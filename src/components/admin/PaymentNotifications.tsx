'use client';

import { useEffect } from 'react';
import { useEventStream } from '@/hooks/useEventStream';
import { useToast } from '@/contexts/ToastContext';

export function PaymentNotifications() {
  const { isConnected, lastEvent } = useEventStream();
  const { showToast } = useToast();

  useEffect(() => {
    if (!lastEvent || lastEvent.type === 'connected' || lastEvent.type === 'heartbeat') {
      return;
    }

    // Format currency
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount / 100);
    };

    switch (lastEvent.type) {
      case 'payment_success':
        showToast({
          type: 'success',
          title: 'Payment Received',
          message: `${formatCurrency(lastEvent.data.amount)} - ${lastEvent.data.description}`,
          duration: 7000,
        });
        break;

      case 'payment_failed':
        showToast({
          type: 'error',
          title: 'Payment Failed',
          message: `${formatCurrency(lastEvent.data.amount)} - ${lastEvent.data.description}`,
          duration: 10000,
        });
        break;

      case 'subscription_updated':
        showToast({
          type: 'info',
          title: 'Subscription Updated',
          message: lastEvent.data.message,
          duration: 7000,
        });
        break;

      case 'subscription_canceled':
        showToast({
          type: 'error',
          title: 'Subscription Canceled',
          message: 'A user has canceled their subscription',
          duration: 10000,
        });
        break;
    }
  }, [lastEvent, showToast]);

  // Connection status indicator (optional)
  if (!isConnected) {
    return null; // Or show a connection status indicator
  }

  return null; // This component doesn't render anything visible
}