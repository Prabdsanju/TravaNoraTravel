"use server";

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function submitBooking(formData: FormData) {
  const name = formData.get('name') as string;
  const email = (formData.get('email') as string) || null;
  const phone = formData.get('phone') as string;
  const guests = parseInt(formData.get('guests') as string);
  const children = parseInt(formData.get('children') as string) || 0;
  const childrenAges = (formData.get('childrenAges') as string) || null;
  const nightsStr = formData.get('nights') as string;
  const nights = nightsStr ? parseInt(nightsStr) : null;
  const travelDateStr = formData.get('travelDate') as string;
  let travelDate: Date | null = null;
  
  try {
    if (travelDateStr) {
      travelDate = new Date(travelDateStr);
      // Validate the date is not 'Invalid Date' and is within a sane range
      if (isNaN(travelDate.getTime()) || travelDate.getFullYear() > 2100 || travelDate.getFullYear() < 2024) {
        throw new Error("Invalid date range");
      }
    }
  } catch (e) {
    console.error("Date parsing failed for:", travelDateStr);
    throw new Error("Please select a valid travel date.");
  }

  const packageId = formData.get('packageId') as string;
  const packageTitle = formData.get('packageTitle') as string;

  if (!name || !phone || !packageId || !travelDate) {
    console.error("Booking failed: Missing required fields", { name, phone, packageId, travelDateStr });
    throw new Error("Please provide all required fields, including a valid travel date.");
  }

  console.log("Attempting to create booking for:", { name, packageId, date: travelDate.toISOString() });

  let newBooking;
  try {
    newBooking = await prisma.booking.create({
      data: { name, email, phone, guests, children, childrenAges, nights, travelDate, packageId },
    });
    console.log("Booking created successfully:", newBooking.id);
  } catch (dbError: any) {
    console.error("Prisma Database Error:", dbError);
    throw new Error(`Database error: ${dbError.message || "Could not save booking"}`);
  }

  revalidatePath('/admin/bookings');

  // Fetch phone from settings
  const settingsRecords = await prisma.siteSetting.findMany();
  const phoneSetting = settingsRecords.find(s => s.key === 'ft_phone1')?.value || '94740077377';
  const cleanPhone = phoneSetting.replace(/\+/g, '').replace(/\s/g, '');

  // Build WhatsApp Message
  const waMessage = `Hello, I would like to request a booking!\n\n` +
    `*Package:* ${packageTitle}\n` +
    `*Name:* ${name}\n` +
    (email ? `*Email:* ${email}\n` : '') +
    `*Phone:* ${phone}\n` +
    `*Travel Date:* ${travelDate.toLocaleDateString()}\n` +
    `*Adults:* ${guests}\n` +
    (children > 0 ? `*Children:* ${children} (Ages: ${childrenAges || 'Not specified'})\n` : '') +
    (nights ? `*Nights Planned:* ${nights}\n` : '');

  const encodedMessage = encodeURIComponent(waMessage);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export async function deleteBooking(id: string) {
  await prisma.booking.delete({ where: { id } });
  revalidatePath('/admin/bookings');
}

export async function updateBookingStatus(id: string, status: string) {
  await prisma.booking.update({
    where: { id },
    data: { status },
  });
  revalidatePath('/admin/bookings');
}
