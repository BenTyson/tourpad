'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Home,
  Music,
  Users,
  Star,
  Calendar,
  MapPin,
  Guitar,
  Heart,
  Coffee,
  Shield,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  UserCheck,
  Sparkles,
  Camera,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function PhotoRichHomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const heroPhotos = [
    { src: '/photos/fr_2-min.jpg', caption: 'Pure joy in every performance' },
    { src: '/photos/fr_1.jpg', caption: 'Intimate spaces, unforgettable nights' },
    { src: '/photos/fr_3-min.jpg', caption: 'Where music brings people together' }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate hero photos
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % heroPhotos.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const userTypes = [
    {
      type: 'artist',
      icon: Music,
      title: 'Artists',
      subtitle: 'Book Your Tour',
      description: 'Connect with passionate hosts who transform their spaces into intimate venues.',
      photo: '/photos/fr_5-min.jpg',
      colorClass: 'from-sage to-evergreen',
      story: 'Every living room becomes your stage. Every audience member becomes a fan.'
    },
    {
      type: 'host',
      icon: Home,
      title: 'Hosts',
      subtitle: 'Create Magic',
      description: 'Open your space and heart to incredible touring artists and music lovers.',
      photo: '/photos/fr_4.jpg',
      colorClass: 'from-french-blue to-primary-700',
      story: 'Turn any space into a concert venue. Bring your community together.'
    },
    {
      type: 'fan',
      icon: Heart,
      title: 'Fans',
      subtitle: 'Find Your Tribe',
      description: 'Discover intimate concerts where every note matters and connections are real.',
      photo: '/photos/fr_3-min.jpg',
      colorClass: 'from-sand to-secondary-600',
      story: 'Feel the music in your bones. Meet artists face-to-face.'
    }
  ];


  return (
    <div className="bg-white">
      {/* Minimal Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-mist via-white to-neutral-50">
        {/* Clean geometric background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-french-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sage/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 z-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Clean content */}
            <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {/* Logo */}
              <div className="flex justify-center mb-12">
                <Image 
                  src="/logo.png" 
                  alt="TourPad Logo" 
                  width={120} 
                  height={120}
                  className="h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 drop-shadow-lg"
                  priority
                />
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Where Music
                <span className="block text-french-blue">
                  Feels Like Home
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connect artists, hosts, and fans for intimate house concerts 
                that create lasting memories and genuine community.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/register">
                  <Button size="lg" className="px-8 py-4 bg-french-blue hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/artists">
                  <Button variant="outline" size="lg" className="px-8 py-4 border-sage text-sage hover:bg-sage hover:text-white transition-all duration-300">
                    See Community
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right side - Featured photo */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/photos/fr_2-min.jpg"
                  alt="House concert community"
                  width={600}
                  height={400}
                  className="w-full h-[400px] object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-french-blue/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Turning Homes Into Venues Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Full Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/photos/fr_4.jpg"
            alt="House concert community"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-french-blue/85 via-primary-600/80 to-primary-700/85"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">            
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8 leading-tight">
              Turning Homes Into Venues,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sand to-mist">
                Nights Into Memories
              </span>
            </h2>
          </div>

          {/* Story cards in clean layout */}
          <div className="space-y-12">
            {/* Card 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              <div className="lg:w-2/3 order-2 lg:order-1">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
                  <p className="text-xl text-gray-700 leading-relaxed">
                    Our goal is simple: to make it easier for musicians, hosts, and fans to come together and bring live music into homes and creative spaces everywhere. Whether you're an artist looking for fresh audiences, a host eager to share unforgettable nights, or a fan seeking intimate musical experiences, we're here to help you make it happen.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/3 order-1 lg:order-2">
                <div className="w-24 h-24 bg-gradient-to-br from-french-blue/30 to-primary-700/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <Users className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              <div className="lg:w-1/3 order-1">
                <div className="w-24 h-24 bg-gradient-to-br from-sand/30 to-mist/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <Heart className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="lg:w-2/3 order-2">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
                  <p className="text-xl text-gray-700 leading-relaxed">
                    House concerts break down barriers between performers and listeners. These aren't your average gigs—they're cozy, up-close shows where every note matters. We believe every living room, backyard, and community space has the potential to become a stage.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 - Featured Quote */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-2xl">
                <blockquote className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-6">
                  "Let's turn more homes into venues and more nights into something worth remembering."
                </blockquote>
                <div className="flex items-center justify-center space-x-2">
                  <Star className="w-6 h-6 text-sand" />
                  <Star className="w-6 h-6 text-sand" />
                  <Star className="w-6 h-6 text-sand" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Are House Concerts Section */}
      <section className="py-32 bg-gradient-to-b from-white to-mist relative overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-french-blue/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-60 h-60 bg-sage/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-sage/10 text-evergreen rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              The Magic of House Concerts
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              What If Your Living Room Could 
              <span className="block text-french-blue">
                Change Someone's Life?
              </span>
            </h2>
          </div>

          {/* Main content grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Left side - Story */}
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-xl text-gray-700 leading-relaxed">
                  Imagine this: 25 people gathered in a cozy living room, sitting cross-legged on the floor, 
                  leaning against couches, eyes locked on a musician just 5 feet away. No sound system needed. 
                  No stage barrier. Just pure, raw connection.
                </p>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  That's a house concert. And it's the most intimate, powerful way to experience live music. 
                  The artist can see every face, hear every breath, feel every heartbeat. The audience becomes 
                  part of the performance, not just observers.
                </p>
              </div>

              <div className="bg-gradient-to-br from-sage/10 to-french-blue/10 p-8 rounded-2xl border border-sage/20">
                <blockquote className="text-lg italic text-gray-700 mb-4">
                  "In a house concert, there's nowhere to hide—for the artist or the audience. 
                  That vulnerability creates something magical that you can't get anywhere else."
                </blockquote>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-sage to-french-blue rounded-full flex items-center justify-center mr-3">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Real House Concert Host</div>
                    <div className="text-sm text-gray-600">After 50+ shows</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Visual elements */}
            <div className="relative">
              <div className="bg-gradient-to-br from-evergreen to-neutral-800 rounded-3xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-white/60 text-sm">House Concert Magic</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 text-white">
                      <div className="w-8 h-8 bg-french-blue rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold">15-40 people</div>
                        <div className="text-sm text-white/70">Intimate audience size</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-white">
                      <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center">
                        <Home className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold">Living rooms, backyards, barns</div>
                        <div className="text-sm text-white/70">Unique, personal venues</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-white">
                      <div className="w-8 h-8 bg-sand rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold">Artist meets audience</div>
                        <div className="text-sm text-white/70">Real conversations, lasting connections</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-white">
                      <div className="w-8 h-8 bg-mist rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-evergreen" />
                      </div>
                      <div>
                        <div className="font-semibold">Every note matters</div>
                        <div className="text-sm text-white/70">Acoustic perfection, pure emotion</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section - Why it matters */}
          <div className="text-center">
            <div className="bg-white rounded-3xl p-12 shadow-xl border border-neutral-100">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Why House Concerts Matter Now More Than Ever
              </h3>
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-sage to-secondary-700 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900">Artists Need Support</h4>
                  <p className="text-gray-600">
                    Streaming pays pennies. Venues take huge cuts. House concerts let artists 
                    connect directly with fans and actually make a living.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-french-blue to-primary-700 rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900">Community Connection</h4>
                  <p className="text-gray-600">
                    In our digital world, we're craving real connection. House concerts bring 
                    neighbors together around something beautiful.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-evergreen to-neutral-800 rounded-full flex items-center justify-center mx-auto">
                    <PlayCircle className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900">Music As It Should Be</h4>
                  <p className="text-gray-600">
                    Before amplification, before massive venues, music was intimate. Personal. 
                    House concerts bring back that original magic.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Artist-Focused Killer Section */}
      <section className="relative py-32 bg-white overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-french-blue/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-sage/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-french-blue/10 to-sage/10 text-evergreen rounded-full text-sm font-medium mb-8 border border-french-blue/20">
              <Guitar className="w-4 h-4 mr-2" />
              For Touring Artists
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Stop Playing to Empty Rooms.
              <span className="block text-french-blue">
                Start Building Real Fans.
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              House concerts aren't just gigs—they're fan-building machines. 
              Every show creates lifelong supporters who actually buy your music.
            </p>
          </div>

          {/* Main content grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Left side - Value props */}
            <div className="space-y-8">
              {/* Problem/Solution Cards */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-mist to-white rounded-3xl p-8 shadow-lg border border-neutral-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">The Venue Problem</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Bars take 30-50% of your merch sales. Venues book you for $200 and expect you to bring the crowd. 
                        You're building their business, not yours.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-sage/10 to-evergreen/10 rounded-3xl p-8 shadow-lg border border-sage/20">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-sage to-evergreen rounded-xl flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">The House Concert Solution</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Keep 100% of door fees AND merch. Guaranteed engaged audience. Hosts who actually care about your success. 
                        Every show builds your mailing list and creates superfans.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats that matter */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-neutral-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">What Our Artists Actually Make</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-french-blue mb-2">$800</div>
                    <div className="text-sm text-gray-600">Average per show</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-sage mb-2">15+</div>
                    <div className="text-sm text-gray-600">New email signups</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-evergreen mb-2">$300</div>
                    <div className="text-sm text-gray-600">Merch sales per show</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-sand mb-2">98%</div>
                    <div className="text-sm text-gray-600">Want you back</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Artist photo and benefits */}
            <div className="space-y-8">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/photos/fr_5-min.jpg"
                  alt="Artist performing at house concert"
                  width={600}
                  height={400}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-evergreen/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <blockquote className="text-white text-lg font-medium leading-relaxed">
                    "In three months on TourPad, I made more from door fees and merch than my entire last year of bar gigs."
                  </blockquote>
                  <div className="flex items-center mt-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      <Music className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Real TourPad Artist</div>
                      <div className="text-sm text-white/80">Folk Singer-Songwriter</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key benefits */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-french-blue/10 to-transparent rounded-2xl">
                  <div className="w-8 h-8 bg-french-blue rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Pre-screened hosts who actually promote your show</span>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-sage/10 to-transparent rounded-2xl">
                  <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Guaranteed minimum audience size (15+ people)</span>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-evergreen/10 to-transparent rounded-2xl">
                  <div className="w-8 h-8 bg-evergreen rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Payment processing & host vetting handled for you</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-evergreen to-neutral-800 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-evergreen/90 to-transparent"></div>
              <div className="relative z-10">
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  Ready to Build Real Fans?
                </h3>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Join 500+ artists who've discovered that intimate shows create lifelong supporters, not just one-night audiences.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                  <Link href="/register?type=artist">
                    <Button size="lg" className="px-8 py-4 bg-white text-evergreen hover:bg-mist hover:text-evergreen shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold">
                      <Guitar className="w-5 h-5 mr-2" />
                      Apply as Artist
                    </Button>
                  </Link>
                  <Link href="/artists">
                    <Button variant="outline" size="lg" className="px-8 py-4 border-white/30 text-white bg-white/10 hover:bg-white/20 transition-all duration-300">
                      See Success Stories
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-white/70 mt-4">
                  No upfront costs • Keep 100% of door fees & merch • We handle the logistics
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Three-Column Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Find Your Place in Live Music
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you create, host, or experience music, there's a place for you in our community.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {userTypes.map((userType, index) => (
              <div key={userType.type} className="group">
                <div className="relative rounded-2xl overflow-hidden mb-6 aspect-[4/3] shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src={userType.photo}
                    alt={`${userType.title} story`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className={`absolute top-6 left-6 p-3 rounded-full bg-${userType.colorClass.split(' ')[0].replace('from-', '')} shadow-lg`}>
                    <userType.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-neutral-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{userType.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{userType.description}</p>
                  <Link href={`/register?type=${userType.type}`}>
                    <Button 
                      variant="outline" 
                      className="w-full border-french-blue text-french-blue hover:bg-french-blue hover:text-white transition-all duration-300"
                    >
                      {userType.subtitle}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Clean Final CTA */}
      <section className="py-24 bg-gradient-to-br from-mist to-neutral-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Ready to Join?
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Every great musical story starts with someone saying "yes." What's yours?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <Link href="/register?type=artist" className="flex-1">
              <Button size="lg" className="w-full px-6 py-4 bg-sage hover:bg-secondary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Guitar className="w-5 h-5 mr-2" />
                I'm an Artist
              </Button>
            </Link>
            
            <Link href="/register?type=host" className="flex-1">
              <Button size="lg" className="w-full px-6 py-4 bg-french-blue hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Home className="w-5 h-5 mr-2" />
                I'm a Host
              </Button>
            </Link>
            
            <Link href="/register?type=fan" className="flex-1">
              <Button size="lg" className="w-full px-6 py-4 bg-evergreen hover:bg-neutral-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Heart className="w-5 h-5 mr-2" />
                I'm a Fan
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}