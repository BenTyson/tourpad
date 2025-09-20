'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Music, Home, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface UserTypesSectionProps {}

export function UserTypesSection({}: UserTypesSectionProps) {
  const userTypes = [
    {
      type: 'artist',
      icon: Music,
      title: 'Artists',
      subtitle: 'Book Your Tour',
      description: 'Connect with passionate hosts who transform their spaces into intimate venues.',
      photo: '/photos/fr_5-min.jpg',
      colorClass: 'from-sage to-evergreen',
      story: 'Every living room becomes your stage. Every audience member becomes a fan.'
    },
    {
      type: 'host',
      icon: Home,
      title: 'Hosts',
      subtitle: 'Create Magic',
      description: 'Open your space and heart to incredible touring artists and music lovers.',
      photo: '/photos/fr_4.jpg',
      colorClass: 'from-french-blue to-primary-700',
      story: 'Turn any space into a concert venue. Bring your community together.'
    },
    {
      type: 'fan',
      icon: Heart,
      title: 'Fans',
      subtitle: 'Find Your Tribe',
      description: 'Discover intimate concerts where every note matters and connections are real.',
      photo: '/photos/fr_3-min.jpg',
      colorClass: 'from-sand to-secondary-600',
      story: 'Feel the music in your bones. Meet artists face-to-face.'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Find Your Place in Live Music
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you create, host, or experience music, there's a place for you in our community.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {userTypes.map((userType, index) => (
            <div key={userType.type} className="group">
              <div className="relative rounded-2xl overflow-hidden mb-6 aspect-[4/3] shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src={userType.photo}
                  alt={`${userType.title} story`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className={`absolute top-6 left-6 p-3 rounded-full bg-${userType.colorClass.split(' ')[0].replace('from-', '')} shadow-lg`}>
                  <userType.icon className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="p-6 bg-white rounded-2xl shadow-sm border border-neutral-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{userType.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{userType.description}</p>
                <Link href={`/register?type=${userType.type}`}>
                  <Button
                    variant="outline"
                    className="w-full border-french-blue text-french-blue hover:bg-french-blue hover:text-white transition-all duration-300"
                  >
                    {userType.subtitle}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}