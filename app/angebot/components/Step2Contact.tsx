'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FormStepProps, FormErrors } from '@/types/angebot';
import { validateEmail, validatePhone, validatePLZ } from '@/lib/validation';
import { trackOfferStep2Completed } from '@/app/components/Datafast';

export default function Step2Contact({ formData, onUpdate, onNext, onBack }: FormStepProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [orte, setOrte] = useState<string[]>([]);

  // Der aktuelle Ort ohne ihn in die Abhaengigkeiten des Effekts zu ziehen —
  // sonst laedt jeder Tastendruck den Katalog neu.
  const ortRef = useRef(formData.city);
  ortRef.current = formData.city;

  // Die Antrags-Automation prueft den Ort gegen einen Katalog. Statt den Kunden
  // tippen zu lassen, holen wir die Orte zur PLZ und lassen ihn auswaehlen.
  useEffect(() => {
    const plz = formData.postalCode;

    if (!/^\d{5}$/.test(plz)) {
      setOrte([]);
      return;
    }

    let abgebrochen = false;

    fetch(`/api/plz?plz=${plz}`)
      .then((antwort) => antwort.json())
      .then((ergebnis: { orte?: string[] }) => {
        if (abgebrochen) return;

        const gefunden = ergebnis.orte ?? [];
        setOrte(gefunden);

        if (gefunden.length === 1) {
          onUpdate({ city: gefunden[0] });
        } else if (gefunden.length > 1 && !gefunden.includes(ortRef.current)) {
          onUpdate({ city: '' });
        }
      })
      .catch(() => {
        // Katalog nicht erreichbar: der Kunde tippt den Ort wie bisher selbst.
        if (!abgebrochen) setOrte([]);
      });

    return () => {
      abgebrochen = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.postalCode]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Bitte gib eine gültige E-Mail-Adresse ein';
    }

    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Bitte gib eine gültige Telefonnummer ein';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Bitte gib deine Straße ein';
    }

    if (!formData.houseNumber.trim()) {
      newErrors.houseNumber = 'Bitte gib deine Hausnummer ein';
    }

    if (!validatePLZ(formData.postalCode)) {
      newErrors.postalCode = 'Bitte gib eine gültige PLZ ein (5 Ziffern)';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Bitte gib deinen Wohnort ein';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      // Track step completion
      trackOfferStep2Completed(formData.email, formData.tarif);
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
          Kontaktdaten des Versicherungsnehmers
        </h2>
        <h3>
          (Person, welche die Versicherung abschließt)
        </h3>
      </div>

      <div className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            E-Mail-Adresse <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => {
              onUpdate({ email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: '' });
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="max.mustermann@email.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefonnummer <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => {
              onUpdate({ phone: e.target.value });
              if (errors.phone) setErrors({ ...errors, phone: '' });
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+49 123 456789"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Street and House Number */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Straße <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => {
                onUpdate({ street: e.target.value });
                if (errors.street) setErrors({ ...errors, street: '' });
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                errors.street ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Musterstraße"
            />
            {errors.street && (
              <p className="text-red-500 text-sm mt-1">{errors.street}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nr. <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.houseNumber}
              onChange={(e) => {
                onUpdate({ houseNumber: e.target.value });
                if (errors.houseNumber) setErrors({ ...errors, houseNumber: '' });
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                errors.houseNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="12"
            />
            {errors.houseNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.houseNumber}</p>
            )}
          </div>
        </div>

        {/* Postal Code and City */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PLZ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                onUpdate({ postalCode: value });
                if (errors.postalCode) setErrors({ ...errors, postalCode: '' });
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                errors.postalCode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="12345"
              inputMode="numeric"
            />
            {errors.postalCode && (
              <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ort <span className="text-red-500">*</span>
            </label>

            {orte.length > 1 ? (
              // Mehrere Orte teilen sich die PLZ — der Kunde waehlt aus.
              <select
                value={formData.city}
                onChange={(e) => {
                  onUpdate({ city: e.target.value });
                  if (errors.city) setErrors({ ...errors, city: '' });
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Bitte wählen</option>
                {orte.map((ort) => (
                  <option key={ort} value={ort}>{ort}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={formData.city}
                onChange={(e) => {
                  onUpdate({ city: e.target.value });
                  if (errors.city) setErrors({ ...errors, city: '' });
                }}
                readOnly={orte.length === 1}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                  orte.length === 1 ? 'bg-gray-50 text-gray-700' : ''
                } ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Musterstadt"
              />
            )}

            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
            {orte.length > 0 && (
              <p className="text-gray-500 text-xs mt-1">Automatisch zur PLZ ermittelt</p>
            )}
          </div>
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
    </motion.div>
  );
}
