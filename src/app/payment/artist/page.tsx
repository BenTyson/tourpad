'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircleIcon,
  StarIcon,
  MusicalNoteIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { apiClient, handleApiResponse } from '@/lib/api-client';
import { getStripe } from '@/lib/stripe';

export default function ArtistPaymentPage() {
  const [paymentStep, setPaymentStep] = useState<'plan' | 'payment' | 'processing' | 'success'>('plan');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  const features = [
    'Unlimited venue booking requests',
    'Direct messaging with hosts',
    'Profile visibility to 500+ hosts',
    'Show calendar management',
    'Performance analytics & reviews',
    'Marketing tools & event pages',
    'Priority customer support',
    'Mobile app access'
  ];

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStep('processing');
    
    try {
      // Create Stripe checkout session
      const response = await apiClient.request('/payments/create-checkout', {
        method: 'POST',
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_ARTIST_PRICE_ID || 'price_1234567890', // Would be configured in env
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/artist`
        })
      });
      
      await handleApiResponse(
        response,
        async (data) => {
          // Redirect to Stripe Checkout
          const stripe = await getStripe();
          if (stripe && data.sessionId) {
            await stripe.redirectToCheckout({ sessionId: data.sessionId });
          } else {
            throw new Error('Failed to initialize Stripe');
          }
        },
        (error) => {
          console.error('Payment error:', error);
          setPaymentStep('payment');
          // TODO: Show error message to user
        }
      );
      
    } catch (error) {
      console.error('Error creating payment:', error);
      setPaymentStep('payment');
      // TODO: Show error message to user
    }
  };

  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to TourPad!</h1>
            <p className="text-gray-600 mb-4">
              Your membership is active and your profile is now live.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-green-900 mb-2">What's Next?</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>✓ Your profile is visible to hosts</li>
                <li>✓ You can now book venues</li>
                <li>✓ Start browsing available hosts</li>
                <li>✓ Set up your tour calendar</li>
              </ul>
            </div>
            <div className="space-y-3">
              <Link href="/dashboard">
                <Button className="w-full">Go to Dashboard</Button>
              </Link>
              <Link href="/hosts">
                <Button variant="outline" className="w-full">Browse Venues</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStep === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Processing Payment...</h1>
            <p className="text-gray-600">Please don't close this window</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MusicalNoteIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Artist Membership
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our network of touring musicians and start booking intimate venue experiences.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Payment Form */}
          <div className="lg:col-span-2">
            {paymentStep === 'plan' && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Artist Membership Plan</h2>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Annual Membership</h3>
                        <p className="text-gray-600">Everything you need to tour successfully</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">$400</div>
                        <div className="text-sm text-gray-600">per year</div>
                      </div>
                    </div>
                    <Badge variant="success" className="mb-4">
                      ✨ Most Popular Plan
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-8">
                    <h4 className="font-medium text-gray-900">What's Included:</h4>
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="text-sm text-yellow-800">
                        <h4 className="font-medium mb-1">Subscription Details</h4>
                        <ul className="space-y-1">
                          <li>• Automatically renews annually</li>
                          <li>• Cancel anytime from your dashboard</li>
                          <li>• 7-day grace period for failed payments</li>
                          <li>• All payments processed securely via Stripe</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setPaymentStep('payment')}
                    size="lg" 
                    className="w-full"
                  >
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {paymentStep === 'payment' && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Payment Information</h2>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePayment} className="space-y-6">
                    {/* Payment Method Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Payment Method
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`p-4 border rounded-lg flex items-center justify-center transition-colors ${
                            paymentMethod === 'card'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <CreditCardIcon className="w-5 h-5 mr-2" />
                          Credit Card
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('bank')}
                          className={`p-4 border rounded-lg flex items-center justify-center transition-colors ${
                            paymentMethod === 'bank'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-sm font-medium">Bank Transfer</span>
                        </button>
                      </div>
                    </div>

                    {paymentMethod === 'card' && (
                      <>
                        {/* Card Information */}
                        <div className="space-y-4">
                          <Input
                            label="Card Number"
                            value={cardData.number}
                            onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="Expiry Date"
                              value={cardData.expiry}
                              onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                              placeholder="MM/YY"
                              required
                            />
                            <Input
                              label="CVC"
                              value={cardData.cvc}
                              onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                              placeholder="123"
                              required
                            />
                          </div>

                          <Input
                            label="Cardholder Name"
                            value={cardData.name}
                            onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                            placeholder="John Doe"
                            required
                          />
                        </div>

                        {/* Billing Address */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Billing Address</h4>
                          
                          <Input
                            label="Email Address"
                            type="email"
                            value={cardData.email}
                            onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
                            placeholder="john@example.com"
                            required
                          />

                          <Input
                            label="Address"
                            value={cardData.address}
                            onChange={(e) => setCardData({ ...cardData, address: e.target.value })}
                            placeholder="123 Main St"
                            required
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="City"
                              value={cardData.city}
                              onChange={(e) => setCardData({ ...cardData, city: e.target.value })}
                              placeholder="Austin"
                              required
                            />
                            <Input
                              label="State"
                              value={cardData.state}
                              onChange={(e) => setCardData({ ...cardData, state: e.target.value })}
                              placeholder="TX"
                              required
                            />
                          </div>

                          <Input
                            label="ZIP Code"
                            value={cardData.zip}
                            onChange={(e) => setCardData({ ...cardData, zip: e.target.value })}
                            placeholder="78701"
                            required
                          />
                        </div>
                      </>
                    )}

                    {paymentMethod === 'bank' && (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 mb-4">
                          Bank transfer option coming soon. Please use credit card for now.
                        </p>
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => setPaymentMethod('card')}
                        >
                          Use Credit Card Instead
                        </Button>
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <>
                        {/* Terms */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <label className="flex items-start">
                            <input type="checkbox" className="mt-1 mr-3" required />
                            <span className="text-sm text-gray-700">
                              I agree to the{' '}
                              <Link href="/terms" className="text-blue-600 hover:underline">
                                Terms of Service
                              </Link>{' '}
                              and{' '}
                              <Link href="/privacy" className="text-blue-600 hover:underline">
                                Privacy Policy
                              </Link>
                              . My membership will automatically renew annually.
                            </span>
                          </label>
                        </div>

                        <Button type="submit" size="lg" className="w-full">
                          Complete Payment - $400
                        </Button>
                      </>
                    )}
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Order Summary</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Artist Membership</span>
                    <span className="font-medium">$400.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">1 Year</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next billing</span>
                    <span className="font-medium">Jan 15, 2026</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>$400.00</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center text-sm text-gray-600">
                  <ShieldCheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span>Secured by Stripe. Your payment information is encrypted and secure.</span>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Need Help?</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p className="text-gray-600">
                    Questions about membership or billing?
                  </p>
                  <Link href="/support">
                    <Button variant="outline" size="sm" className="w-full">
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}