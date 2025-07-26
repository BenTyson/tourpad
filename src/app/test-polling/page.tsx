'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePollingTest } from '@/hooks/usePollingTest';
import { Button } from '@/components/ui/Button';

export default function TestPollingPage() {
  const { data: session } = useSession();
  const [pollingEnabled, setPollingEnabled] = useState(false);
  const [pollInterval, setPollInterval] = useState(30000); // 30 seconds default
  
  const { 
    lastPollTime, 
    pollCount, 
    isPolling, 
    error, 
    triggerPoll 
  } = usePollingTest(pollingEnabled, pollInterval);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p>Please log in to test the polling system.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Messaging Polling Test
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poll Interval (ms)
              </label>
              <input
                type="number"
                value={pollInterval}
                onChange={(e) => setPollInterval(Number(e.target.value))}
                min="5000"
                max="300000"
                step="5000"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                disabled={pollingEnabled}
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum: 5 seconds, Maximum: 5 minutes
              </p>
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={() => setPollingEnabled(!pollingEnabled)}
                variant={pollingEnabled ? "outline" : "primary"}
                className="w-full"
              >
                {pollingEnabled ? 'Stop Polling' : 'Start Polling'}
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={triggerPoll}
              variant="outline"
              disabled={isPolling}
            >
              {isPolling ? 'Polling...' : 'Manual Poll'}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Polling Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600">Status</div>
              <div className="text-lg font-semibold">
                {pollingEnabled ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-gray-600">Stopped</span>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600">Poll Count</div>
              <div className="text-lg font-semibold text-blue-600">
                {pollCount}
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
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="text-sm font-medium text-red-800">Error</div>
              <div className="text-sm text-red-600">{error}</div>
            </div>
          )}

          {isPolling && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm text-blue-600">
                🔄 Polling in progress...
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">
            ⚠️ Test Safety Notes
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• This endpoint does minimal database work</li>
            <li>• Monitor server console for request logs</li>
            <li>• Start with long intervals (30+ seconds)</li>
            <li>• Stop polling if you see performance issues</li>
            <li>• Check browser network tab for request patterns</li>
          </ul>
        </div>
      </div>
    </div>
  );
}