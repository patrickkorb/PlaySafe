import { NextRequest, NextResponse } from 'next/server';

/**
 * Liefert die Orte zu einer Postleitzahl.
 *
 * Die Antrags-Automation prueft den Ort gegen einen Katalog; ein vertippter Ort
 * laesst den Antrag dort auflaufen. Deshalb waehlt der Kunde den Ort im
 * Formular aus, statt ihn zu tippen.
 *
 * Quelle: OpenPLZ API (amtliche Daten, kostenlos, ohne Schluessel).
 */
export async function GET(request: NextRequest) {
  const plz = request.nextUrl.searchParams.get('plz') ?? '';

  if (!/^\d{5}$/.test(plz)) {
    return NextResponse.json({ orte: [] });
  }

  try {
    const antwort = await fetch(
      `https://openplzapi.org/de/Localities?postalCode=${plz}`,
      // Postleitzahlen aendern sich praktisch nie — einen Tag cachen reicht.
      { next: { revalidate: 86400 } }
    );

    if (!antwort.ok) {
      return NextResponse.json({ orte: [] });
    }

    const eintraege: Array<{ name?: string }> = await antwort.json();
    const orte = [...new Set(eintraege.map((e) => e.name).filter((n): n is string => !!n))].sort(
      (a, b) => a.localeCompare(b, 'de')
    );

    return NextResponse.json({ orte });
  } catch (error) {
    // Faellt der Katalog aus, tippt der Kunde den Ort wie bisher selbst —
    // besser als ein Formular, das nicht weitergeht.
    console.error('PLZ-Katalog nicht erreichbar:', error);
    return NextResponse.json({ orte: [] });
  }
}
