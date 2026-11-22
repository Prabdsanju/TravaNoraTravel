'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { createSessionToken } from '@/lib/auth-session';
import { checkRateLimit } from '@/lib/rate-limit';

const SESSION_COOKIE_NAME = 'admin_session';
const SALT = process.env.AUTH_SALT || 'travanora-salt-2026';
const MODERN_ITERATIONS = 100000;
const LEGACY_ITERATIONS = 1000;

function hashPassword(password: string, iterations = MODERN_ITERATIONS) {
  const hash = crypto.pbkdf2Sync(password, SALT, iterations, 64, 'sha512').toString('hex');
  return `pbkdf2$${iterations}$${hash}`;
}

function verifyPassword(password: string, storedHash: string): { valid: boolean; needsUpgrade: boolean } {
  if (storedHash.startsWith('pbkdf2$')) {
    const parts = storedHash.split('$');
    const iterations = parseInt(parts[1], 10);
    const expectedHash = parts[2];
    const computed = crypto.pbkdf2Sync(password, SALT, iterations, 64, 'sha512').toString('hex');
    
    const computedBuf = Buffer.from(computed, 'hex');
    const expectedBuf = Buffer.from(expectedHash, 'hex');

    if (computedBuf.length !== expectedBuf.length) return { valid: false, needsUpgrade: false };
    const valid = crypto.timingSafeEqual(computedBuf, expectedBuf);
    return { valid, needsUpgrade: iterations < MODERN_ITERATIONS };
  }

  // Legacy format (plain hex with 1000 iterations)
  const legacyComputed = crypto.pbkdf2Sync(password, SALT, LEGACY_ITERATIONS, 64, 'sha512').toString('hex');
  const computedBuf = Buffer.from(legacyComputed, 'hex');
  const storedBuf = Buffer.from(storedHash, 'hex');

  if (computedBuf.length !== storedBuf.length) return { valid: false, needsUpgrade: false };
  const valid = crypto.timingSafeEqual(computedBuf, storedBuf);
  return { valid, needsUpgrade: true };
}

export async function checkSetupRequired() {
  const passwordSetting = await prisma.siteSetting.findUnique({ where: { key: 'admin_password_hash' } });
  return !passwordSetting;
}

export async function setupAdmin(password: string, pin: string) {
  const isSetup = await checkSetupRequired();
  if (!isSetup) return { success: false, error: 'Admin already configured' };
  
  if (!password || password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters long.' };
  }
  if (!pin || pin.length < 4) {
    return { success: false, error: 'Recovery PIN must be at least 4 characters long.' };
  }

  await prisma.siteSetting.create({
    data: { key: 'admin_password_hash', value: hashPassword(password) }
  });
  await prisma.siteSetting.create({
    data: { key: 'admin_recovery_pin_hash', value: hashPassword(pin) }
  });
  
  const token = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });
  return { success: true };
}

export async function loginAdmin(password: string) {
  // Rate limiting: 5 failed attempts per 15 minutes
  const rateLimit = checkRateLimit('admin_login_attempt', 5, 15 * 60 * 1000);
  if (!rateLimit.success) {
    return { 
      success: false, 
      error: `Too many login attempts. Please try again in ${rateLimit.resetTime} seconds.` 
    };
  }

  const passwordSetting = await prisma.siteSetting.findUnique({ where: { key: 'admin_password_hash' } });
  if (!passwordSetting) return { success: false, error: 'Admin not configured. Please refresh to setup.' };
  
  const { valid, needsUpgrade } = verifyPassword(password, passwordSetting.value);
  if (valid) {
    // If legacy hash was used, transparently upgrade it to modern iterations
    if (needsUpgrade) {
      await prisma.siteSetting.update({
        where: { key: 'admin_password_hash' },
        data: { value: hashPassword(password) }
      });
    }

    const token = await createSessionToken();
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    return { success: true };
  }
  return { success: false, error: 'Invalid password' };
}

export async function resetPassword(pin: string, newPassword: string) {
  const pinSetting = await prisma.siteSetting.findUnique({ where: { key: 'admin_recovery_pin_hash' } });
  if (!pinSetting) return { success: false, error: 'Recovery PIN not configured' };
  
  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: 'New password must be at least 8 characters long.' };
  }

  const { valid } = verifyPassword(pin, pinSetting.value);
  if (valid) {
    await prisma.siteSetting.update({
      where: { key: 'admin_password_hash' },
      data: { value: hashPassword(newPassword) }
    });
    
    const token = await createSessionToken();
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    return { success: true };
  }
  return { success: false, error: 'Invalid recovery PIN' };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return { success: true };
}
