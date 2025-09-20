import React from 'react';
import { ProgressBarProps } from './types';

export function ProgressBar({
  currentStep,
  totalSteps,
  className = ''
}: ProgressBarProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-neutral-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-neutral-900">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-neutral-600">
          {Math.round(progressPercentage)}% Complete
        </span>
      </div>
      <div className="w-full bg-neutral-200 rounded-full h-3">
        <div
          className="bg-primary-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}