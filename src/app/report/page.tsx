import { Flag } from 'lucide-react';
import { ComingSoon } from '@/components/ui/ComingSoon';

export default function ReportPage() {
  return (
    <ComingSoon
      title="Report an Issue"
      description="Let us know about problems, concerns, or policy violations so we can take action."
      icon={Flag}
      category="Support"
    />
  );
}
