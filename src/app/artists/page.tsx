import Link from 'next/link';
import { 
  Music,
  Guitar,
  Users,
  Shield,
  Star,
  ArrowRight,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function ArtistsGatewayPage() {
  const benefits = [
    {
      icon: Music,
      title: 'Professional Network',
      description: 'Access our curated community of touring musicians who are actively booking shows.'
    },
    {
      icon: Shield,
      title: 'Verified Artists',
      description: 'All artists in our network are approved, background-checked, and committed to professionalism.'
    },
    {
      icon: Star,
      title: 'Quality Performances',
      description: 'Discover artists who specialize in intimate venues and understand house concert dynamics.'
    },
    {
      icon: Heart,
      title: 'Genuine Connections',
      description: 'Connect with musicians who value authentic relationships with hosts and audiences.'
    }
  ];

  const stats = [
    { value: '200+', label: 'Verified Artists' },
    { value: '2,500+', label: 'Shows Booked' },
    { value: '50+', label: 'Cities Available' },
    { value: '96%', label: 'Host Satisfaction' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-secondary-600 to-secondary-400 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-8 w-40 h-40 bg-primary-400/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className="mb-6 border-white/30 text-white bg-white/10 backdrop-blur-sm">
            Exclusive Network Access
          </Badge>
          
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Discover Amazing
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-white">
              Touring Artists
            </span>
          </h1>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Browse our exclusive network of professional touring musicians who specialize in intimate house concerts and small venue performances.
          </p>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Protected Community</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Our artist directory is only available to approved hosts and paying artist members. 
              To maintain the quality and safety of our community, access requires application and approval.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?type=host">
                <Button size="lg" className="px-8 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <Users className="w-5 h-5 mr-2" />
                  Apply as Host
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/register?type=artist">
                <Button size="lg" variant="outline" className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Guitar className="w-5 h-5 mr-2" />
                  Join as Artist
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-white to-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What You'll Find in Our Artist Network
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our carefully curated community features professional touring musicians 
              who understand the unique magic of house concerts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={benefit.title} className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-6">
                    <benefit.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Join Our Thriving Community
            </h2>
            <p className="text-xl text-white/90">
              Real numbers from our growing network of artists and hosts
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Access Our Artist Network?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join as a host to discover amazing artists for your venue, or apply as an artist 
            to connect with passionate hosts across the country.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">I'm a Host</h3>
                <p className="text-gray-600 mb-6">
                  I want to find amazing artists to perform at my venue or home.
                </p>
                <Link href="/register?type=host">
                  <Button size="lg" className="w-full">
                    Apply as Host
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-secondary-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Guitar className="w-8 h-8 text-secondary-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">I'm an Artist</h3>
                <p className="text-gray-600 mb-6">
                  I want to book shows and connect with hosts who love live music.
                </p>
                <Link href="/register?type=artist">
                  <Button size="lg" variant="outline" className="w-full border-secondary-300 text-secondary-700 hover:bg-secondary-50">
                    Join as Artist
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}