'use client';
import {
  Sparkles,
  Music,
  Users,
  Home,
  Heart,
  Star,
  Shield,
  PlayCircle
} from 'lucide-react';

interface FeaturesSectionProps {}

export function FeaturesSection({}: FeaturesSectionProps) {
  return (
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
  );
}