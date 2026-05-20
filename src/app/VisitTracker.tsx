'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { recordVisit } from '@/app/actions/analytics';

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Record visit on mount and path change
    // We wrap it in a small timeout to ensure the page has loaded
    const timer = setTimeout(() => {
      recordVisit(pathname);
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null; // This component is invisible
}
