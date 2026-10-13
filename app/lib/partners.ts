// Zentrale Partner-Konfiguration (Sponsoring-Kooperationen).
// Wird sowohl auf dem Client (Rechner/Navbar) als auch auf dem Server (API, Middleware)
// verwendet.
//
// NEUEN PARTNER HINZUFÜGEN:
//   1. Logo nach /public/images/sponsoring/ legen
//   2. Unten in PARTNERS einen Eintrag ergänzen (Schlüssel = Wert in ?ref=...)
//   3. Link verteilen: https://playsafe.fit/rechner?ref=<schluessel>

export const PARTNER_COOKIE_NAME = 'playsafe_ref';
export const PARTNER_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 Tage in Sekunden

// Rabatt pro Tarif-Stufe (in Prozent). Kinder-Tarife folgen derselben Staffel.
export type DiscountTable = Record<string, number>;

const STANDARD_DISCOUNTS: DiscountTable = {
  Small: 5,
  Medium: 10,
  Large: 15,
  'Small Kids': 5,
  'Medium Kids': 10,
  'Large Kids': 15,
};

export interface Partner {
  /** Anzeigename, z.B. in Rabatt-Badge, Betreff und Mail-Badge ("SVH-Partnerrabatt") */
  name: string;
  /** Pfad zum Logo in /public */
  logo: string;
  /** Seitenverhältnis des Logos für next/image (Breite x Höhe in px, grob) */
  logoSize?: { width: number; height: number };
  /** Eigene Rabatt-Staffel; ohne Angabe gilt die Standard-Staffel (5/10/15 %) */
  discounts?: DiscountTable;
  /** Kennzeichnung in Supabase (Spalte "quelle") und im n8n-Tarif-Suffix */
  quelle: string;
  /** Text im internen Mail-Badge: "Herkunft: <mailLabel>" */
  mailLabel: string;
}

export const PARTNERS: Record<string, Partner> = {
  svh: {
    name: 'SVH',
    logo: '/images/sponsoring/Logo_SVH.png',
    quelle: 'SVH',
    mailLabel: 'SVH-Kooperation (Sponsoring)',
  },
   svhagenbach: {
     name: 'SV Hagenbach',
     logo: '/images/sponsoring/Logo_SVHagenbach.png',
     quelle: 'SVHagenbach',
     mailLabel: 'SVHagenbach-Kooperation (Sponsoring)',
     // discounts: { Small: 10, Medium: 15, Large: 20, 'Small Kids': 10, 'Medium Kids': 15, 'Large Kids': 20 },
    },
};

// Liefert den Partner zu einem ref-Wert, oder null wenn unbekannt.
export function getPartner(ref: string | null | undefined): Partner | null {
  if (!ref) return null;
  return Object.prototype.hasOwnProperty.call(PARTNERS, ref) ? PARTNERS[ref] : null;
}

// Liefert den Partner-Rabatt (%) für einen Tarif-Titel, oder 0 wenn keiner definiert ist.
export function getPartnerDiscount(partner: Partner | null, tarifTitle: string): number {
  if (!partner) return 0;
  return (partner.discounts ?? STANDARD_DISCOUNTS)[tarifTitle] ?? 0;
}

// Wandelt einen Preis-String wie "10,00€" in eine Zahl um.
export function priceStringToNumber(priceStr: string): number {
  const clean = priceStr.replace('€', '').replace(',', '.').trim();
  const value = parseFloat(clean);
  return isNaN(value) ? 0 : value;
}

// Formatiert eine Zahl als Euro-String, z.B. 9.5 -> "9,50€".
export function formatEuro(value: number): string {
  return value.toFixed(2).replace('.', ',') + '€';
}

// Wendet den Rabatt auf einen Preis-String an und gibt Original + reduziert
// als formatierte Strings zurück. Die Rundung ist identisch zur API-Preisberechnung
// (Math.round(preis * prozent) / 100), damit Rechner-Anzeige und Mail übereinstimmen.
export function applyDiscount(
  priceStr: string,
  percent: number
): { original: string; discounted: string } {
  const value = priceStringToNumber(priceStr);
  const amount = percent > 0 ? Math.round(value * percent) / 100 : 0;
  return { original: formatEuro(value), discounted: formatEuro(value - amount) };
}
