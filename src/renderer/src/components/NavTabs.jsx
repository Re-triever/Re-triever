import React from 'react';
import { History, FileCode, Folder, Settings } from 'lucide-react';

export default function NavTabs({ theme, activeTab, setActiveTab, folderCount }) {
  return (
    <div className={`px-4 pt-2.5 flex border-b space-x-1 ${
      theme === 'dark' ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-100 border-slate-200'
    }`}>
      <button
        onClick={() => setActiveTab('activity')}
        className={`flex-1 py-1.5 text-xs font-medium rounded-t-md border-t border-x transition-all flex items-center justify-center gap-1.5 ${
          activeTab === 'activity'
            ? (theme === 'dark' ? 'bg-slate-900 text-white border-slate-800 border-b-transparent shadow-sm font-semibold' : 'bg-white text-slate-900 border-slate-300 border-b-transparent shadow-sm font-semibold')
            : (theme === 'dark' ? 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40' : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-200/60')
        }`}
      >
        <History className="w-3.5 h-3.5" />
        Activity Feed
      </button>

      <button
        onClick={() => setActiveTab('history')}
        className={`flex-1 py-1.5 text-xs font-medium rounded-t-md border-t border-x transition-all flex items-center justify-center gap-1.5 ${
          activeTab === 'history'
            ? (theme === 'dark' ? 'bg-slate-900 text-white border-slate-800 border-b-transparent shadow-sm font-semibold' : 'bg-white text-slate-900 border-slate-300 border-b-transparent shadow-sm font-semibold')
            : (theme === 'dark' ? 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40' : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-200/60')
        }`}
      >
        <FileCode className="w-3.5 h-3.5 text-emerald-500" />
        File History & Diffs
      </button>

      <button
        onClick={() => setActiveTab('folders')}
        className={`flex-1 py-1.5 text-xs font-medium rounded-t-md border-t border-x transition-all flex items-center justify-center gap-1.5 ${
          activeTab === 'folders'
            ? (theme === 'dark' ? 'bg-slate-900 text-white border-slate-800 border-b-transparent shadow-sm font-semibold' : 'bg-white text-slate-900 border-slate-300 border-b-transparent shadow-sm font-semibold')
            : (theme === 'dark' ? 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40' : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-200/60')
        }`}
      >
        <Folder className="w-3.5 h-3.5" />
        Folders ({folderCount})
      </button>

      <button
        onClick={() => setActiveTab('settings')}
        className={`py-1.5 px-3 text-xs font-medium rounded-t-md border-t border-x transition-all flex items-center justify-center gap-1.5 ${
          activeTab === 'settings'
            ? (theme === 'dark' ? 'bg-slate-900 text-white border-slate-800 border-b-transparent shadow-sm font-semibold' : 'bg-white text-slate-900 border-slate-300 border-b-transparent shadow-sm font-semibold')
            : (theme === 'dark' ? 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40' : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-200/60')
        }`}
        title="Settings & Preferences"
      >
        <Settings className="w-3.5 h-3.5" />
        Settings
      </button>
    </div>
  );
}
