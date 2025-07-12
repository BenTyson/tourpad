import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/applications/[id] - Get application by ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    // TODO: Implement auth check (admin only)
    // const session = await auth.getSession();
    // if (!session?.user || session.user.type !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // TODO: Implement actual database query
    // const application = await db.applications.findUnique({
    //   where: { id },
    //   include: { user: true }
    // });

    // if (!application) {
    //   return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    // }

    // Mock response
    const mockApplication = {
      id,
      userId: 'user1',
      type: 'artist',
      status: 'pending',
      submittedAt: new Date(),
      data: {
        bio: 'Folk singer-songwriter',
        genres: ['Folk', 'Indie'],
        experience: 'professional'
      },
      user: {
        id: 'user1',
        name: 'Sarah Johnson',
        email: 'sarah@email.com'
      }
    };

    return NextResponse.json(mockApplication);

  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/applications/[id] - Review application (approve/reject)
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, notes } = body;

    // TODO: Implement auth check (admin only)
    // const session = await auth.getSession();
    // if (!session?.user || session.user.type !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // TODO: Implement application update
    // const application = await db.applications.findUnique({ where: { id } });
    // if (!application) {
    //   return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    // }

    // TODO: Update application and user status
    // const updatedApplication = await db.applications.update({
    //   where: { id },
    //   data: {
    //     status,
    //     notes,
    //     reviewedAt: new Date(),
    //     reviewedBy: session.user.id
    //   }
    // });

    // TODO: If approved, update user status and create profile
    // if (status === 'approved') {
    //   await db.users.update({
    //     where: { id: application.userId },
    //     data: { status: 'approved' }
    //   });
    //   
    //   // Create profile based on application data
    //   if (application.type === 'artist') {
    //     await db.artistProfiles.create({
    //       data: {
    //         userId: application.userId,
    //         ...application.data
    //       }
    //     });
    //   } else {
    //     await db.hostProfiles.create({
    //       data: {
    //         userId: application.userId,
    //         ...application.data
    //       }
    //     });
    //   }
    // }

    // Mock response
    const mockUpdatedApplication = {
      id,
      status,
      notes,
      reviewedAt: new Date(),
      reviewedBy: 'admin-user-id'
    };

    return NextResponse.json(mockUpdatedApplication);

  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
