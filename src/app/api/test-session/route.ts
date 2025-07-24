import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    console.log('🧪 Testing session data...');
    
    const session = await auth();
    
    console.log('Session:', JSON.stringify(session, null, 2));
    
    return NextResponse.json({
      hasSession: !!session,
      session: session || null
    });

  } catch (error) {
    console.error('❌ Session test error:', error);
    return NextResponse.json({ 
      error: 'Session test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}