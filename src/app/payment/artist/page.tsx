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
    'Profile visibility to our entire host and fan user base',
    'Show calendar management',
    'Rating & Review platform',
    'Marketing tools & event pages',
    'Robust map display to plan tours',
    'Priority customer support'
  ];

  const handlePayment = async () => {
    setPaymentStep('processing');
    
    try {
      // Create Stripe checkout session
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_1RnOGfPNV1CmbPyC0lkEfYbl', // Artist annual price ID
          userType: 'artist'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }
      
      const { sessionId, url } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await getStripe();
      if (stripe && sessionId) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Stripe redirect error:', error);
          setPaymentStep('plan');
        }
      } else if (url) {
        // Fallback to direct URL redirect
        window.location.href = url;
      } else {
        throw new Error('No checkout session created');
      }
      
    } catch (error) {
      console.error('Error creating payment:', error);
      setPaymentStep('plan');
      // TODO: Show error message to user
    }
  };

  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-10 h-10 text-sage-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to TourPad!</h1>
            <p className="text-gray-600 mb-4">
              Your membership is active and your profile is now live.
            </p>
            <div className="bg-sage-50 border border-sage-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-sage-900 mb-2">What's Next?</h3>
              <ul className="text-sm text-sage-800 space-y-1">
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
            <div className="animate-spin w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Processing Payment...</h1>
            <p className="text-gray-600">Please don't close this window</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
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


        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Payment Form */}
          <div className="lg:col-span-2">
            {paymentStep === 'plan' && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Artist Membership Plan</h2>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg p-6 border border-blue-200 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Annual Membership</h3>
                        <p className="text-gray-600">Everything you need to tour successfully</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-teal-600">$400</div>
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
                        <CheckCircleIcon className="w-5 h-5 text-sage-600 mr-3 flex-shrink-0" />
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
                    onClick={handlePayment}
                    size="lg" 
                    className="w-full"
                  >
                    Start Your Music Journey - $400/year
                  </Button>
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
                    <span className="text-gray-600">Membership</span>
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
                  <ShieldCheckIcon className="w-5 h-5 text-sage-600 mr-2" />
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