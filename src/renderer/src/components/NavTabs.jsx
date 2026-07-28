import React from 'react';
import { History, FileCode, Folder, Settings } from 'lucide-react';

export default function NavTabs({ activeTab, setActiveTab, folderCount }) {
  return (
    <div className="px-5 pt-3 pb-1 bg-[#353536] flex border-b border-[#404042] space-x-2">
      {/* Activity Feed Tab */}
      <button
        onClick={() => setActiveTab('activity')}
        className={`px-4 py-2 text-xs font-bold rounded-full transition-all flex items-center gap-2 ${
          activeTab === 'activity'
            ? 'bg-[#FF6F1E] text-white shadow-md shadow-[#FF6F1E]/30 scale-105'
            : 'bg-[#2B2B2C] hover:bg-[#404042] text-[#FEF1D7] hover:text-white border border-[#404042]'
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
            ? 'bg-[#FF6F1E] text-white shadow-md shadow-[#FF6F1E]/30 scale-105'
            : 'bg-[#2B2B2C] hover:bg-[#404042] text-[#FEF1D7] hover:text-white border border-[#404042]'
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
            ? 'bg-[#FF6F1E] text-white shadow-md shadow-[#FF6F1E]/30 scale-105'
            : 'bg-[#2B2B2C] hover:bg-[#404042] text-[#FEF1D7] hover:text-white border border-[#404042]'
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
            ? 'bg-[#FF6F1E] text-white shadow-md shadow-[#FF6F1E]/30 scale-105'
            : 'bg-[#2B2B2C] hover:bg-[#404042] text-[#FEF1D7] hover:text-white border border-[#404042]'
        }`}
        title="Settings & Preferences"
      >
        <Settings className="w-3.5 h-3.5" />
        Settings
      </button>
    </div>
  );
}
