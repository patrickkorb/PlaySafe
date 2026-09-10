import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { schreibeAbschluss } from './abschluesse';

const DATEN = { vn_name: 'Thomas Berger', email: 'thomas.berger@example.org' };
const QUELLE_ID = '3f2b1c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d';

/** Merkt sich den letzten fetch-Aufruf und antwortet mit dem gesetzten Status. */
function fetchMit(status: number, body = '') {
  return vi.fn(async () => new Response(body, { status }));
}

beforeEach(() => {
  process.env.SUPABASE_URL = 'https://beispiel.supabase.co';
  process.env.SUPABASE_INSERT_KEY = 'test-key';
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_INSERT_KEY;
});

describe('schreibeAbschluss', () => {
  test('schreibt genau eine Zeile in abschluesse', async () => {
    const fetchStub = fetchMit(201);
    vi.stubGlobal('fetch', fetchStub);

    await schreibeAbschluss({ daten: DATEN, quelleId: QUELLE_ID });

    expect(fetchStub).toHaveBeenCalledTimes(1);
    const [url, optionen] = fetchStub.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://beispiel.supabase.co/rest/v1/abschluesse');
    expect(optionen.method).toBe('POST');
  });

  test('schickt nur daten, sparte und quelle_id mit', async () => {
    const fetchStub = fetchMit(201);
    vi.stubGlobal('fetch', fetchStub);

    await schreibeAbschluss({ daten: DATEN, quelleId: QUELLE_ID });

    const [, optionen] = fetchStub.mock.calls[0] as unknown as [string, RequestInit];
    const gesendet = JSON.parse(optionen.body as string);

    expect(Object.keys(gesendet).sort()).toEqual(['daten', 'quelle_id', 'sparte']);
    expect(gesendet.daten).toEqual(DATEN);
    expect(gesendet.sparte).toBe('unfallversicherung');
    expect(gesendet.quelle_id).toBe(QUELLE_ID);
  });

  test('fordert keine Rueckgabe der Zeile an — die Rolle darf nicht lesen', async () => {
    const fetchStub = fetchMit(201);
    vi.stubGlobal('fetch', fetchStub);

    await schreibeAbschluss({ daten: DATEN, quelleId: QUELLE_ID });

    const [, optionen] = fetchStub.mock.calls[0] as unknown as [string, RequestInit];
    expect((optionen.headers as Record<string, string>)['Prefer']).toBe('return=minimal');
  });

  test('meldet einen erfolgreichen Insert als kein Duplikat', async () => {
    vi.stubGlobal('fetch', fetchMit(201));

    expect(await schreibeAbschluss({ daten: DATEN, quelleId: QUELLE_ID })).toEqual({
      duplikat: false,
    });
  });

  test('meldet eine verletzte quelle_id-Bedingung als Duplikat statt als Fehler', async () => {
    vi.stubGlobal('fetch', fetchMit(409, '{"code":"23505"}'));

    expect(await schreibeAbschluss({ daten: DATEN, quelleId: QUELLE_ID })).toEqual({
      duplikat: true,
    });
  });

  test('wirft bei jedem anderen Fehlerstatus', async () => {
    vi.stubGlobal('fetch', fetchMit(401, 'invalid api key'));

    await expect(schreibeAbschluss({ daten: DATEN, quelleId: QUELLE_ID })).rejects.toThrow(
      /401/
    );
  });

  test('wirft, wenn die Zugangsdaten nicht konfiguriert sind', async () => {
    delete process.env.SUPABASE_URL;
    vi.stubGlobal('fetch', fetchMit(201));

    await expect(schreibeAbschluss({ daten: DATEN, quelleId: QUELLE_ID })).rejects.toThrow(
      /SUPABASE_URL/
    );
  });
});
