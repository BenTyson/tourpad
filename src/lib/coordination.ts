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