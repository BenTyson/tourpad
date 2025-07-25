'use client';
import Link from 'next/link';
import { ArrowLeft, FileText, Shield, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-mist">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-french-blue/5 to-sage/5 border-b border-neutral-100">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-french-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-sage/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back navigation */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-french-blue hover:text-primary-700 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Page header */}
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full text-evergreen border border-sage/20 mb-8">
              <FileText className="w-4 h-4 mr-2" />
              Legal Documentation
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The foundation of our community. Clear, honest terms that protect everyone while keeping the music flowing.
            </p>
            <div className="mt-8 inline-flex items-center px-4 py-2 bg-sage/10 rounded-full text-sm text-gray-600">
              Last updated: January 2025
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Quick Navigation */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100 mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Navigation</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <a href="#who-can-use" className="flex items-center p-4 rounded-xl bg-french-blue/5 hover:bg-french-blue/10 transition-colors group">
                <Users className="w-5 h-5 text-french-blue mr-3" />
                <span className="text-gray-700 group-hover:text-gray-900">Who Can Use TourPad</span>
              </a>
              <a href="#how-it-works" className="flex items-center p-4 rounded-xl bg-sage/5 hover:bg-sage/10 transition-colors group">
                <Heart className="w-5 h-5 text-sage mr-3" />
                <span className="text-gray-700 group-hover:text-gray-900">How TourPad Works</span>
              </a>
              <a href="#safety" className="flex items-center p-4 rounded-xl bg-evergreen/5 hover:bg-evergreen/10 transition-colors group">
                <Shield className="w-5 h-5 text-evergreen mr-3" />
                <span className="text-gray-700 group-hover:text-gray-900">Safety & Liability</span>
              </a>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100">
            <div className="p-8 sm:p-12">
              
              {/* Welcome Section */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-french-blue to-sage rounded-lg flex items-center justify-center mr-3">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  Welcome to TourPad
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  These Terms of Service govern your use of TourPad, a platform that connects touring musicians with house concert hosts and music fans. By using TourPad, you agree to these terms.
                </p>
              </div>

              {/* Who Can Use TourPad */}
              <div id="who-can-use" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-sage to-evergreen rounded-lg flex items-center justify-center mr-3">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  Who Can Use TourPad
                </h2>
                <div className="bg-gradient-to-br from-mist/50 to-neutral-50 rounded-xl p-6">
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-french-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      You must be at least 13 years old to use TourPad
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-sage rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      You must provide accurate information when creating your account
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-evergreen rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      You're responsible for keeping your account secure
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-sand rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      One person per account (no shared accounts)
                    </li>
                  </ul>
                </div>
              </div>

              {/* How TourPad Works */}
              <div id="how-it-works" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-evergreen to-neutral-800 rounded-lg flex items-center justify-center mr-3">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  How TourPad Works
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {/* Artists */}
                  <div className="bg-gradient-to-br from-french-blue/5 to-french-blue/10 rounded-xl p-6 border border-french-blue/20">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">For Artists</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Create a profile to showcase your music and tour information</li>
                      <li>• Search for house concert venues across the country</li>
                      <li>• Connect directly with hosts to book shows</li>
                      <li>• Pay a subscription fee for platform access</li>
                    </ul>
                  </div>

                  {/* Hosts */}
                  <div className="bg-gradient-to-br from-sage/5 to-sage/10 rounded-xl p-6 border border-sage/20">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">For Hosts</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Create a venue profile for your home concert space</li>
                      <li>• Connect with touring artists looking for shows</li>
                      <li>• Share your address only with confirmed, booked artists</li>
                      <li>• Use TourPad for free</li>
                    </ul>
                  </div>

                  {/* Fans */}
                  <div className="bg-gradient-to-br from-evergreen/5 to-evergreen/10 rounded-xl p-6 border border-evergreen/20">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">For Fans</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Discover house concerts in your area</li>
                      <li>• RSVP to shows and receive event details</li>
                      <li>• Connect with artists and other music lovers</li>
                      <li>• Pay a fee for platform access</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Account Responsibilities */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Responsibilities</h2>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-mist/50 to-white rounded-xl p-6 border border-neutral-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">All Users Must</h3>
                    <ul className="grid md:grid-cols-2 gap-2 text-gray-700">
                      <li>• Provide accurate profile information</li>
                      <li>• Treat other users with respect</li>
                      <li>• Follow our Community Guidelines</li>
                      <li>• Respect intellectual property rights</li>
                      <li className="md:col-span-2">• Use the platform only for its intended purpose</li>
                    </ul>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-french-blue/5 to-white rounded-xl p-6 border border-french-blue/20">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Artists Must</h3>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Accurately represent your music and tour information</li>
                        <li>• Honor confirmed bookings</li>
                        <li>• Communicate professionally with hosts and fans</li>
                        <li>• Respect host property and house rules</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-sage/5 to-white rounded-xl p-6 border border-sage/20">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hosts Must</h3>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Accurately describe your venue and capacity</li>
                        <li>• Only share your address with confirmed bookings</li>
                        <li>• Provide a safe environment for concerts</li>
                        <li>• Communicate clearly about house rules and expectations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payments and Fees */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payments and Fees</h2>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-sage/5 to-evergreen/5 rounded-xl p-6 border border-sage/20">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Processing</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• All payments are processed securely through Stripe</li>
                      <li>• We don't store your payment information</li>
                      <li>• You're responsible for keeping your payment method current</li>
                    </ul>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-neutral-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Fees</h3>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Artists and fans pay subscription fees for platform access</li>
                        <li>• Fees are charged according to your selected plan</li>
                        <li>• Hosts use TourPad for free</li>
                      </ul>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-neutral-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Refunds</h3>
                      <p className="text-gray-700 text-sm">
                        See our separate Cancellation & Refund Policy for details on refunds and cancellations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety and Liability */}
              <div id="safety" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  Safety and Liability
                </h2>

                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 text-red-800">Important Safety Notice</h3>
                  <p className="text-red-700">
                    House concerts involve people gathering in private homes. While we facilitate these connections, TourPad is not responsible for what happens at individual events.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-sage/5 to-evergreen/5 rounded-xl p-6 border border-sage/20">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">What TourPad Does</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Provide a platform for connections</li>
                      <li>• Moderate content for Community Guidelines violations</li>
                      <li>• Facilitate secure payments</li>
                      <li>• Offer customer support</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-6 border border-neutral-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">What TourPad Doesn't Do</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Screen users beyond basic verification</li>
                      <li>• Supervise individual concerts or events</li>
                      <li>• Mediate disputes unrelated to platform use</li>
                      <li>• Guarantee the safety of any event</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-neutral-200 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Responsibilities</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-700 mb-2"><strong>Artists:</strong> Respect host property and follow house rules</p>
                      <p className="text-sm text-gray-700 mb-2"><strong>Hosts:</strong> Ensure your venue is reasonably safe for guests</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 mb-2"><strong>Fans:</strong> Follow host guidelines and respect private property</p>
                      <p className="text-sm text-gray-700"><strong>Everyone:</strong> Use good judgment and prioritize safety</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3">Limitation of Liability</h3>
                  <p className="text-yellow-700 mb-4">
                    TourPad provides a connection platform only. We're not liable for:
                  </p>
                  <ul className="grid md:grid-cols-2 gap-2 text-yellow-700 text-sm mb-4">
                    <li>• Property damage at house concerts</li>
                    <li>• Personal injury at events</li>
                    <li>• Disputes between users</li>
                    <li>• Cancelled or problematic shows</li>
                    <li className="md:col-span-2">• Loss of equipment or personal items</li>
                  </ul>
                  <p className="text-yellow-700 font-medium">
                    You participate in house concerts at your own risk and agree to hold TourPad harmless from any issues that arise.
                  </p>
                </div>
              </div>

              {/* Remaining sections with similar styling... */}
              <div className="space-y-12">
                {/* Intellectual Property */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Intellectual Property</h2>
                  <div className="bg-gradient-to-br from-mist/50 to-white rounded-xl p-6 border border-neutral-100">
                    <ul className="space-y-3 text-gray-700">
                      <li>• TourPad respects copyright and intellectual property rights</li>
                      <li>• Don't post content you don't have permission to share</li>
                      <li>• We'll respond to valid copyright infringement claims</li>
                      <li>• TourPad owns the platform technology and design</li>
                    </ul>
                  </div>
                </div>

                {/* Privacy */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy</h2>
                  <div className="bg-gradient-to-br from-french-blue/5 to-sage/5 rounded-xl p-6 border border-french-blue/20">
                    <p className="text-gray-700">
                      Your privacy is important to us. See our <Link href="/privacy" className="text-french-blue hover:text-primary-700 underline">Privacy Policy</Link> for details on how we collect, use, and protect your information.
                    </p>
                  </div>
                </div>

                {/* Platform Rules */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Rules</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                      <h3 className="text-lg font-semibold text-red-800 mb-4">Prohibited Activities</h3>
                      <ul className="space-y-2 text-red-700 text-sm">
                        <li>• Harassing or threatening other users</li>
                        <li>• Posting inappropriate or offensive content</li>
                        <li>• Using the platform for unrelated commercial purposes</li>
                        <li>• Creating fake accounts or impersonating others</li>
                        <li>• Attempting to circumvent platform fees</li>
                        <li>• Sharing contact info to avoid using TourPad</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-sage/5 to-evergreen/5 rounded-xl p-6 border border-sage/20">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Consequences</h3>
                      <p className="text-gray-700 mb-3">Violating these terms may result in:</p>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Content removal</li>
                        <li>• Account warnings</li>
                        <li>• Temporary suspension</li>
                        <li>• Permanent account termination</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-gradient-to-br from-evergreen/5 to-neutral-50 rounded-xl p-8 border border-evergreen/20 text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions About These Terms?</h2>
                  <p className="text-gray-700 mb-6">
                    Contact us at <a href="mailto:support@tourpad.com" className="text-french-blue hover:text-primary-700 underline">support@tourpad.com</a> or TourPad, Denver, CO
                  </p>
                  <div className="inline-flex items-center px-6 py-3 bg-sage/10 rounded-full text-sm text-gray-600">
                    By using TourPad, you acknowledge that you've read, understood, and agree to these Terms of Service.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-br from-sage/5 to-evergreen/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Join the Community?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Now that you understand how TourPad works, join thousands of artists, hosts, and fans creating magical musical moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <Link href="/register">
              <Button size="lg" className="px-8 py-4 bg-french-blue hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started Today
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="px-8 py-4 border-sage text-sage hover:bg-sage hover:text-white transition-all duration-300">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}