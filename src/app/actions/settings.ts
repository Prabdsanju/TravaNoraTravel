"use server";

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadImage } from './upload';

export async function saveSiteSettings(formData: FormData) {
  // 1. Handle Regular File Uploads (starts with 'file_')
  const uploadedUrls: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    if (value instanceof File && value.size > 0 && key.startsWith('file_')) {
      const actualKey = key.replace('file_', '');
      
      const fData = new FormData();
      fData.append('file', value);
      const url = await uploadImage(fData);
      
      if (url) {
        uploadedUrls[actualKey] = url;
        // Save static files normally
        if (!key.startsWith('file_hero_dynamic_')) {
          await prisma.siteSetting.upsert({
            where: { key: actualKey },
            update: { value: url },
            create: { key: actualKey, value: url },
          });
        }
      }
    }
  }

  // 2. Handle Text Settings (starts with 'setting_')
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string' && key.startsWith('setting_')) {
      const actualKey = key.replace('setting_', '');
      let finalValue = value;

      // Special handling for dynamic hero slides JSON
      if (actualKey === 'hero_slides_json') {
        try {
          const slides = JSON.parse(value);
          // Check if any slide has a pending file upload
          const updatedSlides = slides.map((slide: any, index: number) => {
            const uploadKey = `hero_dynamic_${index}`;
            if (uploadedUrls[uploadKey]) {
              return { ...slide, image: uploadedUrls[uploadKey] };
            }
            return slide;
          });
          finalValue = JSON.stringify(updatedSlides);
        } catch (e) {
          console.error("Failed to process hero slides JSON", e);
        }
      }

      await prisma.siteSetting.upsert({
        where: { key: actualKey },
        update: { value: finalValue },
        create: { key: actualKey, value: finalValue },
      });
    }
  }

  revalidatePath('/', 'layout');
}

export async function getSiteSettings() {
  const settings = await prisma.siteSetting.findMany();
  const map: Record<string, string> = {};
  settings.forEach(s => {
     map[s.key] = s.value;
  });
  return map;
}
