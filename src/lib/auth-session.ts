import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'admin_session';
const AUTH_SECRET = process.env.AUTH_SECRET || 'travanora-fallback-secret-2026-key';

// Helper to get HMAC key for Web Crypto API (works in Node and Edge runtimes)
async function getCryptoKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    encoder.encode(AUTH_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Creates a cryptographically signed session token using HMAC-SHA256
 */
export async function createSessionToken(): Promise<string> {
  const key = await getCryptoKey();
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const payload = JSON.stringify({ role: 'admin', exp: expiresAt, iat: Date.now() });
  
  const encoder = new TextEncoder();
  const payloadBytes = encoder.encode(payload);
  const payloadB64 = base64UrlEncode(payloadBytes);

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payloadB64)
  );

  const sigB64 = base64UrlEncode(new Uint8Array(signature));
  return `${payloadB64}.${sigB64}`;
}

/**
 * Verifies the validity and expiration of a session token
 */
export async function verifySessionToken(token: string | null | undefined): Promise<boolean> {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payloadB64, sigB64] = parts;

  try {
    const key = await getCryptoKey();
    const encoder = new TextEncoder();
    const sigBytes = base64UrlDecode(sigB64);

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes as BufferSource,
      encoder.encode(payloadB64)
    );

    if (!isValid) return false;

    const payloadRaw = new TextDecoder().decode(base64UrlDecode(payloadB64));
    const payload = JSON.parse(payloadRaw);

    if (!payload || payload.role !== 'admin') return false;
    if (typeof payload.exp !== 'number' || Date.now() > payload.exp) return false;

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Reusable authorization guard for Server Actions
 * Throws an error if the user is not authenticated as admin
 */
export async function requireAdminAuth(): Promise<void> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  const isValid = await verifySessionToken(sessionCookie?.value);
  if (!isValid) {
    throw new Error('Unauthorized: Admin credentials required for this action.');
  }
}

/**
 * Checks if current request has valid admin session
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    return await verifySessionToken(sessionCookie?.value);
  } catch {
    return false;
  }
}
