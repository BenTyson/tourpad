import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}