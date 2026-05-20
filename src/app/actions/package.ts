"use server";

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadImage, uploadMultipleImages } from './upload';

export async function addPackage(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const itinerary = formData.get('itinerary') as string;
  const inclusions = formData.get('inclusions') as string;
  const exclusions = formData.get('exclusions') as string;
  const price = parseFloat(formData.get('price') as string);
  const days = parseInt(formData.get('days') as string);
  const nights = parseInt(formData.get('nights') as string);
  const destinationId = formData.get('destinationId') as string;

  const uploadUrl = await uploadImage(formData);
  const imageUrl = uploadUrl || formData.get('imageUrl') as string;
  const galleryUrls = await uploadMultipleImages(formData);

  if (!title || !destinationId) throw new Error("Title and destination are required");

  await prisma.package.create({
    data: { 
      title, 
      description, 
      itinerary,
      inclusions,
      exclusions,
      price, 
      days, 
      nights, 
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
  await prisma.package.delete({
    where: { id },
  });
  revalidatePath('/admin/packages');
  revalidatePath('/');
  revalidatePath('/packages');
}

export async function updatePackage(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const itinerary = formData.get('itinerary') as string;
  const inclusions = formData.get('inclusions') as string;
  const exclusions = formData.get('exclusions') as string;
  const price = parseFloat(formData.get('price') as string);
  const days = parseInt(formData.get('days') as string);
  const nights = parseInt(formData.get('nights') as string);
  const destinationId = formData.get('destinationId') as string;

  const uploadUrl = await uploadImage(formData);
  const imageUrl = uploadUrl || formData.get('imageUrl') as string;

  const dataToUpdate: any = { 
    title, 
    description, 
    itinerary,
    inclusions,
    exclusions,
    price, 
    days, 
    nights, 
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
  const packageId = formData.get('packageId') as string;
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
  await prisma.packageImage.delete({
    where: { id: imageId }
  });

  revalidatePath(`/admin/packages/${packageId}`);
  revalidatePath(`/packages/${packageId}`);
}
