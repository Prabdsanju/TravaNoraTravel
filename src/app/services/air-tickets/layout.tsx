import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Air Ticketing & Cheap Flights from Sri Lanka | TravaNora Travel',
  description: 'Book international flight tickets from Sri Lanka to Thailand, Singapore, Malaysia, and worldwide at competitive fares with TravaNora Travel.',
};

export default function AirTicketsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
