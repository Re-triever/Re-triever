import React from 'react';
import { Clock, Sparkles, Eye, FileText, FileSpreadsheet, Image as ImageIcon, Archive, FileCode2, FileCheck, FileType } from 'lucide-react';
import { formatBytes, formatTimeAgo, getFileTypeBadge } from '../utils/diffUtils';

export default function ActivityFeed({
  commits,
  onViewFileLog
}) {
  // Return distinct, rich file type icons with specialized colors
  const getFileTypeIconAndBg = (label, fileName = '') => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const l = label?.toLowerCase();

    if (['doc', 'docx', 'txt', 'rtf'].includes(ext) || l === 'doc' || l === 'docx') {
      return {
        icon: <FileText className="w-5 h-5 text-[#2B6CB0]" />,
        bg: 'bg-[#2B6CB0]/10 border-[#2B6CB0]/25'
      };
    }
    if (['xls', 'xlsx', 'csv'].includes(ext) || l === 'sheet' || l === 'excel') {
      return {
        icon: <FileSpreadsheet className="w-5 h-5 text-[#2A9D8F]" />,
        bg: 'bg-[#2A9D8F]/10 border-[#2A9D8F]/25'
      };
    }
    if (['ppt', 'pptx', 'pdf', 'key'].includes(ext) || l === 'ppt' || l === 'pdf') {
      return {
        icon: <FileCheck className="w-5 h-5 text-[#E76F51]" />,
        bg: 'bg-[#E76F51]/10 border-[#E76F51]/25'
      };
    }
    if (['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'].includes(ext) || l === 'img' || l === 'image') {
      return {
        icon: <ImageIcon className="w-5 h-5 text-[#8E44AD]" />,
        bg: 'bg-[#8E44AD]/10 border-[#8E44AD]/25'
      };
    }
    if (['zip', 'tar', 'gz', 'rar', '7z'].includes(ext) || l === 'zip' || l === 'archive') {
      return {
        icon: <Archive className="w-5 h-5 text-[#D97706]" />,
        bg: 'bg-[#D97706]/10 border-[#D97706]/25'
      };
    }
    if (['js', 'jsx', 'ts', 'tsx', 'py', 'rs', 'c', 'cpp', 'html', 'css', 'json'].includes(ext) || l === 'code') {
      return {
        icon: <FileCode2 className="w-5 h-5 text-[#E07A5F]" />,
        bg: 'bg-[#E07A5F]/10 border-[#E07A5F]/25'
      };
    }
    return {
      icon: <FileType className="w-5 h-5 text-[#E07A5F]" />,
      bg: 'bg-[#E07A5F]/10 border-[#E07A5F]/25'
    };
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
      {commits.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center justify-center space-y-3 bg-white rounded-xl p-8 border border-[rgba(224,122,95,0.2)] shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#E07A5F]/10 flex items-center justify-center text-[#E07A5F] text-xl">
            📜
          </div>
          <p className="text-sm font-bold text-[#2A201A]">No File Saves Recorded Yet</p>
          <p className="text-xs text-[#786658] max-w-sm">
            Save any file inside a watched folder to automatically back up and deduplicate versions.
          </p>
        </div>
      ) : (
        commits.map((commit) => {
          const fileName = commit.file_path ? commit.file_path.split('/').pop() : 'File';
          const folderName = commit.file_path ? commit.file_path.split('/').slice(-2, -1)[0] : '';
          const badge = getFileTypeBadge(fileName, 'light');
          const fileIconStyle = getFileTypeIconAndBg(badge.label, fileName);
          const isDeduped = commit.deduplicated_bytes > 0;

          return (
            <div 
              key={commit.id} 
              className="p-3.5 bg-white hover:bg-[#FFFBF7] rounded-xl transition-all flex items-center justify-between group border border-[rgba(224,122,95,0.18)] hover:border-[#E07A5F] shadow-xs"
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
                    className="text-xs font-bold text-[#2A201A] truncate cursor-pointer hover:underline hover:text-[#E07A5F] transition-colors flex items-center gap-2"
                  >
                    {fileName}
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E07A5F]/10 text-[#E07A5F] border border-[#E07A5F]/20">
                      {badge.label}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#786658] truncate mt-0.5 flex items-center gap-1.5 font-mono">
                    <span>in <strong className="text-[#2A201A] font-semibold">{folderName}</strong></span>
                    <span>•</span>
                    <span>{formatBytes(commit.file_size)}</span>
                  </div>
                </div>
              </div>

              {/* Timestamp & Actions */}
              <div className="flex items-center space-x-3 shrink-0">
                {isDeduped && (
                  <span className="hidden sm:flex text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#E07A5F]/10 text-[#E07A5F] border border-[#E07A5F]/25 items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {formatBytes(commit.deduplicated_bytes)} Saved
                  </span>
                )}

                <span className="text-xs font-medium text-[#786658] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#786658]" />
                  {formatTimeAgo(commit.timestamp)}
                </span>

                <button
                  onClick={() => onViewFileLog(commit.file_path, fileName)}
                  className="peach-btn-secondary px-3.5 py-1.5 text-xs flex items-center gap-1.5"
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
