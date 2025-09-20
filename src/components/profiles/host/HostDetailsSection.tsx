import React from 'react';
import Link from 'next/link';
import {
  Globe,
  Instagram,
  Youtube,
  Facebook
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface HostDetailsSectionProps {
  host: {
    id: string;
    name: string;
    bio?: string;
    website?: string;
    socialLinks?: {
      website?: string;
      instagram?: string;
      youtube?: string;
      facebook?: string;
    };
    hostInfo?: {
      hostName: string;
      profilePhoto?: string;
      aboutMe?: string;
    };
    hostMembers?: Array<{
      id: string;
      hostName: string;
      profilePhoto?: string;
      aboutMe?: string;
    }>;
    showSpecs: {
      hostingHistory: string;
    };
    rating: number;
    reviewCount: number;
  };
}

export function HostDetailsSection({ host }: HostDetailsSectionProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Meet Your {(host.hostMembers && host.hostMembers.length > 1) ? 'Hosts' : 'Host'}
            </h2>
            <div>
              <p className="text-neutral-600">
                Hosted by {
                  host.hostMembers && host.hostMembers.length > 0
                    ? host.hostMembers.map(h => h.hostName).join(' & ')
                    : host.hostInfo?.hostName || host.name
                }
              </p>
              <div className="flex items-center space-x-4 text-sm text-neutral-500 mt-2">
                <span>{host.showSpecs.hostingHistory} hosting experience</span>
                <span>•</span>
                <span>{host.reviewCount} reviews</span>
                <span>•</span>
                <span>{host.rating} ⭐ average rating</span>
              </div>
            </div>
          </div>
          <Badge variant="default" className="bg-primary-100 text-primary-800">
            {host.showSpecs.hostingHistory} Experience
          </Badge>
        </div>

        {/* Multiple hosts display */}
        {host.hostMembers && host.hostMembers.length > 0 ? (
          <div className="space-y-6">
            {host.hostMembers.map((hostPerson, index) => (
              <div key={hostPerson.id} className="flex items-start space-x-6">
                <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg flex-shrink-0">
                  {hostPerson.profilePhoto ? (
                    <img
                      src={hostPerson.profilePhoto}
                      alt={`${hostPerson.hostName} profile photo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white font-bold text-2xl">
                      {hostPerson.hostName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">{hostPerson.hostName}</h3>
                  <p className="text-neutral-700 leading-relaxed">
                    {hostPerson.aboutMe || 'Passionate about bringing live music into intimate settings. I love creating memorable experiences where artists and audiences can connect in a personal, meaningful way.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Single host display (legacy) */
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
              {host.hostInfo?.profilePhoto ? (
                <img
                  src={host.hostInfo.profilePhoto}
                  alt={`${host.hostInfo.hostName || host.name} profile photo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white font-bold text-2xl">
                  {host.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">{host.hostInfo?.hostName || host.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-4">
                <span>{host.showSpecs.hostingHistory} hosting experience</span>
                <span>•</span>
                <span>{host.reviewCount} reviews</span>
                <span>•</span>
                <span>{host.rating} ⭐ average rating</span>
              </div>
              <p className="text-neutral-700 leading-relaxed">
                {host.hostInfo?.aboutMe || host.bio || 'Passionate about bringing live music into intimate settings. I love creating memorable experiences where artists and audiences can connect in a personal, meaningful way.'}
              </p>
            </div>
          </div>
        )}

        {/* Social Links */}
        {(host.website || host.socialLinks?.instagram || host.socialLinks?.youtube || host.socialLinks?.facebook) && (
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <div className="flex items-center space-x-4">
              {host.website && (
                <a
                  href={host.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-primary-600 transition-colors"
                  title="Website"
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
              {host.socialLinks?.instagram && (
                <a
                  href={host.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-pink-600 transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {host.socialLinks?.youtube && (
                <a
                  href={host.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-red-600 transition-colors"
                  title="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {host.socialLinks?.facebook && (
                <a
                  href={host.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-[var(--color-evergreen)] transition-colors"
                  title="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        )}

        <div className="mt-6">
          <Link href={`/messages?hostId=${host.id}`}>
            <Button variant="outline" size="sm">
              Contact Host
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}