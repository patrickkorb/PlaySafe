'use client';

import { useRechner } from './RechnerProvider';
import Step1ForWho from './steps/Step1ForWho';
import Step2Gender from './steps/Step2Gender';
import Step3Sport from './steps/Step3Sport';
import Step4Frequency from './steps/Step4Frequency';
import Step5BirthDate from './steps/Step5BirthDate';
import Step6Contact from './steps/Step6Contact';
import Step7Result from './steps/Step7Result';

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

  const renderStep = () => {
    switch (data.step) {
      case 1:
        return <Step1ForWho />;
      case 2:
        return <Step2Gender />;
      case 3:
        return <Step3Sport />;
      case 4:
        return <Step4Frequency />;
      case 5:
        return <Step5BirthDate />;
      case 6:
        return <Step6Contact />;
      case 7:
        return <Step7Result />;
      default:
        return <Step1ForWho />;
    }
  };

  return <>{renderStep()}</>;
}
