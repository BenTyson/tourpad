'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Music,
  Guitar,
  Users,
  Shield,
  Star,
  ArrowRight,
  Heart,
  Search,
  Filter,
  Home,
  Volume2,
  Calendar,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { ArtistCard } from '@/components/cards/ArtistCard';

export default function ArtistsPage() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [selectedConcert, setSelectedConcert] = useState<any>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minYearsActive: '',
    maxTourMonths: '',
    requirements: {
      requireHomeStay: false,
      ownSoundSystem: false,
      travelWithAnimals: false
    },
    cancellationPolicy: '' as '' | 'strict' | 'flexible'
  });

  // Check if user has access to browse artists
  const hasAccess = session?.user && (
    session.user.type === 'admin' || 
    ((session.user.status === 'approved' || session.user.status === 'active' || session.user.status === 'pending') && (session.user.type === 'artist' || session.user.type === 'host')) ||
    (session.user.type === 'fan' && (session.user as any).paymentStatus === 'active')
  );

  // Fetch artists data from API
  useEffect(() => {
    const fetchArtists = async () => {
      if (!hasAccess) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/artists');
        if (response.ok) {
          const artistsData = await response.json();
          setArtists(artistsData);
        } else {
          console.error('Failed to fetch artists');
        }
      } catch (error) {
        console.error('Error fetching artists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [hasAccess]);

  // If user doesn't have access, show gateway page
  if (status === 'loading' || loading) {
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
            <Badge variant="secondary" className="mb-6 border-white/30 text-white bg-white/10 backdrop-blur-sm">
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


        {/* Dashboard Preview Section */}
        <section className="py-32 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary-200/20 rounded-full blur-3xl"></div>
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="default" className="mb-4 bg-primary-100 text-primary-700">
                Your Artist Dashboard
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Everything You Need to 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                  Build Your Touring Career
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Your membership gives you access to a comprehensive dashboard designed specifically for touring artists
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Left side - Dashboard mockup */}
              <div className="relative order-2 lg:order-1">
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                  {/* Dashboard header */}
                  <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <Guitar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">Artist Dashboard</h3>
                          <p className="text-primary-100 text-sm">Welcome back, Sarah</p>
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
                      <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-primary-700">12</div>
                        <div className="text-sm text-primary-600">Active Bookings</div>
                      </div>
                      <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-secondary-700">$2,850</div>
                        <div className="text-sm text-secondary-600">Monthly Revenue</div>
                      </div>
                      <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-neutral-700">4.9</div>
                        <div className="text-sm text-neutral-600">Average Rating</div>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Quick Actions</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Calendar className="w-4 h-4 text-primary-600 mr-2" />
                          <span className="text-sm text-gray-700">Book Shows</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Users className="w-4 h-4 text-secondary-600 mr-2" />
                          <span className="text-sm text-gray-700">Browse Hosts</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Star className="w-4 h-4 text-primary-600 mr-2" />
                          <span className="text-sm text-gray-700">View Reviews</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Guitar className="w-4 h-4 text-secondary-600 mr-2" />
                          <span className="text-sm text-gray-700">Edit Profile</span>
                        </div>
                      </div>
                    </div>

                    {/* Recent activity */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Recent Activity</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-700">New booking confirmed</span>
                          </div>
                          <span className="text-xs text-gray-500">2h ago</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-700">Message from host</span>
                          </div>
                          <span className="text-xs text-gray-500">5h ago</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-700">Review received</span>
                          </div>
                          <span className="text-xs text-gray-500">1d ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Features */}
              <div className="space-y-8 order-1 lg:order-2">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Booking Management</h3>
                      <p className="text-gray-600 leading-relaxed">
                        View all your bookings in one place, manage availability, and coordinate with hosts seamlessly. 
                        Never miss a show or double-book again.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Host Discovery Engine</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Advanced search and filters to find the perfect hosts for your style and tour route. 
                        See ratings, photos, and detailed venue information.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Analytics</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Track your earnings, audience growth, and review scores. Get insights to improve your performances 
                        and build stronger fan relationships.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-neutral-500 to-neutral-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Profile</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Showcase your music, photos, and experience with a beautiful profile that converts browsers into bookers. 
                        Stand out from the crowd.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-6 rounded-2xl border border-primary-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Why Artists Choose TourPad</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></div>
                      Direct connection with passionate music lovers
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></div>
                      Higher earnings than traditional venue splits
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></div>
                      Build genuine fan relationships in intimate settings
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></div>
                      Professional tools to manage your touring career
                    </li>
                  </ul>
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

  // Browse functionality for authorized users
  // For fans, show concerts; for others, show artists
  const upcomingConcerts: any[] = []; // TODO: Fetch from concerts API when implemented

  // Filter concerts for fans
  const filteredConcerts = session?.user?.type === 'fan' 
    ? upcomingConcerts.filter(concert => {
        const matchesSearch = searchQuery === '' || 
          concert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          concert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          concert.artistName.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesSearch;
      })
    : [];

  // Filter artists based on search and filters
  const filteredArtists = artists.filter(artist => {

    const matchesSearch = searchQuery === '' || 
      (artist as any).name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (artist as any).bio?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesYearsActive = !filters.minYearsActive || 
      ((artist as any).yearsActive && (artist as any).yearsActive >= parseInt(filters.minYearsActive));

    const matchesTourMonths = !filters.maxTourMonths || 
      ((artist as any).tourMonthsPerYear && (artist as any).tourMonthsPerYear <= parseInt(filters.maxTourMonths));

    const matchesRequirements = Object.entries(filters.requirements).every(([requirement, mustHave]) => {
      if (!mustHave) return true;
      return (artist as any)[requirement];
    });

    const matchesCancellationPolicy = !filters.cancellationPolicy || 
      (artist as any).cancellationPolicy === filters.cancellationPolicy;

    return matchesSearch && matchesYearsActive && matchesTourMonths && matchesRequirements && matchesCancellationPolicy;
  });

  const updateRequirementFilter = (requirement: string, value: boolean) => {
    setFilters({
      ...filters,
      requirements: {
        ...filters.requirements,
        [requirement]: value
      }
    });
  };

  const handleRSVPClick = (concert: any) => {
    setSelectedConcert(concert);
    setGuestCount(1);
    setShowRSVPModal(true);
  };

  const handleRSVPSubmit = () => {
    // TODO: Send RSVP to backend
    console.log('RSVP submitted:', {
      concertId: selectedConcert?.id,
      fanId: session?.user?.id,
      guestCount: guestCount
    });
    
    // Close modal
    setShowRSVPModal(false);
    setSelectedConcert(null);
    setGuestCount(1);
    
    // TODO: Update UI to show RSVP status
    alert(`RSVP submitted for ${guestCount} guest${guestCount > 1 ? 's' : ''}!`);
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
                    placeholder="Search by artist name or description..."
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
                  {/* Experience & Availability */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Experience & Availability</h3>
                    <div className="space-y-3">
                      <Input
                        label="Min Years Active"
                        type="number"
                        value={filters.minYearsActive}
                        onChange={(e) => setFilters({ ...filters, minYearsActive: e.target.value })}
                        placeholder="2"
                      />
                      <Input
                        label="Max Tour Months/Year"
                        type="number"
                        value={filters.maxTourMonths}
                        onChange={(e) => setFilters({ ...filters, maxTourMonths: e.target.value })}
                        placeholder="8"
                      />
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Artist Preferences</h3>
                    <div className="space-y-2">
                      {Object.entries({
                        requireHomeStay: { label: 'Offers Home Stay', icon: Home },
                        ownSoundSystem: { label: 'Has Sound System', icon: Volume2 },
                        travelWithAnimals: { label: 'Travels with Pets', icon: Heart }
                      }).map(([key, { label, icon: Icon }]) => (
                        <label key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.requirements[key as keyof typeof filters.requirements]}
                            onChange={(e) => updateRequirementFilter(key, e.target.checked)}
                            className="mr-2"
                          />
                          <Icon className="w-4 h-4 mr-1.5 text-gray-500" />
                          <span className="text-sm text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Cancellation Policy */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Cancellation Policy</h3>
                    <select
                      value={filters.cancellationPolicy}
                      onChange={(e) => setFilters({ ...filters, cancellationPolicy: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      <option value="">Any Policy</option>
                      <option value="flexible">Flexible</option>
                      <option value="strict">Strict</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {session?.user?.type === 'fan' 
              ? `${filteredConcerts.length} Concert${filteredConcerts.length !== 1 ? 's' : ''} Found`
              : `${filteredArtists.length} Artist${filteredArtists.length !== 1 ? 's' : ''} Found`
            }
          </h2>
        </div>

        {/* Concert Grid for Fans */}
        {session?.user?.type === 'fan' ? (
          filteredConcerts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConcerts.map((concert) => (
                <Card key={concert.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Concert Image */}
                  <div className="relative h-48 bg-gradient-to-br from-sage/20 to-french-blue/20">
                    {concert.imageUrl ? (
                      <img 
                        src={concert.imageUrl} 
                        alt={`${concert.artistName} concert`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="w-12 h-12 text-sage/60" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                        ${concert.ticketPrice}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {concert.title}
                      </h3>
                      <p className="text-sm text-gray-600">by {concert.artistName}</p>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {concert.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(concert.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} at {concert.startTime}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        {concert.capacity} capacity • {concert.attendees.length} going
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {(concert as any).genre?.slice(0, 3)?.map((genre: string) => (
                        <Badge key={genre} variant="secondary" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={() => handleRSVPClick(concert)}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      RSVP
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No concerts match your search criteria.</p>
              <Button
                onClick={() => setSearchQuery('')}
                variant="outline"
                className="mt-4"
              >
                Clear Search
              </Button>
            </div>
          )
        ) : (
          /* Artist Grid for Hosts/Artists */
          filteredArtists.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtists.map((artist) => (
                <ArtistCard key={(artist as any).id || Math.random()} artist={artist} />
              ))}
            </div>
          ) : artists.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No artists are currently available in the database.</p>
              <p className="text-gray-400 text-sm mt-2">Artists need to complete their profiles and be approved to appear here.</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No artists match your search criteria.</p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    minYearsActive: '',
                    maxTourMonths: '',
                    requirements: {
                      requireHomeStay: false,
                      ownSoundSystem: false,
                      travelWithAnimals: false
                    },
                    cancellationPolicy: ''
                  });
                }}
                variant="outline"
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )
        )}
      </div>

      {/* RSVP Modal */}
      {showRSVPModal && selectedConcert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  RSVP for Concert
                </h3>
                <button
                  onClick={() => setShowRSVPModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-1">
                  {selectedConcert?.title}
                </h4>
                <p className="text-sm text-gray-600">
                  by {selectedConcert?.artistName}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedConcert?.date && new Date(selectedConcert.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} at {selectedConcert?.startTime}
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many guests? (including yourself)
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium text-gray-900 min-w-[2rem] text-center">
                    {guestCount}
                  </span>
                  <button
                    onClick={() => setGuestCount(Math.min((selectedConcert?.capacity || 0) - (selectedConcert?.attendees?.length || 0), guestCount + 1))}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {(selectedConcert?.capacity || 0) - (selectedConcert?.attendees?.length || 0)} spots available
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowRSVPModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRSVPSubmit}
                  className="flex-1 bg-sage hover:bg-sage/90 text-white"
                >
                  Submit RSVP
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}