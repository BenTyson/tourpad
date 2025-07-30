'use client';
import { Globe, Instagram, Youtube, Facebook, Twitter, Music } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SocialLinksProps } from '../types';

const PLATFORM_CONFIG = {
  website: { icon: Globe, label: 'Website' },
  instagram: { icon: Instagram, label: 'Instagram' },
  youtube: { icon: Youtube, label: 'YouTube' },
  facebook: { icon: Facebook, label: 'Facebook' },
  twitter: { icon: Twitter, label: 'Twitter' },
  spotify: { icon: Music, label: 'Spotify' },
  bandcamp: { icon: Music, label: 'Bandcamp' },
  soundcloud: { icon: Music, label: 'SoundCloud' }
};

export default function SocialLinks({ links, website, className = '' }: SocialLinksProps) {
  const allLinks = { ...links };
  if (website && !allLinks.website) {
    allLinks.website = website;
  }

  const hasLinks = Object.values(allLinks).some(link => link);
  if (!hasLinks) return null;

  return (
    <section className={`bg-neutral-50 border-b border-neutral-200 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap justify-center gap-3">
          {Object.entries(allLinks).map(([platform, url]) => {
            if (!url) return null;
            
            const config = PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG];
            if (!config) return null;
            
            const Icon = config.icon;
            
            return (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {config.label}
                </Button>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}