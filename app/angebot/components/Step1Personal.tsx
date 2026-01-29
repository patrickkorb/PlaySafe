'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FormStepProps, FormErrors } from '@/types/angebot';
import { validateBirthDate } from '@/lib/validation';
import { trackOfferStep1Completed } from '@/app/components/Datafast';

// Berufsstand-Optionen
const JOB_OPTIONS = [
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
  'Selbsständiger',
];

// Berufe, die ein Tätigkeitsfeld erfordern
const JOBS_REQUIRING_FIELD = [
  'Arbeitnehmer',
  'Auszubildender',
  'Beamter auf Widerruf/Probe',
  'Beamter',
  'Selbsständiger',
];

export default function Step1Personal({ formData, onUpdate, onNext }: FormStepProps) {
  const [errors, setErrors] = useState<FormErrors>({});

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>, isPolicyHolder = false) => {
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

    if (isPolicyHolder) {
      onUpdate({ policyHolderBirthDate: value });
      if (errors.policyHolderBirthDate) {
        setErrors({ ...errors, policyHolderBirthDate: '' });
      }
    } else {
      onUpdate({ birthDate: value });
      if (errors.birthDate) {
        setErrors({ ...errors, birthDate: '' });
      }
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    onUpdate({ insuranceStartDate: value });
    if (errors.insuranceStartDate) {
      setErrors({ ...errors, insuranceStartDate: '' });
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Validate insurance type selection
    if (!formData.insuranceFor) {
      newErrors.insuranceFor = 'Bitte wähle, für wen die Versicherung ist';
    }

    // Validate policy holder data if insuring someone else
    if (formData.insuranceFor === 'other') {
      if (!formData.relationshipToInsured) {
        newErrors.relationshipToInsured = 'Bitte wähle die Beziehung zum Versicherungsnehmer';
      }

      if (!formData.policyHolderSalutation) {
        newErrors.policyHolderSalutation = 'Bitte wähle eine Anrede';
      }

      if (!formData.policyHolderName.trim()) {
        newErrors.policyHolderName = 'Bitte gib den Namen ein';
      }

      const policyHolderBirthDateValidation = validateBirthDate(formData.policyHolderBirthDate);
      if (!policyHolderBirthDateValidation.valid) {
        newErrors.policyHolderBirthDate = policyHolderBirthDateValidation.error || 'Ungültiges Geburtsdatum';
      }

      if (!formData.policyHolderJob) {
        newErrors.policyHolderJob = 'Bitte wähle den Berufsstand';
      }

      if (JOBS_REQUIRING_FIELD.includes(formData.policyHolderJob) && !formData.policyHolderJobField.trim()) {
        newErrors.policyHolderJobField = 'Bitte gib die Tätigkeit ein';
      }
    }

    // Validate insured person data
    if (!formData.salutation) {
      newErrors.salutation = 'Bitte wähle eine Anrede';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Bitte gib den Namen ein';
    }

    // Bei "self" muss die Person 18+ sein (ist gleichzeitig Versicherungsnehmer)
    // Bei "other" darf die versicherte Person auch jünger sein (z.B. Kind)
    const requireMinAge18ForInsured = formData.insuranceFor === 'self';
    const birthDateValidation = validateBirthDate(formData.birthDate, requireMinAge18ForInsured);
    if (!birthDateValidation.valid) {
      newErrors.birthDate = birthDateValidation.error || 'Ungültiges Geburtsdatum';
    }

    if (!formData.job) {
      newErrors.job = 'Bitte wähle den Berufsstand';
    }

    if (JOBS_REQUIRING_FIELD.includes(formData.job) && !formData.jobField.trim()) {
      newErrors.jobField = 'Bitte gib die Tätigkeit ein';
    }

    // Validate insurance start
    if (!formData.insuranceStartType) {
      newErrors.insuranceStartType = 'Bitte wähle den Versicherungsbeginn';
    }

    if (formData.insuranceStartType === 'date') {
      const startDateValidation = validateBirthDate(formData.insuranceStartDate);
      if (!startDateValidation.valid) {
        newErrors.insuranceStartDate = 'Bitte gib ein gültiges Datum ein';
      }
    }

    // Validate tarif
    if (!formData.tarif) {
      newErrors.tarif = 'Bitte wähle einen Tarif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      // Track step completion
      trackOfferStep1Completed(formData.insuranceFor, formData.tarif);
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
      <div className="space-y-6">
        {/* Insurance Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Wer muss beim Sport abgesichert werden? <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                onUpdate({ insuranceFor: 'self' });
                if (errors.insuranceFor) setErrors({ ...errors, insuranceFor: '' });
              }}
              className={`py-3 px-4 rounded-lg border-2 font-medium transition-all duration-200 ${
                formData.insuranceFor === 'self'
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-primary/50'
              }`}
            >
              Ich
            </button>
            <button
              type="button"
              onClick={() => {
                onUpdate({ insuranceFor: 'other' });
                if (errors.insuranceFor) setErrors({ ...errors, insuranceFor: '' });
              }}
              className={`py-2 px-4 rounded-lg border-2 font-medium transition-all duration-200 ${
                formData.insuranceFor === 'other'
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-primary/50'
              }`}
            >
              Jemand anderes
            </button>
          </div>
          {errors.insuranceFor && (
            <p className="text-red-500 text-sm mt-2">{errors.insuranceFor}</p>
          )}
        </div>

        {/* Relationship Selection - Only shown when insuring someone else */}
        {formData.insuranceFor === 'other' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Welche Beziehung hat die Person zu dir? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Verheiratet', 'Lebensgemeinschaft', 'Kind', 'Sonstige'].map((rel) => (
                <button
                  key={rel}
                  type="button"
                  onClick={() => {
                    onUpdate({ relationshipToInsured: rel });
                    if (errors.relationshipToInsured) setErrors({ ...errors, relationshipToInsured: '' });
                  }}
                  className={`py-3 px-4 rounded-lg border-2 font-medium transition-all duration-200 ${
                    formData.relationshipToInsured === rel
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-primary/50'
                  }`}
                >
                  {rel}
                </button>
              ))}
            </div>
            {errors.relationshipToInsured && (
              <p className="text-red-500 text-sm mt-2">{errors.relationshipToInsured}</p>
            )}
          </div>
        )}

        {/* Policy Holder Section - Only shown when insuring someone else */}
        {formData.insuranceFor === 'other' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4 border-b-2 border-gray-300 pb-2">Versicherungsnehmer (Person, die die Versicherung abschließt)</h3>

            {/* Policy Holder Salutation */}
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
                      onUpdate({ policyHolderSalutation: sal });
                      if (errors.policyHolderSalutation) setErrors({ ...errors, policyHolderSalutation: '' });
                    }}
                    className={`py-3 px-4 rounded-lg border-2 font-medium transition-all duration-200 ${
                      formData.policyHolderSalutation === sal
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-primary/50'
                    }`}
                  >
                    {sal}
                  </button>
                ))}
              </div>
              {errors.policyHolderSalutation && (
                <p className="text-red-500 text-sm mt-2">{errors.policyHolderSalutation}</p>
              )}
            </div>

            {/* Policy Holder Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vor- und Nachname <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.policyHolderName}
                onChange={(e) => {
                  onUpdate({ policyHolderName: e.target.value });
                  if (errors.policyHolderName) setErrors({ ...errors, policyHolderName: '' });
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                  errors.policyHolderName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Max Mustermann"
              />
              {errors.policyHolderName && (
                <p className="text-red-500 text-sm mt-1">{errors.policyHolderName}</p>
              )}
            </div>

            {/* Policy Holder Birth Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Geburtsdatum <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.policyHolderBirthDate}
                onChange={(e) => handleBirthDateChange(e, true)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                  errors.policyHolderBirthDate ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="TT.MM.JJJJ"
                inputMode="numeric"
              />
              {errors.policyHolderBirthDate && (
                <p className="text-red-500 text-sm mt-1">{errors.policyHolderBirthDate}</p>
              )}
            </div>

            {/* Policy Holder Job */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Berufsstand <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.policyHolderJob}
                onChange={(e) => {
                  onUpdate({ policyHolderJob: e.target.value });
                  if (errors.policyHolderJob) setErrors({ ...errors, policyHolderJob: '' });
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                  errors.policyHolderJob ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Bitte wählen</option>
                {JOB_OPTIONS.map((job) => (
                  <option key={job} value={job}>{job}</option>
                ))}
              </select>
              {errors.policyHolderJob && (
                <p className="text-red-500 text-sm mt-1">{errors.policyHolderJob}</p>
              )}
            </div>

            {/* Policy Holder Job Field - Only shown for certain jobs */}
            {JOBS_REQUIRING_FIELD.includes(formData.policyHolderJob) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tätigkeit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.policyHolderJobField}
                  onChange={(e) => {
                    onUpdate({ policyHolderJobField: e.target.value });
                    if (errors.policyHolderJobField) setErrors({ ...errors, policyHolderJobField: '' });
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                    errors.policyHolderJobField ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="z.B. Softwareentwickler, Lehrer, etc."
                />
                {errors.policyHolderJobField && (
                  <p className="text-red-500 text-sm mt-1">{errors.policyHolderJobField}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Insured Person Section */}
        {formData.insuranceFor && (
          <div className="space-y-4">
            {formData.insuranceFor === 'other' && (
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4 border-b-2 border-gray-300 pb-2">Versicherte Person</h3>
            )}

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
                onChange={(e) => handleBirthDateChange(e, false)}
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

            {/* Job */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Berufsstand <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.job}
                onChange={(e) => {
                  onUpdate({ job: e.target.value });
                  if (errors.job) setErrors({ ...errors, job: '' });
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                  errors.job ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Bitte wählen</option>
                {JOB_OPTIONS.map((job) => (
                  <option key={job} value={job}>{job}</option>
                ))}
              </select>
              {errors.job && (
                <p className="text-red-500 text-sm mt-1">{errors.job}</p>
              )}
            </div>

            {/* Job Field - Only shown for certain jobs */}
            {JOBS_REQUIRING_FIELD.includes(formData.job) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tätigkeit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.jobField}
                  onChange={(e) => {
                    onUpdate({ jobField: e.target.value });
                    if (errors.jobField) setErrors({ ...errors, jobField: '' });
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                    errors.jobField ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="z.B. Softwareentwickler, Lehrer, etc."
                />
                {errors.jobField && (
                  <p className="text-red-500 text-sm mt-1">{errors.jobField}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Insurance Start - Shown after selecting insurance type */}
        {formData.insuranceFor && (
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b-2 border-gray-300 pb-2">Versicherungsdetails</h3>

            {/* Start Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Wann soll die Versicherung beginnen? <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col md:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onUpdate({ insuranceStartType: 'immediate', insuranceStartDate: '' });
                    if (errors.insuranceStartType) setErrors({ ...errors, insuranceStartType: '' });
                  }}
                  className={`py-4 px-4 rounded-lg border-2 font-medium transition-all duration-200 flex-1 ${
                    formData.insuranceStartType === 'immediate'
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-primary/50'
                  }`}
                >
                  Sofort
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdate({ insuranceStartType: 'date' });
                    if (errors.insuranceStartType) setErrors({ ...errors, insuranceStartType: '' });
                  }}
                  className={`py-4 px-4 rounded-lg border-2 font-medium transition-all duration-200 flex-1 ${
                    formData.insuranceStartType === 'date'
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-primary/50'
                  }`}
                >
                  Zu einem bestimmten Datum
                </button>
              </div>
              {errors.insuranceStartType && (
                <p className="text-red-500 text-sm mt-2">{errors.insuranceStartType}</p>
              )}
            </div>

            {/* Start Date - Only shown when date is selected */}
            {formData.insuranceStartType === 'date' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gewünschtes Startdatum <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.insuranceStartDate}
                  onChange={handleStartDateChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                    errors.insuranceStartDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="TT.MM.JJJJ"
                  inputMode="numeric"
                />
                {errors.insuranceStartDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.insuranceStartDate}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Der Versicherungsschutz beginnt zum gewählten Datum
                </p>
              </div>
            )}

            {/* Tarif Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tarif <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.tarif}
                onChange={(e) => {
                  onUpdate({ tarif: e.target.value });
                  if (errors.tarif) setErrors({ ...errors, tarif: '' });
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                  errors.tarif ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Bitte wählen</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
              {errors.tarif && (
                <p className="text-red-500 text-sm mt-1">{errors.tarif}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 mt-2"
      >
        Weiter
      </button>

      {/* Trust Indicator */}
      <div className="bg-primary/10 border-2 border-primary p-4 rounded-lg mb-6">
        <p className="text-sm text-gray-700">
          🔒 Deine Daten sind bei uns sicher und werden verschlüsselt übertragen
        </p>
      </div>
    </motion.div>
  );
}
