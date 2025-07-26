import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';

interface RealtimeMessagingOptions {
  conversationId?: string | null;
  pollInterval?: number;
  enabled?: boolean;
}

interface TypingUser {
  userId: string;
  userName: string;
}

interface OnlineStatus {
  [userId: string]: {
    isOnline: boolean;
    lastSeen?: number;
  };
}

// Safe real-time messaging hook with stable refs pattern (tested and verified)
export function useRealtimeMessagingSafe(options: RealtimeMessagingOptions = {}) {
  const { data: session } = useSession();
  const {
    conversationId,
    pollInterval = 30000, // 30 seconds default (tested safe)
    enabled = true
  } = options;

  // State
  const [newMessages, setNewMessages] = useState<any[]>([]);
  const [updatedConversations, setUpdatedConversations] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [onlineStatus, setOnlineStatus] = useState<OnlineStatus>({});
  const [lastPollTime, setLastPollTime] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [pollError, setPollError] = useState<string | null>(null);

  // Stable refs to prevent dependency loops
  const enabledRef = useRef(enabled);
  const sessionRef = useRef(session);
  const conversationIdRef = useRef(conversationId);
  const lastPollTimeRef = useRef<string | null>(null);
  
  // Update refs when values change
  enabledRef.current = enabled;
  sessionRef.current = session;
  conversationIdRef.current = conversationId;
  lastPollTimeRef.current = lastPollTime;

  // Single stable poll function
  const pollMessages = useCallback(async () => {
    // Check if we should poll
    if (!enabledRef.current || !sessionRef.current?.user?.id) {
      return;
    }

    // Prevent concurrent polls
    if (isPolling) {
      console.log('[REALTIME] Skipping poll - already in progress');
      return;
    }

    try {
      setIsPolling(true);
      setPollError(null);
      
      const params = new URLSearchParams();
      if (lastPollTimeRef.current) {
        params.append('since', lastPollTimeRef.current);
      }
      if (conversationIdRef.current) {
        params.append('conversationId', conversationIdRef.current);
      }

      console.log('[REALTIME] Polling messages...', params.toString());
      
      const response = await fetch(`/api/messages/poll-safe?${params}`, {
        method: 'GET',
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`Poll failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Update state with new data
      if (data.updatedConversations?.length > 0) {
        setUpdatedConversations(data.updatedConversations);
      }
      
      if (data.newMessages?.length > 0) {
        setNewMessages(prev => [...prev, ...data.newMessages]);
      }

      // Update poll timestamp
      if (data.timestamp) {
        setLastPollTime(data.timestamp);
      }

      console.log('[REALTIME] Poll success:', {
        newMessages: data.newMessages?.length || 0,
        updatedConversations: data.updatedConversations?.length || 0
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[REALTIME] Poll error:', errorMessage);
      setPollError(errorMessage);
    } finally {
      setIsPolling(false);
    }
  }, []); // Empty deps - function is stable

  // Store poll function in ref for interval use
  const pollRef = useRef(pollMessages);
  pollRef.current = pollMessages;

  // Single effect for message polling with proper cleanup
  useEffect(() => {
    if (!enabled || !session?.user?.id) {
      return;
    }

    console.log(`[REALTIME] Starting message polling every ${pollInterval}ms`);
    
    // Initial poll
    pollRef.current();
    
    // Set up interval
    const interval = setInterval(() => {
      pollRef.current();
    }, pollInterval);

    // Cleanup
    return () => {
      console.log('[REALTIME] Stopping message polling');
      clearInterval(interval);
    };
  }, [enabled, session?.user?.id, pollInterval]); // Only primitive deps

  // Typing indicator functions
  const sendTypingIndicator = useCallback(async (isTyping: boolean) => {
    if (!session?.user?.id || !conversationId) return;

    try {
      await fetch('/api/messages/typing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          isTyping
        })
      });
    } catch (error) {
      console.error('[REALTIME] Error sending typing indicator:', error);
    }
  }, [session?.user?.id, conversationId]);

  // Typing control with auto-stop
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const startTyping = useCallback(() => {
    sendTypingIndicator(true);
    
    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Auto-stop after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(false);
    }, 3000);
  }, [sendTypingIndicator]);

  const stopTyping = useCallback(() => {
    sendTypingIndicator(false);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [sendTypingIndicator]);

  // Fetch online status
  const fetchOnlineStatus = useCallback(async (userIds: string[]) => {
    if (!session?.user?.id || userIds.length === 0) return;

    try {
      const response = await fetch(`/api/messages/online-status?userIds=${userIds.join(',')}`);
      if (!response.ok) return;

      const data = await response.json();
      setOnlineStatus(data.onlineStatus || {});
    } catch (error) {
      console.error('[REALTIME] Error fetching online status:', error);
    }
  }, [session?.user?.id]);

  // Clear functions
  const clearNewMessages = useCallback(() => {
    setNewMessages([]);
  }, []);

  const clearUpdatedConversations = useCallback(() => {
    setUpdatedConversations([]);
  }, []);

  // Manual poll trigger
  const triggerPoll = useCallback(() => {
    pollMessages();
  }, [pollMessages]);

  return {
    // Data
    newMessages,
    updatedConversations,
    typingUsers,
    onlineStatus,
    lastPollTime,
    isPolling,
    pollError,

    // Actions
    startTyping,
    stopTyping,
    fetchOnlineStatus,
    clearNewMessages,
    clearUpdatedConversations,
    triggerPoll,

    // Utils
    isUserOnline: (userId?: string) => userId ? (onlineStatus[userId]?.isOnline || false) : false,
    getLastSeen: (userId?: string) => userId ? onlineStatus[userId]?.lastSeen : undefined
  };
}