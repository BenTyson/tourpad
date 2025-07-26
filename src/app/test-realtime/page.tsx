'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRealtimeMessagingSafe } from '@/hooks/useRealtimeMessagingSafe';
import { Button } from '@/components/ui/Button';

export default function TestRealtimePage() {
  const { data: session } = useSession();
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const [pollInterval, setPollInterval] = useState(30000); // 30 seconds default
  const [testConversationId, setTestConversationId] = useState('');
  
  const { 
    newMessages,
    updatedConversations,
    lastPollTime,
    isPolling,
    pollError,
    triggerPoll,
    clearNewMessages,
    clearUpdatedConversations
  } = useRealtimeMessagingSafe({
    enabled: realtimeEnabled,
    pollInterval,
    conversationId: testConversationId || null
  });

  // Auto-clear messages after showing them
  useEffect(() => {
    if (newMessages.length > 0) {
      console.log('[TEST-REALTIME] New messages received:', newMessages);
      // Auto-clear after 5 seconds to prevent buildup
      const timer = setTimeout(() => {
        clearNewMessages();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [newMessages, clearNewMessages]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p>Please log in to test real-time messaging.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Real-Time Messaging Test
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poll Interval (ms)
              </label>
              <input
                type="number"
                value={pollInterval}
                onChange={(e) => setPollInterval(Number(e.target.value))}
                min="10000"
                max="300000"
                step="5000"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                disabled={realtimeEnabled}
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum: 10 seconds (rate limited)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conversation ID (optional)
              </label>
              <input
                type="text"
                value={testConversationId}
                onChange={(e) => setTestConversationId(e.target.value)}
                placeholder="Leave empty for all conversations"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                disabled={realtimeEnabled}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setRealtimeEnabled(!realtimeEnabled)}
              variant={realtimeEnabled ? "outline" : "primary"}
            >
              {realtimeEnabled ? 'Stop Real-Time' : 'Start Real-Time'}
            </Button>
            <Button
              onClick={triggerPoll}
              variant="outline"
              disabled={isPolling || !realtimeEnabled}
            >
              {isPolling ? 'Polling...' : 'Manual Poll'}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600">Real-Time Status</div>
              <div className="text-lg font-semibold">
                {realtimeEnabled ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-gray-600">Stopped</span>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600">Last Poll</div>
              <div className="text-sm">
                {lastPollTime ? (
                  new Date(lastPollTime).toLocaleTimeString()
                ) : (
                  'Never'
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600">Polling State</div>
              <div className="text-sm">
                {isPolling ? (
                  <span className="text-blue-600">In Progress</span>
                ) : (
                  <span className="text-gray-600">Idle</span>
                )}
              </div>
            </div>
          </div>

          {pollError && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-sm font-medium text-red-800">Error</div>
              <div className="text-sm text-red-600">{pollError}</div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Real-Time Updates</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                New Messages ({newMessages.length})
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                {newMessages.length === 0 ? (
                  <p className="text-sm text-gray-500">No new messages</p>
                ) : (
                  newMessages.map((msg, idx) => (
                    <div key={idx} className="mb-2 p-2 bg-white rounded border">
                      <div className="text-xs text-gray-600">
                        {msg.sender?.name || 'Unknown'} • {new Date(msg.createdAt).toLocaleTimeString()}
                      </div>
                      <div className="text-sm">{msg.content}</div>
                    </div>
                  ))
                )}
              </div>
              {newMessages.length > 0 && (
                <Button
                  onClick={clearNewMessages}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Clear Messages
                </Button>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Updated Conversations ({updatedConversations.length})
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                {updatedConversations.length === 0 ? (
                  <p className="text-sm text-gray-500">No conversation updates</p>
                ) : (
                  updatedConversations.map((conv, idx) => (
                    <div key={idx} className="mb-2 p-2 bg-white rounded border">
                      <div className="text-xs">
                        ID: {conv.id}
                      </div>
                      <div className="text-xs text-gray-600">
                        Unread: {conv.unreadCount || 0}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {updatedConversations.length > 0 && (
                <Button
                  onClick={clearUpdatedConversations}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Clear Updates
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">
            ⚠️ Testing Notes
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Safe endpoint has 10-second rate limiting per user</li>
            <li>• Only fetches messages from last 5 minutes maximum</li>
            <li>• Limited to 10 messages per poll for safety</li>
            <li>• Monitor server console for detailed logs</li>
            <li>• Send a message in another tab to test real-time updates</li>
          </ul>
        </div>
      </div>
    </div>
  );
}