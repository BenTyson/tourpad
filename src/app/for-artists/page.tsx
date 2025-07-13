'use client';
import Link from 'next/link';
import { useState } from 'react';
import { 
  HomeIcon, 
  MapPinIcon, 
  UsersIcon, 
  HeartIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ChevronRightIcon,
  PlayIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

export default function ForArtistsPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const benefits = [
    {
      icon: <HomeIcon className="h-8 w-8" />,
      title: "Intimate Venues",
      description: "Perform in cozy living rooms, rustic barns, and unique spaces that create magical connections with your audience."
    },
    {
      icon: <MapPinIcon className="h-8 w-8" />,
      title: "Tour Planning",
      description: "Build meaningful tours across the country with vetted hosts who understand and love live music."
    },
    {
      icon: <UsersIcon className="h-8 w-8" />,
      title: "Engaged Audiences",
      description: "Connect with music lovers who choose to attend because they genuinely want to discover new artists."
    },
    {
      icon: <CalendarDaysIcon className="h-8 w-8" />,
      title: "Flexible Booking",
      description: "Book shows that fit your schedule and tour route, with hosts who accommodate your specific needs."
    },
    {
      icon: <CurrencyDollarIcon className="h-8 w-8" />,
      title: "Fair Compensation",
      description: "Door fees and tips go directly to you, plus opportunities for merchandise sales and fan connections."
    },
    {
      icon: <HeartIcon className="h-8 w-8" />,
      title: "Authentic Community",
      description: "Join a curated network of serious musicians and dedicated hosts who care about the music experience."
    }
  ];

  const testimonials = [
    {
      quote: "TourPad has transformed how we tour. The intimate connections we make at house concerts are unlike anything we experience at traditional venues.",
      author: "Sarah Johnson",
      band: "Sarah & The Wanderers",
      shows: "12 shows booked"
    },
    {
      quote: "The hosts on TourPad aren't just providing a venue - they're creating experiences. Every show feels special and personal.",
      author: "Marcus Blue",
      band: "Solo Folk Artist",
      shows: "18 shows booked"
    },
    {
      quote: "What I love most is the quality of the audiences. People come to these shows because they want to discover new music, not just have background entertainment.",
      author: "Elena Martinez",
      band: "Echo & Iris",
      shows: "8 shows booked"
    }
  ];

  const features = [
    "Vetted host community with proven track records",
    "Direct messaging system for coordination",
    "Flexible cancellation policies that protect both parties",
    "Host amenity matching (sound systems, lodging, etc.)",
    "Tour route planning tools and batch booking",
    "Secure payment processing and transparent fees"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-neutral-50 to-secondary-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Tour
                <span className="text-primary"> Differently</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-8">
                Connect with passionate hosts across the country who open their homes for intimate house concerts. 
                Build meaningful tours, engage authentic audiences, and create unforgettable musical experiences.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/register?type=artist">
                  <Button size="lg" className="w-full sm:w-auto">
                    Apply as an Artist
                    <ChevronRightIcon className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="lg" className="w-full sm:w-auto group">
                  <PlayIcon className="mr-2 h-5 w-5 group-hover:text-primary transition-colors" />
                  Watch How It Works
                </Button>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                $400/year after approval • 7-day free trial • Cancel anytime
              </p>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <img
                    className="w-full h-64 object-cover"
                    src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800"
                    alt="Intimate house concert performance"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm font-medium">Live at The Garden House</p>
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
              Why Artists Choose TourPad
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join hundreds of musicians who've discovered a better way to tour through authentic house concert experiences.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary rounded-xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
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

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Everything You Need to Tour Successfully
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                TourPad provides a complete platform for planning, booking, and managing your house concert tours with confidence and ease.
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
            <div className="mt-12 lg:mt-0">
              <div className="grid grid-cols-2 gap-4">
                <img
                  className="rounded-lg shadow-lg"
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
                  alt="Artist performing acoustic set"
                />
                <img
                  className="rounded-lg shadow-lg mt-8"
                  src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400"
                  alt="Intimate venue atmosphere"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Hear from Our Artists
            </h2>
            <p className="text-lg text-gray-600">
              Real stories from musicians who've built meaningful connections through TourPad
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 md:p-12">
              <blockquote className="text-xl md:text-2xl font-medium text-gray-900 mb-6 leading-relaxed">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonials[currentTestimonial].author}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[currentTestimonial].band}
                  </div>
                  <div className="text-sm text-primary font-medium mt-1">
                    {testimonials[currentTestimonial].shows}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentTestimonial ? 'bg-primary' : 'bg-gray-300'
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
      <section className="py-24 bg-gradient-to-r from-primary to-secondary">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your House Concert Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Join our community of touring musicians and start building meaningful connections 
            with hosts and audiences across the country.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?type=artist">
              <Button size="lg" variant="ghost" className="bg-white text-primary hover:bg-gray-50 w-full sm:w-auto">
                Apply as an Artist
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