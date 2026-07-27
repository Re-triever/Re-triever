import React from 'react';
import { 
  Search, 
  FileCode, 
  ArrowLeft, 
  GitCompare, 
  ArrowLeftRight, 
  GitCommit, 
  RotateCcw, 
  Clock, 
  Eye, 
  Sparkles,
  ExternalLink,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Archive,
  FileCode2,
  FileCheck,
  FileType
} from 'lucide-react';
import { formatBytes, formatTimeAgo, getFileTypeBadge, getRestoredInfo } from '../utils/diffUtils';

export default function FileHistoryTab({
  selectedFile,
  trackedFiles,
  fileSearchQuery,
  setFileSearchQuery,
  fileHistory,
  onSelectFile,
  compareBaseId,
  setCompareBaseId,
  compareTargetId,
  setCompareTargetId,
  onCompareAnyTwoVersions,
  onOpenDiffLog,
  onSelectCommitToRestore,
  onOpenTempVersion,
  onBackToActivity
}) {
  const filteredTrackedFiles = trackedFiles.filter(f => 
    f.fileName.toLowerCase().includes(fileSearchQuery.toLowerCase()) ||
    f.filePath.toLowerCase().includes(fileSearchQuery.toLowerCase())
  );

  const getFileTypeIcon = (label, fileName = '') => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const l = label?.toLowerCase();

    if (['doc', 'docx', 'txt', 'rtf'].includes(ext) || l === 'doc' || l === 'docx') {
      return <FileText className="w-4 h-4 text-[#2B6CB0]" />;
    }
    if (['xls', 'xlsx', 'csv'].includes(ext) || l === 'sheet' || l === 'excel') {
      return <FileSpreadsheet className="w-4 h-4 text-[#2A9D8F]" />;
    }
    if (['ppt', 'pptx', 'pdf', 'key'].includes(ext) || l === 'ppt' || l === 'pdf') {
      return <FileCheck className="w-4 h-4 text-[#E76F51]" />;
    }
    if (['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'].includes(ext) || l === 'img' || l === 'image') {
      return <ImageIcon className="w-4 h-4 text-[#8E44AD]" />;
    }
    if (['zip', 'tar', 'gz', 'rar', '7z'].includes(ext) || l === 'zip' || l === 'archive') {
      return <Archive className="w-4 h-4 text-[#D97706]" />;
    }
    return <FileCode2 className="w-4 h-4 text-[#E07A5F]" />;
  };

  return (
    <div className="flex-1 flex gap-3 min-h-0 overflow-hidden">
      
      {/* LEFT COLUMN: Tracked Files Library */}
      <div className={`w-1/3 flex flex-col space-y-2 border-r border-[#EEDCC8] pr-2 shrink-0 ${selectedFile ? 'hidden md:flex' : 'flex'}`}>
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#786658]" />
          <input
            type="text"
            placeholder="Search tracked files..."
            value={fileSearchQuery}
            onChange={(e) => setFileSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#EEDCC8] rounded-full text-xs text-[#2A201A] placeholder-[#786658] focus:outline-none focus:border-[#E07A5F] transition-colors shadow-xs"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {filteredTrackedFiles.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#786658]">
              No files found in library.
            </div>
          ) : (
            filteredTrackedFiles.map((file) => {
              const badge = getFileTypeBadge(file.fileName, 'light');
              const isSelected = selectedFile && selectedFile.filePath === file.filePath;

              return (
                <button
                  key={file.filePath}
                  onClick={() => onSelectFile(file)}
                  className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-[#FFF8F2] text-[#2A201A] border border-[#E07A5F] shadow-xs'
                      : 'bg-white hover:bg-[#FFFBF7] text-[#786658] hover:text-[#2A201A] border border-[rgba(224,122,95,0.18)] shadow-xs'
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-2">
                      {getFileTypeIcon(badge.label, file.fileName)}
                      <span className="text-xs font-bold truncate group-hover:text-[#E07A5F] transition-colors text-[#2A201A]">
                        {file.fileName}
                      </span>
                    </div>
                    <p className="text-[11px] truncate mt-1 font-mono text-[#786658]">
                      {file.filePath}
                    </p>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E07A5F]/10 text-[#E07A5F]">
                      {file.commitCount} Saves
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Visual Timeline & Version History */}
      <div className="flex-1 flex flex-col min-w-0 rounded-xl bg-white border border-[rgba(224,122,95,0.2)] p-4 overflow-hidden shadow-xs">
        {!selectedFile ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3 text-center">
            <FileCode className="w-12 h-12 text-[#EEDCC8] stroke-1" />
            <p className="text-xs font-bold text-[#2A201A]">Select a file from your library</p>
            <p className="text-xs text-[#786658] max-w-xs">
              Inspect complete save histories, visual node timelines, and line-by-line diffs for every saved version.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden space-y-3">
            
            {/* File Header Banner */}
            <div className="pb-3 border-b border-[#EEDCC8] flex items-center justify-between shrink-0">
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2.5">
                  {onBackToActivity && (
                    <button 
                      onClick={onBackToActivity} 
                      className="p-1.5 rounded-full bg-[#FFF8F2] text-[#2A201A] border border-[#EEDCC8] hover:bg-[#FFEBE0] transition-colors flex items-center gap-1 text-xs font-semibold"
                      title="Back to Activity Feed"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Feed
                    </button>
                  )}
                  <h2 className="text-sm font-extrabold text-[#2A201A] truncate flex items-center gap-2">
                    {selectedFile.fileName || selectedFile.filePath.split('/').pop()}
                  </h2>
                </div>
                <p className="text-[11px] font-mono text-[#786658] truncate mt-0.5">
                  {selectedFile.filePath}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E07A5F]/10 text-[#E07A5F] border border-[#E07A5F]/20">
                  {fileHistory.length} Saved Versions
                </span>
              </div>
            </div>

            {/* Custom Version-to-Version Comparison Bar */}
            {fileHistory.length > 1 && (
              <div className="p-3 rounded-xl bg-[#FFF8F2] border border-[rgba(224,122,95,0.25)] flex flex-wrap items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2 flex-1 min-w-[280px]">
                  <GitCompare className="w-4 h-4 shrink-0 text-[#E07A5F]" />
                  <span className="text-xs font-bold text-[#2A201A] shrink-0">Compare:</span>
                  
                  {/* Base Select */}
                  <div className="flex items-center gap-1 min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-[#786658] shrink-0">Base:</span>
                    <select
                      value={compareBaseId}
                      onChange={(e) => setCompareBaseId(e.target.value)}
                      className="w-full text-xs py-1 px-2.5 bg-white border border-[#EEDCC8] rounded-full text-[#2A201A] focus:outline-none focus:border-[#E07A5F] truncate"
                    >
                      {fileHistory.map((c, i) => (
                        <option key={c.id} value={c.id}>
                          Save #{fileHistory.length - i} ({formatTimeAgo(c.timestamp)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <ArrowLeftRight className="w-3.5 h-3.5 shrink-0 text-[#786658]" />

                  {/* Target Select */}
                  <div className="flex items-center gap-1 min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-[#786658] shrink-0">Target:</span>
                    <select
                      value={compareTargetId}
                      onChange={(e) => setCompareTargetId(e.target.value)}
                      className="w-full text-xs py-1 px-2.5 bg-white border border-[#EEDCC8] rounded-full text-[#2A201A] focus:outline-none focus:border-[#E07A5F] truncate"
                    >
                      {fileHistory.map((c, i) => (
                        <option key={c.id} value={c.id}>
                          Save #{fileHistory.length - i} ({formatTimeAgo(c.timestamp)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => onCompareAnyTwoVersions(compareBaseId, compareTargetId)}
                  className="peach-btn-primary px-4 py-1.5 text-xs flex items-center gap-1.5 shrink-0"
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  Compare
                </button>
              </div>
            )}

            {/* Visual Node Timeline Track */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-0 relative">
              <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-[#EEDCC8]" />

              {fileHistory.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#786658]">
                  Loading revision history...
                </div>
              ) : (
                fileHistory.map((commit, idx) => {
                  const isLatest = idx === 0;
                  const isDeduped = commit.deduplicated_bytes > 0;
                  const restoredInfo = getRestoredInfo(commit, idx, fileHistory);

                  return (
                    <div key={commit.id} className="relative pl-9 py-2 group">
                      {/* Node Dot */}
                      <div className={`absolute left-3 top-4.5 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                        isLatest
                          ? 'bg-[#E07A5F] border-white shadow-md shadow-[#E07A5F]/40 scale-110'
                          : 'bg-white border-[#EEDCC8] group-hover:border-[#E07A5F]'
                      }`} />

                      <div className={`p-3.5 rounded-xl border transition-all flex flex-col space-y-2 ${
                        restoredInfo
                          ? 'bg-[#FFF8F2] border-[#E07A5F]/40'
                          : isLatest
                          ? 'bg-[#FFF8F2] border-[#E07A5F] text-[#2A201A] shadow-xs'
                          : 'bg-white hover:bg-[#FFFBF7] border-[rgba(224,122,95,0.18)] text-[#2A201A] shadow-xs'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1 min-w-0 pr-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-[#2A201A] flex items-center gap-1.5">
                                <GitCommit className="w-3.5 h-3.5 text-[#E07A5F]" />
                                Save #{fileHistory.length - idx}
                              </span>
                              {isLatest && (
                                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#E07A5F] text-white">
                                  CURRENT
                                </span>
                              )}
                              {restoredInfo && (
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white text-[#2A201A] border border-[#EEDCC8] flex items-center gap-1">
                                  <RotateCcw className="w-2.5 h-2.5 text-[#E07A5F]" />
                                  RESTORED FROM #{restoredInfo.saveNumber}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-[#786658]">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-[#786658]" />
                                {formatTimeAgo(commit.timestamp)}
                              </span>
                              <span>•</span>
                              <span>{formatBytes(commit.file_size)}</span>
                              {isDeduped && (
                                <>
                                  <span>•</span>
                                  <span className="text-[#E07A5F] font-semibold">
                                    Saved {formatBytes(commit.deduplicated_bytes)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => onOpenTempVersion(commit, fileHistory.length - idx)}
                              className="peach-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1"
                              title="Open temporary preview copy"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Open
                            </button>

                            <button
                              onClick={() => onOpenDiffLog(commit, idx)}
                              className="peach-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              Diff
                            </button>

                            <button
                              onClick={() => onSelectCommitToRestore(commit)}
                              className="peach-btn-primary px-3 py-1.5 text-xs flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Restore
                            </button>
                          </div>
                        </div>

                        {restoredInfo && (
                          <div className="text-[11px] text-[#E07A5F] font-semibold px-2.5 py-1 rounded-lg bg-[#E07A5F]/10 border border-[#E07A5F]/20 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 shrink-0" />
                            <span>Version restored to state from Save #{restoredInfo.saveNumber} ({formatTimeAgo(restoredInfo.commit.timestamp)})</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
