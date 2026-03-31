import { ShieldCheck } from 'lucide-react';
import { ComingSoon } from '@/components/ui/ComingSoon';

export default function TrustPage() {
  return (
    <ComingSoon
      title="Trust & Safety"
      description="Our verification process, dispute resolution, and commitment to a trustworthy platform."
      icon={ShieldCheck}
      category="Support"
    />
  );
}
