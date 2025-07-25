'use client';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, CreditCard, Calendar, AlertTriangle, CheckCircle, X, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-mist">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-evergreen/5 to-sage/5 border-b border-neutral-100">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-evergreen/10 rounded-full blur-3xl"></div>
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
              <RefreshCw className="w-4 h-4 mr-2" />
              Cancellation & Refund Information
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Cancellation & Refund Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Fair and transparent policies for subscriptions and cancellations. Clear guidelines that respect both our community and real-world concert planning.
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
              <a href="#subscriptions" className="flex items-center p-4 rounded-xl bg-sage/5 hover:bg-sage/10 transition-colors group">
                <CreditCard className="w-5 h-5 text-sage mr-3" />
                <span className="text-gray-700 group-hover:text-gray-900 text-sm">Subscriptions</span>
              </a>
              <a href="#concerts" className="flex items-center p-4 rounded-xl bg-french-blue/5 hover:bg-french-blue/10 transition-colors group">
                <Calendar className="w-5 h-5 text-french-blue mr-3" />
                <span className="text-gray-700 group-hover:text-gray-900 text-sm">Concert Cancellations</span>
              </a>
              <a href="#platform-refunds" className="flex items-center p-4 rounded-xl bg-evergreen/5 hover:bg-evergreen/10 transition-colors group">
                <DollarSign className="w-5 h-5 text-evergreen mr-3" />
                <span className="text-gray-700 group-hover:text-gray-900 text-sm">Platform Refunds</span>
              </a>
              <a href="#special-circumstances" className="flex items-center p-4 rounded-xl bg-sand/20 hover:bg-sand/30 transition-colors group">
                <AlertTriangle className="w-5 h-5 text-neutral-700 mr-3" />
                <span className="text-gray-700 group-hover:text-gray-900 text-sm">Special Cases</span>
              </a>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100">
            <div className="p-8 sm:p-12">
              
              {/* Overview */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-sage to-evergreen rounded-lg flex items-center justify-center mr-3">
                    <RefreshCw className="w-4 h-4 text-white" />
                  </div>
                  Overview
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  This policy covers cancellations and refunds for TourPad subscriptions and services. Since house concerts involve real people making plans, we encourage clear communication and early notice when changes are needed.
                </p>
              </div>

              {/* Subscription Cancellations & Refunds */}
              <div id="subscriptions" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-french-blue to-sage rounded-lg flex items-center justify-center mr-3">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  Subscription Cancellations & Refunds
                </h2>
                
                <div className="space-y-6">
                  {/* Monthly vs Annual */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-sage/5 to-evergreen/5 rounded-xl p-6 border border-sage/20">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <Calendar className="w-5 h-5 text-sage mr-2" />
                        Monthly Subscriptions
                      </h3>
                      <ul className="space-y-3 text-gray-700 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-sage mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <strong>Cancellation:</strong> Cancel anytime from your account settings
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Clock className="w-4 h-4 text-sage mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <strong>Effective Date:</strong> Cancellation takes effect at the end of your current billing period
                          </div>
                        </li>
                        <li className="flex items-start">
                          <DollarSign className="w-4 h-4 text-sage mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <strong>Refunds:</strong> No refunds for partial months, but you keep access until the period ends
                          </div>
                        </li>
                        <li className="flex items-start">
                          <RefreshCw className="w-4 h-4 text-sage mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <strong>Reactivation:</strong> You can reactivate anytime before your access expires
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-french-blue/5 to-primary-700/5 rounded-xl p-6 border border-french-blue/20">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <Calendar className="w-5 h-5 text-french-blue mr-2" />
                        Annual Subscriptions
                      </h3>
                      <ul className="space-y-3 text-gray-700 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-french-blue mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <strong>Within 30 Days:</strong> Full refund if you cancel within 30 days of purchase
                          </div>
                        </li>
                        <li className="flex items-start">
                          <X className="w-4 h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <strong>After 30 Days:</strong> No refund, but service continues until the end of your annual period
                          </div>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <strong>Exceptional Circumstances:</strong> We may offer prorated refunds for documented emergencies or platform issues
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Processing Time */}
                  <div className="bg-gradient-to-br from-evergreen/5 to-neutral-50 rounded-xl p-6 border border-evergreen/20">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Time</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Refunds are processed within 5-7 business days</li>
                      <li>• Refunds appear on your original payment method</li>
                      <li>• Contact support@tourpad.com if you don't see your refund after 10 business days</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Concert Cancellations */}
              <div id="concerts" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-evergreen to-neutral-800 rounded-lg flex items-center justify-center mr-3">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  Concert Cancellations
                </h2>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200 mb-6">
                  <p className="text-yellow-800 text-sm">
                    <strong>Note:</strong> TourPad facilitates connections but doesn't directly handle concert bookings. However, we encourage these practices for a healthy community.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-6">Recommended Practices</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-french-blue/5 to-primary-700/5 rounded-xl p-6 border border-french-blue/20">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">For Artists</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Advance Notice</h5>
                        <ul className="space-y-1 text-gray-700 text-sm">
                          <li>• <strong>7+ days notice:</strong> Generally acceptable for most situations</li>
                          <li>• <strong>24-48 hours notice:</strong> Only for emergencies or serious circumstances</li>
                          <li>• <strong>Same-day cancellation:</strong> Should be limited to true emergencies</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Communication</h5>
                        <ul className="space-y-1 text-gray-700 text-sm">
                          <li>• Contact the host directly through TourPad messaging</li>
                          <li>• Explain the situation clearly and apologetically</li>
                          <li>• Offer to reschedule if possible</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-sage/5 to-evergreen/5 rounded-xl p-6 border border-sage/20">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">For Hosts</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Flexibility</h5>
                        <ul className="space-y-1 text-gray-700 text-sm">
                          <li>• Understand that touring involves uncertainties</li>
                          <li>• Consider rescheduling when possible</li>
                          <li>• Communicate any limitations or conflicts early</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Notice to Fans</h5>
                        <ul className="space-y-1 text-gray-700 text-sm">
                          <li>• Inform RSVPed fans as soon as possible</li>
                          <li>• Use TourPad's messaging system to reach attendees</li>
                          <li>• Provide clear information about cancellation or rescheduling</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Platform-Related Refunds */}
              <div id="platform-refunds" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-sand/60 to-neutral-400 rounded-lg flex items-center justify-center mr-3">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  Platform-Related Refunds
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-sage/5 to-evergreen/5 rounded-xl p-6 border border-sage/20">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 text-sage mr-2" />
                      When We Provide Refunds
                    </h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• <strong>Platform Outages:</strong> Extended downtime that prevents service use</li>
                      <li>• <strong>Billing Errors:</strong> Incorrect charges or technical payment issues</li>
                      <li>• <strong>Account Problems:</strong> Issues caused by platform bugs or errors</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                    <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                      <X className="w-5 h-5 text-red-600 mr-2" />
                      When We Don't Provide Refunds
                    </h3>
                    <ul className="space-y-2 text-red-700 text-sm">
                      <li>• <strong>Change of Mind:</strong> Deciding you don't want to use the service</li>
                      <li>• <strong>Concert Cancellations:</strong> Issues between users (artists, hosts, fans)</li>
                      <li>• <strong>Unused Services:</strong> Not using your subscription during the billing period</li>
                      <li>• <strong>Violation Suspensions:</strong> Account restrictions due to guideline violations</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Special Circumstances */}
              <div id="special-circumstances" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-evergreen to-neutral-800 rounded-lg flex items-center justify-center mr-3">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  Special Circumstances
                </h2>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-french-blue/5 to-primary-700/5 rounded-xl p-6 border border-french-blue/20">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergencies and Hardships</h3>
                    <p className="text-gray-700 mb-4 text-sm">
                      We understand that life happens. For documented emergencies, serious illness, or genuine hardship situations, contact our support team. We'll review each case individually and may offer:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Subscription pauses</li>
                        <li>• Partial refunds</li>
                      </ul>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Extended access periods</li>
                        <li>• Payment plan adjustments</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-sage/5 to-evergreen/5 rounded-xl p-6 border border-sage/20">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Changes</h3>
                    <p className="text-gray-700 text-sm">
                      If we make significant changes to TourPad that substantially affect your ability to use the service, we may offer refunds for unused portions of annual subscriptions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dispute Resolution */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Dispute Resolution</h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-sage/5 to-evergreen/5 rounded-xl p-6 border border-sage/20 text-center">
                    <div className="w-12 h-12 bg-sage rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Support</h3>
                    <p className="text-gray-600 text-sm">Before disputing charges with your bank, please contact us at support@tourpad.com. Many issues can be resolved quickly.</p>
                  </div>

                  <div className="bg-gradient-to-br from-french-blue/5 to-primary-700/5 rounded-xl p-6 border border-french-blue/20 text-center">
                    <div className="w-12 h-12 bg-french-blue rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Review Period</h3>
                    <p className="text-gray-600 text-sm">We'll investigate your request within 5 business days and respond with our decision and reasoning.</p>
                  </div>

                  <div className="bg-gradient-to-br from-evergreen/5 to-neutral-50 rounded-xl p-6 border border-evergreen/20 text-center">
                    <div className="w-12 h-12 bg-evergreen rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Appeals</h3>
                    <p className="text-gray-600 text-sm">If you disagree with our decision, you can appeal by providing additional information or documentation.</p>
                  </div>
                </div>
              </div>

              {/* Account Deletion */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Deletion</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                    <h3 className="text-lg font-semibold text-red-800 mb-4">Your Data</h3>
                    <ul className="space-y-2 text-red-700 text-sm">
                      <li>• Account deletion removes your personal information</li>
                      <li>• You lose access to messages, booking history, and reviews</li>
                      <li>• Deletion is permanent and cannot be undone</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-4">Financial Implications</h3>
                    <ul className="space-y-2 text-yellow-700 text-sm">
                      <li>• No refunds for remaining subscription time after account deletion</li>
                      <li>• Outstanding payments must be resolved before deletion</li>
                      <li>• You can download your data before deleting your account</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-gradient-to-br from-evergreen/5 to-neutral-50 rounded-xl p-8 border border-evergreen/20 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Need Help With Cancellations or Refunds?</h2>
                <p className="text-gray-700 mb-6">
                  For cancellation requests, refund questions, or policy clarification:
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm text-gray-600 mb-6">
                  <span>Email: <a href="mailto:billing@tourpad.com" className="text-french-blue hover:text-primary-700 underline">billing@tourpad.com</a></span>
                  <span className="hidden sm:inline">•</span>
                  <span>Support: <a href="mailto:support@tourpad.com" className="text-french-blue hover:text-primary-700 underline">support@tourpad.com</a></span>
                </div>
                <div className="inline-flex items-center px-6 py-3 bg-sage/10 rounded-full text-sm text-gray-600">
                  This policy is designed to be fair to both TourPad and our community members while encouraging clear communication.
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
            Ready to Join With Confidence?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Our fair policies protect both you and our community. Start your TourPad journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <Link href="/register">
              <Button size="lg" className="px-8 py-4 bg-sage hover:bg-secondary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
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