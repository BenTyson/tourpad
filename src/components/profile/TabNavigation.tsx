'use client';
import { FileText, Video, Camera, Volume2, Home } from 'lucide-react';
import { TabType } from './types';

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isArtist: boolean;
}

export default function TabNavigation({ activeTab, setActiveTab, isArtist }: TabNavigationProps) {
  const tabButtonClass = (tab: TabType) => `
    flex items-center px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
      activeTab === tab
        ? 'bg-white text-primary-600 shadow-sm'
        : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
    }
  `;

  return (
    <div className="mb-8">
      <nav className="flex space-x-2 bg-neutral-50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('info')}
          className={tabButtonClass('info')}
        >
          <FileText className="w-4 h-4 mr-2" />
          Profile Information
        </button>
        
        <button
          onClick={() => setActiveTab('media')}
          className={tabButtonClass('media')}
        >
          {isArtist ? (
            <Video className="w-4 h-4 mr-2" />
          ) : (
            <Camera className="w-4 h-4 mr-2" />
          )}
          {isArtist ? 'Music & Media' : 'Gallery'}
        </button>
        
        {!isArtist && (
          <>
            <button
              onClick={() => setActiveTab('sound-system')}
              className={tabButtonClass('sound-system')}
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Sound System & Equipment
            </button>
            
            <button
              onClick={() => setActiveTab('lodging')}
              className={tabButtonClass('lodging')}
            >
              <Home className="w-4 h-4 mr-2" />
              Lodging
            </button>
          </>
        )}
      </nav>
    </div>
  );
}