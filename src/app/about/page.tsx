import { Users } from 'lucide-react';
import { ComingSoon } from '@/components/ui/ComingSoon';

export default function AboutPage() {
  return (
    <ComingSoon
      title="About Us"
      description="Learn about TourPad's mission to connect touring musicians with passionate hosts for unforgettable intimate concerts."
      icon={Users}
      category="Company"
    />
  );
}
