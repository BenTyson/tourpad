import { describe, it, expect, beforeEach } from 'vitest';
import { rateLimit } from '@/lib/api-helpers';

describe('rateLimit', () => {
  // Use unique identifiers per test to avoid cross-test pollution
  let testId: string;
  let counter = 0;

  beforeEach(() => {
    counter++;
    testId = `test-user-${counter}-${Date.now()}`;
  });

  it('allows first request', () => {
    expect(rateLimit(testId, 5, 60000)).toBe(true);
  });

  it('allows requests under the limit', () => {
    for (let i = 0; i < 4; i++) {
      expect(rateLimit(testId, 5, 60000)).toBe(true);
    }
  });

  it('blocks requests at the limit', () => {
    for (let i = 0; i < 5; i++) {
      rateLimit(testId, 5, 60000);
    }
    expect(rateLimit(testId, 5, 60000)).toBe(false);
  });

  it('resets after window expires', () => {
    // Fill up the limit
    for (let i = 0; i < 5; i++) {
      rateLimit(testId, 5, 1); // 1ms window
    }
    // Wait for window to expire
    const start = Date.now();
    while (Date.now() - start < 5) {
      // busy wait 5ms
    }
    expect(rateLimit(testId, 5, 1)).toBe(true);
  });

  it('tracks different identifiers independently', () => {
    const id1 = `${testId}-a`;
    const id2 = `${testId}-b`;

    for (let i = 0; i < 3; i++) {
      rateLimit(id1, 3, 60000);
    }
    // id1 is at limit
    expect(rateLimit(id1, 3, 60000)).toBe(false);
    // id2 should still work
    expect(rateLimit(id2, 3, 60000)).toBe(true);
  });
});
