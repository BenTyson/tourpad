'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Guitar, Home, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-mist">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-french-blue/5 to-sage/5 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-french-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sage/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              How It Works
            </h1>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
              Imagine walking into someone's living room and hearing your new favorite band perform just for you and twenty other music lovers.
            </p>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              This is the world TourPad creates—where artists, hosts, and fans come together to build an ecosystem of authentic musical connection that traditional venues simply can't offer.
            </p>
          </div>

          {/* Hero Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-16">
            <Image
              src="/photos/fr_4.jpg"
              alt="House concert community"
              width={1200}
              height={600}
              className="w-full h-[400px] sm:h-[500px] object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-evergreen/40 via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      {/* For Artists Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/photos/fr_5-min.jpg"
                  alt="Artist performing at house concert"
                  width={600}
                  height={400}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-french-blue/30 via-transparent to-transparent"></div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                For Artists: Tour Smarter, Connect Deeper
              </h2>
              <div className="prose prose-lg text-gray-700 space-y-6">
                <p>
                  As a touring musician, you know the challenges: finding venues that actually care about your music, dealing with promoters who take massive cuts, and performing for crowds that might not even be listening. TourPad changes everything about how you tour.
                </p>
                <p>
                  When you join TourPad, you create a profile that truly represents who you are as an artist. Share your music, showcase your band with photos and videos, and tell hosts about your upcoming tour plans. Our interactive map becomes your touring command center where you can explore host venues nationwide.
                </p>
                <p>
                  <strong>Here's where TourPad really shines: you keep 100% of everything.</strong> Every dollar from the door goes into your pocket. Every piece of merchandise sold is yours. No venue cuts, no promoter fees, no hidden charges. You're building direct relationships with people who genuinely want to support your music.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Hosts Section */}
      <section className="py-20 bg-gradient-to-br from-sage/5 to-evergreen/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                For Hosts: Share Your Space, Support Live Music
              </h2>
              <div className="prose prose-lg text-gray-700 space-y-6">
                <p>
                  Maybe you've always dreamed of having concerts in your backyard. Perhaps you remember house shows from college and want to bring that magic back into your life. Or you simply love music and want to support touring artists in a meaningful way.
                </p>
                <p>
                  Your host profile tells the story of your venue and who you are as a music lover. Upload photos of your listening space—whether it's a cozy living room, a spacious backyard, an industrial loft, or something completely unique. Share details about your capacity and what genres excite you most.
                </p>
                <p>
                  Finding artists to host becomes an adventure in music discovery. Browse profiles of touring musicians, listen to their music, and see when they're planning to be in your area. <strong>Best of all, you get to use TourPad completely free.</strong> We believe hosts are the backbone of the house concert community.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/photos/fr_2-min.jpg"
                  alt="House concert venue space"
                  width={600}
                  height={400}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sage/30 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Fans Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/photos/fr_1.jpg"
                  alt="Fans enjoying house concert"
                  width={600}
                  height={400}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-evergreen/30 via-transparent to-transparent"></div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                For Fans: Discover Intimate Musical Experiences
              </h2>
              <div className="prose prose-lg text-gray-700 space-y-6">
                <p>
                  Concert venues keep getting bigger, tickets keep getting more expensive, and the experience feels increasingly disconnected from the music itself. TourPad brings you back to what live music should be: intimate, personal, and real.
                </p>
                <p>
                  When you create your fan profile, you're joining a community of people who value authentic musical experiences. You can browse artist profiles, listen to their music, and discover new sounds before deciding which shows to attend.
                </p>
                <p>
                  These aren't typical concerts. You might find yourself sitting on a couch while a singer-songwriter performs three feet away. You could be dancing in someone's backyard while a band plays under string lights. <strong>You're not just attending a concert—you're becoming part of the artist's journey and the host's community.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Magic Section */}
      <section className="py-20 bg-gradient-to-br from-sage/5 to-evergreen/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              The Magic of House Concerts
            </h2>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-16">
            <Image
              src="/photos/fr_3-min.jpg"
              alt="The magic of house concerts"
              width={1200}
              height={500}
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-evergreen/80 via-evergreen/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-12">
              <div className="text-center text-white max-w-4xl mx-auto">
                <blockquote className="text-2xl sm:text-3xl font-bold leading-tight mb-8">
                  "What makes house concerts special isn't just the intimate setting—it's the complete reimagining of how music, artists, and audiences connect."
                </blockquote>
                <p className="text-lg text-white/90 leading-relaxed">
                  For artists, TourPad represents freedom from the traditional music industry's limitations. Hosts discover the profound joy of bringing live music into their communities. Fans get access to musical experiences that simply don't exist anywhere else.
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-xl text-gray-700 max-w-none text-center">
            <p className="text-xl leading-relaxed">
              Every house concert strengthens this ecosystem. Artists build fanbases of people who genuinely care about their music. Hosts create musical communities in their neighborhoods. Fans discover new sounds and form connections that extend far beyond any single show.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-evergreen to-neutral-800 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            Building the Future of Live Music
          </h2>
          <div className="prose prose-xl text-white/90 max-w-none mb-12">
            <p className="text-xl leading-relaxed">
              TourPad isn't trying to replace traditional venues—we're creating something entirely different. Whether you're an artist dreaming of touring without compromise, a host wanting to bring live music into your community, or a fan seeking authentic musical experiences, TourPad connects you with people who share your passion for live music done right.
            </p>
            <p className="text-lg leading-relaxed mt-6">
              The future of live music isn't bigger venues and higher ticket prices—it's more personal, more connected, and more real. It's happening in living rooms and backyards across the country, and it's waiting for you to be part of it.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <Link href="/register?type=artist">
              <Button size="lg" className="w-full px-6 py-4 bg-white text-evergreen hover:bg-mist hover:text-evergreen shadow-lg hover:shadow-xl transition-all duration-300">
                <Guitar className="w-5 h-5 mr-2" />
                Tour as an Artist
              </Button>
            </Link>
            
            <Link href="/register?type=host">
              <Button size="lg" className="w-full px-6 py-4 bg-white text-evergreen hover:bg-mist hover:text-evergreen shadow-lg hover:shadow-xl transition-all duration-300">
                <Home className="w-5 h-5 mr-2" />
                Host Concerts
              </Button>
            </Link>
            
            <Link href="/register?type=fan">
              <Button size="lg" className="w-full px-6 py-4 bg-white text-evergreen hover:bg-mist hover:text-evergreen shadow-lg hover:shadow-xl transition-all duration-300">
                <Heart className="w-5 h-5 mr-2" />
                Discover Music
              </Button>
            </Link>
          </div>

          <p className="text-white/70 italic text-lg">
            Join thousands of music lovers who are reimagining what concerts can be.
          </p>
        </div>
      </section>
    </div>
  );
}