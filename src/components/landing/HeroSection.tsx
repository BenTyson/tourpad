'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeroSectionProps {}

export function HeroSection({}: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
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
  );
}