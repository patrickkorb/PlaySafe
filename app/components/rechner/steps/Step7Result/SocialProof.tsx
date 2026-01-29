'use client';

import Image from 'next/image';

// Ersetze diese URLs später mit echten Bildern unter /images/avatars/
const AVATARS = [
  { src: 'https://i.pravatar.cc/100?img=12', alt: 'Sportler 1' },
  { src: 'https://i.pravatar.cc/100?img=32', alt: 'Sportlerin 2' },
  { src: '/images/fusball/soccer2.webp', alt: 'Sportler 3' },
  { src: 'https://i.pravatar.cc/100?img=47', alt: 'Sportlerin 4' },
  { src: '/images/mike.jpg', alt: 'Sportler 5' },
];

export default function SocialProof() {
  return (
    <div className="flex flex-col items-center gap-3 py-6">
        <div className="text-center">
            <p className="text-xl font-bold text-foreground">
                Über 245 Sportler vertrauen uns
            </p>
        </div>
      <div className="flex items-center -space-x-3">
        {AVATARS.map((avatar, index) => (
          <div
            key={index}
            className="relative w-12 h-12 rounded-full border-3 border-background shadow-md overflow-hidden"
            style={{ zIndex: AVATARS.length - index }}
          >
            <Image
              src={avatar.src}
              alt={avatar.alt}
              fill
              className="object-cover"
            />
          </div>
        ))}
        <div
          className="relative w-12 h-12 rounded-full border-3 border-background shadow-md bg-primary flex items-center justify-center ml-1"
          style={{ zIndex: 0 }}
        >
          <span className="text-white text-xs font-bold">+200</span>
        </div>
      </div>


    </div>
  );
}
