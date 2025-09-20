import React from 'react';
import { Home, Check } from 'lucide-react';
import { WizardStep } from '../WizardStep';
import { WizardStepProps } from '../types';

export function LodgingToggleStep({ data, onDataChange }: WizardStepProps) {
  const handleToggleLodging = (offer: boolean) => {
    onDataChange({ offerLodging: offer });
  };

  return (
    <WizardStep
      title="Offer Overnight Accommodation"
      icon={<Home className="w-5 h-5" />}
    >
      <p className="text-neutral-600 mb-6">
        Would you like to offer overnight accommodation to touring artists? This can help artists save money and creates deeper connections with the local music community.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
            data.offerLodging ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
          }`}
          onClick={() => handleToggleLodging(true)}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-neutral-900">Yes, I'll offer lodging</h3>
            {data.offerLodging && <Check className="w-5 h-5 text-primary-600" />}
          </div>
          <p className="text-sm text-neutral-600">
            Provide overnight accommodation for artists performing at your venue or nearby
          </p>
        </div>

        <div
          className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
            !data.offerLodging ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
          }`}
          onClick={() => handleToggleLodging(false)}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-neutral-900">No lodging</h3>
            {!data.offerLodging && <Check className="w-5 h-5 text-primary-600" />}
          </div>
          <p className="text-sm text-neutral-600">
            Focus on hosting shows only. Artists will find their own accommodation
          </p>
        </div>
      </div>
    </WizardStep>
  );
}