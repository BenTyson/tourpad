'use client';
import { useState, ReactNode, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';

interface WizardContextType {
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  canProceed: boolean;
  setCanProceed: (canProceed: boolean) => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a Wizard component');
  }
  return context;
};

interface WizardProps {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  className?: string;
}

export const Wizard = ({ 
  children, 
  initialStep = 0, 
  onStepChange,
  className 
}: WizardProps) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [canProceed, setCanProceed] = useState(true);
  
  const childrenArray = Array.isArray(children) ? children : [children];
  const totalSteps = childrenArray.length;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
      onStepChange?.(step);
    }
  };

  const contextValue: WizardContextType = {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    canProceed,
    setCanProceed,
  };

  return (
    <WizardContext.Provider value={contextValue}>
      <div className={cn('w-full', className)}>
        {childrenArray[currentStep]}
      </div>
    </WizardContext.Provider>
  );
};

interface WizardStepProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const WizardStep = ({ 
  children, 
  title, 
  description, 
  className 
}: WizardStepProps) => {
  return (
    <div className={cn('w-full', className)}>
      {(title || description) && (
        <div className="mb-8 text-center">
          {title && (
            <h2 className="text-2xl font-bold text-evergreen mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-neutral-600 max-w-md mx-auto">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

interface ProgressIndicatorProps {
  steps: Array<{
    label: string;
    description?: string;
  }>;
  className?: string;
}

export const ProgressIndicator = ({ steps, className }: ProgressIndicatorProps) => {
  const { currentStep } = useWizard();

  return (
    <div className={cn('w-full mb-8', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all duration-300',
                    isCompleted && 'bg-secondary-500 border-secondary-500 text-white',
                    isActive && 'bg-primary-600 border-[var(--color-french-blue)] text-white shadow-lg scale-110',
                    !isActive && !isCompleted && 'bg-white border-neutral-300 text-neutral-500'
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                
                {/* Step Label */}
                <div className="mt-2 text-center">
                  <div
                    className={cn(
                      'text-xs font-medium transition-colors',
                      isActive && 'text-primary-700',
                      isCompleted && 'text-secondary-700',
                      !isActive && !isCompleted && 'text-neutral-500'
                    )}
                  >
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-xs text-neutral-400 mt-1 hidden sm:block">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-4 transition-colors duration-300',
                    isCompleted ? 'bg-secondary-300' : 'bg-neutral-200'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface WizardNavigationProps {
  onNext?: () => void | Promise<void>;
  onPrev?: () => void;
  nextLabel?: string;
  prevLabel?: string;
  isLoading?: boolean;
  className?: string;
}

export const WizardNavigation = ({
  onNext,
  onPrev,
  nextLabel,
  prevLabel,
  isLoading = false,
  className
}: WizardNavigationProps) => {
  const { 
    nextStep, 
    prevStep, 
    isFirstStep, 
    isLastStep, 
    canProceed 
  } = useWizard();

  const handleNext = async () => {
    if (onNext) {
      const result = await onNext();
      // If onNext returns true or undefined, proceed to next step
      if (result !== false) {
        nextStep();
      }
    } else {
      nextStep();
    }
  };

  const handlePrev = () => {
    if (onPrev) {
      onPrev();
    } else {
      prevStep();
    }
  };

  return (
    <div className={cn('flex items-center justify-between pt-6', className)}>
      <Button
        variant="ghost"
        onClick={handlePrev}
        disabled={isFirstStep}
        className="flex items-center gap-2"
      >
        <ChevronLeftIcon className="w-4 h-4" />
        {prevLabel || 'Previous'}
      </Button>

      <Button
        onClick={handleNext}
        disabled={!canProceed || isLoading}
        loading={isLoading}
        className="flex items-center gap-2"
      >
        {nextLabel || (isLastStep ? 'Submit Application' : 'Continue')}
        {!isLastStep && <ChevronRightIcon className="w-4 h-4" />}
      </Button>
    </div>
  );
};