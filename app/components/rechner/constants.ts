import { SportOption } from './types';

export const STORAGE_KEY = 'playsafe_rechner';
export const EXPIRATION_DAYS = 14;

export const INSURANCE_FOR_OPTIONS = [
  { name: 'Mich selbst', value: 'self' },
  { name: 'Mein Kind', value: 'child' },
  { name: 'Ehepartner/in', value: 'spouse' },
  { name: 'Lebenspartner/in', value: 'partner' },
] as const;

export const GENDER_OPTIONS = [
  { name: 'Männlich', value: 'Männlich' },
  { name: 'Weiblich', value: 'Weiblich' },
] as const;

export const SPORTS: SportOption[] = [
  {
    name: 'Fußball',
    icon: '⚽',
    image: '/images/rechner/soccer2.jpg',
    catch: 'schon bei Kreuzbandrissen, Bänderrissen und weiteren Fußballverletzungen'
  },
  {
    name: 'Tennis',
    icon: '🎾',
    image: '/images/rechner/tennis.jpg',
    catch: 'schon bei Sehnenrissen, Bänderrissen und sonstigen Tennisverletzungen'
  },
  {
    name: 'Ski',
    icon: '⛷️',
    image: '/images/rechner/ski.jpg',
    catch: 'schon bei Kreuzbandrissen, Knochenbrüchen und sonstigen Skiunfällen'
  },
  {
    name: 'Fitness',
    icon: '💪',
    image: '/images/rechner/gym.jpg',
    catch: 'schon bei Muskelrissen, Kapselrissen und sonstigen Trainingsverletzungen'
  },
  {
    name: 'Radfahren',
    icon: '🚴',
    image: '/images/rechner/rad.jpg',
    catch: 'schon bei Sehnenrissen, Schlüsselbeinbrüchen und sonstigen Radunfällen'
  },
  {
    name: 'Sonstiges',
    icon: '🏃',
    image: '/images/rechner/running.jpg',
    catch: 'schon bei Rissen oder Brüchen jeder Art'
  },
];

export const FREQUENCIES = [
  '1x pro Woche',
  '2-3x pro Woche',
  '4-5x pro Woche',
  'Täglich',
  'Unregelmäßig',
] as const;

export const TARIFFS = {
  Small: {
    title: 'Small' as const,
    price: '10€',
    features: [
      '1.000€ sofort aufs Konto',
      'Sicherheitsbudget: 30€',
      'Vollinvalidität: 500.000€',
      'Krankenhaustagegeld: 10€',
      'Schwerverletzung: 2.500€',
      'Happy Holiday: Extra-Schutz im Urlaub',
      'Zahnersatz: 20.000€',
      'Premium Leistungen der SIGNAL IDUNA',
    ],
  },
  Medium: {
    title: 'Medium' as const,
    price: '15€',
    features: [
      '1.500€ sofort aufs Konto',
      'Sicherheitsbudget: 30€',
      'Vollinvalidität: 750.000€',
      'Krankenhaustagegeld: 30€',
      'Schwerverletzung: 7.000€',
      'Happy Holiday: Extra-Schutz im Urlaub',
      'Zahnersatz: 20.000€',
      'Premium Leistungen der SIGNAL IDUNA',
    ],
  },
  Large: {
    title: 'Large' as const,
    price: '20€',
    features: [
      '2.000€ sofort aufs Konto',
      'Sicherheitsbudget: 30€',
      'Vollinvalidität: 1.000.000€',
      'Krankenhaustagegeld: 50€',
      'Schwerverletzung: 12.000€',
      'Happy Holiday: Extra-Schutz im Urlaub',
      'Zahnersatz: 20.000€',
      'Premium Leistungen der SIGNAL IDUNA',
    ],
  },
} as const;
