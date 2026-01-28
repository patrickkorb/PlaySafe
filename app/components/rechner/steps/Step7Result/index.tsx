'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRechner } from '../../RechnerProvider';
import { calculateTariff, getSportByName, buildOfferUrl } from '../../utils';
import { trackOfferPageVisited } from '@/app/components/Datafast';
import Button from '@/app/components/ui/Button';
import Footer from '@/app/sections/Footer';
import FAQ from '@/app/sections/FAQ';
import TariffCard from './TariffCard';
import VideoSection from './VideoSection';
import SocialProof from './SocialProof';
import Testimonials from './Testimonials';
import GoogleReviewBadge from './GoogleReviewBadge';

export default function Step7Result() {
  const { data, resetRechner } = useRechner();

  const tariff = calculateTariff(data.frequency, data.insuranceFor);
  const sport = getSportByName(data.sport);
  const offerUrl = buildOfferUrl({
    name: data.name,
    email: data.email,
    phone: data.phone,
    birthDate: data.birthDate,
    gender: data.gender,
    tarif: tariff.title,
    insuranceFor: data.insuranceFor,
  });

  const handleCtaClick = () => {
    trackOfferPageVisited(tariff.title);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="rounded-2xl py-4 mb-2 mx-4 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4 flex flex-row items-center justify-center gap-4 mt-2">
          Dein passender Sportschutz:
        </h2>

        <TariffCard
          tariff={tariff}
          sport={sport}
          offerUrl={offerUrl}
          onCtaClick={handleCtaClick}
        />

        <VideoSection sport={data.sport} tariffTitle={tariff.title} />

        <motion.div
          className="my-4"
          animate={{
            rotate: [0, -1, 1, -1, 1, 0],
            scale: [1, 1.05, 1.05, 1.05, 1.05, 1],
          }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
        >
          <Button
            text="Jetzt Schutz erhalten"
            variant="primary"
            size="lg"
            href={offerUrl}
            onClick={handleCtaClick}
          />
        </motion.div>

        <SocialProof />
        <div className={"-mx-4"}>
          <GoogleReviewBadge/>
        </div>
        <Testimonials />
      </div>



      <motion.div
        className="mb-6 mx-2"
        animate={{
          rotate: [0, -1, 1, -1, 1, 0],
          scale: [1, 1.05, 1.05, 1.05, 1.05, 1],
        }}
        transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
      >
        <Button
          text="Jetzt Schutz erhalten"
          variant="primary"
          size="lg"
          href={offerUrl}
          onClick={handleCtaClick}
        />
      </motion.div>

      <div className="text-center mt-2 bg-background mx-2">
        <Link
          href="/"
          className="w-full inline-block bg-background hover:bg-muted text-primary font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200 shadow-md hover:shadow-lg border-2 border-primary mb-8"
        >
          Mehr Informationen erhalten →
        </Link>
      </div>

      <div className="text-center mb-8">
        <button
          onClick={resetRechner}
          className="text-muted-foreground hover:text-foreground underline text-sm transition-colors"
        >
          Neu berechnen
        </button>
      </div>

      <div className="-mx-4">
        <FAQ />
      </div>

      <Footer />
    </motion.div>
  );
}
