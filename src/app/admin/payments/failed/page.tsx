'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  CreditCardIcon,
  EnvelopeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function FailedPaymentsPage() {
  const [processingRetries, setProcessingRetries] = useState(false);

  const failedPayments = [
    {
      id: 'payment_001',
      artistName: 'Tommy Blue',
      artistEmail: 'tommy@tommyblue.com',
      amount: 400,
      currency: 'USD',
      failureReason: 'insufficient_funds',
      failureCode: '4000000000000002',
      attemptDate: new Date('2025-07-10'),
      nextRetryDate: new Date('2025-07-12'),
      attemptCount: 2,
      subscriptionId: 'sub_0987654321'
    },
    {
      id: 'payment_002', 
      artistName: 'The Mountain Folk',
      artistEmail: 'contact@mountainfolk.com',
      amount: 400,
      currency: 'USD',
      failureReason: 'card_declined',
      failureCode: '4000000000000341',
      attemptDate: new Date('2025-07-08'),
      nextRetryDate: new Date('2025-07-15'),
      attemptCount: 1,
      subscriptionId: 'sub_5566778899'
    }
  ];

  const handleRetryPayments = async () => {
    setProcessingRetries(true);
    // Simulate retry process
    setTimeout(() => {
      setProcessingRetries(false);
      alert('Payment retries initiated. Results will be updated shortly.');
    }, 2000);
  };

  const getFailureReasonText = (reason: string) => {
    switch (reason) {
      case 'insufficient_funds':
        return 'Insufficient funds';
      case 'card_declined':
        return 'Card declined';
      case 'expired_card':
        return 'Expired card';
      case 'processing_error':
        return 'Processing error';
      default:
        return reason.replace('_', ' ');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/payments">
            <Button variant="outline" size="sm">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Payments
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Failed Payments
            </h1>
            <p className="text-gray-600">
              Review and retry failed subscription payments
            </p>
          </div>
          <Button 
            onClick={handleRetryPayments}
            disabled={processingRetries}
            className="mt-4 md:mt-0"
          >
            <CreditCardIcon className="w-4 h-4 mr-2" />
            {processingRetries ? 'Processing...' : 'Retry All Payments'}
          </Button>
        </div>

        {/* Summary */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{failedPayments.length}</div>
              <div className="text-sm text-gray-600">Failed Payments</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                ${failedPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Revenue at Risk</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {failedPayments.filter(p => p.attemptCount < 3).length}
              </div>
              <div className="text-sm text-gray-600">Eligible for Retry</div>
            </CardContent>
          </Card>
        </div>

        {/* Failed Payments List */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Payment Failures</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {failedPayments.map((payment) => (
                <div key={payment.id} className="border border-red-200 bg-red-50 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
                        <h3 className="font-medium text-red-900">{payment.artistName}</h3>
                        <Badge variant="error" className="ml-3">
                          Attempt #{payment.attemptCount}
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="space-y-2">
                            <div>
                              <span className="text-gray-600">Email: </span>
                              <span className="text-gray-900">{payment.artistEmail}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Amount: </span>
                              <span className="font-medium text-gray-900">${payment.amount} {payment.currency}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Failure Reason: </span>
                              <span className="text-red-700 font-medium">
                                {getFailureReasonText(payment.failureReason)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="space-y-2">
                            <div>
                              <span className="text-gray-600">Failed On: </span>
                              <span className="text-gray-900">{payment.attemptDate.toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Next Retry: </span>
                              <span className="text-gray-900">{payment.nextRetryDate.toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Subscription ID: </span>
                              <span className="font-mono text-gray-900">{payment.subscriptionId}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-6">
                      <Button size="sm">
                        <CreditCardIcon className="w-4 h-4 mr-2" />
                        Retry Now
                      </Button>
                      <Button variant="outline" size="sm">
                        <EnvelopeIcon className="w-4 h-4 mr-2" />
                        Email Artist
                      </Button>
                      <Link href={`/admin/artists/${payment.subscriptionId}`}>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Retry Strategy Info */}
                  <div className="mt-4 pt-4 border-t border-red-200">
                    <h4 className="text-sm font-medium text-red-900 mb-2">Retry Strategy</h4>
                    <div className="text-sm text-red-800">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <CheckCircleIcon className="w-4 h-4 text-green-600 mr-1" />
                          <span>Day 1 (Immediate)</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircleIcon className="w-4 h-4 text-green-600 mr-1" />
                          <span>Day 3</span>
                        </div>
                        <div className="flex items-center">
                          {payment.attemptCount >= 3 ? (
                            <CheckCircleIcon className="w-4 h-4 text-green-600 mr-1" />
                          ) : (
                            <div className="w-4 h-4 border border-gray-400 rounded-full mr-1"></div>
                          )}
                          <span>Day 7 (Final)</span>
                        </div>
                      </div>
                      {payment.attemptCount >= 3 && (
                        <div className="mt-2 text-red-700 font-medium">
                          ⚠️ All retry attempts exhausted. Manual intervention required.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}