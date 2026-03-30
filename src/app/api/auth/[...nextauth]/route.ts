import { NextRequest, NextResponse } from 'next/server';
import { handlers } from '@/lib/auth';
import { rateLimit } from '@/lib/api-helpers';

export const { GET } = handlers;

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!rateLimit(`auth:${ip}`, 10, 60000)) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      { status: 429 }
    );
  }
  return handlers.POST(request);
}
