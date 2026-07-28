import React from 'react';
import { Zap, GitCommit, Folder } from 'lucide-react';
import { formatBytes } from '../utils/diffUtils';

export default function MetricsStrip({ stats = {}, watchedFolderCount = 0 }) {
  const totalCommits = stats.totalCommits ?? stats.total_commits ?? 0;
  const totalDeduplicatedBytes = stats.totalDeduplicatedBytes ?? stats.total_deduplicated_bytes ?? 0;
  const folderCount = stats.watchedFolderCount ?? stats.watched_folder_count ?? watchedFolderCount;

  return (
    <div className="px-5 py-3 bg-[#353536] border-b border-[#404042] grid grid-cols-3 gap-3">
      {/* Saved Space Card */}
      <div className="p-3.5 bg-[#2B2B2C] hover:bg-[#404042] rounded-xl border border-[#404042] transition-all flex items-center justify-between group shadow-xs">
        <div>
          <div className="text-[11px] font-semibold text-[#FEF1D7]/70 flex items-center gap-1.5 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-[#FF6F1E]" /> Saved Space
          </div>
          <div className="text-sm font-extrabold text-[#FEF1D7] mt-1 group-hover:text-[#FF6F1E] transition-colors">
            {formatBytes(totalDeduplicatedBytes)}
          </div>
        </div>
        <div className="w-8.5 h-8.5 rounded-full bg-[#FF6F1E]/15 text-[#FF6F1E] flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
          ⚡
        </div>
      </div>

      {/* Total Revisions Card */}
      <div className="p-3.5 bg-[#2B2B2C] hover:bg-[#404042] rounded-xl border border-[#404042] transition-all flex items-center justify-between group shadow-xs">
        <div>
          <div className="text-[11px] font-semibold text-[#FEF1D7]/70 flex items-center gap-1.5 uppercase tracking-wider">
            <GitCommit className="w-3.5 h-3.5 text-[#FF6F1E]" /> Total Revisions
          </div>
          <div className="text-sm font-extrabold text-[#FEF1D7] mt-1 group-hover:text-[#FF6F1E] transition-colors">
            {totalCommits} Version Saves
          </div>
        </div>
        <div className="w-8.5 h-8.5 rounded-full bg-[#FF6F1E]/15 text-[#FF6F1E] flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
          📜
        </div>
      </div>

      {/* Monitored Folders Card */}
      <div className="p-3.5 bg-[#2B2B2C] hover:bg-[#404042] rounded-xl border border-[#404042] transition-all flex items-center justify-between group shadow-xs">
        <div>
          <div className="text-[11px] font-semibold text-[#FEF1D7]/70 flex items-center gap-1.5 uppercase tracking-wider">
            <Folder className="w-3.5 h-3.5 text-[#FF6F1E]" /> Monitored Folders
          </div>
          <div className="text-sm font-extrabold text-[#FEF1D7] mt-1 group-hover:text-[#FF6F1E] transition-colors">
            {folderCount} Folders
          </div>
        </div>
        <div className="w-8.5 h-8.5 rounded-full bg-[#FEF1D7]/15 text-[#FEF1D7] flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
          📁
        </div>
      </div>
    </div>
  );
}
