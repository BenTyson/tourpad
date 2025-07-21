'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircleIcon,
  HeartIcon,
  MusicalNoteIcon,
  TicketIcon,
  MapPinIcon,
  BellIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

export default function FanPaymentPage() {
  const [paymentStep, setPaymentStep] = useState<'plan' | 'payment' | 'processing' | 'success'>('plan');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  
  const features = [
    'Discover exclusive house concerts in your area',
    'Direct access to book concert tickets',
    'Get notified about new shows from favorite artists',
    'View detailed venue information and photos',
    'Read reviews from other concert-goers',
    'Build your concert history and favorites',
    'Support independent artists directly',
    'Cancel anytime - no commitment'
  ];

  const plans = {
    monthly: {
      price: 9.99,
      period: 'month',
      description: 'Perfect for trying out TourPad',
      savings: null
    },
    annual: {
      price: 79.99,
      period: 'year',
      description: 'Best value for regular concert-goers',
      savings: 'Save $40 (33% off)'
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStep('success');
    }, 2000);
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
              Your membership is active. Let's find your first house concert!
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-green-900 mb-2">Get Started</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Browse upcoming concerts in your area</li>
                <li>• Follow your favorite artists</li>
                <li>• Set up concert alerts</li>
                <li>• Book your first show!</li>
              </ul>
            </div>
            <div className="space-y-3">
              <Link href="/dashboard">
                <Button size="lg" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/artists">
                <Button size="lg" variant="outline" className="w-full">
                  Browse Concerts
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back button */}
        <Link href="/register?type=fan" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back
        </Link>

        {paymentStep === 'plan' && (
          <>
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mb-6">
                <HeartIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Choose Your Concert Experience
              </h1>
              <p className="text-xl text-gray-600">
                Join thousands of music lovers discovering intimate house concerts
              </p>
            </div>

            {/* Plan Selection */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {(['monthly', 'annual'] as const).map((plan) => (
                <Card 
                  key={plan}
                  className={`cursor-pointer transition-all ${
                    selectedPlan === plan 
                      ? 'ring-2 ring-primary-500 shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <CardHeader className="pb-4">
                    {plan === 'annual' && (
                      <Badge variant="secondary" className="mb-2">
                        BEST VALUE
                      </Badge>
                    )}
                    <h3 className="text-2xl font-bold capitalize">{plan} Plan</h3>
                    <div className="mt-3">
                      <span className="text-4xl font-bold">${plans[plan].price}</span>
                      <span className="text-gray-600">/{plans[plan].period}</span>
                    </div>
                    {plans[plan].savings && (
                      <p className="text-green-600 font-medium mt-1">{plans[plan].savings}</p>
                    )}
                    <p className="text-gray-600 mt-2">{plans[plan].description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center">
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        selectedPlan === plan
                          ? 'bg-primary-500 border-primary-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedPlan === plan && (
                          <CheckCircleIcon className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Features */}
            <Card className="mb-8">
              <CardHeader>
                <h2 className="text-2xl font-bold text-gray-900">Everything You Get</h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <MusicalNoteIcon className="w-8 h-8 mx-auto text-primary-600 mb-2" />
                <p className="text-sm text-gray-600">500+ Artists</p>
              </div>
              <div className="text-center">
                <MapPinIcon className="w-8 h-8 mx-auto text-primary-600 mb-2" />
                <p className="text-sm text-gray-600">100+ Cities</p>
              </div>
              <div className="text-center">
                <TicketIcon className="w-8 h-8 mx-auto text-primary-600 mb-2" />
                <p className="text-sm text-gray-600">1000+ Shows</p>
              </div>
            </div>

            {/* Continue button */}
            <div className="text-center">
              <Button 
                size="lg" 
                className="px-8"
                onClick={() => setPaymentStep('payment')}
              >
                Continue to Payment
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Cancel anytime. No questions asked.
              </p>
            </div>
          </>
        )}

        {paymentStep === 'payment' && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Complete Your Membership</h2>
              <p className="text-gray-600">
                ${plans[selectedPlan].price}/{plans[selectedPlan].period} - {plans[selectedPlan].description}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment}>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800">
                        <strong>Demo Mode:</strong> This is a demo. No real payment will be processed.
                        In production, this would integrate with Stripe for secure payment processing.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Card Number"
                    placeholder="4242 4242 4242 4242"
                    value="4242 4242 4242 4242"
                    disabled
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry"
                      placeholder="MM/YY"
                      value="12/25"
                      disabled
                    />
                    <Input
                      label="CVC"
                      placeholder="123"
                      value="123"
                      disabled
                    />
                  </div>
                  <Input
                    label="Name on Card"
                    placeholder="John Doe"
                    value="John Doe"
                    disabled
                  />
                </div>

                <div className="mt-8 space-y-4">
                  <Button type="submit" size="lg" className="w-full">
                    {paymentStep === 'processing' ? 'Processing...' : `Pay $${plans[selectedPlan].price}`}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setPaymentStep('plan')}
                    className="w-full text-gray-600 hover:text-gray-800"
                  >
                    Back to plans
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {paymentStep === 'processing' && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing your payment...</p>
          </div>
        )}
      </div>
    </div>
  );
}