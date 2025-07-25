'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Star, Guitar, Home, Heart, Zap, Shield, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const artistPlans = [
    {
      name: 'Artist Starter',
      description: 'Perfect for new touring musicians',
      monthlyPrice: 29,
      annualPrice: 299,
      features: [
        'Complete artist profile with music & photos',
        'Browse unlimited host venues nationwide',
        'Send booking requests to hosts',
        'Access to interactive touring map',
        'Basic messaging with hosts',
        'Keep 100% of door fees & merch',
        'Mobile app access'
      ],
      popular: false,
      cta: 'Start Touring'
    },
    {
      name: 'Artist Pro',
      description: 'For serious touring musicians',
      monthlyPrice: 59,
      annualPrice: 599,
      features: [
        'Everything in Starter',
        'Priority listing in host searches',
        'Advanced tour planning tools',
        'Detailed venue analytics & insights',
        'Priority customer support',
        'Concert promotion tools',
        'Fan mailing list integration',
        'Verified artist badge'
      ],
      popular: true,
      cta: 'Go Pro'
    }
  ];

  const hostPlans = [
    {
      name: 'Host Forever Free',
      description: 'Everything you need to host amazing concerts',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        'Complete host profile with venue photos',
        'Browse all touring artists',
        'Unlimited booking requests',
        'Guest list management',
        'Direct messaging with artists',
        'Concert promotion tools',
        'Community support access',
        'Mobile app access'
      ],
      popular: true,
      cta: 'Start Hosting'
    }
  ];

  const fanPlans = [
    {
      name: 'Fan Free',
      description: 'Discover amazing house concerts',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        'Browse all confirmed concerts',
        'Artist discovery tools',
        'RSVP to house concerts',
        'Follow favorite artists & hosts',
        'Concert notifications',
        'Mobile app access'
      ],
      popular: false,
      cta: 'Join Free'
    },
    {
      name: 'Fan Plus',
      description: 'Enhanced concert discovery',
      monthlyPrice: 9,
      annualPrice: 99,
      features: [
        'Everything in Free',
        'Early access to new concerts',
        'Priority RSVP notifications',
        'Advanced filtering & search',
        'Exclusive fan community access',
        'Concert recommendations',
        'Premium support'
      ],
      popular: true,
      cta: 'Upgrade Experience'
    }
  ];

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price}`;
  };

  const getDisplayPrice = (plan: any) => {
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
    return formatPrice(price);
  };

  const getSavings = (monthlyPrice: number, annualPrice: number) => {
    if (monthlyPrice === 0) return 0;
    return Math.round(((monthlyPrice * 12 - annualPrice) / (monthlyPrice * 12)) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-mist">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-french-blue/5 to-sage/5 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-french-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sage/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Back navigation */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-french-blue hover:text-primary-700 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full text-sage border border-sage/20 mb-8">
              <Star className="w-4 h-4 mr-2" />
              Simple, Transparent Pricing
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
              Whether you're touring, hosting, or discovering music, we have the perfect plan to support your house concert journey.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white rounded-full p-2 shadow-sm border border-neutral-200">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-french-blue text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === 'annual'
                    ? 'bg-french-blue text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual
                <span className="ml-2 text-xs bg-sage/20 text-sage px-2 py-1 rounded-full">Save up to 17%</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Artist Pricing */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-french-blue/10 to-primary-700/10 rounded-full text-french-blue border border-french-blue/20 mb-6">
              <Guitar className="w-5 h-5 mr-2" />
              For Artists
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Tour Your Way
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Keep 100% of your earnings while building authentic connections with hosts and fans
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {artistPlans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-lg ${
                  plan.popular
                    ? 'border-french-blue/30 ring-2 ring-french-blue/20'
                    : 'border-neutral-200 hover:border-french-blue/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-french-blue to-primary-700 text-white px-6 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-8">
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold text-gray-900">
                        {getDisplayPrice(plan)}
                      </span>
                      {plan.monthlyPrice > 0 && (
                        <span className="text-gray-600 ml-2">
                          /{billingCycle === 'monthly' ? 'month' : 'year'}
                        </span>
                      )}
                    </div>
                    {billingCycle === 'annual' && plan.monthlyPrice > 0 && (
                      <p className="text-sm text-sage mt-2">
                        Save {getSavings(plan.monthlyPrice, plan.annualPrice)}% with annual billing
                      </p>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-sage mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/register?type=artist">
                    <Button
                      className={`w-full py-4 font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                        plan.popular
                          ? 'bg-gradient-to-r from-french-blue to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white'
                          : 'bg-white border-2 border-french-blue text-french-blue hover:bg-french-blue hover:text-white'
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Host Pricing */}
      <section className="py-20 bg-gradient-to-br from-sage/5 to-evergreen/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sage/10 to-evergreen/10 rounded-full text-sage border border-sage/20 mb-6">
              <Home className="w-5 h-5 mr-2" />
              For Hosts
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Host for Free, Forever
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We believe hosts are the backbone of the house concert community. That's why hosting is completely free.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {hostPlans.map((plan, index) => (
              <div
                key={plan.name}
                className="relative bg-white rounded-2xl shadow-sm border border-sage/30 ring-2 ring-sage/20"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-sage to-evergreen text-white px-6 py-2 rounded-full text-sm font-medium">
                    Always Free
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-8">
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold text-gray-900">Free</span>
                      <span className="text-gray-600 ml-2">forever</span>
                    </div>
                    <p className="text-sm text-sage mt-2">
                      No hidden fees, no subscription costs
                    </p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-sage mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/register?type=host">
                    <Button className="w-full py-4 bg-gradient-to-r from-sage to-evergreen hover:from-secondary-700 hover:to-neutral-800 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02]">
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fan Pricing */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-evergreen/10 to-neutral-400/10 rounded-full text-evergreen border border-evergreen/20 mb-6">
              <Heart className="w-5 h-5 mr-2" />
              For Fans
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Discover Amazing Music
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find intimate concerts and support artists directly. Start free or upgrade for enhanced discovery.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {fanPlans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-lg ${
                  plan.popular
                    ? 'border-evergreen/30 ring-2 ring-evergreen/20'
                    : 'border-neutral-200 hover:border-evergreen/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-evergreen to-neutral-800 text-white px-6 py-2 rounded-full text-sm font-medium">
                      Enhanced Experience
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-8">
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold text-gray-900">
                        {getDisplayPrice(plan)}
                      </span>
                      {plan.monthlyPrice > 0 && (
                        <span className="text-gray-600 ml-2">
                          /{billingCycle === 'monthly' ? 'month' : 'year'}
                        </span>
                      )}
                    </div>
                    {billingCycle === 'annual' && plan.monthlyPrice > 0 && (
                      <p className="text-sm text-sage mt-2">
                        Save {getSavings(plan.monthlyPrice, plan.annualPrice)}% with annual billing
                      </p>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-sage mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/register?type=fan">
                    <Button
                      className={`w-full py-4 font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                        plan.popular
                          ? 'bg-gradient-to-r from-evergreen to-neutral-800 hover:from-neutral-800 hover:to-neutral-900 text-white'
                          : 'bg-white border-2 border-evergreen text-evergreen hover:bg-evergreen hover:text-white'
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-gradient-to-br from-mist to-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why TourPad?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built specifically for the house concert community with features that matter most
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-french-blue/10 to-primary-700/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-french-blue" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Artists Keep Everything</h3>
              <p className="text-gray-600">
                No venue cuts, no promoter fees. Artists keep 100% of door fees and merchandise sales.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-sage/10 to-evergreen/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-sage" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Safe & Trusted</h3>
              <p className="text-gray-600">
                Verified profiles, secure messaging, and community guidelines ensure safe experiences for everyone.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-evergreen/10 to-neutral-400/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Headphones className="w-8 h-8 text-evergreen" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Dedicated Support</h3>
              <p className="text-gray-600">
                Our team understands house concerts and is here to help you succeed at every step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-evergreen to-neutral-800 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Join the Community?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Start your house concert journey today. No setup fees, no hidden costs, just authentic musical connections.
          </p>
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Link href="/register?type=artist">
              <Button size="lg" className="w-full px-6 py-4 bg-white text-evergreen hover:bg-mist hover:text-evergreen shadow-lg hover:shadow-xl transition-all duration-300">
                <Guitar className="w-5 h-5 mr-2" />
                Start as Artist
              </Button>
            </Link>
            
            <Link href="/register?type=host">
              <Button size="lg" className="w-full px-6 py-4 bg-white text-evergreen hover:bg-mist hover:text-evergreen shadow-lg hover:shadow-xl transition-all duration-300">
                <Home className="w-5 h-5 mr-2" />
                Host for Free
              </Button>
            </Link>
            
            <Link href="/register?type=fan">
              <Button size="lg" className="w-full px-6 py-4 bg-white text-evergreen hover:bg-mist hover:text-evergreen shadow-lg hover:shadow-xl transition-all duration-300">
                <Heart className="w-5 h-5 mr-2" />
                Discover Music
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}