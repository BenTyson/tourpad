'use client';
import Link from 'next/link';
import { ArrowLeft, Shield, User, Share, Lock, Eye, Download, Trash2, Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-mist">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-french-blue/5 to-evergreen/5 border-b border-neutral-100">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-french-blue/10 rounded-full blur-3xl"></div>
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
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full text-evergreen border border-french-blue/20 mb-8">
              <Shield className="w-4 h-4 mr-2" />
              Privacy & Data Protection
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your privacy matters to us. Learn how we collect, use, and protect your information while connecting the music community.
            </p>
            <div className="mt-8 inline-flex items-center px-4 py-2 bg-french-blue/10 rounded-full text-sm text-gray-600">
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
              <a href="#information-collect" className="flex items-center p-4 rounded-xl bg-french-blue/5 hover:bg-french-blue/10 transition-colors group">
                <User className="w-5 h-5 text-french-blue mr-3" />
                <span className="text-gray-700 group-hover:text-gray-900 text-sm">Information We Collect</span>
              </a>
              <a href="#how-we-use" className="flex items-center p-4 rounded-xl bg-sage/5 hover:bg-sage/10 transition-colors group">
                <Eye className="w-5 h-5 text-sage mr-3" />
                <span className="text-gray-700 group-hover:text-gray-900 text-sm">How We Use It</span>
              </a>
              <a href="#information-sharing" className="flex items-center p-4 rounded-xl bg-evergreen/5 hover:bg-evergreen/10 transition-colors group">
                <Share className="w-5 h-5 text-evergreen mr-3" />
                <span className="text-gray-700 group-hover:text-gray-900 text-sm">Information Sharing</span>
              </a>
              <a href="#your-rights" className="flex items-center p-4 rounded-xl bg-sand/20 hover:bg-sand/30 transition-colors group">
                <Lock className="w-5 h-5 text-neutral-700 mr-3" />
                <span className="text-gray-700 group-hover:text-gray-900 text-sm">Your Rights</span>
              </a>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100">
            <div className="p-8 sm:p-12">
              
              {/* Welcome */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-french-blue to-sage rounded-lg flex items-center justify-center mr-3">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  Welcome to TourPad
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  TourPad connects touring musicians with house concert hosts and music fans across the United States. We take your privacy seriously and want you to understand how we collect, use, and protect your information.
                </p>
              </div>

              {/* Information We Collect */}
              <div id="information-collect" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-sage to-evergreen rounded-lg flex items-center justify-center mr-3">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  Information We Collect
                </h2>
                
                <div className="space-y-6">
                  {/* Information You Provide */}
                  <div className="bg-gradient-to-br from-french-blue/5 to-primary-700/5 rounded-xl p-6 border border-french-blue/20">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Information You Provide</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• <strong>Profile Information:</strong> Name, email address, phone number, profile photos, and bio</li>
                      <li>• <strong>For Hosts:</strong> Home venue photos, venue capacity, and general location (specific address is only shared when you book a show)</li>
                      <li>• <strong>For Artists:</strong> Press photos, band member photos, music samples, and tour information</li>
                      <li>• <strong>For Fans:</strong> Profile photos and concert photos you choose to share</li>
                      <li>• <strong>Communications:</strong> Messages you send through our platform (stored for moderation and dispute resolution)</li>
                      <li>• <strong>Reviews:</strong> Ratings and reviews you leave for artists, hosts, or concerts</li>
                    </ul>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-sage/5 to-evergreen/5 rounded-xl p-6 border border-sage/20">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Information We Collect Automatically</h3>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• <strong>Usage Data:</strong> How you use our platform, pages visited, features used</li>
                        <li>• <strong>Device Information:</strong> Browser type, operating system, IP address</li>
                        <li>• <strong>Cookies:</strong> See our <Link href="/cookies" className="text-sage hover:text-secondary-700 underline">Cookie Policy</Link> for details</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-sand/20 to-mist/50 rounded-xl p-6 border border-sand/40">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Information from Third Parties</h3>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• <strong>Payment Information:</strong> We use Stripe for all payments. We don't store your payment details</li>
                        <li>• <strong>Analytics:</strong> We use Google Analytics to understand how people use our platform</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* How We Use Your Information */}
              <div id="how-we-use" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-evergreen to-neutral-800 rounded-lg flex items-center justify-center mr-3">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  How We Use Your Information
                </h2>

                <div className="bg-gradient-to-br from-evergreen/5 to-neutral-50 rounded-xl p-6 border border-evergreen/20">
                  <p className="text-gray-700 mb-4">We use your information to:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Connect artists with hosts and help fans discover concerts</li>
                      <li>• Process payments through Stripe</li>
                      <li>• Send you notifications about bookings, messages, and platform updates</li>
                      <li>• Improve our platform and develop new features</li>
                    </ul>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Provide customer support and resolve disputes</li>
                      <li>• Ensure platform safety through content moderation</li>
                      <li>• Comply with legal requirements</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Information Sharing */}
              <div id="information-sharing" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-french-blue to-sage rounded-lg flex items-center justify-center mr-3">
                    <Share className="w-4 h-4 text-white" />
                  </div>
                  Information Sharing
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-sage/5 to-evergreen/5 rounded-xl p-6 border border-sage/20">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">When We Share Your Information</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• <strong>With Other Users:</strong> Profile information is visible to other users to facilitate connections</li>
                      <li>• <strong>Address Sharing:</strong> Host addresses are only shared with booked artists and fans who RSVP to confirmed shows</li>
                      <li>• <strong>Service Providers:</strong> We share data with Stripe (payments) and Google Analytics (usage insights)</li>
                      <li>• <strong>Legal Requirements:</strong> We may disclose information if required by law or to protect safety</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                    <h3 className="text-lg font-semibold text-red-800 mb-4">What We Don't Do</h3>
                    <ul className="space-y-2 text-red-700 text-sm">
                      <li>• We don't sell your personal information to third parties</li>
                      <li>• We don't share your private messages except for moderation purposes</li>
                      <li>• Host addresses remain private until a booking is confirmed</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Your Rights and Choices */}
              <div id="your-rights" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-sand/60 to-neutral-400 rounded-lg flex items-center justify-center mr-3">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                  Your Rights and Choices
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-french-blue/5 to-primary-700/5 rounded-xl p-6 border border-french-blue/20">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Management</h3>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-white rounded-lg border border-neutral-100">
                        <Eye className="w-5 h-5 text-french-blue mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">Access</div>
                          <div className="text-sm text-gray-600">View and edit your profile information anytime</div>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg border border-neutral-100">
                        <Trash2 className="w-5 h-5 text-red-500 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">Delete</div>
                          <div className="text-sm text-gray-600">Delete your account and all associated data</div>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg border border-neutral-100">
                        <Bell className="w-5 h-5 text-sage mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">Communication</div>
                          <div className="text-sm text-gray-600">Opt out of non-essential emails</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-sage/5 to-evergreen/5 rounded-xl p-6 border border-sage/20">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Portability</h3>
                    <div className="flex items-center p-4 bg-white rounded-lg border border-neutral-100">
                      <Download className="w-5 h-5 text-sage mr-3" />
                      <div>
                        <div className="font-medium text-gray-900 mb-2">Export Your Data</div>
                        <div className="text-sm text-gray-600 mb-3">Contact us if you want a copy of your data in a portable format.</div>
                        <Button size="sm" className="bg-sage hover:bg-secondary-700 text-white">
                          <Download className="w-4 h-4 mr-2" />
                          Request Data Export
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Security */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Security</h2>
                
                <div className="bg-gradient-to-br from-evergreen/5 to-neutral-50 rounded-xl p-6 border border-evergreen/20">
                  <p className="text-gray-700 mb-4">We protect your information through:</p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex items-center">
                        <Shield className="w-4 h-4 text-evergreen mr-2" />
                        Secure data transmission (SSL encryption)
                      </li>
                      <li className="flex items-center">
                        <Lock className="w-4 h-4 text-evergreen mr-2" />
                        Limited access to personal information by our team
                      </li>
                    </ul>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex items-center">
                        <Shield className="w-4 h-4 text-evergreen mr-2" />
                        Regular security reviews and updates
                      </li>
                      <li className="flex items-center">
                        <Lock className="w-4 h-4 text-evergreen mr-2" />
                        Secure third-party services (Stripe for payments)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Data Retention & Children's Privacy */}
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="bg-gradient-to-br from-french-blue/5 to-primary-700/5 rounded-xl p-6 border border-french-blue/20">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Retention</h3>
                  <p className="text-gray-700 text-sm">
                    We keep your information as long as your account is active. When you delete your account, we remove your personal information, though we may keep some data for legal compliance or safety purposes.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-sand/20 to-mist/50 rounded-xl p-6 border border-sand/40">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Children's Privacy</h3>
                  <p className="text-gray-700 text-sm">
                    Our platform is intended for users 13 and older. We don't knowingly collect information from children under 13. If we learn we have collected such information, we'll delete it promptly.
                  </p>
                </div>
              </div>

              {/* Updates */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Changes to This Policy</h2>
                <div className="bg-gradient-to-br from-mist/50 to-neutral-50 rounded-xl p-6 border border-neutral-100">
                  <p className="text-gray-700">
                    We may update this Privacy Policy occasionally. We'll notify you of significant changes via email or platform notification.
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-gradient-to-br from-evergreen/5 to-neutral-50 rounded-xl p-8 border border-evergreen/20 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions About Privacy?</h2>
                <p className="text-gray-700 mb-6">
                  Contact us at <a href="mailto:privacy@tourpad.com" className="text-french-blue hover:text-primary-700 underline">privacy@tourpad.com</a> or TourPad, Denver, CO
                </p>
                <div className="inline-flex items-center px-6 py-3 bg-french-blue/10 rounded-full text-sm text-gray-600">
                  This policy is effective as of January 2025 and governs the collection and use of information by TourPad.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-br from-french-blue/5 to-evergreen/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Comfortable With Our Privacy Practices?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of artists, hosts, and fans who trust TourPad to connect them safely and securely.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <Link href="/register">
              <Button size="lg" className="px-8 py-4 bg-french-blue hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started Today
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