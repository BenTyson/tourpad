import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Store active connections
const clients = new Map<string, ReadableStreamDefaultController>();

export async function GET(req: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const isAdmin = session.user.email === 'admin@tourpad.com';

  // Create a new ReadableStream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Store the controller for this user
      const clientId = `${userId}-${Date.now()}`;
      clients.set(clientId, controller);
      console.log(`[SSE] Client connected: ${clientId}. Total clients: ${clients.size}`);

      // Send initial connection message
      const encoder = new TextEncoder();
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected', clientId })}\n\n`)
      );

      // Set up heartbeat to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: Date.now() })}\n\n`)
          );
        } catch (error) {
          clearInterval(heartbeat);
          clients.delete(clientId);
        }
      }, 30000); // Every 30 seconds

      // Clean up on close
      req.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        clients.delete(clientId);
        controller.close();
        console.log(`[SSE] Client disconnected: ${clientId}. Total clients: ${clients.size}`);
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// Helper function to send events to specific users or all admins
export function sendPaymentEvent(event: {
  type: 'payment_success' | 'payment_failed' | 'subscription_updated' | 'subscription_canceled';
  userId?: string;
  data: any;
}) {
  const encoder = new TextEncoder();
  const message = encoder.encode(`data: ${JSON.stringify(event)}\n\n`);

  // Send to all active clients
  clients.forEach((controller, clientId) => {
    try {
      // Extract userId from clientId
      const [targetUserId] = clientId.split('-');
      
      // Send to the specific user or to all admins
      if (event.userId === targetUserId || targetUserId === 'admin@tourpad.com') {
        controller.enqueue(message);
      }
    } catch (error) {
      // Remove dead connections
      clients.delete(clientId);
    }
  });
}