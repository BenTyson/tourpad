import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tourpad.com';

  const host = await prisma.host.findUnique({
    where: { id },
    select: {
      venueDescription: true,
      venueName: true,
      city: true,
      state: true,
      venueType: true,
      user: { select: { name: true, profileImageUrl: true } },
    },
  });

  if (!host) {
    return { title: 'Venue Not Found | TourPad' };
  }

  const name = host.venueName || host.user.name;
  const location = host.city && host.state ? `${host.city}, ${host.state}` : '';
  const description = host.venueDescription
    ? host.venueDescription.slice(0, 160)
    : `${name} hosts house concerts${location ? ` in ${location}` : ''} on TourPad.`;

  return {
    title: `${name}${location ? ` — ${location}` : ''}`,
    description,
    openGraph: {
      title: `${name} | TourPad`,
      description,
      url: `${baseUrl}/hosts/${id}`,
      type: 'profile',
      ...(host.user.profileImageUrl && {
        images: [{ url: host.user.profileImageUrl, alt: name }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} | TourPad`,
      description,
    },
  };
}

export default async function HostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tourpad.com';

  const host = await prisma.host.findUnique({
    where: { id },
    select: {
      venueName: true,
      city: true,
      state: true,
      user: { select: { name: true, profileImageUrl: true } },
    },
  });

  const jsonLd = host
    ? {
        '@context': 'https://schema.org',
        '@type': 'EventVenue',
        name: host.venueName || host.user.name,
        url: `${baseUrl}/hosts/${id}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: host.city,
          addressRegion: host.state,
          addressCountry: 'US',
        },
        ...(host.user.profileImageUrl && { image: host.user.profileImageUrl }),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
