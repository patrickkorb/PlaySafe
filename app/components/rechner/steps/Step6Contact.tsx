'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRechner } from '../RechnerProvider';
import { calculateTariff } from '../utils';
import { trackLead } from '@/app/components/MetaPixel';
import { trackContactDataSubmitted, trackCalculatorComplete } from '@/app/components/Datafast';

function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)\/]/g, '');
  // Deutsche Nummer: +49, 0049 oder 0 am Anfang, dann mindestens 9 weitere Ziffern
  const germanPattern = /^(\+49|0049|0)[1-9]\d{8,14}$/;
  return germanPattern.test(cleaned);
}

export default function Step6Contact() {
  const { data, updateData, saveData } = useRechner();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');
    setSubmitError('');

    if (!isValidPhoneNumber(data.phone)) {
      setPhoneError('Bitte gib eine gültige Telefonnummer ein');
      return;
    }

    setIsSubmitting(true);

    try {
      const tariff = calculateTariff(data.frequency);

      const response = await fetch('/api/rechner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          birthDate: data.birthDate,
          gender: data.gender,
          tarif: tariff.title,
          insuranceFor: data.insuranceFor,
        }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Senden');
      }

      trackContactDataSubmitted(data.name, data.email, data.phone);

      const leadValue = parseInt(tariff.price) || 10;
      await trackLead(
        {
          email: data.email,
          phone: data.phone,
          firstName: data.name.split(' ')[0],
          lastName: data.name.split(' ').slice(1).join(' '),
        },
        leadValue
      );

      trackCalculatorComplete(data.sport, data.frequency, tariff.title);

      saveData({ completedAt: new Date().toISOString(), step: 7 });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Fehler beim Senden. Bitte versuche es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubtitle = () => {
    if (data.insuranceFor === 'self') {
      return 'Um dir passende Versicherungs-Lösungen zu zeigen, lass uns wissen, wie wir dir deine Empfehlung zusenden können:';
    }
    return 'Gib jetzt deine Kontaktdaten als Versicherungsnehmer/in ein, um die Empfehlung zu erhalten:';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-8"
    >
      <h2 className="text-xl font-medium text-foreground mb-2 text-center">
        Super, nur noch 1 Schritt bis zu Deiner persönlichen Sportversicherungsberatung
      </h2>

      <h3 className="text-xl font-bold text-center mb-8 mt-4 text-foreground">
        {getSubtitle()}
      </h3>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="text-2xl">👋</span>
            </div>
            <input
              type="text"
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
              required
              className="w-full pl-16 pr-4 py-4 border-2 border-border rounded-lg focus:border-primary focus:outline-none text-lg transition-colors bg-background text-foreground"
              placeholder="Vor- & Nachname"
            />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="text-2xl">📧</span>
            </div>
            <input
              type="email"
              value={data.email}
              onChange={(e) => updateData({ email: e.target.value })}
              required
              className="w-full pl-16 pr-4 py-4 border-2 border-border rounded-lg focus:border-primary focus:outline-none text-lg transition-colors bg-background text-foreground"
              placeholder="Deine E-Mail"
            />
          </div>

          <div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="text-2xl">📱</span>
              </div>
              <input
                type="tel"
                value={data.phone}
                onChange={(e) => {
                  updateData({ phone: e.target.value });
                  if (phoneError) setPhoneError('');
                }}
                required
                className={`w-full pl-16 pr-4 py-4 border-2 rounded-lg focus:outline-none text-lg transition-colors bg-background text-foreground ${
                  phoneError ? 'border-error focus:border-error' : 'border-border focus:border-primary'
                }`}
                placeholder="Deine Handynummer"
              />
            </div>
            {phoneError && (
              <p className="text-error text-sm mt-1">{phoneError}</p>
            )}
          </div>

          {submitError && (
            <div className="bg-error/10 border-2 border-error rounded-lg p-4 text-center">
              <p className="text-error font-semibold">{submitError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted-foreground disabled:cursor-not-allowed text-white font-bold py-5 px-6 rounded-lg text-lg transition-colors duration-200 hover:cursor-pointer"
          >
            {isSubmitting ? 'Wird berechnet...' : 'Meine Empfehlung erhalten'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
