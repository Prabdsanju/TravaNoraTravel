import { getSiteSettings } from '@/app/actions/settings';
import ContactPageClient from './ContactPageClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact TravaNora Travel | Inquiries & Customer Support',
  description: 'Get in touch with TravaNora Travel PVT LTD for tailored holiday packages, visa assistance, and flight ticket bookings in Sri Lanka.',
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return <ContactPageClient settings={settings} />;
}
