"use server";

import fs from 'fs/promises';
import path from 'path';

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file || file.size === 0) return null;

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
  
  const publicDir = path.join(process.cwd(), 'public', 'uploads');
  
  // Ensure directory exists
  try {
    await fs.access(publicDir);
  } catch (e) {
    await fs.mkdir(publicDir, { recursive: true });
  }

  const filePath = path.join(publicDir, filename);
  await fs.writeFile(filePath, buffer);
  
  return `/uploads/${filename}`;
}
export async function uploadMultipleImages(formData: FormData) {
  const files = formData.getAll('files') as File[];
  if (!files || files.length === 0) return [];

  const urls: string[] = [];
  const publicDir = path.join(process.cwd(), 'public', 'uploads');

  // Ensure directory exists
  try {
    await fs.access(publicDir);
  } catch (e) {
    await fs.mkdir(publicDir, { recursive: true });
  }

  for (const file of files) {
    if (file.size === 0) continue;
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const filePath = path.join(publicDir, filename);
    await fs.writeFile(filePath, buffer);
    urls.push(`/uploads/${filename}`);
  }
  
  return urls;
}
