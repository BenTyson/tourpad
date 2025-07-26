import { useEffect, useRef, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

// Safe polling test hook with stable references and single timer
// This is designed to test polling without the dependency loop issues
export function usePollingTest(enabled: boolean = false, pollInterval: number = 30000) {
  const { data: session } = useSession();
  const [lastPollTime, setLastPollTime] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Stable refs to prevent recreation
  const enabledRef = useRef(enabled);
  const sessionRef = useRef(session);
  const pollCountRef = useRef(0);
  
  // Update refs when values change
  enabledRef.current = enabled;
  sessionRef.current = session;
  pollCountRef.current = pollCount;

  // Single stable poll function
  const pollTest = useCallback(async () => {
    // Check if we should poll
    if (!enabledRef.current || !sessionRef.current?.user?.id) {
      return;
    }

    try {
      setIsPolling(true);
      setError(null);
      
      const response = await fetch('/api/messages/poll-test', {
        method: 'GET',
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`Poll failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Update state with polling results
      setLastPollTime(data.timestamp);
      setPollCount(prev => prev + 1);
      
      console.log(`[POLL-TEST] Success #${pollCountRef.current + 1}:`, data.message);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('[POLL-TEST] Error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsPolling(false);
    }
  }, []); // Empty deps - function is stable

  // Store poll function in ref for interval use
  const pollRef = useRef(pollTest);
  pollRef.current = pollTest;

  // Single effect for interval management
  useEffect(() => {
    if (!enabled || !session?.user?.id) {
      return;
    }

    console.log(`[POLL-TEST] Starting polling every ${pollInterval}ms`);
    
    // Initial poll
    pollRef.current();
    
    // Set up interval
    const interval = setInterval(() => {
      pollRef.current();
    }, pollInterval);

    // Cleanup
    return () => {
      console.log('[POLL-TEST] Stopping polling interval');
      clearInterval(interval);
    };
  }, [enabled, session?.user?.id, pollInterval]); // Only primitive deps

  // Manual trigger function
  const triggerPoll = useCallback(() => {
    pollTest();
  }, [pollTest]);

  return {
    lastPollTime,
    pollCount,
    isPolling,
    error,
    triggerPoll
  };
}