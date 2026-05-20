"use server";

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitFlightRequest(formData: FormData) {
  const from = formData.get('from') as string;
  const to = formData.get('to') as string;
  const departureDate = new Date(formData.get('departureDate') as string);
  const returnDateStr = formData.get('returnDate') as string;
  const returnDate = returnDateStr ? new Date(returnDateStr) : null;
  const adults = parseInt(formData.get('adults') as string) || 1;
  const children = parseInt(formData.get('children') as string) || 0;
  const childrenAges = formData.get('childrenAges') as string;
  const baggage = formData.get('baggage') as string;
  const preferredAirline = formData.get('preferredAirline') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;

  if (!from || !to || !departureDate || !name || !phone) {
    throw new Error("Missing required fields");
  }

  const request = await prisma.flightRequest.create({
    data: {
      from,
      to,
      departureDate,
      returnDate,
      adults,
      children,
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
  await prisma.flightRequest.update({
    where: { id },
    data: { status },
  });
  revalidatePath('/admin/flights');
}

export async function deleteFlightRequest(id: string) {
  await prisma.flightRequest.delete({ where: { id } });
  revalidatePath('/admin/flights');
}
