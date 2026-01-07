'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FormStepProps, FormErrors } from '@/types/angebot';

interface Step4ConfirmationProps extends FormStepProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function Step4Confirmation({
  formData,
  onUpdate,
  onBack,
  onSubmit,
  isSubmitting
}: Step4ConfirmationProps) {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.privacyConsent) {
      newErrors.privacyConsent = 'Bitte akzeptiere die Datenschutzerklärung';
    }

    if (!formData.contactConsent) {
      newErrors.contactConsent = 'Bitte erlaube uns, dich zu kontaktieren';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  // Mask IBAN for security (show only first 4 and last 4 chars)
  const maskIBAN = (iban: string) => {
    const clean = iban.replace(/\s/g, '');
    if (clean.length < 8) return iban;
    return `${clean.slice(0, 4)} ${'*'.repeat(12)} ${clean.slice(-4)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Fast geschafft!
        </h2>
        <p className="text-gray-600">
          Bitte überprüfe deine Angaben und bestätige die Einwilligungen
        </p>
      </div>

      {/* Summary */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="font-bold text-lg text-gray-900 mb-4">📋 Deine Angaben im Überblick</h3>

        {/* Personal Data */}
        <div className="border-b border-gray-200 pb-4">
          <h4 className="font-semibold text-gray-700 mb-2">Persönliche Daten</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Anrede:</span> {formData.salutation}</p>
            <p><span className="font-medium">Name:</span> {formData.name}</p>
            <p><span className="font-medium">Geburtsdatum:</span> {formData.birthDate}</p>
          </div>
        </div>

        {/* Contact Data */}
        <div className="border-b border-gray-200 pb-4">
          <h4 className="font-semibold text-gray-700 mb-2">Kontaktdaten</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">E-Mail:</span> {formData.email}</p>
            <p><span className="font-medium">Telefon:</span> {formData.phone}</p>
            <p><span className="font-medium">Adresse:</span> {formData.street} {formData.houseNumber}, {formData.postalCode} {formData.city}</p>
          </div>
        </div>

        {/* Bank Data */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Bankverbindung</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">IBAN:</span> {maskIBAN(formData.iban)}</p>
            <p><span className="font-medium">Kontoinhaber:</span> {formData.accountHolder || formData.name}</p>
          </div>
        </div>
      </div>

      {/* Consents */}
      <div className="space-y-4">
        {/* Privacy Consent */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="privacy"
            checked={formData.privacyConsent}
            onChange={(e) => {
              onUpdate({ privacyConsent: e.target.checked });
              if (errors.privacyConsent) setErrors({ ...errors, privacyConsent: '' });
            }}
            className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
          />
          <label htmlFor="privacy" className="text-sm text-gray-700 cursor-pointer">
            Ich habe die{' '}
            <Link href="/datenschutz" target="_blank" className="text-primary underline hover:text-primary/80">
              Datenschutzerklärung
            </Link>{' '}
            gelesen und akzeptiert. Ich bin damit einverstanden, dass meine Daten zur Bearbeitung meiner Antragsanfrage
            verarbeitet werden. <span className="text-red-500">*</span>
          </label>
        </div>
        {errors.privacyConsent && (
          <p className="text-red-500 text-sm -mt-2">{errors.privacyConsent}</p>
        )}

        {/* Contact Consent */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="contact"
            checked={formData.contactConsent}
            onChange={(e) => {
              onUpdate({ contactConsent: e.target.checked });
              if (errors.contactConsent) setErrors({ ...errors, contactConsent: '' });
            }}
            className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
          />
          <label htmlFor="contact" className="text-sm text-gray-700 cursor-pointer">
            Ich bin damit einverstanden, dass PlaySafe mich per E-Mail und Telefon
            kontaktiert, um mir ein persönliches Angebot zu unterbreiten. Diese Einwilligung kann ich jederzeit
            widerrufen. <span className="text-red-500">*</span>
          </label>
        </div>
        {errors.contactConsent && (
          <p className="text-red-500 text-sm -mt-2">{errors.contactConsent}</p>
        )}
      </div>

      {/* Trust Badge */}
      <div className="bg-primary/10 border-2 border-primary p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✓</span>
          <div className="text-sm text-gray-700">
            <p className="font-semibold">100% kostenlos & unverbindlich</p>
            <p>Du erhältst ein maßgeschneidertes Angebot - ganz ohne Verpflichtung.</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-4 mt-8">
        <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-secondary hover:bg-secondary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all duration-200"
        >
          {isSubmitting ? 'Wird gesendet...' : 'Angebot anfordern'}
        </button>
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-bold py-4 px-6 rounded-lg transition-all duration-200"
        >
          Zurück
        </button>
      </div>
    </motion.div>
  );
}
