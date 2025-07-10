'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon,
  HomeIcon,
  MusicalNoteIcon,
  UserGroupIcon,
  StarIcon,
  CalendarIcon,
  PlayIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const howItWorksSteps = [
    {
      icon: UserGroupIcon,
      title: 'Join the Community',
      description: 'Artists apply and get approved. Hosts create their venue profiles.',
      cta: 'Apply Now',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: MagnifyingGlassIcon,
      title: 'Discover & Connect',
      description: 'Browse verified artists or welcoming host venues in your area.',
      cta: 'Start Browsing',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: CalendarIcon,
      title: 'Book & Perform',
      description: 'Coordinate dates, share event details, and create magical intimate concerts.',
      cta: 'Book a Show',
      gradient: 'from-pink-500 to-red-600'
    }
  ];

  const featuredStats = [
    { label: 'Active Hosts', value: '500+', icon: HomeIcon, color: 'text-blue-600' },
    { label: 'Verified Artists', value: '200+', icon: MusicalNoteIcon, color: 'text-purple-600' },
    { label: 'Shows Booked', value: '1,000+', icon: CalendarIcon, color: 'text-green-600' },
    { label: 'Cities', value: '50+', icon: SparklesIcon, color: 'text-orange-600' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Indie Folk Artist',
      content: 'TourPad connected me with the most amazing hosts. Every show feels like performing for friends.',
      rating: 5,
      avatar: 'S'
    },
    {
      name: 'Mike & Linda Chen',
      role: 'House Concert Hosts',
      content: 'We\'ve hosted 12 shows through TourPad. The artists are professional and our community loves it.',
      rating: 5,
      avatar: 'M'
    },
    {
      name: 'Tommy Blue',
      role: 'Blues Musician',
      content: 'Best platform for booking intimate venues. The hosts are passionate about music.',
      rating: 5,
      avatar: 'T'
    }
  ];

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 z-10">
          <div className="text-center">
            {/* Main headline with staggered animation */}
            <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 leading-tight">
                Where Music
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 animate-pulse">
                  Feels Like Home
                </span>
              </h1>
            </div>
            
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <p className="text-xl sm:text-2xl text-blue-100 max-w-4xl mx-auto mb-12 leading-relaxed">
                Connect touring artists with passionate hosts for unforgettable intimate concerts. 
                <span className="block mt-2 text-yellow-200">
                  Building community, one show at a time.
                </span>
              </p>
            </div>

            {/* Animated search bar */}
            <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl p-3 flex flex-col sm:flex-row gap-3 mb-12 shadow-2xl border border-white/20">
                <div className="flex-1 flex items-center px-4">
                  <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Search by city, artist, or venue..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-lg bg-transparent"
                  />
                </div>
                <Button size="lg" className="px-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* CTA Buttons with hover effects */}
            <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/register?type=host">
                  <Button size="lg" variant="secondary" className="px-10 py-4 text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group">
                    <HomeIcon className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                    Become a Host
                    <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/register?type=artist">
                  <Button size="lg" variant="outline" className="px-10 py-4 text-lg bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-900 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group backdrop-blur-sm">
                    <MusicalNoteIcon className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                    Join as Artist
                    <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Floating elements */}
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
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Animated Stats */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative">
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
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 group-hover:bg-white group-hover:shadow-xl transition-all duration-300 mb-4 ${stat.color}`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works with enhanced animations */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-4 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-purple-800">
              Simple Process
            </Badge>
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
                
                <Card className="text-center hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-500 group border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-10">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${step.gradient} text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                      <step.icon className="w-10 h-10" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-125 transition-transform duration-300">
                      {index + 1}
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                      {step.description}
                    </p>
                    <Button variant="outline" size="sm" className="group-hover:shadow-lg transform group-hover:scale-105 transition-all duration-300">
                      {step.cta}
                      <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">
              Loved by Artists & Hosts
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Real stories from our community members
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.name} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transform hover:-translate-y-2 transition-all duration-500 group">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-100 mb-6 text-lg leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-gray-300 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of musicians and hosts creating unforgettable experiences together.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register?type=host">
              <Button size="lg" variant="secondary" className="px-12 py-4 text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group">
                <HomeIcon className="w-6 h-6 mr-3" />
                Host a Concert
                <ArrowRightIcon className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/register?type=artist">
              <Button size="lg" variant="outline" className="px-12 py-4 text-lg border-white/30 text-white hover:bg-white hover:text-purple-600 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group backdrop-blur-sm">
                <MusicalNoteIcon className="w-6 h-6 mr-3" />
                Perform at Shows
                <ArrowRightIcon className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}