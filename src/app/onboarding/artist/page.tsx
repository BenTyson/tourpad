import { redirect } from 'next/navigation';

// Artist onboarding is handled by the registration wizard
export default function ArtistOnboardingPage() {
  redirect('/register?type=artist');
}
