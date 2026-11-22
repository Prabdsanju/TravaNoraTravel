"use server";

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdminAuth } from '@/lib/auth-session';
import { checkRateLimit } from '@/lib/rate-limit';

export async function submitBooking(formData: FormData) {
  // Rate limit: Max 10 bookings per 10 minutes to prevent spam / bot attacks
  const rateLimit = checkRateLimit('public_booking_submission', 10, 10 * 60 * 1000);
  if (!rateLimit.success) {
    throw new Error(`Too many submissions. Please wait ${rateLimit.resetTime} seconds before submitting again.`);
  }

  const name = (formData.get('name') as string)?.trim()?.slice(0, 100);
  const emailRaw = (formData.get('email') as string)?.trim()?.slice(0, 120);
  const email = emailRaw || null;
  const phone = (formData.get('phone') as string)?.trim()?.slice(0, 30);
  const guests = parseInt(formData.get('guests') as string, 10);
  const children = parseInt(formData.get('children') as string, 10) || 0;
  const childrenAges = ((formData.get('childrenAges') as string)?.trim()?.slice(0, 100)) || null;
  const nightsStr = formData.get('nights') as string;
  const nights = nightsStr ? parseInt(nightsStr, 10) : null;
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
    throw new Error("Please select a valid travel date.");
  }

  const packageId = (formData.get('packageId') as string)?.trim();
  const packageTitle = (formData.get('packageTitle') as string)?.trim()?.slice(0, 150) || '';

  if (!name || !phone || !packageId || !travelDate) {
    throw new Error("Please provide all required fields, including a valid travel date.");
  }

  await prisma.booking.create({
    data: { 
      name, 
      email, 
      phone, 
      guests: isNaN(guests) || guests < 1 ? 1 : guests, 
      children: isNaN(children) || children < 0 ? 0 : children, 
      childrenAges, 
      nights: nights && nights > 0 ? nights : null, 
      travelDate, 
      packageId 
    },
  });

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
  await requireAdminAuth();

  if (!id) throw new Error("Booking ID is required");

  await prisma.booking.delete({ where: { id } });
  revalidatePath('/admin/bookings');
}

export async function updateBookingStatus(id: string, status: string) {
  await requireAdminAuth();

  if (!id || !status) throw new Error("Booking ID and Status are required");

  await prisma.booking.update({
    where: { id },
    data: { status },
  });
  revalidatePath('/admin/bookings');
}
