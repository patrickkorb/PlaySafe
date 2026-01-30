'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRechner } from '../RechnerProvider';
import { getInsuredPersonLabel, formatBirthDateInput, validateBirthDate } from '../utils';
import { trackEnterBirthDate } from '@/app/components/Datafast';

export default function Step5BirthDate() {
  const { data, updateData, nextStep } = useRechner();
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBirthDateInput(e.target.value);
    updateData({ birthDate: formatted });
    setError('');
  };

  const handleSubmit = () => {
    const validationError = validateBirthDate(data.birthDate, data.insuranceFor);

    if (validationError) {
      setError(validationError);
      return;
    }

    trackEnterBirthDate(data.birthDate);
    nextStep();
  };

  const getTitle = () => {
    if (data.insuranceFor === 'self') {
      return 'Wann ist dein Geburtstag?';
    }
    const label = getInsuredPersonLabel(data.insuranceFor, data.gender);
    return `Wann ist der Geburtstag ${label}?`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center px-4"
    >
      <h1 className="text-3xl font-bold mb-8 text-foreground">Fast geschafft!</h1>

      <h2 className="text-2xl font-bold text-foreground mb-6">
        {getTitle()}
      </h2>

      <div className="flex flex-col items-center gap-4">
        <input
          type="text"
          value={data.birthDate}
          onChange={handleChange}
          className="w-full max-w-md mx-auto px-6 py-4 text-xl text-center border-2 border-border rounded-lg focus:border-primary focus:outline-none transition-colors bg-background text-foreground"
          placeholder="TT.MM.JJJJ"
          inputMode="numeric"
        />

        {error && (
          <div className="bg-error/10 border-2 border-error rounded-lg p-4 w-full max-w-md mx-auto">
            <p className="text-error font-semibold text-center">{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!data.birthDate}
          className="bg-primary hover:bg-primary/90 hover:cursor-pointer disabled:bg-muted-foreground disabled:cursor-not-allowed text-white font-bold py-4 px-16 rounded-lg text-xl transition-colors duration-200 w-full max-w-md"
        >
          Weiter
        </button>
      </div>
    </motion.div>
  );
}
