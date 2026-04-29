"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function StatsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track on public pages, not admin
    if (pathname.startsWith('/admin')) return;

    const trackVisit = async () => {
      try {
        await fetch('/api/stats/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: pathname,
            userAgent: navigator.userAgent
          })
        });
      } catch (err) {
        console.error('Failed to track visit:', err);
      }
    };

    // Delay slightly to ensure page load
    const timer = setTimeout(trackVisit, 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
