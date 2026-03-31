import { Shield } from 'lucide-react';
import { ComingSoon } from '@/components/ui/ComingSoon';

export default function SafetyPage() {
  return (
    <ComingSoon
      title="Safety"
      description="How TourPad keeps artists, hosts, and fans safe at every house concert."
      icon={Shield}
      category="Support"
    />
  );
}
