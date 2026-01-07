'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FormStepProps, FormErrors } from '@/types/angebot';
import { validateIBAN, formatIBAN } from '@/lib/validation';

export default function Step3Bank({ formData, onUpdate, onNext, onBack }: FormStepProps) {
  const [errors, setErrors] = useState<FormErrors>({});

  // Pre-fill account holder with name if empty
  useEffect(() => {
    if (!formData.accountHolder && formData.name) {
      onUpdate({ accountHolder: formData.name });
    }
  }, [formData.name, formData.accountHolder, onUpdate]);

  const handleIBANChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '').toUpperCase();
    const formatted = formatIBAN(value);
    onUpdate({ iban: formatted });
    if (errors.iban) setErrors({ ...errors, iban: '' });
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!validateIBAN(formData.iban)) {
      newErrors.iban = 'Bitte gib eine gültige deutsche IBAN ein';
    }

    if (!formData.accountHolder.trim()) {
      newErrors.accountHolder = 'Bitte gib den Kontoinhaber ein';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
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
          Bankverbindung
        </h2>
        <p className="text-gray-600">
          Für die Erstellung des Angebots benötigen wir deine Kontodaten
        </p>
      </div>


      {/* Important Notice */}
      <div className="bg-yellow-50 border-2 border-yellow-400  p-4 rounded-lg mb-6">
        <div className="flex items-start gap-3">
          <span className="text-xl">ℹ️</span>
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-1">Wichtig: Noch kein Vertragsabschluss</p>
            <p className="text-gray-600">
              Die Eingabe deiner IBAN dient ausschließlich der Antragsstellung und bedeutet <strong>nicht</strong>, dass bereits ein Vertrag abgeschlossen wird. Du erhältst zunächst einen Antrag von uns, welcher von Dir zu unterzeichnen ist.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* IBAN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IBAN <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.iban}
            onChange={handleIBANChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors font-mono ${
              errors.iban ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="DE12 3456 7890 1234 5678 90"
            maxLength={27}
          />
          {errors.iban && (
            <p className="text-red-500 text-sm mt-1">{errors.iban}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Deine IBAN findest du auf deiner EC-Karte oder im Online-Banking
          </p>
        </div>

        {/* Account Holder */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kontoinhaber <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.accountHolder}
            onChange={(e) => {
              onUpdate({ accountHolder: e.target.value });
              if (errors.accountHolder) setErrors({ ...errors, accountHolder: '' });
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
              errors.accountHolder ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Max Mustermann"
          />
          {errors.accountHolder && (
            <p className="text-red-500 text-sm mt-1">{errors.accountHolder}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Falls abweichend vom versicherten Namen
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-8">
        <button
            onClick={onBack}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-6 rounded-lg transition-all duration-200"
        >
          Zurück
        </button>
        <button
            onClick={handleNext}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200"
        >
          Weiter
        </button>
      </div>

      {/* Trust Indicator */}
      <div className="bg-primary/10 border-2 border-primary p-4 rounded-lg mb-6">
        <div className="flex items-start gap-3">
          <span className="text-xl">🔒</span>
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-1">Deine Bankdaten sind sicher</p>
            <p className="text-gray-600">
              Wir verwenden SSL-Verschlüsselung und speichern deine Daten nach höchsten Sicherheitsstandards.
              Deine IBAN wird ausschließlich für die Beitragszahlung verwendet, wenn ein Vertrag mit uns abgeschlossen wird.
              Nach 14 Tagen werden alle deine Daten automatisch bei uns gelöscht.
            </p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">💡 Gut zu wissen</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span>Die Beiträge werden monatlich bequem per SEPA-Lastschrift eingezogen</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span>Du kannst das SEPA-Mandat jederzeit widerrufen</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span>Keine versteckten Kosten oder Zusatzgebühren</span>
          </li>
        </ul>
      </div>


    </motion.div>
  );
}
