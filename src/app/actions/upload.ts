"use server";

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { requireAdminAuth } from '@/lib/auth-session';

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function validateFile(file: File): { valid: boolean; error?: string; ext?: string } {
  if (!file || file.size === 0) {
    return { valid: false, error: 'Empty file' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds maximum limit of 10MB' };
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, error: `Disallowed file extension: ${ext}. Only image files (.jpg, .jpeg, .png, .webp, .avif) are allowed.` };
  }

  if (file.type && !ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
    return { valid: false, error: `Disallowed MIME type: ${file.type}` };
  }

  return { valid: true, ext };
}

export async function uploadImage(formData: FormData) {
  await requireAdminAuth();

  const file = formData.get('file') as File;
  if (!file || file.size === 0) return null;

  const validation = validateFile(file);
  if (!validation.valid || !validation.ext) {
    throw new Error(validation.error || 'Invalid file');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeFilename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${validation.ext}`;
  const publicDir = path.resolve(process.cwd(), 'public', 'uploads');
  
  // Ensure directory exists
  try {
    await fs.access(publicDir);
  } catch (e) {
    await fs.mkdir(publicDir, { recursive: true });
  }

  const filePath = path.resolve(publicDir, safeFilename);
  await fs.writeFile(filePath, buffer);
  
  return `/uploads/${safeFilename}`;
}

export async function uploadMultipleImages(formData: FormData) {
  await requireAdminAuth();

  const files = formData.getAll('files') as File[];
  if (!files || files.length === 0) return [];

  const urls: string[] = [];
  const publicDir = path.resolve(process.cwd(), 'public', 'uploads');

  // Ensure directory exists
  try {
    await fs.access(publicDir);
  } catch (e) {
    await fs.mkdir(publicDir, { recursive: true });
  }

  for (const file of files) {
    if (!file || file.size === 0) continue;

    const validation = validateFile(file);
    if (!validation.valid || !validation.ext) {
      continue; // Skip invalid files
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeFilename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${validation.ext}`;
    const filePath = path.resolve(publicDir, safeFilename);
    
    await fs.writeFile(filePath, buffer);
    urls.push(`/uploads/${safeFilename}`);
  }
  
  return urls;
}

export async function deleteImage(url: string | null | undefined) {
  await requireAdminAuth();

  if (!url || !url.startsWith('/uploads/')) return;
  
  // Prevent Path Traversal attacks by isolating file basename
  const safeBasename = path.basename(url);
  const publicDir = path.resolve(process.cwd(), 'public', 'uploads');
  const filePath = path.resolve(publicDir, safeBasename);

  // Strictly verify the target is inside the public/uploads directory
  if (!filePath.startsWith(publicDir)) {
    throw new Error("Invalid file path traversal attempt");
  }
  
  try {
    await fs.unlink(filePath);
  } catch (e) {
    // Ignore error if file doesn't exist
    console.error(`Failed to delete old image: ${filePath}`, e);
  }
}
