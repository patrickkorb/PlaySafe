'use client';

import { useEffect, useState } from 'react';
import { PARTNER_COOKIE_NAME, getPartner, type Partner } from './partners';

export interface ActivePartner {
  /** Schlüssel in PARTNERS (= ref-Wert), z.B. "svh" */
  key: string;
  partner: Partner;
}

// Erkennt, ob der aktuelle Besucher über einen Partner-Link kommt.
// Quelle der Wahrheit ist das Cookie (von der Middleware gesetzt); als Fallback
// beim allerersten Aufruf wird zusätzlich der URL-Parameter ?ref= geprüft.
export function usePartner(): ActivePartner | null {
  const [active, setActive] = useState<ActivePartner | null>(null);

  useEffect(() => {
    const cookieRef = document.cookie
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${PARTNER_COOKIE_NAME}=`))
      ?.split('=')[1];
    const paramRef = new URLSearchParams(window.location.search).get('ref');

    for (const key of [paramRef, cookieRef]) {
      const partner = getPartner(key);
      if (key && partner) {
        setActive({ key, partner });
        return;
      }
    }
  }, []);

  return active;
}
