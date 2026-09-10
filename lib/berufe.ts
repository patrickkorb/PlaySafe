/**
 * Berufsstand-Katalog des Antragsformulars.
 *
 * Die Werte gehen unveraendert an die Antrags-Automation. Sie hier zu aendern
 * aendert damit auch, was im Antrag beim Versicherer steht.
 */
export const JOB_OPTIONS = [
  'Arbeitnehmer',
  'Arbeitslos',
  'Auszubildender',
  'Beamter auf Widerruf/Probe',
  'Beamter',
  'Hausfrau',
  'Pensionär',
  'Rentner',
  'Schüler',
  'Student',
  'Selbstständiger',
];

/**
 * Berufsstaende, bei denen das Formular zusaetzlich die ausgeuebte Taetigkeit
 * abfragt. Bei allen uebrigen wird der Berufsstand selbst als Taetigkeit
 * verwendet — so, wie es die Gegenseite bei Schuelern und Studenten ohnehin tut.
 */
export const JOBS_REQUIRING_FIELD = [
  'Arbeitnehmer',
  'Auszubildender',
  'Beamter auf Widerruf/Probe',
  'Beamter',
  'Selbstständiger',
];
