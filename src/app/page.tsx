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
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{background: 'linear-gradient(to bottom right, #658371, #8BB097, #A1CCAD)'}}>
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 z-10">
          <div className="text-center">
            {/* Enhanced headline with dramatic animation */}
            <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 leading-tight">
                Where Music
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary-200 via-secondary-100 to-secondary-200 animate-pulse">
                  Feels Like Home
                </span>
              </h1>
            </div>
            
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <p className="text-xl sm:text-2xl text-white/90 max-w-4xl mx-auto mb-12 leading-relaxed">
                Connect touring artists with passionate hosts for unforgettable intimate concerts.
                <span className="block mt-2 text-secondary-100">
                  Building community, one show at a time.
                </span>
              </p>
            </div>

            {/* Enhanced search bar with backdrop blur */}
            <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl p-3 flex flex-col sm:flex-row gap-3 mb-12 shadow-2xl border border-white/20">
                <div className="flex-1 flex items-center px-4">
                  <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Search by city, artist, or venue..."
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-lg bg-transparent"
                  />
                </div>
                <Button size="lg" className="px-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Enhanced CTA Buttons with dramatic hover effects */}
            <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/register?type=host">
                  <Button size="lg" variant="secondary" className="px-10 py-4 text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group">
                    <HomeIcon className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                    Become a Host
                    <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                  </Button>
                </Link>
                <Link href="/register?type=artist">
                  <Button size="lg" variant="outline" className="px-10 py-4 text-lg bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-900 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group backdrop-blur-sm">
                    <MusicalNoteIcon className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                    Join as Artist
                    <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Floating musical elements */}
            <div className="absolute top-20 left-10 animate-float">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <MusicalNoteIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="absolute bottom-32 right-16 animate-float" style={{ animationDelay: '1s' }}>
              <div className="w-16 h-16 bg-yellow-300/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <HomeIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute top-1/3 right-10 animate-float" style={{ animationDelay: '2s' }}>
              <div className="w-12 h-12 bg-purple-400/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <StarIcon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 bg-gradient-to-b from-neutral-50 to-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Musicians & Hosts Nationwide
            </h2>
            <p className="text-xl text-gray-600">Real numbers from our growing community</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {featuredStats.map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 group-hover:bg-white group-hover:shadow-xl transition-all duration-300 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-secondary-600 to-secondary-300 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                </div>
                <div className="text-4xl font-bold text-neutral-900 mb-2 group-hover:scale-110 transition-transform duration-300 group-hover:text-primary-500">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced How It Works */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-50/50 to-secondary-100/30"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800 rounded-full text-sm font-medium mb-4">
              Simple Process
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Three simple steps to create meaningful musical connections in your community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {howItWorksSteps.map((step, index) => (
              <div key={step.title} className="group relative">
                {/* Connecting line */}
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-12 h-0.5 bg-gradient-to-r from-gray-300 to-transparent transform translate-x-6"></div>
                )}
                
                <Card className="text-center hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-500 group border-0 shadow-lg bg-white/80 backdrop-blur-sm relative overflow-hidden">
                  {/* Number badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-125 transition-transform duration-300">
                    {index + 1}
                  </div>
                  
                  <CardContent className="p-10">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${
                      index === 0 ? 'from-blue-500 to-purple-600' :
                      index === 1 ? 'from-purple-500 to-pink-600' :
                      'from-pink-500 to-red-600'
                    } text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                      <step.icon className="w-10 h-10" />
                    </div>
                    
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                      {step.description}
                    </p>
                    <Button variant="outline" size="sm" className="group-hover:shadow-lg transform group-hover:scale-105 transition-all duration-300">
                      {step.cta}
                      <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-secondary-600 to-secondary-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-secondary-200/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of musicians and hosts creating unforgettable experiences together.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register?type=host">
              <Button size="lg" variant="secondary" className="px-12 py-4 text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group">
                <HomeIcon className="w-6 h-6 mr-3" />
                Host a Concert
                <span className="ml-3 transition-transform group-hover:translate-x-1">→</span>
              </Button>
            </Link>
            <Link href="/register?type=artist">
              <Button size="lg" variant="outline" className="px-12 py-4 text-lg border-white/30 text-white hover:bg-white hover:text-purple-600 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group backdrop-blur-sm">
                <MusicalNoteIcon className="w-6 h-6 mr-3" />
                Perform at Shows
                <span className="ml-3 transition-transform group-hover:translate-x-1">→</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}