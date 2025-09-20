'use client';
import Link from 'next/link';
import { Guitar, Home, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CTASectionProps {}

export function CTASection({}: CTASectionProps) {
  return (
    <section className="py-24 bg-gradient-to-br from-mist to-neutral-100">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          Ready to Join?
        </h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Every great musical story starts with someone saying "yes." What's yours?
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
          <Link href="/register?type=artist" className="flex-1">
            <Button size="lg" className="w-full px-6 py-4 bg-sage hover:bg-secondary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Guitar className="w-5 h-5 mr-2" />
              I'm an Artist
            </Button>
          </Link>

          <Link href="/register?type=host" className="flex-1">
            <Button size="lg" className="w-full px-6 py-4 bg-french-blue hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Home className="w-5 h-5 mr-2" />
              I'm a Host
            </Button>
          </Link>

          <Link href="/register?type=fan" className="flex-1">
            <Button size="lg" className="w-full px-6 py-4 bg-evergreen hover:bg-neutral-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Heart className="w-5 h-5 mr-2" />
              I'm a Fan
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}