'use client';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ActionAlertProps {
  artistName?: string;
  onApprove: () => void;
  onDecline: () => void;
}

export function ActionAlert({ artistName, onApprove, onDecline }: ActionAlertProps) {
  return (
    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-xl p-6 mb-8">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-primary-900 mb-2">Action Required</h3>
          <p className="text-primary-800 mb-4">
            {artistName} wants to perform at your venue. Review the details below and respond.
          </p>
          <div className="flex space-x-3">
            <Button onClick={onApprove} className="bg-[#738a6e] hover:bg-[#5e7259] text-white">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Booking
            </Button>
            <Button
              variant="outline"
              onClick={onDecline}
              className="border-[#ebebe9] text-[#344c3d] hover:bg-[#ebebe9]"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Decline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}