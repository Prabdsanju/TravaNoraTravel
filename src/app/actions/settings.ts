"use server";

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadImage, deleteImage } from './upload';

export async function saveSiteSettings(formData: FormData) {
  // 0. Fetch existing settings to manage old files
  const oldSettings = await getSiteSettings();

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
        if (!key.startsWith('file_hero_dynamic_') && !key.startsWith('file_blog_dynamic_')) {
          const oldUrl = oldSettings[actualKey];
          
          await prisma.siteSetting.upsert({
            where: { key: actualKey },
            update: { value: url },
            create: { key: actualKey, value: url },
          });

          // Delete the old file if it was a local upload
          if (oldUrl && oldUrl !== url) {
            await deleteImage(oldUrl);
          }
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
          const oldSlides = oldSettings.hero_slides_json ? JSON.parse(oldSettings.hero_slides_json) : [];
          const oldImages = oldSlides.map((s: any) => s.image).filter(Boolean);

          const slides = JSON.parse(value);
          // Check if any slide has a pending file upload
          const updatedSlides = slides.map((slide: any, index: number) => {
            const uploadKey = `hero_dynamic_${index}`;
            if (uploadedUrls[uploadKey]) {
              return { ...slide, image: uploadedUrls[uploadKey] };
            }
            return slide;
          });
          
          const newImages = updatedSlides.map((s: any) => s.image).filter(Boolean);
          finalValue = JSON.stringify(updatedSlides);

          // Find orphaned images that were in the old slides but are no longer in the new slides
          const orphanedImages = oldImages.filter((img: string) => !newImages.includes(img));
          for (const img of orphanedImages) {
            await deleteImage(img);
          }
        } catch (e) {
          console.error("Failed to process hero slides JSON", e);
        }
      }
      
      // Special handling for dynamic blog JSON
      if (actualKey === 'blog_list_json') {
        try {
          const oldList = oldSettings.blog_list_json ? JSON.parse(oldSettings.blog_list_json) : [];
          const oldImages = oldList.map((s: any) => s.image).filter(Boolean);

          const list = JSON.parse(value);
          const updatedList = list.map((item: any, index: number) => {
            const uploadKey = `blog_dynamic_${index}`;
            if (uploadedUrls[uploadKey]) {
              return { ...item, image: uploadedUrls[uploadKey] };
            }
            return item;
          });
          
          const newImages = updatedList.map((s: any) => s.image).filter(Boolean);
          finalValue = JSON.stringify(updatedList);

          const orphanedImages = oldImages.filter((img: string) => !newImages.includes(img));
          for (const img of orphanedImages) {
            await deleteImage(img);
          }
        } catch (e) {
          console.error("Failed to process blog list JSON", e);
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
