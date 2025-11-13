'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    fbq: any;
  }
}

export default function MetaPixel() {
  const pathname = usePathname()

  useEffect(() => {
    // Initialisiere Meta Pixel
    if (typeof window !== 'undefined' && !window.fbq) {
      (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function() {
          n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s)
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

      window.fbq('init', process.env.NEXT_PUBLIC_META_PIXEL_ID);
      window.fbq('track', 'PageView');
    }
  }, [])

  useEffect(() => {
    // Track PageView bei Seitenwechsel
    if (window.fbq) {
      window.fbq('track', 'PageView')
    }
  }, [pathname])

  return null
}

// Exportiere Event-Tracking Funktionen
export const trackLead = (value?: number) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', { value: value || 0, currency: 'EUR' })
  }
}

export const trackCompleteRegistration = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'CompleteRegistration')
  }
}

export const trackContact = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Contact')
  }
}
