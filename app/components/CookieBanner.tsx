'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export const CONSENT_KEY = 'cookie_consent';
export const CONSENT_VERSION = '2026-06';
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
    // Nachweis der Einwilligung (Art. 7 Abs. 1 DSGVO): Zeitpunkt + Version speichern
    localStorage.setItem(
      `${CONSENT_KEY}_meta`,
      JSON.stringify({ value, version: CONSENT_VERSION, timestamp: new Date().toISOString() })
    );
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
            Wir verwenden Analyse- und Marketing-Cookies bzw. -Dienste (Meta, Datafast),
            um unsere Website zu verbessern und Werbung zu optimieren. Sie werden nur mit
            Deiner Einwilligung geladen. Du kannst zustimmen oder ablehnen und Deine
            Entscheidung jederzeit über „Cookie-Einstellungen" im Footer ändern.{' '}
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
