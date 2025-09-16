'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search,
  Home,
  Music,
  Users,
  Star,
  Calendar,
  MapPin,
  Guitar,
  Heart,
  Mic,
  Coffee,
  Shield,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function EnhancedHomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const userTypes = [
    {
      type: 'artist',
      icon: Music,
      title: 'For Artists',
      subtitle: 'Book Your Next Tour',
      description: 'Connect with verified hosts in 50+ cities. Professional venues, guaranteed audiences.',
      gradient: 'from-primary-500 to-primary-600',
      benefits: [
        { icon: Calendar, title: 'Guaranteed Tour Dates', description: 'Book intimate venues across the country with pre-screened, passionate hosts.' },
        { icon: Users, title: 'Engaged Audiences', description: 'Perform for music lovers in intimate settings where every note matters.' },
        { icon: Heart, title: 'Genuine Connections', description: 'Connect directly with music lovers who want to create something special.' },
        { icon: Star, title: 'Build Your Fanbase', description: 'Turn listeners into lifelong fans through personal concert experiences.' }
      ]
    },
    {
      type: 'host',
      icon: Home,
      title: 'For Hosts',
      subtitle: 'Host Intimate Concerts',
      description: 'Discover amazing touring artists and bring live music to your community.',
      gradient: 'from-secondary-500 to-secondary-600',
      benefits: [
        { icon: Music, title: 'Discover Amazing Artists', description: 'Access a curated network of professional touring musicians.' },
        { icon: Coffee, title: 'Easy Event Hosting', description: 'We handle booking, payments, and logistics. You provide the space.' },
        { icon: UserCheck, title: 'Vetted Musicians', description: 'All artists are approved and background-checked.' },
        { icon: Star, title: 'Create Magic', description: 'Transform your home into a concert venue for your community.' }
      ]
    },
    {
      type: 'fan',
      icon: Heart,
      title: 'For Fans',
      subtitle: 'Experience Live Music',
      description: 'Attend exclusive house concerts and intimate performances in your area.',
      gradient: 'from-neutral-600 to-neutral-700',
      benefits: [
        { icon: MapPin, title: 'Exclusive Access', description: 'Attend intimate concerts in unique venues near you.' },
        { icon: Users, title: 'Intimate Settings', description: 'Experience music up close with small, engaged audiences.' },
        { icon: CheckCircle, title: 'Curated Quality', description: 'Every artist and venue is vetted for exceptional experiences.' },
        { icon: Guitar, title: 'Support Artists', description: 'Help touring musicians build their careers through direct support.' }
      ]
    }
  ];


  return (
    <div className="bg-white">
      {/* Modern Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 z-20">
          <div className="text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 leading-tight">
                Where Music
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary-200 via-white to-secondary-200">
                  Feels Like Home
                </span>
              </h1>
            </div>
            
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <p className="text-xl sm:text-2xl text-white/90 max-w-4xl mx-auto mb-12 leading-relaxed">
                The trusted platform connecting touring artists, passionate hosts, and music lovers
                <span className="block mt-2 text-secondary-100">
                  for unforgettable intimate concerts.
                </span>
              </p>
            </div>

            {/* Three-column CTA */}
            <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mb-12">
                {userTypes.map((userType, index) => (
                  <div key={userType.type} className="group" style={{ animationDelay: `${index * 200}ms` }}>
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20 transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${userType.gradient} flex items-center justify-center`}>
                        <userType.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{userType.title}</h3>
                      <p className="text-gray-600 mb-6 text-sm">{userType.description}</p>
                      <Link href={`/register?type=${userType.type}`}>
                        <Button 
                          size="sm" 
                          className={`w-full bg-gradient-to-r ${userType.gradient} hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
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
          </div>
        </div>
      </section>

      {/* What Are House Concerts Section */}
      <section className="py-32 bg-gradient-to-b from-white to-neutral-50 relative overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-primary-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-60 h-60 bg-secondary-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="default" className="mb-4 bg-primary-100 text-primary-700">
              The Magic of House Concerts
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              What If Your Living Room Could 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
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

              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-8 rounded-2xl border border-primary-100">
                <blockquote className="text-lg italic text-gray-700 mb-4">
                  "In a house concert, there's nowhere to hide—for the artist or the audience. 
                  That vulnerability creates something magical that you can't get anywhere else."
                </blockquote>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-3">
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
              <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-3xl p-8 shadow-2xl">
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
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold">15-40 people</div>
                        <div className="text-sm text-white/70">Intimate audience size</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-white">
                      <div className="w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center">
                        <Home className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold">Living rooms, backyards, barns</div>
                        <div className="text-sm text-white/70">Unique, personal venues</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-white">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold">Artist meets audience</div>
                        <div className="text-sm text-white/70">Real conversations, lasting connections</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-white">
                      <div className="w-8 h-8 bg-secondary-600 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4" />
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
            <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Why House Concerts Matter Now More Than Ever
              </h3>
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900">Artists Need Support</h4>
                  <p className="text-gray-600">
                    Streaming pays pennies. Venues take huge cuts. House concerts let artists 
                    connect directly with fans and actually make a living.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900">Community Connection</h4>
                  <p className="text-gray-600">
                    In our digital world, we're craving real connection. House concerts bring 
                    neighbors together around something beautiful.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mx-auto">
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

      {/* Mission & Story Section - Modern Design */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-8 w-32 h-32 bg-primary-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-8 w-40 h-40 bg-secondary-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-300/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Content container */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-8 border border-white/20">
              <Music className="w-4 h-4 mr-2" />
              Our Story
            </div>
            
            <h2 className="text-5xl sm:text-6xl font-bold text-white mb-8 leading-tight">
              Turning Homes Into Venues,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-secondary-300">
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
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary-300/30">
                  <Users className="w-12 h-12 text-primary-300" />
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              <div className="lg:w-1/3 order-1">
                <div className="w-24 h-24 bg-gradient-to-br from-secondary-500/20 to-secondary-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-secondary-300/30">
                  <Heart className="w-12 h-12 text-secondary-300" />
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
              <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-2xl">
                <blockquote className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-6">
                  "Let's turn more homes into venues and more nights into something worth remembering."
                </blockquote>
                <div className="flex items-center justify-center space-x-2">
                  <Star className="w-6 h-6 text-primary-300" />
                  <Star className="w-6 h-6 text-primary-300" />
                  <Star className="w-6 h-6 text-primary-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Growing the Live Music Community
            </h2>
            <p className="text-xl text-white/90">
              Real numbers from our thriving platform
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">2,500+</div>
              <div className="text-white/80">Shows Booked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-white/80">Active Hosts</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">150+</div>
              <div className="text-white/80">Touring Artists</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-white/80">Cities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-neutral-50 to-white">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-100/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-16">
            <Badge variant="default" className="mb-4 bg-primary-100 text-primary-700">
              Success Stories
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What Our Community Is Saying
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real experiences from artists, hosts, and fans who've found their home in live music
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Artist testimonial */}
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "TourPad helped us book 30 shows across 3 states. The hosts are amazing and the audiences are engaged."
                </p>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&auto=format&fit=crop&q=80"
                    alt="Sarah Chen"
                    className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-primary-200"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Sarah Chen</div>
                    <div className="text-sm text-gray-600">Folk Singer-Songwriter</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      Portland, OR
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Host testimonial */}
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "Hosting concerts through TourPad has brought our community together. It's magic every time."
                </p>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&auto=format&fit=crop&q=80"
                    alt="Mike & Lisa Johnson"
                    className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-secondary-200"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Mike & Lisa Johnson</div>
                    <div className="text-sm text-gray-600">House Concert Hosts</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      Nashville, TN
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fan testimonial */}
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "These intimate concerts are unlike anything else. You can feel the music in your bones."
                </p>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&auto=format&fit=crop&q=80"
                    alt="Emma Rodriguez"
                    className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-neutral-200"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Emma Rodriguez</div>
                    <div className="text-sm text-gray-600">Music Fan</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      Denver, CO
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-secondary-600 to-secondary-400 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-secondary-200/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Join the Community?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Whether you're an artist ready to tour, a host eager to share live music, or a fan seeking intimate concerts—your place in the TourPad community is waiting.
          </p>
          
          {/* Three-column CTA buttons */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link href="/register?type=artist">
              <Button size="lg" className="w-full px-8 py-6 text-lg text-white bg-primary-600 hover:bg-white hover:text-primary-600 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group border-2 border-[var(--color-french-blue)]">
                <Guitar className="w-6 h-6 mr-3" />
                Apply as Artist
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Link href="/register?type=host">
              <Button 
                size="lg" 
                className="w-full px-8 py-6 text-lg text-white bg-primary-600 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group border-2 border-[var(--color-french-blue)]"
                style={{
                  backgroundColor: 'var(--color-primary-600)',
                  borderColor: 'var(--color-primary-600)',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = 'var(--color-primary-600)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-600)';
                  e.currentTarget.style.color = 'white';
                }}
              >
                <Home className="w-6 h-6 mr-3" />
                Become a Host
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Link href="/register?type=fan">
              <Button size="lg" className="w-full px-8 py-6 text-lg text-white bg-primary-600 hover:bg-white hover:text-primary-600 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group border-2 border-[var(--color-french-blue)]">
                <Heart className="w-6 h-6 mr-3" />
                Join as Fan
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}