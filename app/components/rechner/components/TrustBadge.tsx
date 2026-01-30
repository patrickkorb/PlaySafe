'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';

export default function TrustBadge() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-6 px-4">
      <div className="flex items-center gap-2">
        <Image
          src="/images/partner2.svg"
          alt="Signal Iduna Partner"
          width={80}
          height={20}
          className="opacity-70"
        />
        <span className="text-xs">Offizieller Partner</span>
      </div>
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="font-medium text-foreground">5/5</span>
        <span className="text-xs">bei Google</span>
      </div>
    </div>
  );
}
