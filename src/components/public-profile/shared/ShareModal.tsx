'use client';
import { useState } from 'react';
import { Copy, Mail, Twitter, Facebook, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileName: string;
  profileUrl: string;
  profileType: 'artist' | 'host';
}

export default function ShareModal({ isOpen, onClose, profileName, profileUrl, profileType }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `Check out ${profileName} on TourPad!`;
  const shareData = [
    {
      name: 'Copy Link',
      icon: copied ? Check : Copy,
      color: copied ? 'text-green-600' : 'text-neutral-600',
      action: () => {
        navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'text-neutral-600',
      action: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(profileUrl)}`;
      }
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'text-neutral-600',
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(profileUrl)}`, '_blank');
      }
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'text-neutral-600',
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`, '_blank');
      }
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 z-50 w-full max-w-md">
        <h3 className="text-2xl font-bold text-neutral-900 mb-6">
          Share this {profileType === 'artist' ? 'artist' : 'venue'}
        </h3>
        
        <div className="space-y-3">
          {shareData.map((method) => (
            <button
              key={method.name}
              onClick={method.action}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors"
            >
              <method.icon className={`w-5 h-5 ${method.color}`} />
              <span className="text-neutral-900 font-medium">{method.name}</span>
            </button>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-neutral-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </div>
    </>
  );
}