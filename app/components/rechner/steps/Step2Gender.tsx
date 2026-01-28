'use client';

import { motion } from 'framer-motion';
import { Mars, Venus } from 'lucide-react';
import { useRechner } from '../RechnerProvider';
import { Gender } from '../types';
import ChoiceCard from '@/app/fusball/components/ChoiceCard';

const GENDER_OPTIONS = [
  { name: 'Männlich', icon: Mars },
  { name: 'Weiblich', icon: Venus },
];

export default function Step2Gender() {
  const { data, updateData, nextStep } = useRechner();

  const handleSelect = (gender: Gender) => {
    updateData({ gender });
    nextStep();
  };

  const getTitle = () => {
    switch(data.insuranceFor) {
      case "self": return "Welches Geschlecht hast du?";
      case "spouse": return "Welches Geschlecht hat dein Partner?";
      case "child": return "Welches Geschlecht hat dein Kind?";
      case "partner": return "Welches Geschlecht hat deine Beziehung zu dir?";
      default: return "Welches Geschlecht hast du?";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-8"
    >
      <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">
        {getTitle()}
      </h2>

      <div className="flex flex-row justify-center gap-4 max-w-2xl mx-auto">
        {GENDER_OPTIONS.map((option) => (
          <ChoiceCard
            key={option.name}
            title={option.name}
            icon={option.icon}
            onClick={() => handleSelect(option.name as Gender)}
          />
        ))}
      </div>
      <p className={"text-center mt-4 font-semibold text-gray-900"}>Wir benötigen das Geschlecht zur korrekten Risikoberechnung</p>
    </motion.div>
  );
}
