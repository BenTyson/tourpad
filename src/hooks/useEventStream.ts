import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export interface PaymentEvent {
  type: 'payment_success' | 'payment_failed' | 'subscription_updated' | 'subscription_canceled' | 'connected' | 'heartbeat';
  userId?: string;
  data?: any;
  timestamp?: number;
  clientId?: string;
}

export function useEventStream() {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<PaymentEvent | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    let eventSource: EventSource | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;

    const connect = () => {
      eventSource = new EventSource('/api/events');

      eventSource.onopen = () => {
        setIsConnected(true);
        console.log('Event stream connected');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as PaymentEvent;
          
          if (data.type === 'connected') {
            console.log('Connected with client ID:', data.clientId);
          } else if (data.type === 'heartbeat') {
            // Keep connection alive
          } else {
            // Handle payment events
            setLastEvent(data);
          }
        } catch (error) {
          console.error('Error parsing event:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('Event stream error:', error);
        setIsConnected(false);
        eventSource?.close();

        // Reconnect after 5 seconds
        if (reconnectTimer) clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 5000);
      };
    };

    connect();

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      eventSource?.close();
      setIsConnected(false);
    };
  }, [session?.user?.id]);

  return { isConnected, lastEvent };
}