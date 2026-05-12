"use server";

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadImage } from './upload';
import { redirect } from 'next/navigation';

export async function addDestination(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  
  const uploadUrl = await uploadImage(formData);
  const imageUrl = uploadUrl || formData.get('imageUrl') as string; // fallback to URL if provided instead of file

  if (!name) throw new Error("Name is required");

  await prisma.destination.create({
    data: { name, description, imageUrl },
  });

  revalidatePath('/admin/destinations');
  revalidatePath('/');
  revalidatePath('/destinations');
}

export async function deleteDestination(id: string) {
  await prisma.destination.delete({
    where: { id },
  });
  revalidatePath('/admin/destinations');
  revalidatePath('/');
  revalidatePath('/destinations');
}

export async function updateDestinationDetails(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  
  const uploadUrl = await uploadImage(formData);
  const imageUrl = uploadUrl || (formData.get('imageUrl') as string);

  if (!id) throw new Error("ID is required");
  if (!name) throw new Error("Name is required");

  const data: any = { name, description };
  
  // Only update imageUrl if a new one was provided (either upload or URL)
  // We check if it's truthy to avoid clearing it with an empty string accidentally
  if (imageUrl) {
    data.imageUrl = imageUrl;
  }

  await prisma.destination.update({
    where: { id },
    data,
  });

  revalidatePath('/admin/destinations');
  revalidatePath('/');
  revalidatePath('/destinations');
  revalidatePath(`/destinations/${id}`);
  
  redirect('/admin/destinations');
}

export async function updateDestination(id: string, name: string) {
  if (!name) throw new Error('Name is required');

  await prisma.destination.update({
    where: { id },
    data: { name },
  });

  revalidatePath('/admin/destinations');
  revalidatePath('/');
  revalidatePath('/destinations');
}

export async function moveDestination(formData: FormData) {
  const id = formData.get('id') as string;
  const delta = parseInt(String(formData.get('delta') || ''), 10);

  if (!id || Number.isNaN(delta)) throw new Error('Invalid parameters');

  // If positions are uninitialized (0) or duplicates exist, normalize positions
  const needsInit = await prisma.destination.count({ where: { position: 0 } });
  if (needsInit > 0) {
    const all = await prisma.destination.findMany({ orderBy: { name: 'asc' } });
    const tx = all.map((d, i) => prisma.destination.update({ where: { id: d.id }, data: { position: i + 1 } }));
    await prisma.$transaction(tx);
  }

  const current = await prisma.destination.findUnique({ where: { id }, select: { position: true } });
  if (!current) return;
  const currentPos = current.position;

  let neighbour = null as any;
  if (delta < 0) {
    neighbour = await prisma.destination.findFirst({ where: { position: { lt: currentPos } }, orderBy: { position: 'desc' } });
  } else {
    neighbour = await prisma.destination.findFirst({ where: { position: { gt: currentPos } }, orderBy: { position: 'asc' } });
  }

  if (!neighbour) return;

  await prisma.$transaction([
    prisma.destination.update({ where: { id: neighbour.id }, data: { position: currentPos } }),
    prisma.destination.update({ where: { id }, data: { position: neighbour.position } }),
  ]);

  revalidatePath('/admin/destinations');
  revalidatePath('/');
  revalidatePath('/destinations');
}
