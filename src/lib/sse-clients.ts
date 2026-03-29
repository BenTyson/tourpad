// Shared SSE client registry for server-sent events
const clients = new Map<string, ReadableStreamDefaultController>();

export function getClients() {
  return clients;
}

export function sendPaymentEvent(event: {
  type: 'payment_success' | 'payment_failed' | 'subscription_updated' | 'subscription_canceled';
  userId?: string;
  data: unknown;
}) {
  const encoder = new TextEncoder();
  const message = encoder.encode(`data: ${JSON.stringify(event)}\n\n`);

  clients.forEach((controller, clientId) => {
    try {
      const [targetUserId] = clientId.split('-');
      if (event.userId === targetUserId || targetUserId === 'admin@tourpad.com') {
        controller.enqueue(message);
      }
    } catch {
      clients.delete(clientId);
    }
  });
}
