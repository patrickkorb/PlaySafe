'use client';

import { motion } from 'framer-motion';
import { useRechner } from '../RechnerProvider';
import { INSURANCE_FOR_OPTIONS } from '../constants';
import { InsuranceFor } from '../types';

export default function Step1ForWho() {
  const { updateData, nextStep } = useRechner();

  const handleSelect = (value: InsuranceFor) => {
    updateData({ insuranceFor: value });
    nextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12 pt-8">
        <h1 className="text-2xl font-extrabold text-foreground mb-4">
          Finde Deine Perfekte Sportversicherung!
        </h1>
        <h2 className="font-medium text-foreground">
          Erhalte deine persönliche Versicherungsempfehlung, perfekt abgestimmt auf deinen aktiven Lebensstil - völlig kostenlos und unverbindlich.
        </h2>
      </div>

      <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">
        Für wen soll der Sport-Schutz gelten?
      </h2>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-4 max-w-2xl mx-auto">
        {INSURANCE_FOR_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value as InsuranceFor)}
            className="bg-background border-2 border-border hover:cursor-pointer hover:border-primary hover:shadow-lg rounded-xl p-6 transition-all duration-200 text-xl font-semibold text-foreground hover:text-primary"
          >
            {option.name}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
