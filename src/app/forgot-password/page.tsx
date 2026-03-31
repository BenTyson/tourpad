import { KeyRound } from 'lucide-react';
import { ComingSoon } from '@/components/ui/ComingSoon';

export default function ForgotPasswordPage() {
  return (
    <ComingSoon
      title="Reset Password"
      description="Password reset functionality is coming soon. For now, please contact support at hello@tourpad.com."
      icon={KeyRound}
      category="Account"
    />
  );
}
