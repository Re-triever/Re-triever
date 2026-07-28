import React from 'react';
import { Clock, Sparkles, Eye, FileText, FileSpreadsheet, Image as ImageIcon, Archive, FileCode2, FileCheck, FileType } from 'lucide-react';
import { formatBytes, formatTimeAgo, getFileTypeBadge } from '../utils/diffUtils';

export default function ActivityFeed({
  commits,
  onViewFileLog
}) {
  const getFileTypeIconAndBg = (label, fileName = '') => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const l = label?.toLowerCase();

    if (['doc', 'docx', 'txt', 'rtf'].includes(ext) || l === 'doc' || l === 'docx') {
      return {
        icon: <FileText className="w-5 h-5 text-[#FEF1D7]" />,
        bg: 'bg-[#FF6F1E]/20 border-[#FF6F1E]/40'
      };
    }
    if (['xls', 'xlsx', 'csv'].includes(ext) || l === 'sheet' || l === 'excel') {
      return {
        icon: <FileSpreadsheet className="w-5 h-5 text-[#FEF1D7]" />,
        bg: 'bg-[#FF6F1E]/20 border-[#FF6F1E]/40'
      };
    }
    if (['ppt', 'pptx', 'pdf', 'key'].includes(ext) || l === 'ppt' || l === 'pdf') {
      return {
        icon: <FileCheck className="w-5 h-5 text-[#FEF1D7]" />,
        bg: 'bg-[#FF6F1E]/20 border-[#FF6F1E]/40'
      };
    }
    if (['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'].includes(ext) || l === 'img' || l === 'image') {
      return {
        icon: <ImageIcon className="w-5 h-5 text-[#FEF1D7]" />,
        bg: 'bg-[#FF6F1E]/20 border-[#FF6F1E]/40'
      };
    }
    if (['zip', 'tar', 'gz', 'rar', '7z'].includes(ext) || l === 'zip' || l === 'archive') {
      return {
        icon: <Archive className="w-5 h-5 text-[#FEF1D7]" />,
        bg: 'bg-[#FF6F1E]/20 border-[#FF6F1E]/40'
      };
    }
    return {
      icon: <FileCode2 className="w-5 h-5 text-[#FEF1D7]" />,
      bg: 'bg-[#FF6F1E]/20 border-[#FF6F1E]/40'
    };
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
      {commits.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center justify-center space-y-3 bg-[#2B2B2C] rounded-xl p-8 border border-[#404042] shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#FF6F1E]/15 flex items-center justify-center text-[#FF6F1E] text-xl">
            📜
          </div>
          <p className="text-sm font-bold text-[#FEF1D7]">No File Saves Recorded Yet</p>
          <p className="text-xs text-[#FEF1D7]/70 max-w-sm">
            Save any file inside a watched folder to automatically back up and deduplicate versions.
          </p>
        </div>
      ) : (
        commits.map((commit) => {
          const fileName = commit.file_path ? commit.file_path.split('/').pop() : 'File';
          const folderName = commit.file_path ? commit.file_path.split('/').slice(-2, -1)[0] : '';
          const badge = getFileTypeBadge(fileName, 'dark');
          const fileIconStyle = getFileTypeIconAndBg(badge.label, fileName);
          const isDeduped = commit.deduplicated_bytes > 0;

          return (
            <div 
              key={commit.id} 
              className="p-3.5 bg-[#2B2B2C] hover:bg-[#404042] rounded-xl transition-all flex items-center justify-between group border border-[#404042] hover:border-[#FF6F1E] shadow-xs"
            >
              {/* File Info */}
              <div className="flex items-center space-x-3.5 min-w-0 flex-1 pr-3">
                {/* Specific File Type Icon Container */}
                <div 
                  onClick={() => onViewFileLog(commit.file_path, fileName)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 cursor-pointer overflow-hidden border transition-all ${fileIconStyle.bg}`}
                  title={`File type: ${badge.label}`}
                >
                  {fileIconStyle.icon}
                </div>

                {/* File Title & Subtitle */}
                <div className="min-w-0 flex-1">
                  <div 
                    onClick={() => onViewFileLog(commit.file_path, fileName)}
                    className="text-xs font-bold text-[#FEF1D7] truncate cursor-pointer hover:underline hover:text-[#FF6F1E] transition-colors flex items-center gap-2"
                  >
                    {fileName}
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FF6F1E]/15 text-[#FF6F1E] border border-[#FF6F1E]/30">
                      {badge.label}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#FEF1D7]/70 truncate mt-0.5 flex items-center gap-1.5 font-mono">
                    <span>in <strong className="text-[#FEF1D7] font-semibold">{folderName}</strong></span>
                    <span>•</span>
                    <span>{formatBytes(commit.file_size)}</span>
                  </div>
                </div>
              </div>

              {/* Timestamp & Actions */}
              <div className="flex items-center space-x-3 shrink-0">
                {isDeduped && (
                  <span className="hidden sm:flex text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#FF6F1E]/15 text-[#FF6F1E] border border-[#FF6F1E]/30 items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {formatBytes(commit.deduplicated_bytes)} Saved
                  </span>
                )}

                <span className="text-xs font-medium text-[#FEF1D7]/70 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#FEF1D7]/70" />
                  {formatTimeAgo(commit.timestamp)}
                </span>

                <button
                  onClick={() => onViewFileLog(commit.file_path, fileName)}
                  className="orange-btn-secondary px-3.5 py-1.5 text-xs flex items-center gap-1.5"
                  title="View File Log & Visual Timeline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  History & Diffs
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
