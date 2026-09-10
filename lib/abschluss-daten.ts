/**
 * Baut aus den Formulardaten des Antragsformulars das `daten`-Objekt, das in
 * `public.abschluesse` landet.
 *
 * Die Antrags-Automation fuellt damit unbeaufsichtigt einen Antrag aus und
 * verschickt eine Signatureinladung an den Kunden. Es sieht niemand drueber.
 * Deshalb: keine Ersatzwerte, keine Vorbelegungen, keine leeren Strings —
 * lieber den Kunden nachbessern lassen als eine unvollstaendige Zeile schreiben.
 */
import { JOBS_REQUIRING_FIELD } from './berufe';
import { validateEmail, validateIBAN, validatePLZ } from './validation';

export interface AbschlussEingabe {
  insuranceFor: string;
  policyHolderSalutation: string;
  policyHolderName: string;
  policyHolderBirthDate: string;
  policyHolderJob: string;
  policyHolderJobField: string;
  relationshipToInsured: string;
  salutation: string;
  name: string;
  birthDate: string;
  job: string;
  jobField: string;
  insuranceStartType: string;
  insuranceStartDate: string;
  tarif: string;
  email: string;
  phone: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  iban: string;
  accountHolder: string;
}

export type AbschlussDaten = Record<string, string>;

export interface AbschlussErgebnis {
  /** Das fertige Objekt — oder `null`, wenn mindestens ein Fehler vorliegt. */
  daten: AbschlussDaten | null;
  fehler: string[];
}

const ANREDEN = ['Herr', 'Frau'];
const TARIFE = ['Small', 'Medium', 'Large', 'Small Kids', 'Medium Kids', 'Large Kids'];
const BEZIEHUNGEN = ['Verheiratet', 'Lebensgemeinschaft', 'Kind', 'Sonstige'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Eine `quelle_id` ist genau dann brauchbar, wenn sie eine UUID ist. */
export function istQuelleId(wert: unknown): boolean {
  return typeof wert === 'string' && UUID.test(wert);
}

function text(wert: unknown): string {
  return typeof wert === 'string' ? wert.trim() : '';
}

/**
 * `5.4.1980` → `05.04.1980`. Gibt `null` zurueck, wenn das Ergebnis kein
 * existierendes Datum im Format TT.MM.JJJJ waere.
 */
function normalisiereDatum(wert: string): string | null {
  const treffer = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(wert);
  if (!treffer) return null;

  const tag = Number(treffer[1]);
  const monat = Number(treffer[2]);
  const jahr = Number(treffer[3]);

  const datum = new Date(jahr, monat - 1, tag);
  if (datum.getDate() !== tag || datum.getMonth() !== monat - 1 || datum.getFullYear() !== jahr) {
    return null;
  }

  return `${String(tag).padStart(2, '0')}.${String(monat).padStart(2, '0')}.${jahr}`;
}

/** Jede deutsche Schreibweise wird zu `+49…`. */
function normalisiereTelefon(wert: string): string | null {
  const bereinigt = wert.replace(/[\s\-()./]/g, '');

  let national: string;
  if (bereinigt.startsWith('+49')) national = bereinigt.slice(3);
  else if (bereinigt.startsWith('0049')) national = bereinigt.slice(4);
  else if (bereinigt.startsWith('0')) national = bereinigt.slice(1);
  else return null;

  if (!/^\d{9,13}$/.test(national)) return null;

  return `+49${national}`;
}

function normalisiereIban(wert: string): string | null {
  const bereinigt = wert.replace(/\s/g, '').toUpperCase();
  return validateIBAN(bereinigt) ? bereinigt : null;
}

interface Person {
  anrede: string;
  name: string;
  geburtsdatum: string;
  berufsstand: string;
  taetigkeit: string;
}

/**
 * Prueft die fuenf Felder einer Person und liefert sie normalisiert zurueck.
 * `genitiv` geht in die Fehlermeldungen ein ("der versicherten Person").
 */
function bauePerson(
  roh: { anrede: string; name: string; geburtsdatum: string; berufsstand: string; taetigkeit: string },
  genitiv: string,
  fehler: string[]
): Person {
  const anrede = text(roh.anrede);
  if (!ANREDEN.includes(anrede)) {
    fehler.push(`Anrede ${genitiv} muss Herr oder Frau sein`);
  }

  const name = text(roh.name);
  if (!name) {
    fehler.push(`Name ${genitiv} fehlt`);
  }

  const geburtsdatum = normalisiereDatum(text(roh.geburtsdatum));
  if (!geburtsdatum) {
    fehler.push(`Geburtsdatum ${genitiv} ist kein gültiges Datum`);
  }

  const berufsstand = text(roh.berufsstand);
  if (!berufsstand) {
    fehler.push(`Berufsstand ${genitiv} fehlt`);
  }

  // Wo das Formular die Taetigkeit abfragt, ist sie Pflicht. Sonst wird der
  // Berufsstand gespiegelt — nie leer, sonst macht der Berufe-Katalog der
  // Gegenseite aus "Arbeitnehmer" den Eintrag "Arbeit".
  let taetigkeit = text(roh.taetigkeit);
  if (JOBS_REQUIRING_FIELD.includes(berufsstand)) {
    if (!taetigkeit) {
      fehler.push(`Bitte gib die Tätigkeit ${genitiv} an`);
    }
  } else {
    taetigkeit = berufsstand;
  }

  return {
    anrede,
    name,
    geburtsdatum: geburtsdatum ?? '',
    berufsstand,
    taetigkeit,
  };
}

function baueBeziehung(eingabe: Partial<AbschlussEingabe>, fehler: string[]): string {
  const fuerWen = text(eingabe.insuranceFor);

  if (fuerWen === 'self') return 'Selbst';

  if (fuerWen === 'other') {
    const beziehung = text(eingabe.relationshipToInsured);
    if (!BEZIEHUNGEN.includes(beziehung)) {
      fehler.push('Beziehung zur versicherten Person ist ungültig');
      return '';
    }
    return beziehung;
  }

  fehler.push('Es fehlt die Angabe, wer versichert werden soll');
  return '';
}

function baueBeginn(eingabe: Partial<AbschlussEingabe>, fehler: string[]): string {
  if (text(eingabe.insuranceStartType) === 'immediate') return 'Sofort';

  const beginn = normalisiereDatum(text(eingabe.insuranceStartDate));
  if (!beginn) {
    fehler.push('Versicherungsbeginn ist kein gültiges Datum');
    return '';
  }

  if (!beginn.startsWith('01.')) {
    fehler.push('Versicherungsbeginn muss auf den 1. eines Monats fallen');
    return '';
  }

  return beginn;
}

export function baueAbschlussDaten(eingabe: Partial<AbschlussEingabe>): AbschlussErgebnis {
  const fehler: string[] = [];

  const versichertePerson = bauePerson(
    {
      anrede: eingabe.salutation ?? '',
      name: eingabe.name ?? '',
      geburtsdatum: eingabe.birthDate ?? '',
      berufsstand: eingabe.job ?? '',
      taetigkeit: eingabe.jobField ?? '',
    },
    'der versicherten Person',
    fehler
  );

  // Bei "fuer mich selbst" ist der Versicherungsnehmer dieselbe Person — das
  // Formular erhebt die fuenf Felder dort nur einmal.
  const versicherungsnehmer =
    text(eingabe.insuranceFor) === 'other'
      ? bauePerson(
          {
            anrede: eingabe.policyHolderSalutation ?? '',
            name: eingabe.policyHolderName ?? '',
            geburtsdatum: eingabe.policyHolderBirthDate ?? '',
            berufsstand: eingabe.policyHolderJob ?? '',
            taetigkeit: eingabe.policyHolderJobField ?? '',
          },
          'des Versicherungsnehmers',
          fehler
        )
      : versichertePerson;

  const beziehung = baueBeziehung(eingabe, fehler);
  const beginn = baueBeginn(eingabe, fehler);

  const strasse = text(eingabe.street);
  const hausnummer = text(eingabe.houseNumber);
  if (!strasse || !hausnummer) {
    fehler.push('Straße und Hausnummer fehlen');
  }

  const plz = text(eingabe.postalCode);
  if (!validatePLZ(plz)) {
    fehler.push('Postleitzahl ist ungültig');
  }

  const ort = text(eingabe.city);
  if (!ort) {
    fehler.push('Wohnort fehlt');
  }

  const email = text(eingabe.email);
  if (!validateEmail(email)) {
    fehler.push('E-Mail-Adresse ist ungültig');
  }

  const telefon = normalisiereTelefon(text(eingabe.phone));
  if (!telefon) {
    fehler.push('Telefonnummer ist ungültig');
  }

  const iban = normalisiereIban(text(eingabe.iban));
  if (!iban) {
    fehler.push('IBAN ist ungültig');
  }

  const kontoinhaber = text(eingabe.accountHolder);
  if (!kontoinhaber) {
    fehler.push('Kontoinhaber fehlt');
  }

  const tarif = text(eingabe.tarif);
  if (!TARIFE.includes(tarif)) {
    fehler.push('Tarif ist ungültig');
  }

  if (fehler.length > 0) {
    return { daten: null, fehler };
  }

  return {
    daten: {
      vn_anrede: versicherungsnehmer.anrede,
      vn_name: versicherungsnehmer.name,
      vn_geburtsdatum: versicherungsnehmer.geburtsdatum,
      vn_berufsstand: versicherungsnehmer.berufsstand,
      vn_taetigkeit: versicherungsnehmer.taetigkeit,
      vp_anrede: versichertePerson.anrede,
      vp_name: versichertePerson.name,
      vp_geburtsdatum: versichertePerson.geburtsdatum,
      vp_berufsstand: versichertePerson.berufsstand,
      vp_taetigkeit: versichertePerson.taetigkeit,
      adresse_strasse_hausnr: `${strasse} ${hausnummer}`,
      adresse_plz: plz,
      adresse_ort: ort,
      beziehung,
      email,
      telefon: telefon!,
      iban: iban!,
      kontoinhaber,
      beginn_roh: beginn,
      tarif_roh: tarif,
    },
    fehler: [],
  };
}
