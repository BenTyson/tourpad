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
  const [activeTab, setActiveTab] = useState<'artist' | 'host'>('artist');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const artistBenefits = [
    {
      icon: Calendar,
      title: 'Guaranteed Tour Dates',
      description: 'Book intimate venues across the country with pre-screened, passionate hosts who love live music.'
    },
    {
      icon: Users,
      title: 'Engaged Audiences',
      description: 'Perform for music lovers in intimate settings where every note matters and connections are real.'
    },
    {
      icon: Heart,
      title: 'Genuine Connections',
      description: 'Skip the noise and connect directly with music lovers who want to create something special together.'
    },
    {
      icon: Star,
      title: 'Build Your Fanbase',
      description: 'Turn one-time listeners into lifelong fans through personal, memorable house concert experiences.'
    }
  ];

  const hostBenefits = [
    {
      icon: Music,
      title: 'Discover Amazing Artists',
      description: 'Access a curated network of professional touring musicians perfect for intimate house concerts.'
    },
    {
      icon: Coffee,
      title: 'Easy Event Hosting',
      description: 'We handle booking, payments, and logistics. You just provide the space and enjoy the music.'
    },
    {
      icon: UserCheck,
      title: 'Vetted Musicians',
      description: 'All artists are approved and background-checked. Professional, reliable performers only.'
    },
    {
      icon: Star,
      title: 'Create Magic',
      description: 'Transform your home into a concert venue and create unforgettable experiences for your community.'
    }
  ];

  const artistStats = [
    { label: 'Tour Dates Booked', value: '2,500+' },
    { label: 'Cities Available', value: '50+' },
    { label: 'Average Audience', value: '25' },
    { label: 'Artist Success Rate', value: '94%' }
  ];

  const hostStats = [
    { label: 'Active Hosts', value: '500+' },
    { label: 'Concerts Hosted', value: '1,000+' },
    { label: 'Average Rating', value: '4.9★' },
    { label: 'Host Satisfaction', value: '96%' }
  ];

  const artistTestimonials = [
    {
      quote: "TourPad helped us book 30 shows across 3 states. The hosts are amazing and the audiences are engaged.",
      author: "Sarah Chen",
      role: "Folk Singer-Songwriter",
      location: "Portland, OR",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&auto=format&fit=crop&q=80"
    },
    {
      quote: "Finally, a platform that connects us with people who actually love live music. Every show feels special.",
      author: "The Wandering Souls",
      role: "Indie Folk Duo",
      location: "Austin, TX",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&auto=format&fit=crop&q=80"
    }
  ];

  const hostTestimonials = [
    {
      quote: "Hosting concerts through TourPad has brought our community together. It's magic every time.",
      author: "Mike & Lisa Johnson",
      role: "House Concert Hosts",
      location: "Nashville, TN",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&auto=format&fit=crop&q=80"
    },
    {
      quote: "The artists are professional and the process is seamless. We've hosted 15 shows and loved every one.",
      author: "David Rodriguez",
      role: "Venue Host",
      location: "Denver, CO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="bg-white">
      {/* Enhanced Hero Section with Dual Paths */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=1920&h=1080&auto=format&fit=crop&q=80)',
          }}
        >
          {/* Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-700/90 via-secondary-600/85 to-secondary-500/90"></div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 z-20">
          <div className="text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 leading-tight">
                Where Music
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary-200 via-secondary-100 to-secondary-200">
                  Feels Like Home
                </span>
              </h1>
            </div>
            
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <p className="text-xl sm:text-2xl text-white/90 max-w-4xl mx-auto mb-12 leading-relaxed">
                The trusted platform connecting touring artists with passionate hosts
                <span className="block mt-2 text-secondary-100">
                  for unforgettable intimate concerts.
                </span>
              </p>
            </div>

            {/* Dual Path Selection */}
            <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="max-w-4xl mx-auto mb-12">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-2 flex mb-8 shadow-2xl">
                  <button
                    onClick={() => setActiveTab('artist')}
                    className={`flex-1 py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 ${
                      activeTab === 'artist' 
                        ? 'bg-primary-500 text-white shadow-lg' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Music className="w-6 h-6 mx-auto mb-2" />
                    I'm an Artist
                  </button>
                  <button
                    onClick={() => setActiveTab('host')}
                    className={`flex-1 py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 ${
                      activeTab === 'host' 
                        ? 'bg-primary-500 text-white shadow-lg' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Home className="w-6 h-6 mx-auto mb-2" />
                    I'm a Host
                  </button>
                </div>

                {/* Artist Path */}
                {activeTab === 'artist' && (
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Book Your Next Tour</h3>
                    <p className="text-white/90 mb-8 text-lg">
                      Connect with verified hosts in 50+ cities. Professional venues, guaranteed audiences.
                    </p>
                    <Link href="/register?type=artist">
                      <Button size="lg" className="px-12 py-4 text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group">
                        <Guitar className="w-6 h-6 mr-3" />
                        Apply as Artist
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Host Path */}
                {activeTab === 'host' && (
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Host Intimate Concerts</h3>
                    <p className="text-white/90 mb-8 text-lg">
                      Discover amazing touring artists and bring live music to your community.
                    </p>
                    <Link href="/register?type=host">
                      <Button size="lg" className="px-12 py-4 text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group">
                        <Home className="w-6 h-6 mr-3" />
                        Become a Host
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions Section */}
      <section className="py-24 bg-gradient-to-b from-white to-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="default" className="mb-4 bg-primary-100 text-primary-700">
              {activeTab === 'artist' ? 'For Artists' : 'For Hosts'}
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {activeTab === 'artist' 
                ? 'Everything You Need to Tour Successfully' 
                : 'Transform Your Space Into a Concert Venue'
              }
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {activeTab === 'artist'
                ? 'Join hundreds of artists who are building careers through intimate house concerts'
                : 'Connect with your community through the magic of live music in your own space'
              }
            </p>
          </div>

          {/* Photo + Text Layout */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Compelling Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src={activeTab === 'artist' 
                    ? 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&auto=format&fit=crop&q=80'
                    : 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&auto=format&fit=crop&q=80'
                  }
                  alt={activeTab === 'artist' ? 'Intimate acoustic performance' : 'Beautiful home venue'}
                  className="w-full h-96 object-cover transition-all duration-1000"
                />
                {/* Image overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
              </div>
              
              {/* Floating stats card */}
              <div className="absolute -bottom-8 -right-8 bg-white rounded-xl shadow-xl p-6 border border-gray-100">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {activeTab === 'artist' ? '2,500+' : '1,000+'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {activeTab === 'artist' ? 'Shows Booked' : 'Concerts Hosted'}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              {(activeTab === 'artist' ? artistBenefits : hostBenefits).map((benefit, index) => (
                <div key={benefit.title} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                      <benefit.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Story Section - Immersive Design */}
      <section className="relative py-32 overflow-hidden">
        {/* Full-width background with parallax effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1920&h=1080&auto=format&fit=crop&q=80)',
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-gray-900/95"></div>
        </div>

        {/* Floating content container */}
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

          {/* Story cards in diagonal layout */}
          <div className="space-y-12">
            {/* Card 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              <div className="lg:w-2/3 order-2 lg:order-1">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
                  <p className="text-xl text-gray-700 leading-relaxed">
                    Our goal is simple: to make it easier for musicians and hosts to come together and bring live music into homes and creative spaces everywhere. Whether you're an artist looking for fresh audiences or a host eager to share unforgettable nights with friends, we're here to help you make it happen.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/3 order-1 lg:order-2">
                <div className="w-24 h-24 bg-primary-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary-300/30">
                  <Users className="w-12 h-12 text-primary-300" />
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              <div className="lg:w-1/3 order-1">
                <div className="w-24 h-24 bg-secondary-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-secondary-300/30">
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

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-8 w-32 h-32 bg-primary-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-8 w-40 h-40 bg-secondary-400/10 rounded-full blur-3xl"></div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {activeTab === 'artist' ? 'Join Successful Artists' : 'Join Amazing Hosts'}
            </h2>
            <p className="text-xl text-white/90">
              {activeTab === 'artist' 
                ? 'Real numbers from artists building their careers' 
                : 'Real results from our host community'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {(activeTab === 'artist' ? artistStats : hostStats).map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background with subtle imagery */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: activeTab === 'artist' 
                ? 'url(https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1920&h=1080&auto=format&fit=crop&q=80)'
                : 'url(https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=1920&h=1080&auto=format&fit=crop&q=80)',
            }}
          >
            <div className="absolute inset-0 bg-white/80"></div>
          </div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What {activeTab === 'artist' ? 'Artists' : 'Hosts'} Are Saying
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {(activeTab === 'artist' ? artistTestimonials : hostTestimonials).map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-primary-200"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.author}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-secondary-600 to-secondary-400 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-secondary-200/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            {activeTab === 'artist' ? 'Ready to Tour?' : 'Ready to Host?'}
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            {activeTab === 'artist' 
              ? 'Join the platform that\'s helping artists build sustainable touring careers through intimate concerts.'
              : 'Start hosting today and bring the magic of live music to your community.'
            }
          </p>
          <Link href={`/register?type=${activeTab}`}>
            <Button size="lg" variant="secondary" className="px-12 py-4 text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group">
              {activeTab === 'artist' ? (
                <>
                  <Guitar className="w-6 h-6 mr-3" />
                  Apply as Artist
                </>
              ) : (
                <>
                  <Home className="w-6 h-6 mr-3" />
                  Become a Host
                </>
              )}
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}