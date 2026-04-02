import { describe, it, expect } from 'vitest';
import { apiSuccess, apiError, ApiErrors, ErrorCode } from '@/lib/api-response';

describe('apiSuccess', () => {
  it('returns success: true with spread data', async () => {
    const response = apiSuccess({ bookings: [], total: 0 });
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.bookings).toEqual([]);
    expect(body.total).toBe(0);
    expect(response.status).toBe(200);
  });

  it('supports custom status codes', async () => {
    const response = apiSuccess({ id: '123' }, 201);
    expect(response.status).toBe(201);
  });
});

describe('apiError', () => {
  it('returns success: false with error details', async () => {
    const response = apiError(ErrorCode.NOT_FOUND, 'Artist not found', 404);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe('Artist not found');
    expect(body.errorCode).toBe('NOT_FOUND');
    expect(response.status).toBe(404);
  });
});

describe('ApiErrors convenience helpers', () => {
  it('unauthorized returns 401', async () => {
    const response = ApiErrors.unauthorized();
    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.errorCode).toBe('AUTH_REQUIRED');
    expect(body.error).toBe('Unauthorized');
  });

  it('unauthorized accepts custom message', async () => {
    const response = ApiErrors.unauthorized('Session expired');
    const body = await response.json();
    expect(body.error).toBe('Session expired');
  });

  it('forbidden returns 403', async () => {
    const response = ApiErrors.forbidden();
    expect(response.status).toBe(403);
  });

  it('notFound returns 404', async () => {
    const response = ApiErrors.notFound('Host not found');
    const body = await response.json();
    expect(response.status).toBe(404);
    expect(body.error).toBe('Host not found');
  });

  it('validation returns 400', async () => {
    const response = ApiErrors.validation('Invalid email');
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.errorCode).toBe('VALIDATION_ERROR');
  });

  it('rateLimited returns 429', async () => {
    const response = ApiErrors.rateLimited();
    expect(response.status).toBe(429);
  });

  it('conflict returns 409', async () => {
    const response = ApiErrors.conflict('Booking already exists');
    expect(response.status).toBe(409);
  });

  it('internal returns 500', async () => {
    const response = ApiErrors.internal();
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body.errorCode).toBe('INTERNAL_ERROR');
  });
});
