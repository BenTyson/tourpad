import React from 'react';

interface WizardStepProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function WizardStep({
  title,
  icon,
  children,
  className = ''
}: WizardStepProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-neutral-200">
        <h2 className="text-xl font-semibold flex items-center text-neutral-900">
          {icon && <span className="mr-2 text-primary-600">{icon}</span>}
          {title}
        </h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}