"use server";

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadImage, uploadMultipleImages } from './upload';
import { requireAdminAuth } from '@/lib/auth-session';

export async function addPackage(formData: FormData) {
  await requireAdminAuth();

  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const itinerary = (formData.get('itinerary') as string)?.trim();
  const inclusions = (formData.get('inclusions') as string)?.trim();
  const exclusions = (formData.get('exclusions') as string)?.trim();
  const price = parseFloat(formData.get('price') as string);
  const days = parseInt(formData.get('days') as string, 10);
  const nights = parseInt(formData.get('nights') as string, 10);
  const destinationId = (formData.get('destinationId') as string)?.trim();

  const uploadUrl = await uploadImage(formData);
  const imageUrl = uploadUrl || (formData.get('imageUrl') as string)?.trim();
  const galleryUrls = await uploadMultipleImages(formData);

  if (!title || !destinationId) throw new Error("Title and destination are required");
  if (isNaN(price) || price < 0) throw new Error("A valid positive price is required");

  await prisma.package.create({
    data: { 
      title, 
      description: description || '', 
      itinerary: itinerary || '',
      inclusions: inclusions || '',
      exclusions: exclusions || '',
      price, 
      days: isNaN(days) ? 1 : days, 
      nights: isNaN(nights) ? 0 : nights, 
      imageUrl, 
      destinationId,
      images: {
        create: galleryUrls.map(url => ({ url }))
      }
    },
  });

  revalidatePath('/admin/packages');
  revalidatePath('/');
  revalidatePath('/packages');
}

export async function deletePackage(id: string) {
  await requireAdminAuth();

  if (!id) throw new Error("Package ID is required");

  await prisma.package.delete({
    where: { id },
  });
  revalidatePath('/admin/packages');
  revalidatePath('/');
  revalidatePath('/packages');
}

export async function updatePackage(formData: FormData) {
  await requireAdminAuth();

  const id = formData.get('id') as string;
  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const itinerary = (formData.get('itinerary') as string)?.trim();
  const inclusions = (formData.get('inclusions') as string)?.trim();
  const exclusions = (formData.get('exclusions') as string)?.trim();
  const price = parseFloat(formData.get('price') as string);
  const days = parseInt(formData.get('days') as string, 10);
  const nights = parseInt(formData.get('nights') as string, 10);
  const destinationId = (formData.get('destinationId') as string)?.trim();

  if (!id) throw new Error("Package ID is required");
  if (!title || !destinationId) throw new Error("Title and destination are required");

  const uploadUrl = await uploadImage(formData);
  const imageUrl = uploadUrl || (formData.get('imageUrl') as string)?.trim();

  const dataToUpdate: any = { 
    title, 
    description: description || '', 
    itinerary: itinerary || '',
    inclusions: inclusions || '',
    exclusions: exclusions || '',
    price: isNaN(price) ? 0 : price, 
    days: isNaN(days) ? 1 : days, 
    nights: isNaN(nights) ? 0 : nights, 
    destinationId 
  };
  
  if (imageUrl) {
    dataToUpdate.imageUrl = imageUrl;
  }

  await prisma.package.update({
    where: { id },
    data: dataToUpdate,
  });

  revalidatePath('/admin/packages');
  revalidatePath('/');
  revalidatePath('/packages');
  revalidatePath(`/admin/packages/${id}`);
  revalidatePath(`/packages/${id}`);
}

export async function addPackageImages(formData: FormData) {
  await requireAdminAuth();

  const packageId = formData.get('packageId') as string;
  if (!packageId) throw new Error("Package ID is required");

  const urls = await uploadMultipleImages(formData);

  if (urls.length > 0) {
    const data = urls.map(url => ({
      url,
      packageId
    }));

    await prisma.packageImage.createMany({
      data
    });

    revalidatePath(`/admin/packages/${packageId}`);
    revalidatePath(`/packages/${packageId}`);
  }
}

export async function deletePackageImage(imageId: string, packageId: string) {
  await requireAdminAuth();

  if (!imageId || !packageId) throw new Error("Image ID and Package ID are required");

  await prisma.packageImage.delete({
    where: { id: imageId }
  });

  revalidatePath(`/admin/packages/${packageId}`);
  revalidatePath(`/packages/${packageId}`);
}
