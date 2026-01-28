'use client';

import { motion } from 'framer-motion';
import { getVideoPath } from '../../utils';

interface VideoSectionProps {
  sport: string;
  tariffTitle: string;
}

export default function VideoSection({ sport, tariffTitle }: VideoSectionProps) {
  const videoPath = getVideoPath(sport, tariffTitle);

  return (
    <motion.div
      className="mt-8 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <h3 className="text-2xl font-bold text-foreground text-center mb-6">
        Erfahre mehr über deinen {tariffTitle}-Tarif für {sport}
      </h3>

      <div className="flex justify-center">
        <div
          className="relative w-full md:max-w-md rounded-lg overflow-hidden"
          style={{ aspectRatio: '9/16' }}
        >
          <video
            className="w-full h-full object-cover"
            controls
            autoPlay
            muted
            playsInline
            preload="metadata"
            poster="/images/video-placeholder.jpg"
          >
            <source src={videoPath} type="video/mp4" />
            Dein Browser unterstützt keine Video-Wiedergabe.
          </video>
        </div>
      </div>
    </motion.div>
  );
}
