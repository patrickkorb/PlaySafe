/**
 * Type definitions for the Angebot (Offer) form
 */

export interface AngebotFormData {
  // Step 1: Personal Data
  salutation: string; // Herr, Frau, Divers
  name: string;
  birthDate: string; // DD.MM.YYYY format

  // Step 2: Contact Data
  email: string;
  phone: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;

  // Step 3: Bank Details
  iban: string;
  accountHolder: string;

  // Step 4: Privacy & Consent
  privacyConsent: boolean;
  contactConsent: boolean;
}

export interface FormStepProps {
  formData: AngebotFormData;
  onUpdate: (data: Partial<AngebotFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export interface FormErrors {
  [key: string]: string;
}
