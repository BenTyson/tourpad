import { Review } from './realTestData';

// Mock Reviews Data
export const testReviews: Review[] = [
  // Artist reviewing Host (public)
  {
    id: 'review1',
    bookingId: 'booking1',
    reviewerId: 'artist1',
    reviewerType: 'artist',
    reviewedId: 'host1',
    reviewedType: 'host',
    rating: 5,
    feedback: 'Mike was an incredible host! The Wilson House has perfect acoustics and the audience was so warm and engaged. The piano was in excellent condition and the sound system worked beautifully. Would love to perform here again!',
    isPublic: true,
    showDate: '2024-12-15',
    venueName: 'The Wilson House',
    createdAt: '2024-12-16T10:30:00Z',
    helpfulVotes: 12,
    response: {
      text: 'Thank you Sarah! It was wonderful having you perform. Your music filled our home beautifully and our guests are still talking about it. You\'re welcome back anytime!',
      createdAt: '2024-12-17T09:00:00Z'
    }
  },
  
  // Host reviewing Artist (public)
  {
    id: 'review2',
    bookingId: 'booking1',
    reviewerId: 'host1',
    reviewerType: 'host',
    reviewedId: 'artist1',
    reviewedType: 'artist',
    rating: 5,
    feedback: 'Sarah is a true professional. She arrived on time, was well-prepared, and created a magical evening for our guests. Her communication before the show was excellent and she was very respectful of our home. Highly recommend!',
    isPublic: true,
    showDate: '2024-12-15',
    artistName: 'Sarah Johnson',
    createdAt: '2024-12-16T11:00:00Z',
    helpfulVotes: 8
  },
  
  // Artist reviewing Host (private - constructive feedback)
  {
    id: 'review3',
    bookingId: 'booking3',
    reviewerId: 'artist2',
    reviewerType: 'artist',
    reviewedId: 'host2',
    reviewedType: 'host',
    rating: 3,
    feedback: 'The venue itself is great, but there were some communication issues. The sound system wasn\'t set up as promised and we had to scramble to get everything working. The host seemed overwhelmed. With better organization, this could be an excellent venue.',
    isPublic: false,
    showDate: '2024-11-20',
    venueName: 'Thompson Arts Loft',
    createdAt: '2024-11-21T14:00:00Z'
  },
  
  // Host reviewing Artist (public)
  {
    id: 'review4',
    bookingId: 'booking4',
    reviewerId: 'host2',
    reviewerType: 'host',
    reviewedId: 'artist2',
    reviewedType: 'artist',
    rating: 4,
    feedback: 'Marcus is an incredible musician with amazing stage presence. The only reason for 4 stars instead of 5 is that his band arrived 30 minutes late for soundcheck which created some stress. The performance itself was outstanding though!',
    isPublic: true,
    showDate: '2024-10-15',
    artistName: 'Marcus Williams',
    createdAt: '2024-10-16T16:30:00Z',
    helpfulVotes: 5,
    response: {
      text: 'Thank you for the feedback! We apologize for the late arrival - we hit unexpected traffic. We\'ll make sure to plan better buffer time in the future. Thanks for being understanding and for hosting us!',
      createdAt: '2024-10-17T10:00:00Z'
    }
  },
  
  // Another public review
  {
    id: 'review5',
    bookingId: 'booking5',
    reviewerId: 'artist3',
    reviewerType: 'artist',
    reviewedId: 'host3',
    reviewedType: 'host',
    rating: 5,
    feedback: 'Sarah\'s guest suite was perfect for my tour stop. Clean, comfortable, and she even provided breakfast! The location was convenient to the venue I was playing at. Highly recommend for touring artists.',
    isPublic: true,
    showDate: '2024-09-10',
    venueName: 'Cozy Guest Suite',
    createdAt: '2024-09-11T08:00:00Z',
    helpfulVotes: 15
  },
  
  // Private review with concerns
  {
    id: 'review6',
    bookingId: 'booking6',
    reviewerId: 'host1',
    reviewerType: 'host',
    reviewedId: 'artist3',
    reviewedType: 'artist',
    rating: 2,
    feedback: 'Emma cancelled at the last minute after we had already promoted the show. While I understand emergencies happen, the communication was poor and we had disappointed guests. Would need assurances before booking again.',
    isPublic: false,
    showDate: '2024-08-20',
    artistName: 'Emma Rodriguez',
    createdAt: '2024-08-21T19:00:00Z'
  },
  
  // More reviews using mock data IDs
  
  // Artist '1' reviewing host '2' (public)
  {
    id: 'review7',
    bookingId: 'booking7',
    reviewerId: '1',
    reviewerType: 'artist',
    reviewedId: '2',
    reviewedType: 'host',
    rating: 4,
    feedback: 'Riverside Barn is a fantastic venue! The rustic atmosphere was perfect for our folk sound. The acoustics were surprisingly good for a barn setting. Host was very accommodating and the audience was engaged. Only minor issue was the sound system setup took longer than expected.',
    isPublic: true,
    showDate: '2024-11-10',
    venueName: 'Riverside Barn',
    createdAt: '2024-11-11T14:00:00Z',
    helpfulVotes: 7,
    response: {
      text: 'Thanks for the great performance! We\'ve since upgraded our sound system setup process to make it more efficient. You\'re always welcome back!',
      createdAt: '2024-11-12T09:00:00Z'
    }
  },
  
  // Host '2' reviewing artist '1' (private feedback)
  {
    id: 'review8',
    bookingId: 'booking7',
    reviewerId: '2',
    reviewerType: 'host',
    reviewedId: '1',
    reviewedType: 'artist',
    rating: 3,
    feedback: 'Sarah & The Wanderers performed well, but there were some professionalism issues. They arrived 45 minutes late without prior notice, which stressed our guests. The performance itself was beautiful, but better communication would have made the experience smoother for everyone.',
    isPublic: false,
    showDate: '2024-11-10',
    artistName: 'Sarah & The Wanderers',
    createdAt: '2024-11-11T16:00:00Z'
  },
  
  // Artist '1' reviewing host '1' (public)
  {
    id: 'review9',
    bookingId: 'booking8',
    reviewerId: '1',
    reviewerType: 'artist',
    reviewedId: '1',
    reviewedType: 'host',
    rating: 5,
    feedback: 'The Garden House is absolutely perfect for intimate acoustic performances! The fireplace creates such a cozy atmosphere, and the piano was perfectly tuned. The host was incredibly welcoming and the audience was so engaged. This is what house concerts should be!',
    isPublic: true,
    showDate: '2024-10-22',
    venueName: 'The Garden House',
    createdAt: '2024-10-23T10:00:00Z',
    helpfulVotes: 12
  },
  
  // Host '1' reviewing artist '1' (public)
  {
    id: 'review10',
    bookingId: 'booking8',
    reviewerId: '1',
    reviewerType: 'host',
    reviewedId: '1',
    reviewedType: 'artist',
    rating: 5,
    feedback: 'Sarah & The Wanderers delivered an absolutely magical evening! Their harmonies filled our living room beautifully, and they connected so naturally with our guests. Professional, punctual, and incredibly talented. We\'d love to have them back anytime!',
    isPublic: true,
    showDate: '2024-10-22',
    artistName: 'Sarah & The Wanderers',
    createdAt: '2024-10-23T11:30:00Z',
    helpfulVotes: 15,
    response: {
      text: 'Thank you so much! Your home has such a special energy and your guests were wonderful. We\'d absolutely love to return!',
      createdAt: '2024-10-24T08:00:00Z'
    }
  },
  
  // More reviews for variety
  
  // Artist '2' reviewing host '1' (private constructive)
  {
    id: 'review11',
    bookingId: 'booking9',
    reviewerId: '2',
    reviewerType: 'artist',
    reviewedId: '1',
    reviewedType: 'host',
    rating: 3,
    feedback: 'The venue itself is lovely, but there were some organizational challenges. The performance area wasn\'t cleared until 30 minutes before show time, and we had to move furniture ourselves. The sound system also had some feedback issues that took time to resolve. The host was apologetic and the audience was great once we got started.',
    isPublic: false,
    showDate: '2024-09-15',
    venueName: 'The Garden House',
    createdAt: '2024-09-16T12:00:00Z'
  },
  
  // Host '1' reviewing artist '2' (public)
  {
    id: 'review12',
    bookingId: 'booking9',
    reviewerId: '1',
    reviewerType: 'host',
    reviewedId: '2',
    reviewedType: 'artist',
    rating: 4,
    feedback: 'Marcus delivered an incredible performance with such passion and energy! His guitar skills are phenomenal and he really knows how to work a room. The only reason for 4 stars instead of 5 is that the volume was a bit too high for our intimate space at times, but overall a fantastic show!',
    isPublic: true,
    showDate: '2024-09-15',
    artistName: 'Marcus Williams',
    createdAt: '2024-09-16T14:00:00Z',
    helpfulVotes: 8
  },
  
  // Artist '1' received private feedback from host '2' (different perspective)
  {
    id: 'review13',
    bookingId: 'booking10',
    reviewerId: '2',
    reviewerType: 'host',
    reviewedId: '1',
    reviewedType: 'artist',
    rating: 4,
    feedback: 'Great performance overall! The music was beautiful and professional. One suggestion: consider bringing a smaller amp setup for barn venues - the acoustics are quite different from living rooms and the sound was a bit overwhelming at first. Once we adjusted, it was perfect!',
    isPublic: false,
    showDate: '2024-08-05',
    artistName: 'Sarah & The Wanderers',
    createdAt: '2024-08-06T09:00:00Z'
  },
  
  // Additional reviews for artist1 (Sarah Johnson session ID format)
  {
    id: 'review14',
    bookingId: 'booking11',
    reviewerId: 'host1',
    reviewerType: 'host',
    reviewedId: 'artist1',
    reviewedType: 'artist',
    rating: 4,
    feedback: 'Sarah Johnson and her band delivered a wonderful performance! The harmonies were beautiful and the audience was thoroughly engaged. They were professional and respectful of our space. The only minor issue was some equipment setup took longer than expected, but the end result was fantastic.',
    isPublic: false,
    showDate: '2024-06-15',
    artistName: 'Sarah Johnson',
    createdAt: '2024-06-16T10:00:00Z'
  },
  
  {
    id: 'review15',
    bookingId: 'booking12',
    reviewerId: 'artist1',
    reviewerType: 'artist',
    reviewedId: 'host1',
    reviewedType: 'host',
    rating: 5,
    feedback: 'Amazing venue! The acoustics were perfect and the host was incredibly welcoming. The audience was engaged and respectful. This is exactly what house concerts should be - intimate, warm, and magical. Would definitely love to return!',
    isPublic: true,
    showDate: '2024-05-20',
    venueName: 'The Garden House',
    createdAt: '2024-05-21T09:00:00Z',
    helpfulVotes: 9
  },
  
  {
    id: 'review16',
    bookingId: 'booking13',
    reviewerId: 'host2',
    reviewerType: 'host',
    reviewedId: 'artist1',
    reviewedType: 'artist',
    rating: 3,
    feedback: 'The performance was good overall, but there were some communication issues leading up to the show. Last-minute changes to the setlist and technical requirements caused some stress. The actual performance was solid, but better advance planning would have made the experience smoother for everyone.',
    isPublic: false,
    showDate: '2024-04-10',
    artistName: 'Sarah Johnson',
    createdAt: '2024-04-11T15:00:00Z'
  }
];

// Past completed bookings for dashboard display
export const completedBookings = [
  {
    id: 'past1',
    artistId: 'artist1',
    hostId: 'host1',
    artistName: 'Sarah Johnson',
    hostName: 'Mike Wilson',
    venueName: 'The Wilson House',
    eventDate: '2024-12-15',
    attendeeCount: 32,
    hasReview: true,
    reviewId: 'review1'
  },
  {
    id: 'past2',
    artistId: 'artist2',
    hostId: 'host2',
    artistName: 'Marcus Williams',
    hostName: 'Lisa Thompson',
    venueName: 'Thompson Arts Loft',
    eventDate: '2024-10-15',
    attendeeCount: 48,
    hasReview: true,
    reviewId: 'review4'
  },
  {
    id: 'past3',
    artistId: 'artist1',
    hostId: 'host2',
    artistName: 'Sarah Johnson',
    hostName: 'Lisa Thompson',
    venueName: 'Thompson Arts Loft',
    eventDate: '2024-09-05',
    attendeeCount: 42,
    hasReview: false
  },
  {
    id: 'past4',
    artistId: 'artist2',
    hostId: 'host1',
    artistName: 'Marcus Williams',
    hostName: 'Mike Wilson',
    venueName: 'The Wilson House',
    eventDate: '2024-07-20',
    attendeeCount: 30,
    hasReview: false
  },
  // Additional bookings using mock data IDs
  {
    id: 'past5',
    artistId: '1',
    hostId: '2',
    artistName: 'Sarah & The Wanderers',
    hostName: 'Riverside Barn',
    venueName: 'Riverside Barn',
    eventDate: '2024-11-10',
    attendeeCount: 45,
    hasReview: true,
    reviewId: 'review7'
  },
  {
    id: 'past6',
    artistId: '1',
    hostId: '1',
    artistName: 'Sarah & The Wanderers',
    hostName: 'The Garden House',
    venueName: 'The Garden House',
    eventDate: '2024-10-22',
    attendeeCount: 28,
    hasReview: true,
    reviewId: 'review9'
  },
  {
    id: 'past7',
    artistId: '2',
    hostId: '1',
    artistName: 'Marcus Williams',
    hostName: 'The Garden House',
    venueName: 'The Garden House',
    eventDate: '2024-09-15',
    attendeeCount: 25,
    hasReview: true,
    reviewId: 'review12'
  },
  {
    id: 'past8',
    artistId: '1',
    hostId: '2',
    artistName: 'Sarah & The Wanderers',
    hostName: 'Riverside Barn',
    venueName: 'Riverside Barn',
    eventDate: '2024-08-05',
    attendeeCount: 38,
    hasReview: true,
    reviewId: 'review13'
  },
  {
    id: 'past9',
    artistId: '2',
    hostId: '2',
    artistName: 'Marcus Williams',
    hostName: 'Riverside Barn',
    venueName: 'Riverside Barn',
    eventDate: '2024-07-12',
    attendeeCount: 52,
    hasReview: false
  },
  // Additional past bookings for artist1 (Sarah Johnson)
  {
    id: 'past10',
    artistId: 'artist1',
    hostId: 'host1',
    artistName: 'Sarah Johnson',
    hostName: 'The Garden House',
    venueName: 'The Garden House',
    eventDate: '2024-06-15',
    attendeeCount: 35,
    hasReview: true,
    reviewId: 'review14'
  },
  {
    id: 'past11',
    artistId: 'artist1',
    hostId: 'host1',
    artistName: 'Sarah Johnson',
    hostName: 'The Garden House',
    venueName: 'The Garden House',
    eventDate: '2024-05-20',
    attendeeCount: 32,
    hasReview: true,
    reviewId: 'review15'
  },
  {
    id: 'past12',
    artistId: 'artist1',
    hostId: 'host2',
    artistName: 'Sarah Johnson',
    hostName: 'Riverside Barn',
    venueName: 'Riverside Barn',
    eventDate: '2024-04-10',
    attendeeCount: 48,
    hasReview: true,
    reviewId: 'review16'
  }
];

// Helper function to get reviews for a specific user
export function getUserReviews(userId: string, userType: 'artist' | 'host') {
  return testReviews.filter(review => 
    review.reviewedId === userId && review.reviewedType === userType
  );
}

// Helper function to get reviews written by a specific user
export function getReviewsByUser(userId: string) {
  return testReviews.filter(review => review.reviewerId === userId);
}

// Helper function to get public reviews only
export function getPublicReviews(userId: string, userType: 'artist' | 'host') {
  return getUserReviews(userId, userType).filter(review => review.isPublic);
}

// Helper function to calculate average rating
export function calculateAverageRating(userId: string, userType: 'artist' | 'host'): number {
  const reviews = getUserReviews(userId, userType);
  if (reviews.length === 0) return 0;
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal
}