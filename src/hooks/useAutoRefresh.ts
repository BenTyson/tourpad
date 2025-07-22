import { useEffect } from 'react';
import { useEventStream, PaymentEvent } from './useEventStream';

export function useAutoRefresh(onRefresh: () => void, eventTypes?: PaymentEvent['type'][]) {
  const { lastEvent } = useEventStream();

  useEffect(() => {
    if (!lastEvent || lastEvent.type === 'connected' || lastEvent.type === 'heartbeat') {
      return;
    }

    // If eventTypes is specified, only refresh for those types
    if (eventTypes && !eventTypes.includes(lastEvent.type)) {
      return;
    }

    // Refresh data when relevant payment events occur
    if (lastEvent.type.startsWith('payment_') || lastEvent.type.startsWith('subscription_')) {
      // Add a small delay to ensure database writes are completed
      setTimeout(() => {
        onRefresh();
      }, 1000);
    }
  }, [lastEvent, onRefresh, eventTypes]);
}