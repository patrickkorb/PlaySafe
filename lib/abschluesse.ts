/**
 * Schreibt einen Direktabschluss in `public.abschluesse`.
 *
 * Laeuft ausschliesslich serverseitig. Der verwendete Schluessel gehoert zur
 * Rolle `anon`, die per RLS nur `insert` auf drei Spalten darf — weder lesen
 * noch aendern. Deshalb auch `Prefer: return=minimal`: eine zurueckgegebene
 * Zeile wuerde ein Leserecht voraussetzen, das die Rolle nicht hat.
 */
import type { AbschlussDaten } from './abschluss-daten';

const SPARTE = 'unfallversicherung';

export interface AbschlussInsert {
  daten: AbschlussDaten;
  quelleId: string;
}

export interface InsertErgebnis {
  /**
   * `true`, wenn die `quelle_id` schon in der Tabelle steht. Der Antrag des
   * Kunden liegt dann bereits — das ist kein Fehler fuer ihn.
   */
  duplikat: boolean;
}

export async function schreibeAbschluss({ daten, quelleId }: AbschlussInsert): Promise<InsertErgebnis> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_INSERT_KEY;

  if (!url) throw new Error('SUPABASE_URL ist nicht gesetzt');
  if (!key) throw new Error('SUPABASE_INSERT_KEY ist nicht gesetzt');

  const antwort = await fetch(`${url}/rest/v1/abschluesse`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      daten,
      sparte: SPARTE,
      quelle_id: quelleId,
    }),
  });

  if (antwort.status === 409) {
    return { duplikat: true };
  }

  if (!antwort.ok) {
    throw new Error(`Supabase-Insert fehlgeschlagen (${antwort.status}): ${await antwort.text()}`);
  }

  return { duplikat: false };
}
