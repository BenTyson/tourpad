import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tourpad.com';

  const artist = await prisma.artist.findFirst({
    where: { id, approvedAt: { not: null } },
    select: {
      stageName: true,
      briefBio: true,
      fullBio: true,
      genres: true,
      user: { select: { name: true, profileImageUrl: true } },
    },
  });

  if (!artist) {
    return { title: 'Artist Not Found | TourPad' };
  }

  const name = artist.stageName || artist.user.name;
  const bio = artist.briefBio || artist.fullBio;
  const description = bio
    ? bio.slice(0, 160)
    : `${name} on TourPad — book house concerts and connect with intimate venues.`;
  const genres = artist.genres?.length ? artist.genres.join(', ') : undefined;

  return {
    title: name,
    description: genres ? `${description} Genres: ${genres}` : description,
    openGraph: {
      title: `${name} | TourPad`,
      description,
      url: `${baseUrl}/artists/${id}`,
      type: 'profile',
      ...(artist.user.profileImageUrl && {
        images: [{ url: artist.user.profileImageUrl, alt: name }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} | TourPad`,
      description,
    },
  };
}

export default async function ArtistLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tourpad.com';

  const artist = await prisma.artist.findFirst({
    where: { id, approvedAt: { not: null } },
    select: {
      stageName: true,
      genres: true,
      user: { select: { name: true, profileImageUrl: true } },
    },
  });

  const jsonLd = artist
    ? {
        '@context': 'https://schema.org',
        '@type': 'MusicGroup',
        name: artist.stageName || artist.user.name,
        url: `${baseUrl}/artists/${id}`,
        genre: artist.genres,
        ...(artist.user.profileImageUrl && { image: artist.user.profileImageUrl }),
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
