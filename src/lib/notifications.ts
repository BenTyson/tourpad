import { prisma } from '@/lib/prisma';
import { NotificationType } from '@prisma/client';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message?: string;
  relatedId?: string;
  relatedType?: string;
  actionUrl?: string;
  actionText?: string;
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        relatedId: params.relatedId,
        relatedType: params.relatedType,
        actionUrl: params.actionUrl,
        actionText: params.actionText,
      }
    });
    
    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
    throw error;
  }
}

// Booking-specific notification creators
export async function notifyBookingApproved(booking: any, host: any) {
  const artistUser = await prisma.user.findFirst({
    where: { artist: { id: booking.artistId } },
    select: { id: true, name: true }
  });

  if (!artistUser) return;

  return createNotification({
    userId: artistUser.id,
    type: 'BOOKING',
    title: 'Booking Approved!',
    message: `${host.user.name} has approved your booking request for ${host.venueName}. Please confirm within 5 days.`,
    relatedId: booking.id,
    relatedType: 'booking',
    actionUrl: `/dashboard/bookings`,
    actionText: 'View Booking'
  });
}

export async function notifyBookingConfirmed(booking: any, artist: any) {
  const hostUser = await prisma.user.findFirst({
    where: { host: { id: booking.hostId } },
    select: { id: true, name: true }
  });

  if (!hostUser) return;

  return createNotification({
    userId: hostUser.id,
    type: 'BOOKING',
    title: 'Show Confirmed!',
    message: `${artist.user.name} has confirmed the show on ${new Date(booking.requestedDate).toLocaleDateString()}.`,
    relatedId: booking.id,
    relatedType: 'booking',
    actionUrl: `/dashboard`,
    actionText: 'View Show'
  });
}

export async function notifyBookingRejected(booking: any, host: any) {
  const artistUser = await prisma.user.findFirst({
    where: { artist: { id: booking.artistId } },
    select: { id: true, name: true }
  });

  if (!artistUser) return;

  return createNotification({
    userId: artistUser.id,
    type: 'BOOKING',
    title: 'Booking Declined',
    message: `Unfortunately, ${host.user.name} has declined your booking request for ${host.venueName}.`,
    relatedId: booking.id,
    relatedType: 'booking',
    actionUrl: `/dashboard/bookings`,
    actionText: 'View Details'
  });
}

export async function notifyDoorFeeChange(booking: any, isForArtist: boolean) {
  if (isForArtist) {
    const artistUser = await prisma.user.findFirst({
      where: { artist: { id: booking.artistId } },
      select: { id: true }
    });

    if (!artistUser) return;

    return createNotification({
      userId: artistUser.id,
      type: 'BOOKING',
      title: 'Door Fee Proposal',
      message: `The host has proposed a different door fee. Please review and respond.`,
      relatedId: booking.id,
      relatedType: 'booking',
      actionUrl: `/dashboard/bookings`,
      actionText: 'Review Proposal'
    });
  } else {
    const hostUser = await prisma.user.findFirst({
      where: { host: { id: booking.hostId } },
      select: { id: true }
    });

    if (!hostUser) return;

    return createNotification({
      userId: hostUser.id,
      type: 'BOOKING',
      title: 'Door Fee Update',
      message: `The artist has responded to your door fee proposal.`,
      relatedId: booking.id,
      relatedType: 'booking',
      actionUrl: `/dashboard/bookings`,
      actionText: 'View Response'
    });
  }
}

// Mark notifications as read
export async function markNotificationAsRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { 
      isRead: true,
      readAt: new Date()
    }
  });
}

export async function markAllNotificationsAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { 
      userId,
      isRead: false 
    },
    data: { 
      isRead: true,
      readAt: new Date()
    }
  });
}