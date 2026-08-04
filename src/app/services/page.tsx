import { getSiteSettings } from '@/app/actions/settings';
import ServicesClient from './ServicesClient';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const settings = await getSiteSettings();
  return <ServicesClient settings={settings} />;
}
