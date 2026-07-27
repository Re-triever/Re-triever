import React from 'react';
import { Zap, GitCommit, Folder } from 'lucide-react';
import { formatBytes } from '../utils/diffUtils';

export default function MetricsStrip({ stats = {}, watchedFolderCount = 0 }) {
  const totalCommits = stats.totalCommits ?? stats.total_commits ?? 0;
  const totalDeduplicatedBytes = stats.totalDeduplicatedBytes ?? stats.total_deduplicated_bytes ?? 0;
  const folderCount = stats.watchedFolderCount ?? stats.watched_folder_count ?? watchedFolderCount;

  return (
    <div className="px-5 py-3 bg-[oklch(0.962_0.059_95.617)] border-b border-[#EEDCC8] grid grid-cols-3 gap-3">
      {/* Saved Space Card */}
      <div className="p-3.5 bg-white hover:bg-[#FFFBF7] rounded-xl border border-[rgba(224,122,95,0.2)] transition-all flex items-center justify-between group shadow-xs">
        <div>
          <div className="text-[11px] font-semibold text-[#786658] flex items-center gap-1.5 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-[#E07A5F]" /> Saved Space
          </div>
          <div className="text-sm font-extrabold text-[#2A201A] mt-1 group-hover:text-[#E07A5F] transition-colors">
            {formatBytes(totalDeduplicatedBytes)}
          </div>
        </div>
        <div className="w-8.5 h-8.5 rounded-full bg-[#E07A5F]/10 text-[#E07A5F] flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
          ⚡
        </div>
      </div>

      {/* Total Revisions Card */}
      <div className="p-3.5 bg-white hover:bg-[#FFFBF7] rounded-xl border border-[rgba(224,122,95,0.2)] transition-all flex items-center justify-between group shadow-xs">
        <div>
          <div className="text-[11px] font-semibold text-[#786658] flex items-center gap-1.5 uppercase tracking-wider">
            <GitCommit className="w-3.5 h-3.5 text-[#E07A5F]" /> Total Revisions
          </div>
          <div className="text-sm font-extrabold text-[#2A201A] mt-1 group-hover:text-[#E07A5F] transition-colors">
            {totalCommits} Version Saves
          </div>
        </div>
        <div className="w-8.5 h-8.5 rounded-full bg-[#E07A5F]/10 text-[#E07A5F] flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
          📜
        </div>
      </div>

      {/* Monitored Folders Card */}
      <div className="p-3.5 bg-white hover:bg-[#FFFBF7] rounded-xl border border-[rgba(224,122,95,0.2)] transition-all flex items-center justify-between group shadow-xs">
        <div>
          <div className="text-[11px] font-semibold text-[#786658] flex items-center gap-1.5 uppercase tracking-wider">
            <Folder className="w-3.5 h-3.5 text-[#2A9D8F]" /> Monitored Folders
          </div>
          <div className="text-sm font-extrabold text-[#2A201A] mt-1 group-hover:text-[#2A9D8F] transition-colors">
            {folderCount} Folders
          </div>
        </div>
        <div className="w-8.5 h-8.5 rounded-full bg-[#2A9D8F]/10 text-[#2A9D8F] flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
          📁
        </div>
      </div>
    </div>
  );
}
