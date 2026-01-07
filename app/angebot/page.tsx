'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AngebotFormData } from '@/types/angebot';
import Step1Personal from './components/Step1Personal';
import Step2Contact from './components/Step2Contact';
import Step3Bank from './components/Step3Bank';
import Step4Confirmation from './components/Step4Confirmation';
import { trackLead } from '@/app/components/MetaPixel';
import { trackOfferFormSubmitted } from '@/app/components/Datafast';

const initialFormData: AngebotFormData = {
  salutation: '',
  name: '',
  birthDate: '',
  job: '',
  email: '',
  phone: '',
  street: '',
  houseNumber: '',
  postalCode: '',
  city: '',
  iban: '',
  accountHolder: '',
  privacyConsent: false,
  contactConsent: false,
};

function AngebotContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<AngebotFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form data from URL parameters (from Rechner)
  useEffect(() => {
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    const birthDate = searchParams.get('birthDate');
    const gender = searchParams.get('gender');
    const tarif = searchParams.get('tarif');

    // Map gender to salutation
    let salutation = '';
    if (gender === 'Männlich') {
      salutation = 'Herr';
    } else if (gender === 'Weiblich') {
      salutation = 'Frau';
    }

    if (name || email || phone || birthDate || salutation) {
      setFormData(prev => ({
        ...prev,
        salutation: salutation || prev.salutation,
        name: name || '',
        email: email || '',
        phone: phone || '',
        birthDate: birthDate || '',
      }));
    }
  }, [searchParams]);

  const updateFormData = (data: Partial<AngebotFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {

      const response = await fetch('/api/angebot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          salutation: formData.salutation,
          name: formData.name,
          birthDate: formData.birthDate,
          email: formData.email,
          phone: formData.phone,
          job: formData.job,
          street: formData.street,
          houseNumber: formData.houseNumber,
          postalCode: formData.postalCode,
          city: formData.city,
          iban: formData.iban,
          accountHolder: formData.accountHolder,
          privacyConsent: formData.privacyConsent,
          contactConsent: formData.contactConsent,
        }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Senden');
      }

      // Split name for tracking
      const nameParts = formData.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Track Datafast goal: offer_form_submitted
      const tarif = searchParams.get('tarif');
      trackOfferFormSubmitted(formData.name, formData.email, tarif || '');

      // Track Lead Event
      await trackLead(
        {
          email: formData.email,
          phone: formData.phone,
          firstName: firstName,
          lastName: lastName,
        },
        50 // Höherer Wert für vollständige Angebotsanfrage
      );

      // Redirect to success page
      router.push('/angebot/erfolg');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Es ist ein Fehler aufgetreten. Bitte versuche es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dein persönliches Angebot
          </h1>
          <p className="text-gray-600">
            Nur noch wenige Schritte zu deiner maßgeschneiderten Sportversicherung
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Schritt {step} von {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-primary h-full rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <Step1Personal
              key="step1"
              formData={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {step === 2 && (
            <Step2Contact
              key="step2"
              formData={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {step === 3 && (
            <Step3Bank
              key="step3"
              formData={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {step === 4 && (
            <Step4Confirmation
              key="step4"
              formData={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </AnimatePresence>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>SSL-verschlüsselt</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>DSGVO-konform</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>100% kostenlos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Unverbindlich</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Angebot() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Lädt...</p>
        </div>
      </div>
    }>
      <AngebotContent />
    </Suspense>
  );
}
