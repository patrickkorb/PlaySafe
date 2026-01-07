/**
 * Validation utilities for form inputs
 */

/**
 * Validates German IBAN format and checksum
 * @param iban - IBAN string to validate
 * @returns true if valid, false otherwise
 */
export function validateIBAN(iban: string): boolean {
  // Remove spaces and convert to uppercase
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();

  // Check if it starts with DE and has the correct length (22 chars for Germany)
  if (!cleanIban.match(/^DE\d{20}$/)) {
    return false;
  }

  // Validate checksum using mod-97 algorithm
  // Move first 4 chars to end
  const rearranged = cleanIban.slice(4) + cleanIban.slice(0, 4);

  // Replace letters with numbers (A=10, B=11, ..., Z=35)
  const numericString = rearranged
      .split('')
      .map(char => {
        const code = char.charCodeAt(0);
        return code >= 65 && code <= 90 ? code - 55 : char;
      })
      .join('');

  // Calculate mod 97 using BigInt
  try {
    let remainder: bigint;
    remainder = BigInt(numericString) % BigInt(97);
    return remainder === BigInt(1);
  } catch {
    return false;
  }
}

/**
 * Formats IBAN with spaces for better readability
 * @param iban - IBAN string to format
 * @returns Formatted IBAN (DE12 3456 7890 1234 5678 90)
 */
export function formatIBAN(iban: string): string {
  const clean = iban.replace(/\s/g, '').toUpperCase();
  return clean.match(/.{1,4}/g)?.join(' ') || clean;
}

/**
 * Validates German postal code (5 digits)
 * @param plz - Postal code to validate
 * @returns true if valid, false otherwise
 */
export function validatePLZ(plz: string): boolean {
  return /^\d{5}$/.test(plz);
}

/**
 * Validates email format
 * @param email - Email to validate
 * @returns true if valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number (flexible format)
 * Accepts: +49, 0049, 0, with or without spaces/dashes
 * @param phone - Phone number to validate
 * @returns true if valid, false otherwise
 */
export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  // German phone number: starts with +49, 0049, or 0
  return /^(\+49|0049|0)\d{9,13}$/.test(cleaned);
}

/**
 * Validates birth date (DD.MM.YYYY format)
 * Checks if date is valid and person is at least 18 years old
 * @param birthDate - Birth date in DD.MM.YYYY format
 * @returns { valid: boolean, error?: string }
 */
export function validateBirthDate(birthDate: string): { valid: boolean; error?: string } {
  if (birthDate.length !== 10) {
    return { valid: false, error: 'Bitte gib ein vollständiges Datum ein (TT.MM.JJJJ)' };
  }

  const parts = birthDate.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'Ungültiges Datumsformat' };
  }

  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const year = parseInt(parts[2]);

  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
    return { valid: false, error: 'Ungültiges Datum' };
  }

  const selectedDate = new Date(year, month - 1, day);

  // Check if date is valid (e.g., 31.02 becomes different date)
  if (selectedDate.getDate() !== day || selectedDate.getMonth() !== month - 1 || selectedDate.getFullYear() !== year) {
    return { valid: false, error: 'Ungültiges Datum' };
  }

  // Check if person is at least 18
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  if (selectedDate > eighteenYearsAgo) {
    return { valid: false, error: 'Du musst mindestens 18 Jahre alt sein' };
  }

  // Check cutoff date (1.1.1958)
  const cutoffDate = new Date(1958, 0, 1);
  if (selectedDate < cutoffDate) {
    return { valid: false, error: 'Leider können wir für Personen, die vor dem 1.1.1958 geboren wurden, kein Angebot erstellen.' };
  }

  return { valid: true };
}
