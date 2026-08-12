'use client';

import { useEffect, useState } from 'react';
import { SVH_COOKIE_NAME, SVH_REF_VALUE } from './svh';

// Erkennt, ob der aktuelle Besucher im SVH-Sponsoring-Modus ist.
// Quelle der Wahrheit ist das Cookie (von der Middleware gesetzt); als Fallback
// beim allerersten Aufruf über den SVH-Link wird zusätzlich der URL-Parameter geprüft.
export function useSvhMode(): boolean {
  const [isSvh, setIsSvh] = useState(false);

  useEffect(() => {
    const hasCookie = document.cookie
      .split(';')
      .some((c) => c.trim() === `${SVH_COOKIE_NAME}=${SVH_REF_VALUE}`);

    const hasParam =
      new URLSearchParams(window.location.search).get('ref') === SVH_REF_VALUE;

    setIsSvh(hasCookie || hasParam);
  }, []);

  return isSvh;
}