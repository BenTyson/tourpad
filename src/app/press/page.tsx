import { Newspaper } from 'lucide-react';
import { ComingSoon } from '@/components/ui/ComingSoon';

export default function PressPage() {
  return (
    <ComingSoon
      title="Press"
      description="Media resources, press releases, and brand assets for TourPad coverage."
      icon={Newspaper}
      category="Company"
    />
  );
}
