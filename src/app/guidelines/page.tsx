import { ScrollText } from 'lucide-react';
import { ComingSoon } from '@/components/ui/ComingSoon';

export default function GuidelinesPage() {
  return (
    <ComingSoon
      title="Community Guidelines"
      description="Standards and expectations for being a great member of the TourPad community."
      icon={ScrollText}
      category="Support"
    />
  );
}
