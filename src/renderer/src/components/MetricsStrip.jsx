import React from 'react';
import { Zap, Layers, Folder } from 'lucide-react';
import { formatBytes } from '../utils/diffUtils';

export default function MetricsStrip({ theme, stats = {}, watchedFolderCount = 0 }) {
  const totalCommits = stats.totalCommits ?? stats.total_commits ?? 0;
  const totalDeduplicatedBytes = stats.totalDeduplicatedBytes ?? stats.total_deduplicated_bytes ?? 0;
  const folderCount = stats.watchedFolderCount ?? stats.watched_folder_count ?? watchedFolderCount;

  return (
    <div className={`px-4 py-2 border-b grid grid-cols-3 gap-2 ${
      theme === 'dark' ? 'bg-slate-900/40 border-slate-800/60' : 'bg-slate-100/70 border-slate-200'
    }`}>
      {/* Saved Deduplicated Bytes */}
      <div className={`flex flex-col items-start p-2 rounded-md border ${
        theme === 'dark' ? 'bg-slate-900/80 border-slate-800/50' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className={`text-[10px] flex items-center gap-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          <Zap className="w-3 h-3 text-emerald-500" /> Saved Space
        </div>
        <div className="text-xs font-bold text-emerald-500 mt-0.5">
          {formatBytes(totalDeduplicatedBytes)}
        </div>
      </div>

      {/* Total Commits / Saves */}
      <div className={`flex flex-col items-start p-2 rounded-md border ${
        theme === 'dark' ? 'bg-slate-900/80 border-slate-800/50' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className={`text-[10px] flex items-center gap-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          <Layers className="w-3 h-3 text-cyan-500" /> Total Saves
        </div>
        <div className={`text-xs font-bold mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          {totalCommits}
        </div>
      </div>

      {/* Watched Folders Count */}
      <div className={`flex flex-col items-start p-2 rounded-md border ${
        theme === 'dark' ? 'bg-slate-900/80 border-slate-800/50' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className={`text-[10px] flex items-center gap-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          <Folder className="w-3 h-3 text-purple-500" /> Folders Watched
        </div>
        <div className={`text-xs font-bold mt-0.5 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
          {folderCount}
        </div>
      </div>
    </div>
  );
}
