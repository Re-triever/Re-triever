import React from 'react';
import { History, FileCode, Folder, Settings } from 'lucide-react';

export default function NavTabs({ activeTab, setActiveTab, folderCount }) {
  return (
    <div className="px-5 pt-3 pb-1 bg-[oklch(0.962_0.059_95.617)] flex border-b border-[#EEDCC8] space-x-2">
      {/* Activity Feed Tab */}
      <button
        onClick={() => setActiveTab('activity')}
        className={`px-4 py-2 text-xs font-bold rounded-full transition-all flex items-center gap-2 ${
          activeTab === 'activity'
            ? 'bg-[#E07A5F] text-white shadow-md shadow-[#E07A5F]/20 scale-105'
            : 'bg-white hover:bg-[#FFF8F2] text-[#786658] hover:text-[#2A201A] border border-[#EEDCC8]'
        }`}
      >
        <History className="w-3.5 h-3.5" />
        Activity Feed
      </button>

      {/* Tracked Files & Diffs Tab */}
      <button
        onClick={() => setActiveTab('history')}
        className={`px-4 py-2 text-xs font-bold rounded-full transition-all flex items-center gap-2 ${
          activeTab === 'history'
            ? 'bg-[#E07A5F] text-white shadow-md shadow-[#E07A5F]/20 scale-105'
            : 'bg-white hover:bg-[#FFF8F2] text-[#786658] hover:text-[#2A201A] border border-[#EEDCC8]'
        }`}
      >
        <FileCode className="w-3.5 h-3.5" />
        Tracked Files & Diffs
      </button>

      {/* Folders Tab */}
      <button
        onClick={() => setActiveTab('folders')}
        className={`px-4 py-2 text-xs font-bold rounded-full transition-all flex items-center gap-2 ${
          activeTab === 'folders'
            ? 'bg-[#E07A5F] text-white shadow-md shadow-[#E07A5F]/20 scale-105'
            : 'bg-white hover:bg-[#FFF8F2] text-[#786658] hover:text-[#2A201A] border border-[#EEDCC8]'
        }`}
      >
        <Folder className="w-3.5 h-3.5" />
        Monitored Folders ({folderCount})
      </button>

      {/* Settings Tab */}
      <button
        onClick={() => setActiveTab('settings')}
        className={`px-4 py-2 text-xs font-bold rounded-full transition-all flex items-center gap-2 ${
          activeTab === 'settings'
            ? 'bg-[#E07A5F] text-white shadow-md shadow-[#E07A5F]/20 scale-105'
            : 'bg-white hover:bg-[#FFF8F2] text-[#786658] hover:text-[#2A201A] border border-[#EEDCC8]'
        }`}
        title="Settings & Preferences"
      >
        <Settings className="w-3.5 h-3.5" />
        Settings
      </button>
    </div>
  );
}
