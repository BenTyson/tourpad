// Mock coordination service
export interface CoordinationData {
  id: string;
  status: string;
  lastUpdated: Date;
  details: any;
}

export async function getCoordinationData(userId: string): Promise<CoordinationData | null> {
  // Mock implementation
  return {
    id: 'coord-1',
    status: 'pending',
    lastUpdated: new Date(),
    details: {}
  };
}

export async function updateCoordinationStatus(userId: string, status: string): Promise<void> {
  // Mock implementation
  console.log(`Updating coordination status for ${userId} to ${status}`);
}

export async function sendCoordinationNotification(
  userId: string,
  recipients: string[],
  message: string,
  type: string,
  bookingIds: string[],
  metadata: any
): Promise<void> {
  // Mock implementation
  console.log('Sending coordination notification:', {
    userId,
    recipients,
    message,
    type,
    bookingIds,
    metadata
  });
}