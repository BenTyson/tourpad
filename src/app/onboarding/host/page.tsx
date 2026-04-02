import { redirect } from 'next/navigation';

// Host onboarding is handled by the registration wizard
export default function HostOnboardingPage() {
  redirect('/register?type=host');
}
