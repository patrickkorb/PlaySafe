'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { getAnalytics } from '@/lib/datafast';
import { getConsent } from './CookieBanner';

export default function DatafastProvider() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    if (getConsent() === 'granted') {
      setHasConsent(true);
      getAnalytics();
    }

    const handler = () => {
      setHasConsent(true);
      getAnalytics();
    };

    window.addEventListener('cookieConsentGranted', handler);
    return () => window.removeEventListener('cookieConsentGranted', handler);
  }, []);

  if (!hasConsent) return null;

  return (
    <Script
      data-website-id="dfid_OxxKdd3S7HRzcJoBeX8iM"
      data-domain="playsafe.fit"
      src="https://datafa.st/js/script.js"
      strategy="afterInteractive"
    />
  );
}
