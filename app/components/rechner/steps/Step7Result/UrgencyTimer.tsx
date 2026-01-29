'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Gift } from 'lucide-react';
import Button from "@/app/components/ui/Button";

interface UrgencyTimerProps {
  initialMinutes?: number;
  discountPercent?: number;
  offerUrl?: string;
}

export default function UrgencyTimer({
    offerUrl = "/angebot",
  initialMinutes = 5,
  discountPercent = 10
}: UrgencyTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (isExpired) {
    return null;
  }

  return (
    <motion.div
      className="mt-4 mx-auto max-w-md"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
      >
        <div className="flex items-center justify-center gap-2 mb-2 mt-8">
          <Gift className="w-5 h-5 text-primary" />
          <span className="text-base font-semibold text-foreground">
            Exklusives Angebot
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 mb-3">
          <Clock className="w-5 h-5 text-secondary" />
          <div className="flex items-center gap-1">
            <motion.span
              key={minutes}
              initial={{ scale: 1.2, color: '#ef4444' }}
              animate={{ scale: 1, color: '#0a0a0a' }}
              className="text-3xl font-bold tabular-nums"
            >
              {String(minutes).padStart(2, '0')}
            </motion.span>
            <span className="text-3xl font-bold">:</span>
            <motion.span
              key={seconds}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold tabular-nums"
            >
              {String(seconds).padStart(2, '0')}
            </motion.span>
          </div>
        </div>

        <p className="text-center text-sm text-foreground font-semibold my-4">
          Sei schnell und sichere dir jetzt{' '}
          <span className="font-bold text-primary text-base">{discountPercent}% Rabatt</span>{' '}
          auf deinen Tarif!
        </p>

        <motion.div
            className="my-4"
            animate={{
              rotate: [0, -1, 1, -1, 1, 0],
              scale: [1, 1.05, 1.05, 1.05, 1.05, 1],
            }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
        >
          <Button
              text="Jetzt Rabatt sichern"
              variant="primary"
              size="lg"
              href={offerUrl}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
