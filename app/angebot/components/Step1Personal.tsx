'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FormStepProps, FormErrors } from '@/types/angebot';
import { validateBirthDate } from '@/lib/validation';

export default function Step1Personal({ formData, onUpdate, onNext }: FormStepProps) {
  const [errors, setErrors] = useState<FormErrors>({});

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length >= 2) {
      value = value.slice(0, 2) + '.' + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + '.' + value.slice(5);
    }
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    onUpdate({ birthDate: value });
    if (errors.birthDate) {
      setErrors({ ...errors, birthDate: '' });
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.salutation) {
      newErrors.salutation = 'Bitte wähle eine Anrede';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Bitte gib deinen Namen ein';
    }

    const birthDateValidation = validateBirthDate(formData.birthDate);
    if (!birthDateValidation.valid) {
      newErrors.birthDate = birthDateValidation.error || 'Ungültiges Geburtsdatum';
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
          Persönliche Daten
        </h2>
        <p className="text-gray-600">
          Lass uns mit deinen Basisdaten starten
        </p>
      </div>

      {/* Trust Indicator */}
      <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-lg mb-6">
        <p className="text-sm text-gray-700">
          🔒 Deine Daten sind bei uns sicher und werden verschlüsselt übertragen
        </p>
      </div>

      <div className="space-y-4">
        {/* Salutation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Anrede <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['Herr', 'Frau', 'Divers'].map((sal) => (
              <button
                key={sal}
                type="button"
                onClick={() => {
                  onUpdate({ salutation: sal });
                  if (errors.salutation) setErrors({ ...errors, salutation: '' });
                }}
                className={`py-3 px-4 rounded-lg border-2 font-medium transition-all duration-200 ${
                  formData.salutation === sal
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-primary/50'
                }`}
              >
                {sal}
              </button>
            ))}
          </div>
          {errors.salutation && (
            <p className="text-red-500 text-sm mt-2">{errors.salutation}</p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vor- und Nachname <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => {
              onUpdate({ name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Max Mustermann"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Birth Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Geburtsdatum <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.birthDate}
            onChange={handleBirthDateChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
              errors.birthDate ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="TT.MM.JJJJ"
            inputMode="numeric"
          />
          {errors.birthDate && (
            <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
          )}
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 mt-8"
      >
        Weiter
      </button>
    </motion.div>
  );
}
