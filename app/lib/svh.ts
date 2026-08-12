// Zentrale Definitionen für den SVH-Sponsoring-Modus.
// Wird sowohl auf dem Client (Rechner/Navbar) als auch auf dem Server (API, Middleware)
// verwendet – damit Rabattsätze und Cookie-Namen nur an EINER Stelle stehen.

export const SVH_REF_VALUE = 'svh';
export const SVH_COOKIE_NAME = 'playsafe_ref';
export const SVH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 Tage in Sekunden

// Rabatt pro Tarif-Stufe (in Prozent). Kinder-Tarife folgen derselben Staffel.
export const SVH_DISCOUNTS: Record<string, number> = {
  Small: 5,
  Medium: 10,
  Large: 15,
  'Small Kids': 5,
  'Medium Kids': 10,
  'Large Kids': 15,
};

// Liefert den SVH-Rabatt (%) für einen Tarif-Titel, oder 0 wenn keiner definiert ist.
export function getSvhDiscount(tarifTitle: string): number {
  return SVH_DISCOUNTS[tarifTitle] ?? 0;
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
export function applySvhDiscount(
  priceStr: string,
  percent: number
): { original: string; discounted: string } {
  const value = priceStringToNumber(priceStr);
  const amount = percent > 0 ? Math.round(value * percent) / 100 : 0;
  return { original: formatEuro(value), discounted: formatEuro(value - amount) };
}