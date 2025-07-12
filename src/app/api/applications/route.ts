import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

// GET /api/applications - Get applications with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type'); // 'artist' | 'host'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // TODO: Implement auth check (admin only)
    // const session = await auth.getSession();
    // if (!session?.user || session.user.type !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Build filter criteria
    const criteria: any = {};
    if (status) criteria.status = status;
    if (type) criteria.type = type;

    // TODO: Implement actual database query
    // const applications = await db.applications.find({
    //   where: criteria,
    //   skip: (page - 1) * limit,
    //   take: limit,
    //   include: { user: true },
    //   orderBy: { submittedAt: 'desc' }
    // });

    // Mock response for now
    const mockApplications = [
      {
        id: 'app1',
        userId: 'user1',
        type: 'artist',
        status: 'pending',
        submittedAt: new Date('2024-01-22T10:30:00Z'),
        data: {
          bio: 'Folk singer-songwriter from Austin',
          genres: ['Folk', 'Indie'],
          experience: 'professional',
          website: 'https://sarahmusic.com'
        },
        user: {
          id: 'user1',
          name: 'Sarah Johnson',
          email: 'sarah@email.com'
        }
      },
      {
        id: 'app2',
        userId: 'user2',
        type: 'host',
        status: 'pending',
        submittedAt: new Date('2024-01-21T15:45:00Z'),
        data: {
          venueType: 'home',
          capacity: 25,
          location: {
            city: 'Austin',
            state: 'TX'
          }
        },
        user: {
          id: 'user2',
          name: 'Mike Wilson',
          email: 'mike@email.com'
        }
      }
    ];

    return NextResponse.json({
      applications: mockApplications,
      pagination: {
        page,
        limit,
        total: 2,
        totalPages: 1
      }
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/applications - Submit new application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // TODO: Implement auth check
    // const session = await auth.getSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Validate required fields
    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate application type
    if (!['artist', 'host'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid application type' },
        { status: 400 }
      );
    }

    // TODO: Check if user already has a pending application
    // const existingApplication = await db.applications.findFirst({
    //   where: {
    //     userId: session.user.id,
    //     status: 'pending'
    //   }
    // });
    
    // if (existingApplication) {
    //   return NextResponse.json(
    //     { error: 'You already have a pending application' },
    //     { status: 400 }
    //   );
    // }

    // TODO: Implement application creation
    // const application = await db.applications.create({
    //   data: {
    //     userId: session.user.id,
    //     type,
    //     data,
    //     status: 'pending',
    //     submittedAt: new Date()
    //   },
    //   include: { user: true }
    // });

    // Mock response
    const mockApplication = {
      id: 'new-app-id',
      userId: 'current-user-id',
      type,
      data,
      status: 'pending',
      submittedAt: new Date()
    };

    return NextResponse.json(mockApplication, { status: 201 });

  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
