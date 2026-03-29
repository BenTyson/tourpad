import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getClients } from '@/lib/sse-clients';

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const clients = getClients();

  const stream = new ReadableStream({
    start(controller) {
      const clientId = `${userId}-${Date.now()}`;
      clients.set(clientId, controller);

      const encoder = new TextEncoder();
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected', clientId })}\n\n`)
      );

      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: Date.now() })}\n\n`)
          );
        } catch {
          clearInterval(heartbeat);
          clients.delete(clientId);
        }
      }, 30000);

      req.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        clients.delete(clientId);
        controller.close();
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
