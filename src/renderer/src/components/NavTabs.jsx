import React from 'react';
import { History, FileCode, Folder, Settings } from 'lucide-react';

export default function NavTabs({ theme, activeTab, setActiveTab, folderCount }) {
  return (
    <div className={`px-4 pt-2.5 flex border-b space-x-1 ${
      theme === 'dark' ? 'bg-black border-zinc-800' : 'bg-zinc-100 border-zinc-200'
    }`}>
      <button
        onClick={() => setActiveTab('activity')}
        className={`flex-1 py-1.5 text-xs font-medium rounded-t-md border-t border-x transition-all flex items-center justify-center gap-1.5 ${
          activeTab === 'activity'
            ? (theme === 'dark' ? 'bg-black text-white border-zinc-800 border-b-transparent shadow-sm font-semibold' : 'bg-white text-zinc-900 border-zinc-300 border-b-transparent shadow-sm font-semibold')
            : (theme === 'dark' ? 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-900' : 'text-zinc-600 border-transparent hover:text-zinc-900 hover:bg-zinc-200/60')
        }`}
      >
        <History className="w-3.5 h-3.5" />
        Activity Feed
      </button>

      <button
        onClick={() => setActiveTab('history')}
        className={`flex-1 py-1.5 text-xs font-medium rounded-t-md border-t border-x transition-all flex items-center justify-center gap-1.5 ${
          activeTab === 'history'
            ? (theme === 'dark' ? 'bg-black text-white border-zinc-800 border-b-transparent shadow-sm font-semibold' : 'bg-white text-zinc-900 border-zinc-300 border-b-transparent shadow-sm font-semibold')
            : (theme === 'dark' ? 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-900' : 'text-zinc-600 border-transparent hover:text-zinc-900 hover:bg-zinc-200/60')
        }`}
      >
        <FileCode className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
        File History & Diffs
      </button>

      <button
        onClick={() => setActiveTab('folders')}
        className={`flex-1 py-1.5 text-xs font-medium rounded-t-md border-t border-x transition-all flex items-center justify-center gap-1.5 ${
          activeTab === 'folders'
            ? (theme === 'dark' ? 'bg-black text-white border-zinc-800 border-b-transparent shadow-sm font-semibold' : 'bg-white text-zinc-900 border-zinc-300 border-b-transparent shadow-sm font-semibold')
            : (theme === 'dark' ? 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-900' : 'text-zinc-600 border-transparent hover:text-zinc-900 hover:bg-zinc-200/60')
        }`}
      >
        <Folder className="w-3.5 h-3.5" />
        Folders ({folderCount})
      </button>

      <button
        onClick={() => setActiveTab('settings')}
        className={`py-1.5 px-3 text-xs font-medium rounded-t-md border-t border-x transition-all flex items-center justify-center gap-1.5 ${
          activeTab === 'settings'
            ? (theme === 'dark' ? 'bg-black text-white border-zinc-800 border-b-transparent shadow-sm font-semibold' : 'bg-white text-zinc-900 border-zinc-300 border-b-transparent shadow-sm font-semibold')
            : (theme === 'dark' ? 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-900' : 'text-zinc-600 border-transparent hover:text-zinc-900 hover:bg-zinc-200/60')
        }`}
        title="Settings & Preferences"
      >
        <Settings className="w-3.5 h-3.5" />
        Settings
      </button>
    </div>
  );
}
