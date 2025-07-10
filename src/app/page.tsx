'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon,
  HomeIcon,
  MusicalNoteIcon,
  UserGroupIcon,
  StarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const howItWorksSteps = [
    {
      icon: UserGroupIcon,
      title: 'Join the Community',
      description: 'Artists apply and get approved. Hosts create their venue profiles.',
      cta: 'Apply Now'
    },
    {
      icon: MagnifyingGlassIcon,
      title: 'Discover & Connect',
      description: 'Browse verified artists or welcoming host venues in your area.',
      cta: 'Start Browsing'
    },
    {
      icon: CalendarIcon,
      title: 'Book & Perform',
      description: 'Coordinate dates, share event details, and create magical intimate concerts.',
      cta: 'Book a Show'
    }
  ];

  const featuredStats = [
    { label: 'Active Hosts', value: '500+' },
    { label: 'Verified Artists', value: '200+' },
    { label: 'Shows Booked', value: '1,000+' },
    { label: 'Cities', value: '50+' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
                Where Music
                <span className="block text-yellow-300">Feels Like Home</span>
              </h1>
            </div>
            
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                Connect touring artists with passionate hosts for unforgettable intimate concerts.
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white rounded-lg p-2 flex flex-col sm:flex-row gap-2 mb-8">
              <div className="flex-1 flex items-center px-4">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="City, artist, or genre..."
                  className="flex-1 outline-none text-gray-700"
                />
              </div>
              <Button size="lg" className="px-8">
                Search
              </Button>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?type=host">
                <Button size="lg" variant="secondary" className="px-8">
                  <HomeIcon className="w-5 h-5 mr-2" />
                  Become a Host
                </Button>
              </Link>
              <Link href="/register?type=artist">
                <Button size="lg" variant="outline" className="px-8 bg-white/10 border-white text-white hover:bg-white hover:text-gray-900">
                  <MusicalNoteIcon className="w-5 h-5 mr-2" />
                  Join as Artist
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {featuredStats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple steps to create meaningful musical connections in your community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, index) => (
              <Card key={step.title} className="text-center">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {step.description}
                  </p>
                  <Button variant="outline" size="sm">
                    {step.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join our community of music lovers and start creating unforgettable experiences today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?type=host">
              <Button size="lg" variant="secondary" className="px-8">
                Host a Concert
              </Button>
            </Link>
            <Link href="/register?type=artist">
              <Button size="lg" variant="outline" className="px-8 border-white text-white hover:bg-white hover:text-blue-600">
                Perform at Shows
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}