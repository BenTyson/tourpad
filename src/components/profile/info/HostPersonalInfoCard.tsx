'use client';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, UserCircle, X } from 'lucide-react';
import { HostProfile } from '../types';

interface HostPersonalInfoCardProps {
  hostProfile: HostProfile;
  updateHostProfile: (updates: Partial<HostProfile>) => void;
}

export default function HostPersonalInfoCard({
  hostProfile,
  updateHostProfile
}: HostPersonalInfoCardProps) {
  const addHostMember = () => {
    const newHostMember = {
      id: Date.now().toString(),
      hostName: '',
      aboutMe: '',
      profilePhoto: ''
    };
    updateHostProfile({ hostMembers: [...hostProfile.hostMembers, newHostMember] });
  };

  const updateHostMember = (hostMemberId: string, updates: Partial<typeof hostProfile.hostMembers[0]>) => {
    updateHostProfile({
      hostMembers: hostProfile.hostMembers.map(member => 
        member.id === hostMemberId ? { ...member, ...updates } : member
      )
    });
  };

  const removeHostMember = (hostMemberId: string) => {
    updateHostProfile({ hostMembers: hostProfile.hostMembers.filter(m => m.id !== hostMemberId) });
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Personal Host Information</h2>
            <p className="text-sm text-neutral-600">
              Add information about each host. This helps artists get to know you personally.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={addHostMember}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Host
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {hostProfile.hostMembers.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-neutral-300 rounded-lg">
            <UserCircle className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <p className="text-sm text-neutral-600 mb-3">No hosts added yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={addHostMember}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Host
            </Button>
          </div>
        ) : (
          hostProfile.hostMembers.map((member, index) => (
            <div key={member.id} className="border border-neutral-200 rounded-lg p-4 relative">
              {hostProfile.hostMembers.length > 1 && (
                <button
                  onClick={() => removeHostMember(member.id)}
                  className="absolute top-4 right-4 text-neutral-400 hover:text-red-600 transition-colors"
                  title="Remove host"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Host Name</label>
                  <Input
                    placeholder="Your name or nickname"
                    value={member.hostName}
                    onChange={(e) => updateHostMember(member.id, { hostName: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">About Me</label>
                  <textarea
                    placeholder="Tell artists a bit about yourself..."
                    value={member.aboutMe}
                    onChange={(e) => updateHostMember(member.id, { aboutMe: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Profile Photo</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-neutral-100 rounded-full overflow-hidden flex items-center justify-center">
                      {member.profilePhoto ? (
                        <img 
                          src={member.profilePhoto} 
                          alt={`${member.hostName} profile`} 
                          className="w-20 h-20 object-cover"
                        />
                      ) : (
                        <UserCircle className="w-10 h-10 text-neutral-400" />
                      )}
                    </div>
                    <div className="flex-1">
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
                              formData.append('type', 'profile');
                              
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
                              
                              // Update this specific host's photo
                              updateHostMember(member.id, { profilePhoto: data.url });
                              
                              alert('Profile photo uploaded successfully!');
                              
                            } catch (error) {
                              console.error('Upload error:', error);
                              alert('Failed to upload image. Please try again.');
                            }
                          }
                        }}
                        className="hidden"
                        id={`hostPhoto-${member.id}`}
                      />
                      <label htmlFor={`hostPhoto-${member.id}`} className="cursor-pointer">
                        <div className="inline-flex items-center px-3 py-2 text-sm border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 rounded-md">
                          {member.profilePhoto ? 'Change Photo' : 'Upload Photo'}
                        </div>
                      </label>
                      {member.profilePhoto && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateHostMember(member.id, { profilePhoto: '' })}
                          className="ml-2 text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}