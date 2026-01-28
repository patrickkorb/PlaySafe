import { InsuranceFor, Gender, TariffInfo } from './types';
import { TARIFFS, CHILD_TARIFFS, SPORTS } from './constants';

export function getInsuredPersonLabel(insuranceFor: InsuranceFor, gender: Gender): string {
  const isMale = gender === 'Männlich';

  switch (insuranceFor) {
    case 'child':
      return isMale ? 'deines Sohnes' : 'deiner Tochter';
    case 'spouse':
      return isMale ? 'deines Ehemanns' : 'deiner Ehefrau';
    case 'partner':
      return isMale ? 'deines Lebenspartners' : 'deiner Lebenspartnerin';
    default:
      return 'dein';
  }
}

export function getInsuredPersonPronoun(insuranceFor: InsuranceFor, gender: Gender): string {
  const isMale = gender === 'Männlich';

  switch (insuranceFor) {
    case 'child':
      return isMale ? 'dein Sohn' : 'deine Tochter';
    case 'spouse':
      return isMale ? 'dein Ehemann' : 'deine Ehefrau';
    case 'partner':
      return isMale ? 'dein Lebenspartner' : 'deine Lebenspartnerin';
    default:
      return 'du';
  }
}

export function getSportFrequencyQuestion(
  sport: string,
  insuranceFor: InsuranceFor,
  gender: Gender
): string {
  const isSelf = insuranceFor === 'self';
  const isMale = gender === 'Männlich';

  // Verb-Konjugationen: [du-Form, er/sie-Form]
  const sportVerbs: Record<string, [string, string]> = {
    'Fußball': ['spielst du', 'spielt'],
    'Tennis': ['spielst du', 'spielt'],
    'Ski': ['fährst du', 'fährt'],
    'Fitness': ['gehst du ins', 'geht'],
    'Radfahren': ['fährst du', 'fährt'],
    'Sonstiges': ['machst du', 'macht'],
  };

  const [duVerb, erSieVerb] = sportVerbs[sport] || ['machst du', 'macht'];

  if (isSelf) {
    if (sport === 'Fitness') {
      return `Wie oft ${duVerb} Fitnessstudio?`;
    }
    return `Wie oft ${duVerb} ${sport}?`;
  }

  // Für andere Personen
  let subject: string;
  switch (insuranceFor) {
    case 'child':
      subject = isMale ? 'dein Sohn' : 'deine Tochter';
      break;
    case 'spouse':
      subject = isMale ? 'dein Mann' : 'deine Frau';
      break;
    case 'partner':
      subject = isMale ? 'dein Partner' : 'deine Partnerin';
      break;
    default:
      subject = 'die Person';
  }

  if (sport === 'Fitness') {
    return `Wie oft ${erSieVerb} ${subject} ins Fitnessstudio?`;
  }

  return `Wie oft ${erSieVerb} ${subject} ${sport}?`;
}

export function calculateTariff(frequency: string, insuranceFor: InsuranceFor = 'self'): TariffInfo {
  const isChild = insuranceFor === 'child';

  if (isChild) {
    switch (frequency) {
      case '2-3x pro Woche':
        return CHILD_TARIFFS['Medium Kids'];
      case '4-5x pro Woche':
      case 'Täglich':
        return CHILD_TARIFFS['Large Kids'];
      default:
        return CHILD_TARIFFS['Small Kids'];
    }
  }

  switch (frequency) {
    case '2-3x pro Woche':
      return TARIFFS.Medium;
    case '4-5x pro Woche':
    case 'Täglich':
      return TARIFFS.Large;
    default:
      return TARIFFS.Small;
  }
}

export function getSportByName(sportName: string) {
  return SPORTS.find(s => s.name === sportName);
}

export function formatBirthDateInput(value: string): string {
  let cleaned = value.replace(/\D/g, '');

  if (cleaned.length >= 2) {
    cleaned = cleaned.slice(0, 2) + '.' + cleaned.slice(2);
  }
  if (cleaned.length >= 5) {
    cleaned = cleaned.slice(0, 5) + '.' + cleaned.slice(5);
  }
  if (cleaned.length > 10) {
    cleaned = cleaned.slice(0, 10);
  }

  return cleaned;
}

export function validateBirthDate(birthDate: string, insuranceFor: InsuranceFor): string | null {
  if (!birthDate) {
    return insuranceFor === 'self'
      ? 'Bitte gib dein Geburtsdatum ein'
      : 'Bitte gib das Geburtsdatum ein';
  }

  if (birthDate.length !== 10) {
    return 'Bitte gib ein vollständiges Datum ein (TT.MM.JJJJ)';
  }

  const parts = birthDate.split('.');
  if (parts.length !== 3) {
    return 'Ungültiges Datumsformat';
  }

  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const year = parseInt(parts[2]);

  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
    return 'Ungültiges Datum';
  }

  const selectedDate = new Date(year, month - 1, day);
  const cutoffDate = new Date(1958, 0, 1);

  if (selectedDate.getDate() !== day || selectedDate.getMonth() !== month - 1 || selectedDate.getFullYear() !== year) {
    return 'Ungültiges Datum';
  }

  if (selectedDate < cutoffDate) {
    return 'Leider können wir für Personen, die vor dem 1.1.1958 geboren wurden, kein Angebot erstellen.';
  }

  if (selectedDate > new Date()) {
    return 'Das Datum darf nicht in der Zukunft liegen';
  }

  return null;
}

export function getVideoPath(sportName: string, tariffTitle: string): string {
  const sportMap: Record<string, string> = {
    'Fußball': 'fussball',
    'Tennis': 'tennis',
    'Ski': 'ski',
    'Fitness': 'fitness',
    'Radfahren': 'radfahren',
    'Sonstiges': 'sonstiges',
  };

  const normalizedSport = sportMap[sportName] || 'sonstiges';
  const normalizedTariff = tariffTitle.toLowerCase();
  const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';

  return `https://res.cloudinary.com/${cloudinaryCloudName}/video/upload/v1768247662/${normalizedSport}-${normalizedTariff}.mp4`;
}

export function buildOfferUrl(params: {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  tarif: string;
  insuranceFor: string;
}): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, value);
  });

  return `/angebot?${searchParams.toString()}`;
}
