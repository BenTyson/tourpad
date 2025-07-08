'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  CreditCardIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  XCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function SubscriptionPage() {
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'past_due' | 'cancelled'>('active');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpdatePayment, setShowUpdatePayment] = useState(false);

  // Mock subscription data
  const subscription = {
    id: 'sub_1234567890',
    status: subscriptionStatus,
    currentPeriodStart: new Date('2025-01-15'),
    currentPeriodEnd: new Date('2026-01-15'),
    nextBillingDate: new Date('2026-01-15'),
    amount: 400,
    currency: 'usd',
    paymentMethod: {
      type: 'card',
      last4: '4242',
      brand: 'visa',
      expiryMonth: 12,
      expiryYear: 2027
    }
  };

  const handleCancelSubscription = () => {
    setSubscriptionStatus('cancelled');
    setShowCancelModal(false);
    // TODO: Call Stripe API to cancel subscription
  };

  const handleReactivate = () => {
    setSubscriptionStatus('active');
    // TODO: Call Stripe API to reactivate subscription
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return {
          color: 'success',
          icon: CheckCircleIcon,
          text: 'Active',
          description: 'Your membership is active and up to date'
        };
      case 'past_due':
        return {
          color: 'warning',
          icon: ExclamationTriangleIcon,
          text: 'Payment Required',
          description: 'Your payment failed. Please update your payment method'
        };
      case 'cancelled':
        return {
          color: 'error',
          icon: XCircleIcon,
          text: 'Cancelled',
          description: 'Your membership has been cancelled'
        };
      default:
        return {
          color: 'default',
          icon: CheckCircleIcon,
          text: status,
          description: ''
        };
    }
  };

  const statusInfo = getStatusInfo(subscriptionStatus);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold xxtext-gray-900 text-test-red mb-2">
            Subscription & Billing
          </h1>
          <p className="text-gray-600">
            Manage your TourPad artist membership and payment information
          </p>
        </div>

        {/* Status Alert */}
        {subscriptionStatus === 'past_due' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-3" />
              <h3 className="font-medium text-red-900">Action Required</h3>
            </div>
            <p className="text-red-800 mb-4">
              Your payment failed on {subscription.nextBillingDate.toLocaleDateString()}. 
              Please update your payment method to continue your membership.
            </p>
            <div className="flex space-x-3">
              <Button onClick={() => setShowUpdatePayment(true)} className="bg-red-600 hover:bg-red-700">
                Update Payment Method
              </Button>
              <Link href="/support">
                <Button variant="outline">Contact Support</Button>
              </Link>
            </div>
          </div>
        )}

        {subscriptionStatus === 'cancelled' && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <XCircleIcon className="w-5 h-5 text-gray-600 mr-3" />
              <h3 className="font-medium text-gray-900">Membership Cancelled</h3>
            </div>
            <p className="text-gray-800 mb-4">
              Your membership has been cancelled. You can continue using TourPad until {subscription.currentPeriodEnd.toLocaleDateString()}.
            </p>
            <div className="flex space-x-3">
              <Button onClick={handleReactivate}>
                Reactivate Membership
              </Button>
              <Link href="/support">
                <Button variant="outline">Contact Support</Button>
              </Link>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Plan */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-xl font-semibold">Current Plan</h2>
                <Badge variant={statusInfo.color as any}>
                  <StatusIcon className="w-4 h-4 mr-1" />
                  {statusInfo.text}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Artist Membership</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plan:</span>
                        <span className="font-medium">Annual</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium">${subscription.amount}/year</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium">{statusInfo.text}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Billing Cycle</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Started:</span>
                        <span className="font-medium">{subscription.currentPeriodStart.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expires:</span>
                        <span className="font-medium">{subscription.currentPeriodEnd.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next billing:</span>
                        <span className="font-medium">
                          {subscriptionStatus === 'cancelled' 
                            ? 'N/A' 
                            : subscription.nextBillingDate.toLocaleDateString()
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {subscriptionStatus === 'active' && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Auto-renewal</h4>
                        <p className="text-sm text-gray-600">Your membership will automatically renew</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCancelModal(true)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Cancel Membership
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-xl font-semibold">Payment Method</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUpdatePayment(true)}
                >
                  Update
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center mr-4">
                    <span className="text-white text-xs font-bold uppercase">
                      {subscription.paymentMethod.brand}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">•••• •••• •••• {subscription.paymentMethod.last4}</div>
                    <div className="text-sm text-gray-600">
                      Expires {subscription.paymentMethod.expiryMonth}/{subscription.paymentMethod.expiryYear}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Billing History</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: '2025-01-15', amount: 400, status: 'paid', invoice: 'inv_001' },
                    { date: '2024-01-15', amount: 400, status: 'paid', invoice: 'inv_002' },
                    { date: '2023-01-15', amount: 400, status: 'paid', invoice: 'inv_003' }
                  ].map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                          <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">${payment.amount} Annual Membership</div>
                          <div className="text-sm text-gray-600">{payment.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="success">Paid</Badge>
                        <Button variant="outline" size="sm">
                          <DocumentTextIcon className="w-4 h-4 mr-2" />
                          Invoice
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Quick Actions</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setShowUpdatePayment(true)}
                  >
                    <CreditCardIcon className="w-4 h-4 mr-3" />
                    Update Payment Method
                  </Button>
                  <Link href="/subscription/invoices">
                    <Button variant="outline" className="w-full justify-start">
                      <DocumentTextIcon className="w-4 h-4 mr-3" />
                      Download Invoices
                    </Button>
                  </Link>
                  <Link href="/support">
                    <Button variant="outline" className="w-full justify-start">
                      Billing Support
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Membership Benefits */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Membership Benefits</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {[
                    'Unlimited venue bookings',
                    'Direct host messaging',
                    'Profile visibility',
                    'Show analytics',
                    'Marketing tools',
                    'Priority support'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <h3 className="text-lg font-semibold">Cancel Membership</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Are you sure you want to cancel your membership? You'll lose access to:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Booking new venues</li>
                  <li>• Profile visibility to hosts</li>
                  <li>• Direct messaging</li>
                  <li>• Marketing tools</li>
                </ul>
                <p className="text-sm text-gray-600">
                  Your access will continue until {subscription.currentPeriodEnd.toLocaleDateString()}.
                </p>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => setShowCancelModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Keep Membership
                  </Button>
                  <Button
                    onClick={handleCancelSubscription}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Cancel Membership
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Update Payment Modal */}
      {showUpdatePayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <h3 className="text-lg font-semibold">Update Payment Method</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Update your payment method to continue your membership.
                </p>
                {/* In real app, this would be Stripe Elements */}
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => setShowUpdatePayment(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setShowUpdatePayment(false);
                      if (subscriptionStatus === 'past_due') {
                        setSubscriptionStatus('active');
                      }
                    }}
                    className="flex-1"
                  >
                    Update Payment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}