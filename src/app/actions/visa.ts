"use server";

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitVisaRequest(formData: FormData) {
  const country = formData.get('country') as string;
  const visaType = formData.get('visaType') as string;
  const applicants = parseInt(formData.get('applicants') as string) || 1;
  const travelDate = new Date(formData.get('travelDate') as string);
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const messageText = formData.get('message') as string;

  if (!country || !visaType || !travelDate || !name || !phone) {
    throw new Error("Missing required fields");
  }

  const request = await prisma.visaRequest.create({
    data: {
      country,
      visaType,
      applicants,
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
  await prisma.visaRequest.update({
    where: { id },
    data: { status },
  });
  revalidatePath('/admin/visas');
}

export async function deleteVisaRequest(id: string) {
  await prisma.visaRequest.delete({ where: { id } });
  revalidatePath('/admin/visas');
}
