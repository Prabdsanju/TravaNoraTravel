import { getSiteSettings } from '@/app/actions/settings';
import ContactPageClient from './ContactPageClient';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return <ContactPageClient settings={settings} />;
}
