'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export const CONSENT_KEY = 'cookie_consent';
export type ConsentValue = 'granted' | 'denied';

export function getConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CONSENT_KEY) as ConsentValue | null;
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      setVisible(true);
    }
  }, []);

  const handleConsent = (value: ConsentValue) => {
    localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);
    if (value === 'granted') {
      window.dispatchEvent(new Event('cookieConsentGranted'));
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 text-sm">
          <p className="font-semibold text-foreground mb-1">Cookies🍪</p>
          <p className="text-muted-foreground">
            Wir verwenden Analyse-Cookies, um unsere Website zu verbessern
            und Werbung zu optimieren. Du kannst der Nutzung zustimmen oder sie ablehnen.{' '}
            <Link href="/datenschutz" className="underline hover:text-primary transition-colors">
              Datenschutzerklärung
            </Link>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => handleConsent('denied')}
            className="px-4 py-2 text-sm border border-border rounded-lg text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Ablehnen
          </button>
          <button
            onClick={() => handleConsent('granted')}
            className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
