'use client';
import Link from 'next/link';
import { useState } from 'react';
import { 
  HomeIcon, 
  MusicalNoteIcon, 
  UsersIcon, 
  HeartIcon,
  ShieldCheckIcon,
  GiftIcon,
  ChevronRightIcon,
  PlayIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

export default function ForHostsPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const benefits = [
    {
      icon: <MusicalNoteIcon className="h-8 w-8" />,
      title: "Discover New Music",
      description: "Be the first to experience emerging artists and established musicians in your own space."
    },
    {
      icon: <UsersIcon className="h-8 w-8" />,
      title: "Build Community",
      description: "Bring together music lovers in your area and create lasting friendships through shared experiences."
    },
    {
      icon: <HomeIcon className="h-8 w-8" />,
      title: "Share Your Space",
      description: "Transform your living room, barn, or unique venue into a magical performance space."
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: "Vetted Artists",
      description: "Host pre-approved, professional musicians who understand house concert etiquette and respect your space."
    },
    {
      icon: <GiftIcon className="h-8 w-8" />,
      title: "No Financial Risk",
      description: "Hosting is completely free. Artists cover their own costs and any door fees go directly to them."
    },
    {
      icon: <HeartIcon className="h-8 w-8" />,
      title: "Meaningful Impact",
      description: "Support touring musicians and help sustain the house concert movement across the country."
    }
  ];

  const testimonials = [
    {
      quote: "Hosting through TourPad has brought such joy to our home. The artists are professional, respectful, and incredibly talented. Our living room has become a music venue!",
      author: "Maria Rodriguez",
      venue: "The Garden House",
      shows: "8 shows hosted"
    },
    {
      quote: "What I love most is the community that forms around these shows. Neighbors become friends, and everyone leaves with new favorite artists.",
      author: "David Thompson",
      venue: "Riverside Barn",
      shows: "15 shows hosted"
    },
    {
      quote: "The quality of artists on TourPad is exceptional. Every show has been a memorable experience for both us and our guests.",
      author: "Jennifer Park",
      venue: "Urban Loft Sessions",
      shows: "6 shows hosted"
    }
  ];

  const features = [
    "Complete control over your hosting schedule and capacity",
    "Direct communication with artists for planning and coordination",
    "Flexible hosting options (lodging optional, equipment optional)",
    "Support team available for any questions or concerns",
    "Artist background checks and platform verification",
    "Community guidelines that protect both hosts and artists"
  ];

  const venueTypes = [
    {
      title: "Living Rooms",
      description: "Cozy, intimate settings perfect for acoustic performances",
      capacity: "15-30 guests",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"
    },
    {
      title: "Barns & Outdoor",
      description: "Rustic spaces with room for larger audiences",
      capacity: "30-100+ guests",
      image: "https://images.unsplash.com/photo-1544264503-9fb1f3b91040?w=400"
    },
    {
      title: "Unique Spaces",
      description: "Lofts, studios, galleries, and creative venues",
      capacity: "20-50 guests",
      image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sage-light-50 via-beige-50 to-rose-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Open Your
                <span className="text-secondary"> Home</span>
                <br />
                <span className="text-secondary">to Music</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-8">
                Join a community of music lovers who host intimate house concerts. 
                Discover incredible artists, build lasting friendships, and transform your space into a magical venue.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/register?type=host">
                  <Button size="lg" className="w-full sm:w-auto">
                    Apply as a Host
                    <ChevronRightIcon className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="lg" className="w-full sm:w-auto group">
                  <PlayIcon className="mr-2 h-5 w-5 group-hover:text-secondary transition-colors" />
                  See Host Stories
                </Button>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Completely free to host • Vetted artists • Full support
              </p>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <img
                    className="w-full h-64 object-cover"
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"
                    alt="Cozy living room house concert"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm font-medium">Hosted by Maria</p>
                    <p className="text-xs opacity-90">Austin, TX • 25 guests</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why People Love Hosting
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the joy of bringing live music to your community while supporting touring artists.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 text-secondary rounded-xl mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Venue Types Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perfect for Any Space
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From cozy living rooms to spacious barns, TourPad artists perform in all kinds of venues.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {venueTypes.map((venue, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <img
                  className="w-full h-48 object-cover"
                  src={venue.image}
                  alt={venue.title}
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {venue.title}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {venue.description}
                  </p>
                  <div className="text-sm text-secondary font-medium">
                    Typical capacity: {venue.capacity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div className="order-2 lg:order-1 mt-12 lg:mt-0">
              <div className="grid grid-cols-2 gap-4">
                <img
                  className="rounded-lg shadow-lg"
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
                  alt="Host welcoming guests"
                />
                <img
                  className="rounded-lg shadow-lg mt-8"
                  src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400"
                  alt="Artist performing for engaged audience"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Hosting Made Simple
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We handle the logistics so you can focus on creating magical musical experiences in your space.
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckIcon className="h-6 w-6 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="ml-3 text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stories from Our Hosts
            </h2>
            <p className="text-lg text-gray-600">
              Real experiences from people who've opened their homes to music
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-secondary-50 to-primary-50 rounded-2xl p-8 md:p-12">
              <blockquote className="text-xl md:text-2xl font-medium text-gray-900 mb-6 leading-relaxed">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonials[currentTestimonial].author}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[currentTestimonial].venue}
                  </div>
                  <div className="text-sm text-secondary font-medium mt-1">
                    {testimonials[currentTestimonial].shows}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentTestimonial ? 'bg-secondary' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-secondary to-primary">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Open Your Home to Music?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Join hundreds of hosts who are creating unforgettable musical experiences 
            in their communities while supporting touring artists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?type=host">
              <Button size="lg" variant="ghost" className="bg-white text-secondary hover:bg-gray-50 w-full sm:w-auto">
                Apply as a Host
                <ChevronRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="ghost" className="bg-transparent border-white text-white hover:bg-white/10 w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-white/80 text-sm">
            Questions? Email us at <a href="mailto:hello@tourpad.com" className="underline">hello@tourpad.com</a>
          </p>
        </div>
      </section>
    </div>
  );
}