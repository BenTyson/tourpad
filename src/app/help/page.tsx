import { LifeBuoy } from 'lucide-react';
import { ComingSoon } from '@/components/ui/ComingSoon';

export default function HelpPage() {
  return (
    <ComingSoon
      title="Help Center"
      description="Find answers to common questions about hosting, booking, and using TourPad."
      icon={LifeBuoy}
      category="Support"
    />
  );
}
