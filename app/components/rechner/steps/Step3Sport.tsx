'use client';

import { motion } from 'framer-motion';
import { useRechner } from '../RechnerProvider';
import { SPORTS } from '../constants';
import { getInsuredPersonPronoun } from '../utils';
import { trackSportSelected } from '@/app/components/Datafast';
import ChoiceCard from '@/app/fusball/components/ChoiceCard';
import {InfoIcon} from "lucide-react";

export default function Step3Sport() {
  const { data, updateData, nextStep } = useRechner();

  const handleSelect = (sportName: string) => {
    updateData({ sport: sportName });
    trackSportSelected(sportName);
    nextStep();
  };

  const getTitle = () => {
    if (data.insuranceFor === 'self') {
      return 'Welchen Sport übst du aus?';
    }
    const pronoun = getInsuredPersonPronoun(data.insuranceFor, data.gender);
    return `Welchen Sport übt ${pronoun} aus?`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-8"
    >
      <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
        {getTitle()}
      </h2>

      <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
        {SPORTS.map((sport, index) => (
          <ChoiceCard
            key={sport.name}
            title={sport.name}
            image={sport.image}
            onClick={() => handleSelect(sport.name)}
            priority={index < 3}
          />
        ))}
      </div>

      <div className="mt-8 max-w-2xl mx-auto bg-muted border border-border rounded-xl p-4 flex flex-col items-center">
        <p className="text-sm text-muted-foreground text-center">
          Die Vereins-Versicherung deckt nur sehr wenig ab. Bei Verletzungen ohne bleibende Schäden (z.B. Kreuzbandrisse, Muskelrisse, etc.) ist man oft nicht richtig abgesichert.
        </p>
      </div>
    </motion.div>
  );
}
