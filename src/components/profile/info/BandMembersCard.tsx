'use client';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Users, UserCircle, Camera, X } from 'lucide-react';
import { ArtistProfile } from '../types';

interface BandMembersCardProps {
  artistProfile: ArtistProfile;
  updateArtistProfile: (updates: Partial<ArtistProfile>) => void;
}

export default function BandMembersCard({
  artistProfile,
  updateArtistProfile
}: BandMembersCardProps) {
  const addBandMember = () => {
    const newMember = {
      id: Date.now().toString(),
      name: '',
      instrument: '',
      photo: ''
    };
    updateArtistProfile({ bandMembers: [...artistProfile.bandMembers, newMember] });
  };

  const updateBandMember = (id: string, field: string, value: string) => {
    updateArtistProfile({
      bandMembers: artistProfile.bandMembers.map(member => 
        member.id === id ? { ...member, [field]: value } : member
      )
    });
  };

  const removeBandMember = (id: string) => {
    updateArtistProfile({
      bandMembers: artistProfile.bandMembers.filter(member => member.id !== id)
    });
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Band Members</h2>
            <p className="text-sm text-neutral-600">
              Add photos and information for each member of your band
            </p>
          </div>
          <Button onClick={addBandMember} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {artistProfile.bandMembers.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <Users className="w-12 h-12 mx-auto mb-2 text-neutral-400" />
            <p>No band members added yet</p>
            <p className="text-sm">Add your band members to showcase your full lineup</p>
          </div>
        ) : (
          <div className="space-y-4">
            {artistProfile.bandMembers.map((member) => (
              <div key={member.id} className="flex items-center space-x-4 p-4 border border-neutral-200 rounded-lg">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
                  {member.photo ? (
                    <img 
                      src={member.photo} 
                      alt={member.name} 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-8 h-8 text-neutral-400" />
                  )}
                </div>
                <div className="flex-1 grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Member name"
                    value={member.name}
                    onChange={(e) => updateBandMember(member.id, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="Instrument/Role"
                    value={member.instrument}
                    onChange={(e) => updateBandMember(member.id, 'instrument', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Check file size (max 5MB)
                        if (file.size > 5 * 1024 * 1024) {
                          alert('Image file is too large. Please choose an image under 5MB.');
                          return;
                        }
                        
                        try {
                          // Create FormData
                          const formData = new FormData();
                          formData.append('file', file);
                          formData.append('type', 'band-member');
                          
                          // Upload file
                          const response = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData
                          });
                          
                          if (!response.ok) {
                            const error = await response.json();
                            alert(error.error || 'Failed to upload image');
                            return;
                          }
                          
                          const data = await response.json();
                          
                          // Update band member with the new image URL
                          updateBandMember(member.id, 'photo', data.url);
                          
                          alert('Band member photo uploaded successfully!');
                          
                        } catch (error) {
                          console.error('Upload error:', error);
                          alert('Failed to upload image. Please try again.');
                        }
                      }
                    }}
                    className="hidden"
                    id={`bandMemberPhoto-${member.id}`}
                  />
                  <Button variant="outline" size="sm" type="button" onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(`bandMemberPhoto-${member.id}`)?.click();
                  }} title={member.photo ? 'Change Photo' : 'Upload Photo'}>
                    <Camera className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeBandMember(member.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}