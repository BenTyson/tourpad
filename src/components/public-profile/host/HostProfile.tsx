'use client';
import { Users, User } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { HostMember } from '../types';

interface HostProfileProps {
  hostMembers?: HostMember[];
  hostName?: string;
  hostingExperience?: string;
  reviewCount: number;
  rating: number;
}

export default function HostProfile({ 
  hostMembers, 
  hostName, 
  hostingExperience, 
  reviewCount, 
  rating 
}: HostProfileProps) {
  const hasMultipleHosts = hostMembers && hostMembers.length > 1;
  const displayName = hostMembers && hostMembers.length > 0 
    ? hostMembers.map(h => h.hostName).join(' & ')
    : hostName;

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Meet Your {hasMultipleHosts ? 'Hosts' : 'Host'}
            </h2>
            <div>
              <p className="text-neutral-600">
                Hosted by {displayName}
              </p>
              <div className="flex items-center space-x-4 text-sm text-neutral-500 mt-2">
                {hostingExperience && <span>{hostingExperience} hosting experience</span>}
                {hostingExperience && <span>•</span>}
                <span>{reviewCount} reviews</span>
                <span>•</span>
                <span>{rating} ⭐ average rating</span>
              </div>
            </div>
          </div>
          <Badge variant="default" className="bg-primary-100 text-primary-800">
            {hostingExperience || 'Experienced Host'}
          </Badge>
        </div>
        
        {/* Host Members */}
        {hostMembers && hostMembers.length > 0 ? (
          <div className="space-y-6">
            {hostMembers.map((hostPerson) => (
              <div key={hostPerson.id} className="flex items-start space-x-6">
                <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg flex-shrink-0">
                  {hostPerson.profilePhoto ? (
                    <img 
                      src={hostPerson.profilePhoto} 
                      alt={`${hostPerson.hostName} profile photo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                      <User className="w-10 h-10 text-neutral-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    {hostPerson.hostName}
                  </h3>
                  <p className="text-neutral-700 leading-relaxed">
                    {hostPerson.aboutMe}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Single host fallback */
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center">
              <User className="w-8 h-8 text-neutral-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">{displayName}</h3>
              <p className="text-neutral-600">Your friendly host</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}