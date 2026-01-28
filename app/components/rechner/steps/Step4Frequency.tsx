'use client';

import { motion } from 'framer-motion';
import { useRechner } from '../RechnerProvider';
import { FREQUENCIES } from '../constants';
import { getSportFrequencyQuestion } from '../utils';
import { trackFrequencySelected } from '@/app/components/Datafast';

export default function Step4Frequency() {
  const { data, updateData, nextStep } = useRechner();

  const handleSelect = (frequency: string) => {
    updateData({ frequency });
    trackFrequencySelected(frequency);
    nextStep();
  };

  const title = getSportFrequencyQuestion(data.sport, data.insuranceFor, data.gender);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-8"
    >
      <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
        {FREQUENCIES.map((freq) => (
          <button
            key={freq}
            onClick={() => handleSelect(freq)}
            className="bg-background border-2 border-border hover:cursor-pointer hover:border-primary hover:shadow-lg rounded-xl p-6 transition-all duration-200 text-xl font-semibold text-foreground hover:text-primary"
          >
            {freq}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
