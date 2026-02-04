'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRechner } from './RechnerProvider';
import ProgressBar from './components/ProgressBar';
import TrustBadge from './components/TrustBadge';
import Step1ForWho from './steps/Step1ForWho';
import Step2Gender from './steps/Step2Gender';
import Step3Sport from './steps/Step3Sport';
import Step4Frequency from './steps/Step4Frequency';
import Step5BirthDate from './steps/Step5BirthDate';
import Step6Contact from './steps/Step6Contact';
import Step7Result from './steps/Step7Result';

const TOTAL_STEPS = 6; // Step 7 ist das Ergebnis, zählt nicht zum Fortschritt

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );
}

export default function RechnerStepper() {
  const { data, isLoading } = useRechner();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const showProgressAndTrust = data.step < 7;

  return (
    <>
      {showProgressAndTrust && (
        <div className="pt-4">
          <ProgressBar currentStep={data.step} totalSteps={TOTAL_STEPS} />
        </div>
      )}

      <AnimatePresence mode="wait">
        {data.step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Step1ForWho />
          </motion.div>
        )}
        {data.step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Step2Gender />
          </motion.div>
        )}
        {data.step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Step3Sport />
          </motion.div>
        )}
        {data.step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Step4Frequency />
          </motion.div>
        )}
        {data.step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Step5BirthDate />
          </motion.div>
        )}
        {data.step === 6 && (
          <motion.div
            key="step6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Step6Contact />
          </motion.div>
        )}
        {data.step === 7 && (
          <motion.div
            key="step7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Step7Result />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
