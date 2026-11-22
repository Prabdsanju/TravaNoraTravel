import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Visa Consultation & Assistance in Sri Lanka | TravaNora Travel',
  description: 'Fast, reliable visa assistance in Sri Lanka for tourist, business, and transit visas to Thailand, Singapore, Malaysia, and beyond.',
};

export default function VisaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
