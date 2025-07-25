'use client';
import Link from 'next/link';
import { ArrowLeft, Users, Heart, Shield, Star, CheckCircle, AlertTriangle, Flag, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CommunityGuidelines() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-mist">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-sage/5 to-evergreen/5 border-b border-neutral-100">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sage/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-evergreen/10 rounded-full blur-3xl"></div>
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
              <Users className="w-4 h-4 mr-2" />
              Community Standards
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Community Guidelines
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Building a positive, safe community where music brings people together. Clear guidelines that help everyone thrive.
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
            <div className="grid md:grid-cols-4 gap-4">
              <a href="#core-values" className="flex items-center p-4 rounded-xl bg-sage/5 hover:bg-sage/10 transition-colors group">
                <Heart className="w-5 h-5 text-sage mr-3" />
                <span className="text-gray-700 group-hover:text-gray-900 text-sm">Core Values</span>
              </a>
              <a href="#content-standards" className="flex items-center p-4 rounded-xl bg-french-blue/5 hover:bg-french-blue/10 transition-colors group">
                <Star className="w-5 h-5 text-french-blue mr-3" />
                <span className="text-gray-700 group-hover:text-gray-900 text-sm">Content Standards</span>
              </a>
              <a href="#safety" className="flex items-center p-4 rounded-xl bg-evergreen/5 hover:bg-evergreen/10 transition-colors group">
                <Shield className="w-5 h-5 text-evergreen mr-3" />
                <span className="text-gray-700 group-hover:text-gray-900 text-sm">Safety Guidelines</span>
              </a>
              <a href="#reporting" className="flex items-center p-4 rounded-xl bg-sand/20 hover:bg-sand/30 transition-colors group">
                <Flag className="w-5 h-5 text-neutral-700 mr-3" />
                <span className="text-gray-700 group-hover:text-gray-900 text-sm">Reporting</span>
              </a>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100">
            <div className="p-8 sm:p-12">
              
              {/* Building Community */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-sage to-evergreen rounded-lg flex items-center justify-center mr-3">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  Building a Positive Community
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  TourPad connects people through music, bringing together artists, hosts, and fans in intimate home concert settings. These guidelines help ensure our community remains welcoming, safe, and focused on celebrating music together.
                </p>
              </div>

              {/* Core Values */}
              <div id="core-values" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-french-blue to-sage rounded-lg flex items-center justify-center mr-3">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  Our Core Values
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-sage/10 to-evergreen/10 rounded-xl p-6 border border-sage/20">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Respect</h3>
                    <p className="text-gray-700">
                      Treat everyone with kindness and consideration. We're all here because we love music and want to support artists and build community.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-french-blue/10 to-primary-700/10 rounded-xl p-6 border border-french-blue/20">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Safety</h3>
                    <p className="text-gray-700">
                      House concerts happen in people's homes. Everyone deserves to feel safe and comfortable.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-sand/30 to-mist/50 rounded-xl p-6 border border-sand/40">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Authenticity</h3>
                    <p className="text-gray-700">
                      Be genuine in your interactions. Honest communication builds trust in our community.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-evergreen/10 to-neutral-100 rounded-xl p-6 border border-evergreen/20">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Inclusivity</h3>
                    <p className="text-gray-700">
                      TourPad welcomes people of all backgrounds, identities, and music tastes. Diversity makes our community stronger.
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Standards */}
              <div id="content-standards" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-evergreen to-neutral-800 rounded-lg flex items-center justify-center mr-3">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  Content Standards
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* What's Welcome */}
                  <div className="bg-gradient-to-br from-sage/5 to-evergreen/5 rounded-xl p-6 border border-sage/20">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 text-sage mr-2" />
                      What's Welcome
                    </h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-sage rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <strong>Music-Related Content:</strong> Share your music, venue photos, concert experiences
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-sage rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <strong>Constructive Communication:</strong> Professional, helpful, and friendly interactions
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-sage rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <strong>Honest Reviews:</strong> Fair, specific feedback about concerts and experiences
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-sage rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <strong>Community Building:</strong> Content that brings people together around music
                      </li>
                    </ul>
                  </div>

                  {/* What's Not Allowed */}
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                    <h3 className="text-xl font-semibold text-red-800 mb-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                      What's Not Allowed
                    </h3>
                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-red-800 mb-2">Harassment and Abuse</h4>
                        <ul className="space-y-1 text-red-700 text-xs">
                          <li>• Bullying, intimidating, or threatening other users</li>
                          <li>• Targeted harassment based on identity or characteristics</li>
                          <li>• Doxxing or sharing personal info without consent</li>
                          <li>• Stalking or unwelcome persistent contact</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-800 mb-2">Hate Speech & Discrimination</h4>
                        <ul className="space-y-1 text-red-700 text-xs">
                          <li>• Content attacking people based on protected characteristics</li>
                          <li>• Discriminatory language or symbols</li>
                          <li>• Content promoting hate groups or extremist ideologies</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Platform-Specific Guidelines */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Platform-Specific Guidelines</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-french-blue/5 to-primary-700/5 rounded-xl p-6 border border-french-blue/20">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Profile Standards</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Use real names and accurate descriptions</li>
                        <li>• Keep photos family-friendly</li>
                        <li>• Be honest about expectations and capabilities</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-sage/5 to-evergreen/5 rounded-xl p-6 border border-sage/20">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Booking & Communication</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Keep messages respectful and on-topic</li>
                        <li>• Follow through on confirmed bookings</li>
                        <li>• Communicate details upfront</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-sand/20 to-mist/50 rounded-xl p-6 border border-sand/40">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Reviews & Feedback</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Focus on specific experiences</li>
                        <li>• Review the actual concert experience</li>
                        <li>• Consider intimate, informal setting</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety Guidelines */}
              <div id="safety" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-evergreen to-neutral-800 rounded-lg flex items-center justify-center mr-3">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  Safety Guidelines
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-sage/5 to-evergreen/5 rounded-xl p-6 border border-sage/20">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">For Hosts</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Ensure venue can safely accommodate stated capacity</li>
                      <li>• Communicate house rules clearly</li>
                      <li>• Trust your instincts about inviting people</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-french-blue/5 to-primary-700/5 rounded-xl p-6 border border-french-blue/20">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">For Artists</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Respect host property and follow house rules</li>
                      <li>• Communicate technical needs in advance</li>
                      <li>• Be professional and courteous</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-evergreen/5 to-neutral-100 rounded-xl p-6 border border-evergreen/20">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">For Fans</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Follow host guidelines and respect property</li>
                      <li>• Be considerate of neighbors and noise</li>
                      <li>• Remember you're a guest in someone's home</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Reporting and Enforcement */}
              <div id="reporting" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                    <Flag className="w-4 h-4 text-white" />
                  </div>
                  Reporting and Enforcement
                </h2>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                    <h3 className="text-lg font-semibold text-red-800 mb-4">How to Report Issues</h3>
                    <p className="text-red-700 mb-4">If you encounter content or behavior that violates these guidelines:</p>
                    <ul className="space-y-2 text-red-700 text-sm">
                      <li>• Use the "Report" button on problematic content</li>
                      <li>• Contact our support team at support@tourpad.com</li>
                      <li>• For urgent safety concerns, contact local authorities first, then notify us</li>
                    </ul>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-sage/5 to-evergreen/5 rounded-xl p-6 border border-sage/20">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Enforcement Actions</h3>
                      <p className="text-gray-700 mb-3 text-sm">Depending on severity and frequency:</p>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Content Removal</li>
                        <li>• Account Warning</li>
                        <li>• Feature Restrictions</li>
                        <li>• Account Suspension</li>
                        <li>• Account Termination</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-french-blue/5 to-primary-700/5 rounded-xl p-6 border border-french-blue/20">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Appeals Process</h3>
                      <p className="text-gray-700 mb-3 text-sm">If you believe we've made an error:</p>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Email appeals@tourpad.com with details</li>
                        <li>• Explain why action was incorrect</li>
                        <li>• We'll review and respond within 5 business days</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Building Great Experiences */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Building Great Experiences</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-sage/5 to-evergreen/5 rounded-xl p-6 border border-sage/20">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for Success</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Communicate clearly and set expectations early</li>
                      <li>• Be flexible - embrace the unique aspects</li>
                      <li>• Show appreciation to all participants</li>
                      <li>• Share experiences to help others discover music</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-french-blue/5 to-primary-700/5 rounded-xl p-6 border border-french-blue/20">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Supporting Artists</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Buy merchandise and music when possible</li>
                      <li>• Share concerts on social media with tags</li>
                      <li>• Leave honest, helpful reviews</li>
                      <li>• Respect IP - don't record without permission</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-gradient-to-br from-evergreen/5 to-neutral-50 rounded-xl p-8 border border-evergreen/20 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions and Support</h2>
                <p className="text-gray-700 mb-6">
                  These guidelines evolve as our community grows. For questions about specific situations or to suggest improvements, contact us at:
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm text-gray-600 mb-6">
                  <span>Email: <a href="mailto:community@tourpad.com" className="text-french-blue hover:text-primary-700 underline">community@tourpad.com</a></span>
                  <span className="hidden sm:inline">•</span>
                  <span>Support: <a href="mailto:support@tourpad.com" className="text-french-blue hover:text-primary-700 underline">support@tourpad.com</a></span>
                </div>
                <div className="inline-flex items-center px-6 py-3 bg-sage/10 rounded-full text-sm text-gray-600">
                  By using TourPad, you agree to follow these Community Guidelines and help us maintain a positive, safe environment for everyone.
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
            Ready to Be Part of Our Community?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of artists, hosts, and fans who are building something beautiful together through music.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <Link href="/register">
              <Button size="lg" className="px-8 py-4 bg-sage hover:bg-secondary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                Join Our Community
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="px-8 py-4 border-evergreen text-evergreen hover:bg-evergreen hover:text-white transition-all duration-300">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}