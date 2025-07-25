'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate form submission
    try {
      // In production, this would send to your email service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, just log the submission
      console.log('Form submitted:', {
        ...formData,
        to: 'tourpad.music@gmail.com'
      });
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset status after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
              <MessageSquare className="w-4 h-4 mr-2" />
              Get in Touch
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're always here to answer questions about the platform, help you get started, or discuss how TourPad can work for you. Never hesitate to reach out—we love hearing from our community.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Let's Connect</h2>
                <p className="text-gray-600 mb-8">
                  Whether you're an artist planning your next tour, a host ready to open your home, or a fan looking for amazing shows, we're here to help.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gradient-to-br from-french-blue/10 to-sage/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-french-blue" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900">Email Us</h3>
                      <p className="text-gray-600 text-sm mt-1">tourpad.music@gmail.com</p>
                      <p className="text-gray-500 text-xs mt-2">We respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-neutral-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Common Topics</h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-sage rounded-full mr-3"></div>
                        Getting started as an artist
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-french-blue rounded-full mr-3"></div>
                        Hosting your first concert
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-evergreen rounded-full mr-3"></div>
                        Account and billing questions
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-sand rounded-full mr-3"></div>
                        Partnership opportunities
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-french-blue/50 focus:border-french-blue transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-french-blue/50 focus:border-french-blue transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-french-blue/50 focus:border-french-blue transition-colors"
                    >
                      <option value="">Select a topic</option>
                      <option value="artist-question">Artist Question</option>
                      <option value="host-question">Host Question</option>
                      <option value="fan-question">Fan Question</option>
                      <option value="technical-support">Technical Support</option>
                      <option value="billing">Billing & Subscriptions</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="press">Press Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-french-blue/50 focus:border-french-blue transition-colors resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  {/* Status Messages */}
                  {status === 'success' && (
                    <div className="flex items-center p-4 bg-sage/10 border border-sage/20 rounded-xl text-sage">
                      <CheckCircle className="w-5 h-5 mr-3" />
                      <p className="text-sm font-medium">Thank you! We'll get back to you within 24 hours.</p>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                      <AlertCircle className="w-5 h-5 mr-3" />
                      <p className="text-sm font-medium">Something went wrong. Please try again or email us directly.</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-4 bg-gradient-to-r from-french-blue to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 bg-gradient-to-br from-sage/5 to-evergreen/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Looking for Quick Answers?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Check out our Help Center for frequently asked questions and detailed guides.
          </p>
          <Link href="/help">
            <Button variant="outline" size="lg" className="px-8 py-4 border-evergreen text-evergreen hover:bg-evergreen hover:text-white transition-all duration-300">
              Visit Help Center
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}