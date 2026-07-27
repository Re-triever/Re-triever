import React from 'react';
import { Zap, Layers, Folder } from 'lucide-react';
import { formatBytes } from '../utils/diffUtils';

export default function MetricsStrip({ theme, stats = {}, watchedFolderCount = 0 }) {
  const totalCommits = stats.totalCommits ?? stats.total_commits ?? 0;
  const totalDeduplicatedBytes = stats.totalDeduplicatedBytes ?? stats.total_deduplicated_bytes ?? 0;
  const folderCount = stats.watchedFolderCount ?? stats.watched_folder_count ?? watchedFolderCount;

  return (
    <div className={`px-4 py-2 border-b grid grid-cols-3 gap-2 ${
      theme === 'dark' ? 'bg-black border-zinc-800' : 'bg-zinc-100 border-zinc-200'
    }`}>
      {/* Saved Deduplicated Bytes */}
      <div className={`flex flex-col items-start p-2 rounded-lg border ${
        theme === 'dark' ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
      }`}>
        <div className={`text-[10px] flex items-center gap-1 font-medium ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
          <Zap className="w-3 h-3 text-zinc-400" /> Saved Space
        </div>
        <div className={`text-xs font-bold mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
          {formatBytes(totalDeduplicatedBytes)}
        </div>
      </div>

      {/* Total Commits / Saves */}
      <div className={`flex flex-col items-start p-2 rounded-lg border ${
        theme === 'dark' ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
      }`}>
        <div className={`text-[10px] flex items-center gap-1 font-medium ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
          <Layers className="w-3 h-3 text-zinc-400" /> Total Saves
        </div>
        <div className={`text-xs font-bold mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
          {totalCommits}
        </div>
      </div>

      {/* Watched Folders Count */}
      <div className={`flex flex-col items-start p-2 rounded-lg border ${
        theme === 'dark' ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
      }`}>
        <div className={`text-[10px] flex items-center gap-1 font-medium ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
          <Folder className="w-3 h-3 text-zinc-400" /> Folders Watched
        </div>
        <div className={`text-xs font-bold mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
          {folderCount}
        </div>
      </div>
    </div>
  );
}
