import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { LodgingWizardProps, LodgingData } from './types';
import { createDefaultLodgingData, validateStep } from './lodging-utils';
import { ProgressBar } from './ProgressBar';
import { WizardNavigation } from './WizardNavigation';
import { LodgingToggleStep } from './steps/LodgingToggleStep';
import { RoomConfigurationStep } from './steps/RoomConfigurationStep';
import { AmenitiesStep } from './steps/AmenitiesStep';
import { FinalDetailsStep } from './steps/FinalDetailsStep';

export function LodgingWizard({
  onSave,
  onCancel,
  initialData
}: LodgingWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [lodgingData, setLodgingData] = useState<LodgingData>({
    ...createDefaultLodgingData(),
    ...initialData
  });

  const totalSteps = 4;

  const handleDataChange = (updates: Partial<LodgingData>) => {
    setLodgingData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSave();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    console.log('Saving lodging configuration:', lodgingData);
    onSave(lodgingData);
  };

  const isCurrentStepValid = validateStep(currentStep, lodgingData);

  const renderCurrentStep = () => {
    const stepProps = {
      data: lodgingData,
      onDataChange: handleDataChange,
      onNext: handleNext,
      onPrevious: handlePrevious,
      isFirstStep: currentStep === 1,
      isLastStep: currentStep === totalSteps
    };

    switch (currentStep) {
      case 1:
        return <LodgingToggleStep {...stepProps} />;
      case 2:
        return lodgingData.offerLodging ? <RoomConfigurationStep {...stepProps} /> : null;
      case 3:
        return lodgingData.offerLodging ? <AmenitiesStep {...stepProps} /> : null;
      case 4:
        return lodgingData.offerLodging ? <FinalDetailsStep {...stepProps} /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="hover:bg-neutral-100 text-neutral-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Lodging Setup
            </h1>
            <p className="text-neutral-600">
              Configure your overnight accommodation options for touring artists
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          className="mb-8"
        />

        {/* Current Step */}
        {renderCurrentStep()}

        {/* Navigation */}
        <WizardNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSave={handleSave}
          isDataValid={isCurrentStepValid && (currentStep === 1 || lodgingData.offerLodging)}
        />
      </div>
    </div>
  );
}