'use client';
import { Guitar } from 'lucide-react';

interface CommunitySectionProps {}

export function CommunitySection({}: CommunitySectionProps) {
  return (
    <section className="relative py-32 bg-white overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-french-blue/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-sage/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-french-blue/10 to-sage/10 text-evergreen rounded-full text-sm font-medium mb-8 border border-french-blue/20">
            <Guitar className="w-4 h-4 mr-2" />
            For Touring Artists
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Stop Playing to Empty Rooms.
            <span className="block text-french-blue">
              Start Building Real Fans.
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            House concerts aren't just gigs—they're fan-building machines.
            Every show creates lifelong supporters who actually buy your music.
          </p>
        </div>

        {/* Simplified placeholder content */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-sage/10 to-french-blue/10 p-12 rounded-2xl border border-sage/20 max-w-2xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed">
              Artists who play house concerts build genuine connections with fans, earn more per show,
              and create lasting relationships that support their music career for years to come.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}