import React from 'react';
import Link from 'next/link';
import {
  CreditCard,
  CheckCircle,
  Calendar as CalendarIcon,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingStateWrapper } from './LoadingStateWrapper';
import { StatusBadge } from './StatusBadge';

interface BillingWidgetProps {
  userType: 'artist' | 'host' | 'fan';
  subscriptionData: any;
  loading?: boolean;
  error?: string;
}

export function BillingWidget({
  userType,
  subscriptionData,
  loading = false,
  error
}: BillingWidgetProps) {
  const getManageLink = () => {
    switch (userType) {
      case 'artist':
        return '/subscription/manage';
      case 'fan':
        return '/payment/fan';
      case 'host':
        return '/payment/host';
      default:
        return '/subscription';
    }
  };

  const getSetupLink = () => {
    switch (userType) {
      case 'artist':
        return '/payment/artist';
      case 'fan':
        return '/payment/fan';
      case 'host':
        return '/payment/host';
      default:
        return '/payment';
    }
  };

  const getTitle = () => {
    return userType === 'artist' ? 'Subscription & Billing' : 'Membership & Billing';
  };

  const getDescription = () => {
    return userType === 'artist'
      ? 'Manage your annual membership and billing information'
      : 'Manage your membership and payment details';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">{getTitle()}</h2>
          <p className="text-sm text-neutral-600 mt-1">{getDescription()}</p>
        </div>
        <Link href={getManageLink()}>
          <Button size="sm" variant="outline">
            <CreditCard className="w-4 h-4 mr-2" />
            Manage Billing
          </Button>
        </Link>
      </div>

      <div className="p-6">
        <LoadingStateWrapper loading={loading} error={error}>
          {subscriptionData ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Subscription Status */}
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4 border border-primary-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-primary-600 mr-2" />
                      <span className="text-sm font-medium text-primary-900">Status</span>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-primary-800">
                    <StatusBadge status={subscriptionData.subscription?.status || 'UNKNOWN'} />
                  </div>
                </div>

                {/* Next Payment */}
                {subscriptionData.subscription?.status !== 'NONE' && (
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <CalendarIcon className="w-5 h-5 text-neutral-600 mr-2" />
                        <span className="text-sm font-medium text-neutral-700">Next Payment</span>
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-neutral-800">
                      {subscriptionData.billing?.nextPaymentDate
                        ? new Date(subscriptionData.billing.nextPaymentDate).toLocaleDateString()
                        : 'N/A'}
                    </div>
                  </div>
                )}

                {/* Payment Method */}
                {subscriptionData.paymentMethod && (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-700">Payment Method</span>
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-green-800 capitalize">
                      {subscriptionData.paymentMethod.brand} •••• {subscriptionData.paymentMethod.last4}
                    </div>
                  </div>
                )}

                {/* Total Paid */}
                <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 text-secondary-600 mr-2" />
                      <span className="text-sm font-medium text-secondary-700">Total Paid</span>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-secondary-800">
                    ${((subscriptionData.billing?.totalPaid || 0) / 100).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Recent Payments */}
              {subscriptionData?.recentPayments && subscriptionData.recentPayments.length > 0 && (
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <h3 className="text-sm font-medium text-neutral-900 mb-4">Recent Payments</h3>
                  <div className="space-y-2">
                    {subscriptionData.recentPayments.slice(0, 3).map((payment: any) => (
                      <div key={payment.id} className="flex items-center justify-between py-2 px-3 bg-neutral-50 rounded-md">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${
                            payment.status === 'SUCCEEDED' ? 'bg-green-500' :
                            payment.status === 'FAILED' ? 'bg-red-500' :
                            'bg-yellow-500'
                          }`}></div>
                          <div>
                            <div className="text-sm font-medium text-neutral-900">
                              ${(payment.amount / 100).toLocaleString()}
                            </div>
                            <div className="text-xs text-neutral-600">
                              {payment.description || 'Subscription payment'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-neutral-500">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </div>
                          <div className={`text-xs capitalize ${
                            payment.status === 'SUCCEEDED' ? 'text-green-600' :
                            payment.status === 'FAILED' ? 'text-red-600' :
                            'text-yellow-600'
                          }`}>
                            {payment.status.toLowerCase()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Billing Information</h3>
              <p className="text-neutral-600 mb-4">Complete your subscription to start accessing platform features.</p>
              <Link href={getSetupLink()}>
                <Button>
                  Set Up Billing
                </Button>
              </Link>
            </div>
          )}
        </LoadingStateWrapper>
      </div>
    </div>
  );
}