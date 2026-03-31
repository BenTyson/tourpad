import { PenLine } from 'lucide-react';
import { ComingSoon } from '@/components/ui/ComingSoon';

export default function BlogPage() {
  return (
    <ComingSoon
      title="Blog"
      description="Stories from the road, host spotlights, and insights from the house concert community."
      icon={PenLine}
      category="Company"
    />
  );
}
