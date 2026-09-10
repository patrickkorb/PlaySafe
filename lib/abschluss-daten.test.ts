import { describe, expect, test } from 'vitest';
import { baueAbschlussDaten, istQuelleId, type AbschlussEingabe } from './abschluss-daten';

/**
 * Basis: ein vollstaendiger Abschluss fuer die eigene Person.
 */
function fuerSichSelbst(ueberschreiben: Partial<AbschlussEingabe> = {}): AbschlussEingabe {
  return {
    insuranceFor: 'self',
    policyHolderSalutation: '',
    policyHolderName: '',
    policyHolderBirthDate: '',
    policyHolderJob: '',
    policyHolderJobField: '',
    relationshipToInsured: '',
    salutation: 'Herr',
    name: 'Thomas Berger',
    birthDate: '13.09.1992',
    job: 'Arbeitnehmer',
    jobField: 'Softwareentwickler',
    insuranceStartType: 'date',
    insuranceStartDate: '01.11.2026',
    tarif: 'Large',
    email: 'thomas.berger@example.org',
    phone: '+4915100000000',
    street: 'Musterweg',
    houseNumber: '159',
    postalCode: '76135',
    city: 'Karlsruhe',
    iban: 'DE02120300000000202051',
    accountHolder: 'Thomas Berger',
    ...ueberschreiben,
  };
}

/**
 * Basis: ein Abschluss fuer eine andere Person (VN != VP).
 */
function fuerJemandAnderen(ueberschreiben: Partial<AbschlussEingabe> = {}): AbschlussEingabe {
  return fuerSichSelbst({
    insuranceFor: 'other',
    relationshipToInsured: 'Kind',
    policyHolderSalutation: 'Frau',
    policyHolderName: 'Anna Berger',
    policyHolderBirthDate: '02.03.1985',
    policyHolderJob: 'Beamter',
    policyHolderJobField: 'Lehrerin',
    salutation: 'Herr',
    name: 'Leon Berger',
    birthDate: '07.06.2014',
    job: 'Schüler',
    jobField: '',
    tarif: 'Large Kids',
    ...ueberschreiben,
  });
}

function daten(eingabe: AbschlussEingabe) {
  const ergebnis = baueAbschlussDaten(eingabe);
  expect(ergebnis.fehler).toEqual([]);
  return ergebnis.daten!;
}

describe('baueAbschlussDaten — Aufbau des Objekts', () => {
  test('erzeugt genau die 20 vereinbarten Schluessel', () => {
    expect(Object.keys(daten(fuerSichSelbst())).sort()).toEqual(
      [
        'adresse_ort',
        'adresse_plz',
        'adresse_strasse_hausnr',
        'beginn_roh',
        'beziehung',
        'email',
        'iban',
        'kontoinhaber',
        'tarif_roh',
        'telefon',
        'vn_anrede',
        'vn_berufsstand',
        'vn_geburtsdatum',
        'vn_name',
        'vn_taetigkeit',
        'vp_anrede',
        'vp_berufsstand',
        'vp_geburtsdatum',
        'vp_name',
        'vp_taetigkeit',
      ].sort()
    );
  });

  test('alle Werte sind nicht leere Strings', () => {
    for (const [schluessel, wert] of Object.entries(daten(fuerSichSelbst()))) {
      expect(typeof wert, schluessel).toBe('string');
      expect(wert, schluessel).not.toBe('');
    }
  });

  test('bei "fuer mich selbst" sind VN und VP identisch und beziehung ist Selbst', () => {
    const d = daten(fuerSichSelbst());

    expect(d.vn_anrede).toBe('Herr');
    expect(d.vn_name).toBe('Thomas Berger');
    expect(d.vn_geburtsdatum).toBe('13.09.1992');
    expect(d.vn_berufsstand).toBe('Arbeitnehmer');
    expect(d.vn_taetigkeit).toBe('Softwareentwickler');
    expect(d.vp_anrede).toBe(d.vn_anrede);
    expect(d.vp_name).toBe(d.vn_name);
    expect(d.vp_geburtsdatum).toBe(d.vn_geburtsdatum);
    expect(d.vp_berufsstand).toBe(d.vn_berufsstand);
    expect(d.vp_taetigkeit).toBe(d.vn_taetigkeit);
    expect(d.beziehung).toBe('Selbst');
  });

  test('bei "fuer jemand anderen" kommt VN aus den Versicherungsnehmer-Feldern', () => {
    const d = daten(fuerJemandAnderen());

    expect(d.vn_anrede).toBe('Frau');
    expect(d.vn_name).toBe('Anna Berger');
    expect(d.vn_geburtsdatum).toBe('02.03.1985');
    expect(d.vn_berufsstand).toBe('Beamter');
    expect(d.vn_taetigkeit).toBe('Lehrerin');

    expect(d.vp_anrede).toBe('Herr');
    expect(d.vp_name).toBe('Leon Berger');
    expect(d.vp_geburtsdatum).toBe('07.06.2014');
    expect(d.vp_berufsstand).toBe('Schüler');
    expect(d.beziehung).toBe('Kind');
  });

  test('setzt Strasse und Hausnummer zu einem Feld zusammen', () => {
    expect(daten(fuerSichSelbst()).adresse_strasse_hausnr).toBe('Musterweg 159');
  });

  test('trimmt jeden Wert', () => {
    const d = daten(fuerSichSelbst({ name: '  Thomas Berger  ', city: ' Karlsruhe ' }));

    expect(d.vn_name).toBe('Thomas Berger');
    expect(d.adresse_ort).toBe('Karlsruhe');
  });

  test('enthaelt keine zielstufe', () => {
    expect(daten(fuerSichSelbst())).not.toHaveProperty('zielstufe');
  });
});

describe('Taetigkeit', () => {
  test('spiegelt den Berufsstand, wenn das Formular keine Taetigkeit abfragt', () => {
    const d = daten(fuerSichSelbst({ job: 'Rentner', jobField: '' }));

    expect(d.vn_taetigkeit).toBe('Rentner');
    expect(d.vp_taetigkeit).toBe('Rentner');
  });

  test('spiegelt den Berufsstand auch bei Schueler und Student', () => {
    expect(daten(fuerJemandAnderen()).vp_taetigkeit).toBe('Schüler');
    expect(daten(fuerSichSelbst({ job: 'Student', jobField: '' })).vn_taetigkeit).toBe('Student');
  });

  test('lehnt eine fehlende Taetigkeit ab, wo das Formular sie verlangt', () => {
    const ergebnis = baueAbschlussDaten(fuerSichSelbst({ job: 'Arbeitnehmer', jobField: '   ' }));

    expect(ergebnis.daten).toBeNull();
    expect(ergebnis.fehler).toContain('Bitte gib die Tätigkeit der versicherten Person an');
  });

  test('lehnt eine fehlende Taetigkeit des Versicherungsnehmers ab', () => {
    const ergebnis = baueAbschlussDaten(
      fuerJemandAnderen({ policyHolderJob: 'Selbstständiger', policyHolderJobField: '' })
    );

    expect(ergebnis.daten).toBeNull();
    expect(ergebnis.fehler).toContain('Bitte gib die Tätigkeit des Versicherungsnehmers an');
  });
});

describe('Anrede', () => {
  test('lehnt Divers ab', () => {
    const ergebnis = baueAbschlussDaten(fuerSichSelbst({ salutation: 'Divers' }));

    expect(ergebnis.daten).toBeNull();
    expect(ergebnis.fehler).toContain('Anrede der versicherten Person muss Herr oder Frau sein');
  });

  test('lehnt eine leere Anrede ab', () => {
    expect(baueAbschlussDaten(fuerSichSelbst({ salutation: '' })).daten).toBeNull();
  });
});

describe('Geburtsdatum', () => {
  test('ergaenzt fehlende fuehrende Nullen', () => {
    expect(daten(fuerSichSelbst({ birthDate: '5.4.1980' })).vn_geburtsdatum).toBe('05.04.1980');
  });

  test('laesst ein bereits zweistelliges Datum unveraendert', () => {
    expect(daten(fuerSichSelbst({ birthDate: '05.04.1980' })).vn_geburtsdatum).toBe('05.04.1980');
  });

  test('lehnt einen nicht existierenden Tag ab', () => {
    const ergebnis = baueAbschlussDaten(fuerSichSelbst({ birthDate: '31.02.1990' }));

    expect(ergebnis.daten).toBeNull();
    expect(ergebnis.fehler).toContain('Geburtsdatum der versicherten Person ist kein gültiges Datum');
  });

  test('lehnt ein fremdes Datumsformat ab', () => {
    expect(baueAbschlussDaten(fuerSichSelbst({ birthDate: '1980-04-05' })).daten).toBeNull();
  });

  test('lehnt ein zweistelliges Jahr ab', () => {
    expect(baueAbschlussDaten(fuerSichSelbst({ birthDate: '05.04.80' })).daten).toBeNull();
  });
});

describe('Telefon', () => {
  test('macht aus einer 0-Nummer eine +49-Nummer', () => {
    expect(daten(fuerSichSelbst({ phone: '0151 23456789' })).telefon).toBe('+4915123456789');
  });

  test('normalisiert 0049', () => {
    expect(daten(fuerSichSelbst({ phone: '0049 151 23456789' })).telefon).toBe('+4915123456789');
  });

  test('entfernt Trennzeichen aus einer +49-Nummer', () => {
    expect(daten(fuerSichSelbst({ phone: '+49 (151) 234-56789' })).telefon).toBe('+4915123456789');
  });

  test('lehnt eine zu kurze Nummer ab', () => {
    const ergebnis = baueAbschlussDaten(fuerSichSelbst({ phone: '0151 123' }));

    expect(ergebnis.daten).toBeNull();
    expect(ergebnis.fehler).toContain('Telefonnummer ist ungültig');
  });
});

describe('IBAN', () => {
  test('entfernt Leerzeichen', () => {
    expect(daten(fuerSichSelbst({ iban: 'DE02 1203 0000 0000 2020 51' })).iban).toBe(
      'DE02120300000000202051'
    );
  });

  test('lehnt eine falsche Pruefsumme ab', () => {
    const ergebnis = baueAbschlussDaten(fuerSichSelbst({ iban: 'DE02120300000000202052' }));

    expect(ergebnis.daten).toBeNull();
    expect(ergebnis.fehler).toContain('IBAN ist ungültig');
  });
});

describe('Versicherungsbeginn', () => {
  test('uebernimmt einen Monatsersten', () => {
    expect(daten(fuerSichSelbst({ insuranceStartDate: '01.11.2026' })).beginn_roh).toBe('01.11.2026');
  });

  test('uebernimmt Sofort', () => {
    const d = daten(fuerSichSelbst({ insuranceStartType: 'immediate', insuranceStartDate: '' }));

    expect(d.beginn_roh).toBe('Sofort');
  });

  test('lehnt einen Tag mitten im Monat ab', () => {
    const ergebnis = baueAbschlussDaten(fuerSichSelbst({ insuranceStartDate: '15.11.2026' }));

    expect(ergebnis.daten).toBeNull();
    expect(ergebnis.fehler).toContain('Versicherungsbeginn muss auf den 1. eines Monats fallen');
  });
});

describe('Tarif', () => {
  test.each(['Small', 'Medium', 'Large', 'Small Kids', 'Medium Kids', 'Large Kids'])(
    'akzeptiert %s',
    (tarif) => {
      expect(daten(fuerSichSelbst({ tarif })).tarif_roh).toBe(tarif);
    }
  );

  test('lehnt einen unbekannten Tarif ab', () => {
    const ergebnis = baueAbschlussDaten(fuerSichSelbst({ tarif: 'Mega' }));

    expect(ergebnis.daten).toBeNull();
    expect(ergebnis.fehler).toContain('Tarif ist ungültig');
  });
});

describe('Beziehung', () => {
  test.each(['Verheiratet', 'Lebensgemeinschaft', 'Kind', 'Sonstige'])(
    'akzeptiert %s',
    (beziehung) => {
      expect(daten(fuerJemandAnderen({ relationshipToInsured: beziehung })).beziehung).toBe(beziehung);
    }
  );

  test('lehnt Freitext ab', () => {
    const ergebnis = baueAbschlussDaten(fuerJemandAnderen({ relationshipToInsured: 'Bruder' }));

    expect(ergebnis.daten).toBeNull();
    expect(ergebnis.fehler).toContain('Beziehung zur versicherten Person ist ungültig');
  });

  test('lehnt Selbst ab, wenn die Versicherung fuer jemand anderen ist', () => {
    expect(baueAbschlussDaten(fuerJemandAnderen({ relationshipToInsured: 'Selbst' })).daten).toBeNull();
  });
});

describe('Adresse und Kontakt', () => {
  test('lehnt eine PLZ ab, die keine 5 Ziffern hat', () => {
    const ergebnis = baueAbschlussDaten(fuerSichSelbst({ postalCode: '7613' }));

    expect(ergebnis.daten).toBeNull();
    expect(ergebnis.fehler).toContain('Postleitzahl ist ungültig');
  });

  test('lehnt eine ungueltige E-Mail ab', () => {
    const ergebnis = baueAbschlussDaten(fuerSichSelbst({ email: 'thomas.berger@' }));

    expect(ergebnis.daten).toBeNull();
    expect(ergebnis.fehler).toContain('E-Mail-Adresse ist ungültig');
  });

  test('lehnt einen fehlenden Ort ab', () => {
    expect(baueAbschlussDaten(fuerSichSelbst({ city: '  ' })).daten).toBeNull();
  });

  test('lehnt eine fehlende Hausnummer ab', () => {
    expect(baueAbschlussDaten(fuerSichSelbst({ houseNumber: '' })).daten).toBeNull();
  });

  test('lehnt einen fehlenden Kontoinhaber ab', () => {
    expect(baueAbschlussDaten(fuerSichSelbst({ accountHolder: '' })).daten).toBeNull();
  });
});

describe('Sammeln der Fehler', () => {
  test('meldet mehrere Fehler auf einmal', () => {
    const ergebnis = baueAbschlussDaten(
      fuerSichSelbst({ email: 'kaputt', iban: 'DE00', postalCode: 'abc' })
    );

    expect(ergebnis.daten).toBeNull();
    expect(ergebnis.fehler.length).toBeGreaterThanOrEqual(3);
  });

  test('meldet einen Fehler, wenn insuranceFor fehlt', () => {
    expect(baueAbschlussDaten(fuerSichSelbst({ insuranceFor: '' })).daten).toBeNull();
  });
});

describe('istQuelleId', () => {
  test('akzeptiert eine UUID', () => {
    expect(istQuelleId('3f2b1c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d')).toBe(true);
  });

  test('lehnt alles andere ab', () => {
    expect(istQuelleId('')).toBe(false);
    expect(istQuelleId('abc')).toBe(false);
    expect(istQuelleId(undefined)).toBe(false);
    expect(istQuelleId(42)).toBe(false);
  });
});
