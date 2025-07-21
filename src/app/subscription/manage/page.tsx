'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  CreditCard,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit3,
  Download,
  RefreshCw,
  ArrowLeft,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function ManageSubscriptionPage() {
  const { data: session } = useSession();
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payments/subscription-status');
      if (response.ok) {
        const data = await response.json();
        setSubscriptionData(data);
      } else {
        setError('Failed to load subscription data');
      }
    } catch (error) {
      setError('Error loading subscription data');
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentMethod = async () => {
    setUpdating(true);
    try {
      const response = await fetch('/api/payments/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        const errorData = await response.json();
        if (response.status === 503) {
          // Service unavailable - billing portal not configured
          setError(`${errorData.message} Contact: ${errorData.supportEmail}`);
        } else {
          setError('Unable to open billing portal');
        }
      }
    } catch (error) {
      setError('Error opening billing portal');
    }
    setUpdating(false);
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access at the end of your current billing period.')) {
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch('/api/payments/cancel-subscription', {
        method: 'POST'
      });
      
      if (response.ok) {
        await fetchSubscriptionData(); // Refresh data
      } else {
        setError('Unable to cancel subscription');
      }
    } catch (error) {
      setError('Error canceling subscription');
    }
    setUpdating(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200';
      case 'PAST_DUE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'PAST_DUE': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'CANCELED': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mr-4"></div>
            <span className="text-lg text-neutral-600">Loading subscription details...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900">Manage Subscription</h1>
          <p className="text-neutral-600 mt-2">View and manage your TourPad membership</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {!subscriptionData?.subscription || subscriptionData.subscription.status === 'NONE' ? (
          /* No Subscription State */
          <Card className="text-center">
            <CardContent className="py-12">
              <CreditCard className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">No Active Subscription</h2>
              <p className="text-neutral-600 mb-6">
                You don't have an active subscription yet. Start your TourPad membership to access all platform features.
              </p>
              <Link href="/payment/artist">
                <Button size="lg">
                  Start Membership
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Subscription Status Overview */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-neutral-900">Subscription Status</h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(subscriptionData.subscription.status)}
                    <div>
                      <div className="font-medium text-neutral-900">Status</div>
                      <Badge className={getStatusColor(subscriptionData.subscription.status)}>
                        {subscriptionData.subscription.status === 'ACTIVE' ? 'Active' :
                         subscriptionData.subscription.status === 'PAST_DUE' ? 'Past Due' :
                         subscriptionData.subscription.status === 'CANCELED' ? 'Canceled' :
                         subscriptionData.subscription.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-primary-600" />
                    <div>
                      <div className="font-medium text-neutral-900">Plan</div>
                      <div className="text-neutral-600">
                        ${(subscriptionData.subscription.amount / 100).toLocaleString()}/{subscriptionData.subscription.interval}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-secondary-600" />
                    <div>
                      <div className="font-medium text-neutral-900">
                        {subscriptionData.subscription.cancelAtPeriodEnd ? 'Expires' : 'Next Payment'}
                      </div>
                      <div className="text-neutral-600">
                        {subscriptionData.subscription.currentPeriodEnd 
                          ? new Date(subscriptionData.subscription.currentPeriodEnd).toLocaleDateString()
                          : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {subscriptionData.subscription.cancelAtPeriodEnd && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                      <span className="text-yellow-800 text-sm">
                        Your subscription will end on {new Date(subscriptionData.subscription.currentPeriodEnd).toLocaleDateString()}. 
                        You can reactivate anytime before then.
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            {subscriptionData.paymentMethod && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-neutral-900">Payment Method</h2>
                    <Button variant="outline" size="sm" onClick={handleUpdatePaymentMethod} disabled={updating}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Update
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900 capitalize">
                        {subscriptionData.paymentMethod.brand} •••• {subscriptionData.paymentMethod.last4}
                      </div>
                      <div className="text-sm text-neutral-600">
                        Expires {subscriptionData.paymentMethod.expiryMonth}/{subscriptionData.paymentMethod.expiryYear}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Billing History */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-neutral-900">Billing History</h2>
                  <div className="text-sm text-neutral-600">
                    Total Paid: <span className="font-medium">${((subscriptionData.billing?.totalPaid || 0) / 100).toLocaleString()}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {subscriptionData.recentPayments && subscriptionData.recentPayments.length > 0 ? (
                  <div className="space-y-3">
                    {subscriptionData.recentPayments.map((payment: any) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            payment.status === 'SUCCEEDED' ? 'bg-green-500' :
                            payment.status === 'FAILED' ? 'bg-red-500' :
                            'bg-yellow-500'
                          }`}></div>
                          <div>
                            <div className="font-medium text-neutral-900">
                              ${(payment.amount / 100).toLocaleString()}
                            </div>
                            <div className="text-sm text-neutral-600">
                              {payment.description || 'Subscription payment'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-neutral-600">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </div>
                          <div className={`text-xs capitalize font-medium ${
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
                ) : (
                  <div className="text-center py-6 text-neutral-600">
                    No payment history available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-neutral-900">Manage Subscription</h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={handleUpdatePaymentMethod}
                    disabled={updating}
                    className="flex items-center justify-center"
                  >
                    {updating ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Edit3 className="w-4 h-4 mr-2" />
                    )}
                    Update Billing Info
                  </Button>

                  {subscriptionData.subscription.status === 'ACTIVE' && !subscriptionData.subscription.cancelAtPeriodEnd && (
                    <Button 
                      variant="outline" 
                      onClick={handleCancelSubscription}
                      disabled={updating}
                      className="flex items-center justify-center border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Subscription
                    </Button>
                  )}

                  {subscriptionData.subscription.cancelAtPeriodEnd && (
                    <Button 
                      onClick={handleUpdatePaymentMethod}
                      disabled={updating}
                      className="flex items-center justify-center bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Reactivate Subscription
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}