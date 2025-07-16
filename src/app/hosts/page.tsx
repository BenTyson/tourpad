'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Home,
  Music,
  Guitar,
  Users,
  Shield,
  Star,
  ArrowRight,
  Heart,
  Coffee,
  MapPin,
  Search,
  Filter,
  Wifi,
  Car,
  Volume2,
  Baby,
  Moon,
  Accessibility,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { HostCard } from '@/components/cards/HostCard';
import { mockHosts } from '@/data/mockData';

export default function HostsPage() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minAttendance: '',
    maxDoorFee: '',
    amenities: {
      parking: false,
      wifi: false,
      soundSystem: false,
      kidFriendly: false,
      bnbOffered: false,
      accessible: false
    }
  });

  // Check if user has access to browse hosts
  const hasAccess = session?.user && (
    session.user.type === 'admin' || 
    (session.user.status === 'approved' && (session.user.type === 'artist' || session.user.type === 'host'))
  );

  // If user doesn't have access, show gateway page
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    // Gateway page content for unauthorized users
    const benefits = [
      {
        icon: Home,
        title: 'Curated Venues',
        description: 'Discover beautiful homes and unique spaces perfect for intimate house concerts.'
      },
      {
        icon: Shield,
        title: 'Trusted Hosts',
        description: 'All hosts are verified and experienced in creating safe, welcoming environments for artists.'
      },
      {
        icon: Coffee,
        title: 'Full-Service Hosting',
        description: 'Find hosts who handle everything from sound systems to audience coordination.'
      },
      {
        icon: Heart,
        title: 'Passionate Communities',
        description: 'Connect with hosts who genuinely love live music and creating memorable experiences.'
      }
    ];

    const stats = [
      { value: '500+', label: 'Active Hosts' },
      { value: '1,000+', label: 'Concerts Hosted' },
      { value: '4.9★', label: 'Average Rating' },
      { value: '94%', label: 'Artist Satisfaction' }
    ];

    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-br from-primary-600 to-primary-400 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-8 w-40 h-40 bg-secondary-400/30 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="outline" className="mb-6 border-white/30 text-white bg-white/10 backdrop-blur-sm">
              Exclusive Network Access
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              Find Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary-200 to-white">
                Concert Venues
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Access our exclusive network of passionate hosts who open their homes and venues 
              for unforgettable intimate concerts across the country.
            </p>
            
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-primary-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Protected Community</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Our host directory is only available to approved artists and verified host members. 
                To maintain the quality and safety of our community, access requires application and approval.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register?type=artist">
                  <Button size="lg" className="px-8 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                    <Guitar className="w-5 h-5 mr-2" />
                    Apply as Artist
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/register?type=host">
                  <Button size="lg" variant="outline" className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Home className="w-5 h-5 mr-2" />
                    Join as Host
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>


        {/* Dashboard Preview Section */}
        <section className="py-32 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-secondary-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl"></div>
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="default" className="mb-4 bg-secondary-100 text-secondary-700">
                Your Host Dashboard
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Everything You Need to 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-primary-600">
                  Host Amazing Concerts
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join our community and get access to powerful tools that make hosting house concerts simple and rewarding
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Left side - Features */}
              <div className="space-y-8 order-2 lg:order-1">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Artist Discovery & Booking</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Browse our vetted network of professional touring musicians. View profiles, listen to samples, 
                        and book the perfect artists for your venue and audience.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Event Management Suite</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Manage all your concerts in one place. Track RSVPs, communicate with artists, 
                        and handle logistics seamlessly from your dashboard.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary-600 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Home className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Venue Profile & Promotion</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Showcase your space with beautiful photos and detailed descriptions. 
                        Attract the right artists and build your reputation in the community.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-neutral-500 to-neutral-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Community & Support</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Connect with other hosts, share experiences, and get support from our team. 
                        You're never alone in your hosting journey.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-secondary-50 to-primary-50 p-6 rounded-2xl border border-secondary-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Why Hosts Love TourPad</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-secondary-600 rounded-full mr-2"></div>
                      Free to join and host - no upfront costs
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-secondary-600 rounded-full mr-2"></div>
                      All artists are vetted and professional
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-secondary-600 rounded-full mr-2"></div>
                      Build lasting connections with musicians and fans
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-secondary-600 rounded-full mr-2"></div>
                      Easy-to-use tools for managing concerts
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right side - Dashboard mockup */}
              <div className="relative order-1 lg:order-2">
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                  {/* Dashboard header */}
                  <div className="bg-gradient-to-r from-secondary-600 to-secondary-500 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <Home className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">Host Dashboard</h3>
                          <p className="text-secondary-100 text-sm">Welcome back, Mike</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard content */}
                  <div className="p-6 space-y-6">
                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-secondary-700">8</div>
                        <div className="text-sm text-secondary-600">Shows Hosted</div>
                      </div>
                      <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-primary-700">142</div>
                        <div className="text-sm text-primary-600">Total Attendees</div>
                      </div>
                      <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-neutral-700">4.8</div>
                        <div className="text-sm text-neutral-600">Host Rating</div>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Quick Actions</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Users className="w-4 h-4 text-secondary-600 mr-2" />
                          <span className="text-sm text-gray-700">Browse Artists</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Calendar className="w-4 h-4 text-primary-600 mr-2" />
                          <span className="text-sm text-gray-700">Schedule Show</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Home className="w-4 h-4 text-secondary-600 mr-2" />
                          <span className="text-sm text-gray-700">Edit Venue</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Star className="w-4 h-4 text-primary-600 mr-2" />
                          <span className="text-sm text-gray-700">View Reviews</span>
                        </div>
                      </div>
                    </div>

                    {/* Upcoming shows */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Upcoming Shows</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                              <Music className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">Sarah Chen</div>
                              <div className="text-xs text-gray-500">Folk • March 15</div>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">Confirmed</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                              <Guitar className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">The Wandering Souls</div>
                              <div className="text-xs text-gray-500">Indie • March 22</div>
                            </div>
                          </div>
                          <Badge variant="warning" className="text-xs">Pending</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gradient-to-b from-white to-neutral-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                What You'll Find in Our Host Network
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our carefully vetted community features experienced hosts who understand 
                what it takes to create magical house concert experiences.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={benefit.title} className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-100 text-secondary-600 mb-6">
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
        <section className="py-20 bg-gradient-to-br from-secondary-600 to-secondary-400">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Join Our Thriving Community
              </h2>
              <p className="text-xl text-white/90">
                Real numbers from our growing network of hosts and artists
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

        {/* Location Teasers */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Venues Across the Country
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our host network spans major cities and hidden gems, giving you access to 
                amazing venues wherever your tour takes you.
              </p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              {['Austin, TX', 'Nashville, TN', 'Portland, OR', 'Denver, CO', 'Asheville, NC', 'Seattle, WA', 'Burlington, VT', 'Santa Fe, NM', 'Missoula, MT', 'Athens, GA'].map((city, index) => (
                <Card key={city} className="hover:shadow-lg transition-all duration-300 text-center">
                  <CardContent className="p-6">
                    <MapPin className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900">{city}</h3>
                    <p className="text-sm text-gray-500 mt-1">Multiple venues</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 bg-gradient-to-b from-neutral-50 to-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Access Our Host Network?
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Apply as an artist to book shows at amazing venues, or join as a host 
              to share your space with touring musicians.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Guitar className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">I'm an Artist</h3>
                  <p className="text-gray-600 mb-6">
                    I want to book shows at amazing venues across the country.
                  </p>
                  <Link href="/register?type=artist">
                    <Button size="lg" className="w-full">
                      Apply as Artist
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-secondary-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Home className="w-8 h-8 text-secondary-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">I'm a Host</h3>
                  <p className="text-gray-600 mb-6">
                    I want to host concerts and share my space with musicians.
                  </p>
                  <Link href="/register?type=host">
                    <Button size="lg" variant="outline" className="w-full border-secondary-300 text-secondary-700 hover:bg-secondary-50">
                      Become a Host
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

  // Browse functionality for authorized users
  // Filter hosts based on search and filters
  const filteredHosts = mockHosts.filter(host => {
    const matchesSearch = searchQuery === '' || 
      host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.state.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAttendance = !filters.minAttendance || 
      host.showSpecs.avgAttendance >= parseInt(filters.minAttendance);

    const matchesDoorFee = !filters.maxDoorFee || 
      host.showSpecs.avgDoorFee <= parseInt(filters.maxDoorFee);

    const matchesAmenities = Object.entries(filters.amenities).every(([amenity, required]) => {
      if (!required) return true;
      return host.amenities[amenity as keyof typeof host.amenities];
    });

    return matchesSearch && matchesAttendance && matchesDoorFee && matchesAmenities;
  });

  const updateAmenityFilter = (amenity: string, value: boolean) => {
    setFilters({
      ...filters,
      amenities: {
        ...filters.amenities,
        [amenity]: value
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by venue name, city, or state..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="flex items-center"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Capacity & Pricing */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Capacity & Pricing</h3>
                    <div className="space-y-3">
                      <Input
                        label="Min Attendance"
                        type="number"
                        value={filters.minAttendance}
                        onChange={(e) => setFilters({ ...filters, minAttendance: e.target.value })}
                        placeholder="20"
                      />
                      <Input
                        label="Max Door Fee ($)"
                        type="number"
                        value={filters.maxDoorFee}
                        onChange={(e) => setFilters({ ...filters, maxDoorFee: e.target.value })}
                        placeholder="25"
                      />
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="md:col-span-2">
                    <h3 className="font-medium text-gray-900 mb-3">Required Amenities</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries({
                        parking: { label: 'Parking', icon: Car },
                        wifi: { label: 'WiFi', icon: Wifi },
                        soundSystem: { label: 'Sound System', icon: Volume2 },
                        kidFriendly: { label: 'Kid Friendly', icon: Baby },
                        bnbOffered: { label: 'Overnight Stay', icon: Moon },
                        accessible: { label: 'Wheelchair Accessible', icon: Accessibility }
                      }).map(([key, { label, icon: Icon }]) => (
                        <label key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.amenities[key as keyof typeof filters.amenities]}
                            onChange={(e) => updateAmenityFilter(key, e.target.checked)}
                            className="mr-2"
                          />
                          <Icon className="w-4 h-4 mr-1.5 text-gray-500" />
                          <span className="text-sm text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredHosts.length} Host{filteredHosts.length !== 1 ? 's' : ''} Found
          </h2>
        </div>

        {/* Host Grid */}
        {filteredHosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHosts.map((host) => (
              <HostCard key={host.id} host={host} showBookingButton={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hosts match your search criteria.</p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setFilters({
                  minAttendance: '',
                  maxDoorFee: '',
                  amenities: {
                    parking: false,
                    wifi: false,
                    soundSystem: false,
                    kidFriendly: false,
                    bnbOffered: false,
                    accessible: false
                  }
                });
              }}
              variant="outline"
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}