const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addTestSpotifyData() {
  try {
    console.log('Adding test Spotify data...');

    // First, let's find an existing artist
    const artist = await prisma.artist.findFirst({
      where: {
        id: 'cmdi3mtba0004ludm6i1aexz0' // Sarah Johnson's artist ID
      }
    });

    if (!artist) {
      console.log('Artist not found');
      return;
    }

    console.log(`Found artist: ${artist.stageName || 'No stage name'}`);

    // Update artist with Spotify data
    await prisma.artist.update({
      where: { id: artist.id },
      data: {
        spotifyArtistId: '06HL4z0CvFAxyc27GXpf02',
        spotifyVerified: true,
        spotifyFollowers: 114000000,
        spotifyPopularity: 100,
        spotifyGenres: ['pop', 'country pop'],
        lastSpotifySync: new Date()
      }
    });

    console.log('Updated artist with Spotify data');

    // Add albums
    const albums = [
      {
        spotifyId: '5eyZZoQEFQWRHkV2xgAeBw',
        name: 'Midnights',
        albumType: 'album',
        releaseDate: '2022-10-21',
        imageUrl: 'https://i.scdn.co/image/ab67616d0000b2732e9d73d5bdde7c61c37b2dd9',
        spotifyUrl: 'https://open.spotify.com/album/5eyZZoQEFQWRHkV2xgAeBw',
        totalTracks: 13,
        artistId: artist.id
      },
      {
        spotifyId: '6kZ42qRrzov54LcAk4onW9',
        name: 'Red (Taylor\'s Version)',
        albumType: 'album',
        releaseDate: '2021-11-12',
        imageUrl: 'https://i.scdn.co/image/ab67616d0000b273318443aab3531a0558e79a4d',
        spotifyUrl: 'https://open.spotify.com/album/6kZ42qRrzov54LcAk4onW9',
        totalTracks: 30,
        artistId: artist.id
      },
      {
        spotifyId: '2QJmrSgbdM35R67eoGQo4j',
        name: 'evermore',
        albumType: 'album',
        releaseDate: '2020-12-11',
        imageUrl: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5c',
        spotifyUrl: 'https://open.spotify.com/album/2QJmrSgbdM35R67eoGQo4j',
        totalTracks: 15,
        artistId: artist.id
      }
    ];

    // Clear existing Spotify data first
    await prisma.spotifyTrack.deleteMany({
      where: { artistId: artist.id }
    });
    await prisma.spotifyAlbum.deleteMany({
      where: { artistId: artist.id }
    });

    // Create albums
    const createdAlbums = await Promise.all(
      albums.map(album => prisma.spotifyAlbum.create({ data: album }))
    );

    console.log(`Created ${createdAlbums.length} albums`);

    // Add tracks
    const tracks = [
      {
        spotifyId: '3w3y8KPdLr81Z8e4hLF2Nf',
        name: 'Anti-Hero',
        durationMs: 200690,
        popularity: 100,
        previewUrl: 'https://p.scdn.co/mp3-preview/0e48633a8e72b5d53c0d5b50c6e0b0c6e0b0c6e0',
        spotifyUrl: 'https://open.spotify.com/track/3w3y8KPdLr81Z8e4hLF2Nf',
        trackNumber: 4,
        explicit: false,
        artistId: artist.id,
        albumId: createdAlbums[0].id
      },
      {
        spotifyId: '7KokYm8cMIXCsGVmUvKtqf',
        name: 'Lavender Haze',
        durationMs: 202321,
        popularity: 95,
        previewUrl: 'https://p.scdn.co/mp3-preview/1e48633a8e72b5d53c0d5b50c6e0b0c6e0b0c6e0',
        spotifyUrl: 'https://open.spotify.com/track/7KokYm8cMIXCsGVmUvKtqf',
        trackNumber: 1,
        explicit: false,
        artistId: artist.id,
        albumId: createdAlbums[0].id
      },
      {
        spotifyId: '5kqIPrATcBibld1k2Z9J8a',
        name: 'All Too Well (10 Minute Version)',
        durationMs: 613040,
        popularity: 90,
        previewUrl: 'https://p.scdn.co/mp3-preview/2e48633a8e72b5d53c0d5b50c6e0b0c6e0b0c6e0',
        spotifyUrl: 'https://open.spotify.com/track/5kqIPrATcBibld1k2Z9J8a',
        trackNumber: 5,
        explicit: false,
        artistId: artist.id,
        albumId: createdAlbums[1].id
      },
      {
        spotifyId: '5YqltLsjdqFtvqE7Nryqgs',
        name: 'willow',
        durationMs: 214706,
        popularity: 88,
        previewUrl: 'https://p.scdn.co/mp3-preview/3e48633a8e72b5d53c0d5b50c6e0b0c6e0b0c6e0',
        spotifyUrl: 'https://open.spotify.com/track/5YqltLsjdqFtvqE7Nryqgs',
        trackNumber: 1,
        explicit: false,
        artistId: artist.id,
        albumId: createdAlbums[2].id
      },
      {
        spotifyId: '6RsDAWQaTrym5SzKjFfEWP',
        name: 'champagne problems',
        durationMs: 242821,
        popularity: 85,
        previewUrl: 'https://p.scdn.co/mp3-preview/4e48633a8e72b5d53c0d5b50c6e0b0c6e0b0c6e0',
        spotifyUrl: 'https://open.spotify.com/track/6RsDAWQaTrym5SzKjFfEWP',
        trackNumber: 2,
        explicit: false,
        artistId: artist.id,
        albumId: createdAlbums[2].id
      }
    ];

    const createdTracks = await Promise.all(
      tracks.map(track => prisma.spotifyTrack.create({ 
        data: track,
        include: { album: true }
      }))
    );

    console.log(`Created ${createdTracks.length} tracks`);

    console.log('\n✅ Test Spotify data added successfully!');
    console.log('\nSummary:');
    console.log(`- Artist: ${artist.stageName || 'No stage name'}`);
    console.log(`- Followers: ${(114000000).toLocaleString()}`);
    console.log(`- Albums: ${createdAlbums.length}`);
    console.log(`- Tracks: ${createdTracks.length}`);
    
    console.log('\nAlbums:');
    createdAlbums.forEach(album => {
      console.log(`  - ${album.name} (${album.releaseDate})`);
    });

    console.log('\nTracks:');
    createdTracks.forEach(track => {
      console.log(`  - ${track.name} (${track.album.name})`);
    });

  } catch (error) {
    console.error('Error adding test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestSpotifyData();