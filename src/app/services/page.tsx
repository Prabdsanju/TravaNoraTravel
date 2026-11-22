import { getSiteSettings } from '@/app/actions/settings';
import ServicesClient from './ServicesClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Travel Services | Air Ticketing & Visa Assistance | TravaNora',
  description: 'TravaNora Travel PVT LTD offers premium holiday tour packages, international air ticketing, and comprehensive visa consultation services in Sri Lanka.',
};

export default async function ServicesPage() {
  const settings = await getSiteSettings();
  return <ServicesClient settings={settings} />;
}
