/**
 * Type definitions for the Angebot (Offer) form
 */

export interface AngebotFormData {
  // Insurance type selection
  insuranceFor: 'self' | 'other' | ''; // Wer wird versichert?

  // Policy Holder Data (only when insuranceFor === 'other')
  policyHolderSalutation: string;
  policyHolderName: string;
  policyHolderBirthDate: string;
  policyHolderJob: string;
  policyHolderJobField: string;
  relationshipToInsured: string; // Verheiratet, Lebensgemeinschaft, Kind, Sonstige

  // Step 1: Personal Data (Insured Person)
  salutation: string; // Herr, Frau, Divers
  name: string;
  birthDate: string; // DD.MM.YYYY format
  job: string; // Beruf
  jobField: string; // Tätigkeit

  // Insurance start
  insuranceStartType: 'immediate' | 'date' | ''; // Sofort oder Datum
  insuranceStartDate: string; // DD.MM.YYYY format (only when insuranceStartType === 'date')
  tarif: string; // Small, Medium, Large

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
  riskExclusionConsent: boolean; // Keine Pflegebedürftigkeit, kein Flug-/Motorsport-/Profisportrisiko
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
