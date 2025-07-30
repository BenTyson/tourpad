'use client';
import { Users, Music } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { BandMember } from '../types';

interface BandMembersProps {
  bandMembers: BandMember[];
  bandName: string;
}

export default function BandMembers({ bandMembers, bandName }: BandMembersProps) {
  if (!bandMembers || bandMembers.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-1">Band Members</h2>
            <p className="text-neutral-600">Meet the {bandMembers.length} talented members of {bandName}</p>
          </div>
          <Badge variant="secondary" className="bg-primary-100 text-primary-800">
            <Users className="w-4 h-4 mr-1" />
            {bandMembers.length} Members
          </Badge>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bandMembers.map((member) => (
            <div 
              key={member.id} 
              className="bg-neutral-50 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Photo */}
                <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
                  {member.photo ? (
                    <img 
                      src={member.photo} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-8 h-8 text-neutral-400" />
                    </div>
                  )}
                </div>
                
                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900">{member.name}</h3>
                  <p className="text-sm text-neutral-600 mb-1">{member.instrument}</p>
                  {member.yearsWithBand && (
                    <p className="text-xs text-neutral-500">
                      {member.yearsWithBand} year{member.yearsWithBand !== 1 ? 's' : ''} with band
                    </p>
                  )}
                  {member.bio && (
                    <p className="text-sm text-neutral-700 mt-2 leading-relaxed">
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}