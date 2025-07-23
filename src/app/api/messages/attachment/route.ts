import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from 'fs';

// POST /api/messages/attachment - Send a message with file attachment
export async function POST(request: NextRequest) {
  console.log('[ATTACHMENT] Starting file upload process...');
  
  try {
    const session = await auth();
    if (!session?.user?.id) {
      console.log('[ATTACHMENT] Unauthorized - no session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[ATTACHMENT] Processing form data...');
    const formData = await request.formData();
    const conversationId = formData.get('conversationId') as string;
    const file = formData.get('file') as File;
    const content = formData.get('content') as string || ''; // Optional message text with file

    console.log('[ATTACHMENT] Form data received:', {
      conversationId,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      contentLength: content?.length
    });

    if (!conversationId || !file) {
      console.log('[ATTACHMENT] Missing required fields');
      return NextResponse.json(
        { error: 'conversationId and file are required' },
        { status: 400 }
      );
    }

    // Verify user has access to this conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        booking: true
      }
    });

    if (!conversation || !conversation.participantIds.includes(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Validate file type and size
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'application/pdf', 'text/plain', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    const maxSize = 10 * 1024 * 1024; // 10MB limit for attachments

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed. Supported: images, PDF, text, Word documents' },
        { status: 400 }
      );
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Save file to storage
    console.log('[ATTACHMENT] Processing file for storage...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fileExtension = file.name.split('.').pop() || 'bin';
    const fileName = `${uuidv4()}.${fileExtension}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadDir, fileName);

    console.log('[ATTACHMENT] File paths:', { uploadDir, filePath, fileName });

    // Ensure uploads directory exists
    if (!existsSync(uploadDir)) {
      console.log('[ATTACHMENT] Creating uploads directory...');
      await mkdir(uploadDir, { recursive: true });
    }

    console.log('[ATTACHMENT] Writing file to disk...');
    await writeFile(filePath, buffer);
    const fileUrl = `/uploads/${fileName}`;
    console.log('[ATTACHMENT] File saved successfully:', fileUrl);

    // Create the message with attachment
    console.log('[ATTACHMENT] Creating message in database...');
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: session.user.id,
        content: content || `Shared a file: ${file.name}`,
        messageType: 'ATTACHMENT',
        attachmentUrl: fileUrl,
        attachmentType: file.type,
        attachmentName: file.name,
        attachmentSize: file.size,
        readBy: [session.user.id] // Sender has read their own message
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
            userType: true,
            profile: {
              select: {
                profileImageUrl: true
              }
            },
            artist: {
              select: {
                stageName: true
              }
            },
            host: {
              select: {
                venueName: true
              }
            }
          }
        }
      }
    });

    // Create notifications for other participants
    const otherParticipants = conversation.participantIds.filter(id => id !== session.user.id);
    
    if (otherParticipants.length > 0) {
      const notifications = otherParticipants.map(userId => ({
        userId,
        type: 'MESSAGE' as const,
        title: 'New File Attachment',
        message: `${session.user.name} sent you a file: ${file.name}`,
        relatedId: message.id,
        relatedType: 'message',
        actionUrl: `/dashboard/messages?conversation=${conversationId}`,
        actionText: 'View Message'
      }));

      await prisma.notification.createMany({
        data: notifications
      });
    }

    // Format response to match existing message format
    const formattedMessage = {
      id: message.id,
      content: message.content,
      messageType: message.messageType,
      senderId: message.senderId,
      createdAt: message.createdAt,
      readBy: message.readBy,
      // Attachment specific fields
      attachmentUrl: message.attachmentUrl,
      attachmentType: message.attachmentType,
      attachmentName: message.attachmentName,
      attachmentSize: message.attachmentSize,
      // Include sender object to match regular message format
      sender: {
        id: message.sender.id,
        name: message.sender.name,
        profileImageUrl: message.sender.profile?.profileImageUrl || message.sender.profileImageUrl,
        userType: message.sender.userType,
        profile: message.sender.profile,
        artist: message.sender.artist,
        host: message.sender.host
      }
    };

    console.log('[ATTACHMENT] Sending response:', { messageId: message.id });
    return NextResponse.json(formattedMessage);

  } catch (error) {
    console.error('[ATTACHMENT] Error sending attachment:', error);
    return NextResponse.json(
      { error: 'Failed to send attachment: ' + (error as Error).message },
      { status: 500 }
    );
  }
}