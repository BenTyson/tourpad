'use client';
import Link from 'next/link';
import { ArrowLeft, Cookie, Settings, Shield, BarChart3, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-mist">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-sand/10 to-mist/20 border-b border-neutral-100">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sand/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-french-blue/10 rounded-full blur-3xl"></div>
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
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full text-evergreen border border-sand/30 mb-8">
              <Cookie className="w-4 h-4 mr-2" />
              Cookie Information
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transparent information about how we use cookies to improve your TourPad experience while respecting your privacy.
            </p>
            <div className="mt-8 inline-flex items-center px-4 py-2 bg-sand/10 rounded-full text-sm text-gray-600">
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
              <a href="#what-are-cookies" className="flex items-center p-4 rounded-xl bg-sand/20 hover:bg-sand/30 transition-colors group">
                <Cookie className="w-5 h-5 text-neutral-700 mr-3" />
                <span className="text-gray-700 group-hover:text-gray-900 text-sm">What Are Cookies</span>
              </a>
              <a href="#how-we-use" className="flex items-center p-4 rounded-xl bg-french-blue/5 hover:bg-french-blue/10 transition-colors group">
                <BarChart3 className="w-5 h-5 text-french-blue mr-3" />
                <span className="text-gray-700 group-hover:text-gray-900 text-sm">How We Use Them</span>
              </a>
              <a href="#managing" className="flex items-center p-4 rounded-xl bg-sage/5 hover:bg-sage/10 transition-colors group">
                <Settings className="w-5 h-5 text-sage mr-3" />
                <span className="text-gray-700 group-hover:text-gray-900 text-sm">Managing Cookies</span>
              </a>
              <a href="#retention" className="flex items-center p-4 rounded-xl bg-evergreen/5 hover:bg-evergreen/10 transition-colors group">
                <Clock className="w-5 h-5 text-evergreen mr-3" />
                <span className="text-gray-700 group-hover:text-gray-900 text-sm">Cookie Retention</span>
              </a>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100">
            <div className="p-8 sm:p-12">
              
              {/* What Are Cookies */}
              <div id="what-are-cookies" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-sand/60 to-neutral-400 rounded-lg flex items-center justify-center mr-3">
                    <Cookie className="w-4 h-4 text-white" />
                  </div>
                  What Are Cookies?
                </h2>
                <div className="bg-gradient-to-br from-sand/10 to-mist/20 rounded-xl p-6 border border-sand/30">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Cookies are small text files that websites store on your device to remember information about your visit. They help make your experience on TourPad better and more personalized.
                  </p>
                </div>
              </div>

              {/* How We Use Cookies */}
              <div id="how-we-use" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-french-blue to-sage rounded-lg flex items-center justify-center mr-3">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  How We Use Cookies
                </h2>
                
                <div className="space-y-6">
                  {/* Essential Cookies */}
                  <div className="bg-gradient-to-br from-evergreen/5 to-neutral-50 rounded-xl p-6 border border-evergreen/20">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Shield className="w-5 h-5 text-evergreen mr-2" />
                      Essential Cookies
                    </h3>
                    <p className="text-gray-700 mb-4">These cookies are necessary for TourPad to work properly:</p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-evergreen rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>Login Authentication:</strong> Keep you logged in as you navigate the platform
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-evergreen rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>Security:</strong> Protect against spam and abuse
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-evergreen rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>Form Data:</strong> Remember information you've entered in forms
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="bg-gradient-to-br from-french-blue/5 to-primary-700/5 rounded-xl p-6 border border-french-blue/20">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <BarChart3 className="w-5 h-5 text-french-blue mr-2" />
                      Analytics Cookies
                    </h3>
                    <p className="text-gray-700 mb-4">We use Google Analytics to understand how people use TourPad:</p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-french-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>Usage Patterns:</strong> Which features are most popular
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-french-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>Performance:</strong> How fast pages load and where improvements are needed
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-french-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>User Behavior:</strong> How people navigate through the platform (no personal identification)
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Personalization Cookies */}
                  <div className="bg-gradient-to-br from-sage/5 to-evergreen/5 rounded-xl p-6 border border-sage/20">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 text-sage mr-2" />
                      Personalization Cookies
                    </h3>
                    <p className="text-gray-700 mb-4">These make your TourPad experience more tailored:</p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-sage rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>Preferences:</strong> Remember your settings and preferences
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-sage rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>Search History:</strong> Help improve search results based on your interests
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-sage rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>Recommendations:</strong> Suggest relevant artists, venues, or concerts
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Managing Cookies */}
              <div id="managing" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-sage to-evergreen rounded-lg flex items-center justify-center mr-3">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                  Managing Your Cookie Preferences
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-french-blue/5 to-primary-700/5 rounded-xl p-6 border border-french-blue/20">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Browser Settings</h3>
                    <p className="text-gray-700 mb-4 text-sm">You can control cookies through your browser settings:</p>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• <strong>Block All Cookies:</strong> This may affect how TourPad works</li>
                      <li>• <strong>Block Third-Party Cookies:</strong> This will block Google Analytics but won't affect core functionality</li>
                      <li>• <strong>Delete Cookies:</strong> Clear existing cookies (you'll need to log in again)</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-sage/5 to-evergreen/5 rounded-xl p-6 border border-sage/20">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Cookie Preferences</h3>
                    <p className="text-gray-700 text-sm">
                      When you first visit TourPad, we'll ask for your cookie preferences. You can change these anytime in your account settings.
                    </p>
                    <div className="mt-4">
                      <Button size="sm" className="bg-sage hover:bg-secondary-700 text-white">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Preferences
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Third-Party Cookies */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Third-Party Cookies</h2>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Google Analytics</h3>
                    <p className="text-gray-700 text-sm">
                      Google Analytics uses cookies to help us understand website usage. Google's privacy policy governs how they handle this data. You can opt out of Google Analytics tracking using Google's opt-out browser add-on.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-evergreen/5 to-neutral-50 rounded-xl p-6 border border-evergreen/20">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Stripe</h3>
                    <p className="text-gray-700 text-sm">
                      Our payment processor, Stripe, may use cookies for fraud prevention and payment processing. This is essential for secure transactions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cookie Retention */}
              <div id="retention" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-sand/60 to-neutral-400 rounded-lg flex items-center justify-center mr-3">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  Cookie Retention
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-french-blue/5 to-primary-700/5 rounded-xl p-6 border border-french-blue/20 text-center">
                    <div className="w-12 h-12 bg-french-blue rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Session Cookies</h3>
                    <p className="text-gray-600 text-sm">Deleted when you close your browser</p>
                  </div>

                  <div className="bg-gradient-to-br from-sage/5 to-evergreen/5 rounded-xl p-6 border border-sage/20 text-center">
                    <div className="w-12 h-12 bg-sage rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Persistent Cookies</h3>
                    <p className="text-gray-600 text-sm">Remain on your device for a set period (usually up to 2 years)</p>
                  </div>

                  <div className="bg-gradient-to-br from-sand/20 to-mist/50 rounded-xl p-6 border border-sand/40 text-center">
                    <div className="w-12 h-12 bg-neutral-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Analytics Cookies</h3>
                    <p className="text-gray-600 text-sm">Typically expire after 2 years</p>
                  </div>
                </div>
              </div>

              {/* Updates */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Updates to This Policy</h2>
                <div className="bg-gradient-to-br from-mist/50 to-neutral-50 rounded-xl p-6 border border-neutral-100">
                  <p className="text-gray-700">
                    We may update this Cookie Policy as we add new features or change how we use cookies. We'll notify you of any significant changes.
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-gradient-to-br from-evergreen/5 to-neutral-50 rounded-xl p-8 border border-evergreen/20 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions About Cookies?</h2>
                <p className="text-gray-700 mb-6">
                  Contact us at <a href="mailto:support@tourpad.com" className="text-french-blue hover:text-primary-700 underline">support@tourpad.com</a> or TourPad, Denver, CO
                </p>
                <div className="inline-flex items-center px-6 py-3 bg-sand/10 rounded-full text-sm text-gray-600">
                  By continuing to use TourPad, you agree to our use of cookies as described in this policy.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-br from-sand/10 to-mist/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Comfortable With Our Cookie Use?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the TourPad community and start connecting with amazing artists, hosts, and music lovers.
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