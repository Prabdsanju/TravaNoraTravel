'use server'

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'admin_session';
const SALT = process.env.AUTH_SALT || 'travanora-salt-2026';

function hashPassword(password: string) {
  return crypto.pbkdf2Sync(password, SALT, 1000, 64, 'sha512').toString('hex');
}

export async function checkSetupRequired() {
  const passwordSetting = await prisma.siteSetting.findUnique({ where: { key: 'admin_password_hash' } });
  return !passwordSetting;
}

export async function setupAdmin(password: string, pin: string) {
  const isSetup = await checkSetupRequired();
  if (!isSetup) return { success: false, error: 'Admin already configured' };
  
  await prisma.siteSetting.create({
    data: { key: 'admin_password_hash', value: hashPassword(password) }
  });
  await prisma.siteSetting.create({
    data: { key: 'admin_recovery_pin_hash', value: hashPassword(pin) }
  });
  
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, 'authenticated', { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });
  return { success: true };
}

export async function loginAdmin(password: string) {
  const passwordSetting = await prisma.siteSetting.findUnique({ where: { key: 'admin_password_hash' } });
  if (!passwordSetting) return { success: false, error: 'Admin not configured. Please refresh to setup.' };
  
  const hash = hashPassword(password);
  if (hash === passwordSetting.value) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, 'authenticated', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
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
  
  const hash = hashPassword(pin);
  if (hash === pinSetting.value) {
    await prisma.siteSetting.update({
      where: { key: 'admin_password_hash' },
      data: { value: hashPassword(newPassword) }
    });
    
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, 'authenticated', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
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
