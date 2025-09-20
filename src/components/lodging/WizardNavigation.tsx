import React from 'react';
import { Button } from '@/components/ui/Button';
import { WizardNavigationProps } from './types';

export function WizardNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSave,
  isDataValid,
  nextLabel = 'Next',
  saveLabel = 'Save Configuration'
}: WizardNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
      >
        Previous
      </Button>

      <Button
        onClick={isLastStep ? onSave : onNext}
        disabled={!isDataValid}
      >
        {isLastStep ? saveLabel : nextLabel}
      </Button>
    </div>
  );
}