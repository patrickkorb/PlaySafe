'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    fbq: any;
  }
}

// Event-ID Generator für Deduplizierung
export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

// Interface für User-Daten
interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

// Sende Event sowohl an Pixel als auch an Conversion API
async function sendDualEvent(
  eventName: string,
  userData?: UserData,
  customData?: { value?: number; currency?: string }
): Promise<string> {
  const eventId = generateEventId();

  // 1. Browser-seitiges Pixel-Tracking mit Event-ID
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, {
      ...customData,
      eventID: eventId, // Event-ID für Deduplizierung
    });
  }

  // 2. Server-seitiges CAPI-Tracking
  try {
    await fetch('/api/meta-capi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName,
        eventId,
        eventSourceUrl: window.location.href,
        userData: userData || {},
        customData,
      }),
    });
  } catch (error) {
    console.error('Fehler beim Senden an Meta CAPI:', error);
  }

  return eventId;
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

      // Initiales PageView mit CAPI
      sendDualEvent('PageView');
    }
  }, [])

  useEffect(() => {
    // Track PageView bei Seitenwechsel mit CAPI
    if (window.fbq) {
      sendDualEvent('PageView');
    }
  }, [pathname])

  return null
}

// Exportiere Dual-Tracking Funktionen (Pixel + CAPI)
export const trackLead = async (userData?: UserData, value?: number) => {
  return await sendDualEvent('Lead', userData, {
    value: value || 0,
    currency: 'EUR'
  });
}

export const trackCompleteRegistration = async (userData?: UserData) => {
  return await sendDualEvent('CompleteRegistration', userData);
}

export const trackContact = async (userData?: UserData) => {
  return await sendDualEvent('Contact', userData);
}

// Legacy-Funktionen (nur Pixel, ohne CAPI)
export const trackLeadPixelOnly = (value?: number) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', { value: value || 0, currency: 'EUR' })
  }
}

export const trackCompleteRegistrationPixelOnly = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'CompleteRegistration')
  }
}

export const trackContactPixelOnly = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Contact')
  }
}
