import { NextResponse } from 'next/server';

// Standard error codes for API responses
export const ErrorCode = {
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCodeValue = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * Create a success response: { success: true, ...data }
 * Spreads data fields at the top level so existing field access (e.g. res.bookings)
 * continues to work while adding the success flag.
 */
export function apiSuccess<T extends Record<string, unknown>>(data: T, status = 200) {
  return NextResponse.json({ success: true as const, ...data }, { status });
}

/**
 * Create an error response: { success: false, error: message, errorCode: code }
 * Keeps `error` as a top-level string for backwards compat with frontend code
 * (api-client.ts checks `data.error` as a string). Adds `errorCode` for structured handling.
 */
export function apiError(code: ErrorCodeValue, message: string, status: number) {
  return NextResponse.json(
    { success: false as const, error: message, errorCode: code },
    { status }
  );
}

// Convenience helpers for common error patterns
export const ApiErrors = {
  unauthorized(message = 'Unauthorized') {
    return apiError(ErrorCode.AUTH_REQUIRED, message, 401);
  },
  forbidden(message = 'Forbidden') {
    return apiError(ErrorCode.FORBIDDEN, message, 403);
  },
  notFound(message = 'Not found') {
    return apiError(ErrorCode.NOT_FOUND, message, 404);
  },
  validation(message: string) {
    return apiError(ErrorCode.VALIDATION_ERROR, message, 400);
  },
  rateLimited(message = 'Too many requests. Please try again later.') {
    return apiError(ErrorCode.RATE_LIMITED, message, 429);
  },
  conflict(message: string) {
    return apiError(ErrorCode.CONFLICT, message, 409);
  },
  internal(message = 'Internal server error') {
    return apiError(ErrorCode.INTERNAL_ERROR, message, 500);
  },
};
