'use client';
import Image from 'next/image';
import { Users, Heart, Star } from 'lucide-react';

interface StorySectionProps {}

export function StorySection({}: StorySectionProps) {
  return (
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
  );
}