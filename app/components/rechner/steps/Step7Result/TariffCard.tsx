'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import { TariffInfo, SportOption } from '../../types';
import Button from '@/app/components/ui/Button';

interface TariffCardProps {
  tariff: TariffInfo;
  sport: SportOption | undefined;
  offerUrl: string;
  onCtaClick: () => void;
}

export default function TariffCard({ tariff, sport, offerUrl, onCtaClick }: TariffCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showSicherheitsTooltip, setShowSicherheitsTooltip] = useState(false);

  return (
    <motion.div
      className="flex flex-col mx-auto mt-4"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex-1">
        <div className="relative bg-background rounded-2xl shadow-xl ring-3 ring-success-light p-8 transition-all duration-300 hover:shadow-2xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {tariff.title}
            </h3>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl md:text-5xl font-bold text-foreground">
                {tariff.price}
              </span>
              <span className="text-muted-foreground text-lg">/Monat</span>
            </div>
            <motion.div
              className="bg-success-light text-success px-2 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 mt-2"
              animate={{
                rotate: [0, -1, 1, -1, 1, 0],
                scale: [1, 1.02, 1.02, 1.02, 1.02, 1],
              }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
              30€ Sicherheitsbudget geschenkt
            </motion.div>
          </div>

          <div className="mb-8">
            <ul className="space-y-4">
              {tariff.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-success-light rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground text-left leading-relaxed">
                        {feature}
                      </span>
                      {index === 0 && feature.includes('sofort aufs Konto') && (
                        <div className="relative inline-flex">
                          <Info
                            className="w-4 h-4 text-foreground cursor-pointer mb-3 active:scale-95 transition-transform"
                            onClick={() => setShowTooltip(!showTooltip)}
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                          />
                          <div
                            className={`fixed left-4 right-4 sm:absolute sm:left-auto sm:right-auto sm:bottom-full sm:left-1/2 sm:-translate-x-1/2 bottom-auto top-1/2 -translate-y-1/2 sm:translate-y-0 sm:mb-2 max-w-xs bg-foreground text-background text-xs rounded-lg p-3 transition-all duration-200 z-50 shadow-xl ${
                              showTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'
                            }`}
                          >
                            <div className="text-left leading-relaxed">
                              Bei einer vollständigen Zusammenhangstrennung bei Brüchen oder vollständigen Zerreißung von Muskel, Sehne, Band oder Kapsel.
                            </div>
                          </div>
                        </div>
                      )}
                      {feature.includes('Sicherheitsbudget') && (
                        <div className="relative inline-flex">
                          <Info
                            className="w-4 h-4 text-foreground cursor-pointer mb-3 active:scale-95 transition-transform"
                            onClick={() => setShowSicherheitsTooltip(!showSicherheitsTooltip)}
                            onMouseEnter={() => setShowSicherheitsTooltip(true)}
                            onMouseLeave={() => setShowSicherheitsTooltip(false)}
                          />
                          <div
                            className={`fixed left-4 right-4 sm:absolute sm:left-auto sm:right-auto sm:bottom-full sm:left-1/2 sm:-translate-x-1/2 bottom-auto top-1/2 -translate-y-1/2 sm:translate-y-0 sm:mb-2 max-w-xs bg-foreground text-background text-xs rounded-lg p-3 transition-all duration-200 z-50 shadow-xl ${
                              showSicherheitsTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'
                            }`}
                          >
                            <div className="text-left leading-relaxed">
                              Dieses Budget ist jährlich frei verfügbar für Präventionsmaßnahmen wie z.B. Schienbeinschoner, Protektoren, Helme, Skikurse oder andere Schutzausrüstung.
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {index === 0 && sport?.catch && (
                      <span className="text-muted-foreground text-sm mt-1 text-left">
                        {sport.catch}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full">
            <Button
              variant="v3"
              text="Jetzt Schutz erhalten"
              href={offerUrl}
              onClick={onCtaClick}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
