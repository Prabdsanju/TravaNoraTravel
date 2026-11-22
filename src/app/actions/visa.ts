"use server";

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdminAuth } from '@/lib/auth-session';
import { checkRateLimit } from '@/lib/rate-limit';

export async function submitVisaRequest(formData: FormData) {
  // Rate limit: Max 10 visa inquiries per 10 minutes to prevent spam
  const rateLimit = checkRateLimit('public_visa_submission', 10, 10 * 60 * 1000);
  if (!rateLimit.success) {
    throw new Error(`Too many submissions. Please wait ${rateLimit.resetTime} seconds before submitting again.`);
  }

  const country = (formData.get('country') as string)?.trim()?.slice(0, 100);
  const visaType = (formData.get('visaType') as string)?.trim()?.slice(0, 100);
  const applicants = parseInt(formData.get('applicants') as string, 10) || 1;
  const travelDateStr = formData.get('travelDate') as string;
  const travelDate = new Date(travelDateStr);
  const name = (formData.get('name') as string)?.trim()?.slice(0, 100);
  const phone = (formData.get('phone') as string)?.trim()?.slice(0, 30);
  const email = (formData.get('email') as string)?.trim()?.slice(0, 120);
  const messageText = (formData.get('message') as string)?.trim()?.slice(0, 2000);

  if (!country || !visaType || !travelDateStr || isNaN(travelDate.getTime()) || !name || !phone) {
    throw new Error("Missing required fields or invalid date");
  }

  await prisma.visaRequest.create({
    data: {
      country,
      visaType,
      applicants: applicants < 1 ? 1 : applicants,
      travelDate,
      name,
      phone,
      email,
      message: messageText,
    },
  });

  revalidatePath('/admin/visas');
  
  // Fetch phone from settings
  const settingsRecords = await prisma.siteSetting.findMany();
  const phoneSetting = settingsRecords.find(s => s.key === 'ft_phone1')?.value || '94740077377';
  const cleanPhone = phoneSetting.replace(/\+/g, '').replace(/\s/g, '');

  // WhatsApp Message
  const message = `*New Visa Inquiry - TravaNora Travel*%0A
----------------------------%0A
*Applicant:* ${name}%0A
*Phone:* ${phone}%0A
*Country to Visit:* ${country}%0A
*Visa Type:* ${visaType}%0A
*Applicants:* ${applicants}%0A
*Expected Date:* ${travelDate.toDateString()}%0A
${messageText ? `*Notes:* ${messageText}%0A` : ''}
----------------------------%0A
_Please assist with the visa process._`;

  return { success: true, url: `https://wa.me/${cleanPhone}?text=${message}` };
}

export async function updateVisaStatus(id: string, status: string) {
  await requireAdminAuth();

  if (!id || !status) throw new Error("Visa ID and Status are required");

  await prisma.visaRequest.update({
    where: { id },
    data: { status },
  });
  revalidatePath('/admin/visas');
}

export async function deleteVisaRequest(id: string) {
  await requireAdminAuth();

  if (!id) throw new Error("Visa ID is required");

  await prisma.visaRequest.delete({ where: { id } });
  revalidatePath('/admin/visas');
}
