'use client';

import { Toaster } from 'sonner';
import { RechnerProvider, RechnerStepper } from '@/app/components/rechner';

export default function RechnerPage() {
  return (
    <RechnerProvider>
      <div className="max-h-screen pb-12 mx-2">
        <div className="max-w-4xl mx-auto">
          <RechnerStepper />
        </div>
        <Toaster position="bottom-center" />
      </div>
    </RechnerProvider>
  );
}
