"use server";

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdminAuth } from '@/lib/auth-session';
import { checkRateLimit } from '@/lib/rate-limit';

export async function submitFlightRequest(formData: FormData) {
  // Rate limit: Max 10 flight requests per 10 minutes to prevent spam / bot attacks
  const rateLimit = checkRateLimit('public_flight_submission', 10, 10 * 60 * 1000);
  if (!rateLimit.success) {
    throw new Error(`Too many submissions. Please wait ${rateLimit.resetTime} seconds before submitting again.`);
  }

  const from = (formData.get('from') as string)?.trim()?.slice(0, 100);
  const to = (formData.get('to') as string)?.trim()?.slice(0, 100);
  const departureDateStr = formData.get('departureDate') as string;
  const departureDate = new Date(departureDateStr);
  const returnDateStr = formData.get('returnDate') as string;
  const returnDate = returnDateStr ? new Date(returnDateStr) : null;
  const adults = parseInt(formData.get('adults') as string, 10) || 1;
  const children = parseInt(formData.get('children') as string, 10) || 0;
  const childrenAges = (formData.get('childrenAges') as string)?.trim()?.slice(0, 100);
  const baggage = (formData.get('baggage') as string)?.trim()?.slice(0, 50);
  const preferredAirline = (formData.get('preferredAirline') as string)?.trim()?.slice(0, 100);
  const name = (formData.get('name') as string)?.trim()?.slice(0, 100);
  const email = (formData.get('email') as string)?.trim()?.slice(0, 120);
  const phone = (formData.get('phone') as string)?.trim()?.slice(0, 30);

  if (!from || !to || !departureDateStr || isNaN(departureDate.getTime()) || !name || !phone) {
    throw new Error("Missing required fields or invalid date");
  }

  await prisma.flightRequest.create({
    data: {
      from,
      to,
      departureDate,
      returnDate,
      adults: adults < 1 ? 1 : adults,
      children: children < 0 ? 0 : children,
      childrenAges,
      baggage,
      preferredAirline,
      name,
      email,
      phone,
    },
  });

  revalidatePath('/admin/flights');
  
  // Fetch phone from settings
  const settingsRecords = await prisma.siteSetting.findMany();
  const phoneSetting = settingsRecords.find(s => s.key === 'ft_phone1')?.value || '94740077377';
  const cleanPhone = phoneSetting.replace(/\+/g, '').replace(/\s/g, '');

  // Return the WhatsApp URL
  const message = `*New Flight Inquiry - TravaNora Travel*%0A
----------------------------%0A
*Passenger:* ${name}%0A
*Phone:* ${phone}%0A
*Route:* ${from} ➔ ${to}%0A
*Departure:* ${departureDate.toDateString()}%0A
${returnDate ? `*Return:* ${returnDate.toDateString()}%0A` : ''}
*Pax:* ${adults} Adults, ${children} Children%0A
${childrenAges ? `*Child Ages:* ${childrenAges}%0A` : ''}
*Baggage:* ${baggage || 'N/A'}%0A
*Airline:* ${preferredAirline || 'Any'}%0A
----------------------------%0A
_Please provide a quote for this inquiry._`;

  return { success: true, url: `https://wa.me/${cleanPhone}?text=${message}` };
}

export async function updateFlightStatus(id: string, status: string) {
  await requireAdminAuth();

  if (!id || !status) throw new Error("Flight ID and Status are required");

  await prisma.flightRequest.update({
    where: { id },
    data: { status },
  });
  revalidatePath('/admin/flights');
}

export async function deleteFlightRequest(id: string) {
  await requireAdminAuth();

  if (!id) throw new Error("Flight ID is required");

  await prisma.flightRequest.delete({ where: { id } });
  revalidatePath('/admin/flights');
}
