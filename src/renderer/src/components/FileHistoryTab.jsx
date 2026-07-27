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
  ExternalLink
} from 'lucide-react';
import { formatBytes, formatTimeAgo, getFileTypeBadge, getRestoredInfo } from '../utils/diffUtils';

export default function FileHistoryTab({
  theme,
  selectedFile,
  setSelectedFile,
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

  return (
    <div className="flex-1 flex gap-3 min-h-0 overflow-hidden">
      
      {/* LEFT COLUMN: Tracked Files List */}
      <div className={`w-1/3 flex flex-col space-y-2 border-r pr-2 shrink-0 ${
        theme === 'dark' ? 'border-slate-800/80' : 'border-slate-200'
      } ${selectedFile ? 'hidden md:flex' : 'flex'}`}>
        <div className="relative">
          <Search className={`w-3.5 h-3.5 absolute left-2.5 top-2.5 ${
            theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
          }`} />
          <input
            type="text"
            placeholder="Filter tracked files..."
            value={fileSearchQuery}
            onChange={(e) => setFileSearchQuery(e.target.value)}
            className={`w-full pl-8 pr-2 py-1.5 border rounded-lg text-xs focus:outline-none transition-all ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-emerald-500/60'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-600 shadow-xs'
            }`}
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {filteredTrackedFiles.length === 0 ? (
            <div className={`py-8 text-center text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
              No files found.
            </div>
          ) : (
            filteredTrackedFiles.map((file) => {
              const badge = getFileTypeBadge(file.fileName, theme);
              const isSelected = selectedFile && selectedFile.filePath === file.filePath;

              return (
                <button
                  key={file.filePath}
                  onClick={() => onSelectFile(file)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
                    isSelected
                      ? (theme === 'dark' ? 'bg-slate-900 border-emerald-500/60 text-white shadow-sm' : 'bg-white border-emerald-600 text-slate-900 shadow-md ring-1 ring-emerald-500/20')
                      : (theme === 'dark' ? 'bg-slate-900/40 hover:bg-slate-900 border-slate-800/60 text-slate-300' : 'bg-white/80 hover:bg-white border-slate-200 text-slate-700 shadow-xs')
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-bold px-1 py-0.2 rounded border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs font-semibold truncate">{file.fileName}</span>
                    </div>
                    <p className={`text-[10px] truncate mt-0.5 font-mono ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                      {file.filePath}
                    </p>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {file.commitCount} saves
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Visual Timeline & Graphical Log */}
      <div className={`flex-1 flex flex-col min-w-0 rounded-xl border p-3 overflow-hidden ${
        theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200/90 shadow-xs'
      }`}>
        {!selectedFile ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-2">
            <FileCode className={`w-10 h-10 stroke-1 ${theme === 'dark' ? 'text-slate-700' : 'text-slate-300'}`} />
            <p className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>Select a file to view its Visual Revision Timeline</p>
            <p className={`text-[11px] max-w-[260px] text-center ${theme === 'dark' ? 'text-slate-600' : 'text-slate-500'}`}>
              Inspect complete save histories, visual node timelines, and line-by-line diffs for every saved state.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden space-y-3">
            
            {/* File Header */}
            <div className={`pb-2.5 border-b flex items-center justify-between shrink-0 ${
              theme === 'dark' ? 'border-slate-800/80' : 'border-slate-200'
            }`}>
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  {onBackToActivity && (
                    <button 
                      onClick={onBackToActivity} 
                      className={`p-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1 ${
                        theme === 'dark' ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                      }`}
                      title="Back to Activity Feed"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Activity Feed</span>
                    </button>
                  )}
                  <h2 className={`text-xs font-bold truncate flex items-center gap-2 ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {selectedFile.fileName || selectedFile.filePath.split('/').pop()}
                  </h2>
                </div>
                <p className={`text-[10px] font-mono truncate mt-0.5 ${
                  theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {selectedFile.filePath}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                  theme === 'dark' ? 'text-slate-300 bg-slate-800 border-slate-700' : 'text-slate-700 bg-slate-100 border-slate-300'
                }`}>
                  {fileHistory.length} Revisions
                </span>
              </div>
            </div>

            {/* Custom Version-to-Version Comparison Bar */}
            {fileHistory.length > 1 && (
              <div className={`p-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 shrink-0 ${
                theme === 'dark'
                  ? 'bg-slate-950/70 border-slate-800/80 text-slate-200'
                  : 'bg-slate-100/90 border-slate-200 text-slate-800 shadow-xs'
              }`}>
                <div className="flex items-center gap-2 flex-1 min-w-[280px]">
                  <GitCompare className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-xs font-semibold shrink-0">Compare:</span>
                  
                  {/* Base Select */}
                  <div className="flex items-center gap-1 min-w-0 flex-1">
                    <span className={`text-[10px] uppercase font-bold shrink-0 ${
                      theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                    }`}>Base:</span>
                    <select
                      value={compareBaseId}
                      onChange={(e) => setCompareBaseId(e.target.value)}
                      className={`w-full text-xs py-1 px-2 border rounded-lg focus:outline-none truncate ${
                        theme === 'dark'
                          ? 'bg-slate-900 border-slate-800 text-slate-200'
                          : 'bg-white border-slate-300 text-slate-900 shadow-xs'
                      }`}
                    >
                      {fileHistory.map((c, i) => (
                        <option key={c.id} value={c.id}>
                          Save #{fileHistory.length - i} ({formatTimeAgo(c.timestamp)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <ArrowLeftRight className={`w-3.5 h-3.5 shrink-0 ${
                    theme === 'dark' ? 'text-slate-600' : 'text-slate-400'
                  }`} />

                  {/* Target Select */}
                  <div className="flex items-center gap-1 min-w-0 flex-1">
                    <span className={`text-[10px] uppercase font-bold shrink-0 ${
                      theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                    }`}>Target:</span>
                    <select
                      value={compareTargetId}
                      onChange={(e) => setCompareTargetId(e.target.value)}
                      className={`w-full text-xs py-1 px-2 border rounded-lg focus:outline-none truncate ${
                        theme === 'dark'
                          ? 'bg-slate-900 border-slate-800 text-slate-200'
                          : 'bg-white border-slate-300 text-slate-900 shadow-xs'
                      }`}
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
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  Compare Versions
                </button>
              </div>
            )}

            {/* Visual Node Timeline Track */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-0 relative">
              <div className={`absolute left-[19px] top-3 bottom-3 w-0.5 bg-gradient-to-b ${
                theme === 'dark' ? 'from-emerald-500 via-slate-700 to-slate-800' : 'from-emerald-500 via-slate-300 to-slate-200'
              }`} />

              {fileHistory.length === 0 ? (
                <div className={`py-12 text-center text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                  Loading revision history...
                </div>
              ) : (
                fileHistory.map((commit, idx) => {
                  const isLatest = idx === 0;
                  const isDeduped = commit.deduplicated_bytes > 0;
                  const restoredInfo = getRestoredInfo(commit, idx, fileHistory);

                  return (
                    <div key={commit.id} className="relative pl-9 py-2.5 group">
                      {/* Graphical Node Dot */}
                      <div className={`absolute left-3 top-3.5 w-3.5 h-3.5 rounded-full border-2 transition-all shadow-md ${
                        restoredInfo 
                          ? 'bg-purple-500 border-purple-300 shadow-purple-500/60 scale-105'
                          : isLatest 
                          ? (theme === 'dark' ? 'bg-emerald-400 border-emerald-300 shadow-emerald-500/50 scale-110' : 'bg-emerald-500 border-emerald-300 shadow-emerald-500/30 scale-110')
                          : (theme === 'dark' ? 'bg-slate-900 border-slate-600 group-hover:border-emerald-400 group-hover:bg-emerald-500/20' : 'bg-white border-slate-400 group-hover:border-emerald-500 group-hover:bg-emerald-50')
                      }`} />

                      <div className={`p-3 border rounded-xl transition-all flex flex-col space-y-1.5 ${
                        restoredInfo
                          ? (theme === 'dark' ? 'bg-purple-950/20 hover:bg-purple-950/30 border-purple-500/40' : 'bg-purple-50 hover:bg-purple-100/80 border-purple-200')
                          : (theme === 'dark' ? 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white hover:bg-slate-50 border-slate-200/90 shadow-xs')
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1 min-w-0 pr-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-xs font-semibold flex items-center gap-1 ${
                                theme === 'dark' ? 'text-slate-200' : 'text-slate-900'
                              }`}>
                                <GitCommit className="w-3 h-3 text-emerald-500" />
                                Save #{fileHistory.length - idx}
                              </span>
                              {isLatest && (
                                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                                  theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                                }`}>
                                  CURRENT
                                </span>
                              )}
                              {restoredInfo && (
                                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border flex items-center gap-1 ${
                                  theme === 'dark' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-purple-100 text-purple-700 border-purple-300'
                                }`}>
                                  <RotateCcw className="w-2.5 h-2.5 text-purple-500" />
                                  RESTORED FROM SAVE #{restoredInfo.saveNumber}
                                </span>
                              )}
                            </div>

                            <div className={`flex items-center gap-2 text-[10px] ${
                              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              <span className="flex items-center gap-1">
                                <Clock className={`w-3 h-3 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
                                {formatTimeAgo(commit.timestamp)}
                              </span>
                              <span>•</span>
                              <span>{formatBytes(commit.file_size)}</span>
                              {isDeduped && (
                                <>
                                  <span>•</span>
                                  <span className="text-emerald-500 font-medium">
                                    Saved {formatBytes(commit.deduplicated_bytes)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => onOpenTempVersion(commit, fileHistory.length - idx)}
                              className={`px-2 py-1 text-[11px] font-medium border rounded-lg transition-all flex items-center gap-1 shrink-0 ${
                                theme === 'dark'
                                  ? 'bg-blue-950/60 hover:bg-blue-600 text-blue-300 hover:text-white border-blue-500/30 hover:border-blue-400'
                                  : 'bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border-blue-200 shadow-xs'
                              }`}
                              title="Open temporary preview copy of this save version in default application (Auto-clears on app exit)"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Open Version
                            </button>

                            <button
                              onClick={() => onOpenDiffLog(commit, idx)}
                              className={`px-2 py-1 text-[11px] font-semibold border rounded-lg transition-all flex items-center gap-1 shadow-xs ${
                                theme === 'dark'
                                  ? 'bg-emerald-950/60 hover:bg-emerald-600 text-emerald-400 hover:text-white border-emerald-500/30 hover:border-emerald-400'
                                  : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border-emerald-200'
                              }`}
                            >
                              <Eye className="w-3 h-3" />
                              Visual Diff
                            </button>

                            <button
                              onClick={() => onSelectCommitToRestore(commit)}
                              className={`px-2 py-1 text-[11px] font-medium border rounded-lg transition-all flex items-center gap-1 ${
                                theme === 'dark'
                                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                              }`}
                            >
                              <RotateCcw className="w-3 h-3 text-slate-400" />
                              Restore
                            </button>
                          </div>
                        </div>

                        {restoredInfo && (
                          <div className={`text-[10px] flex items-center gap-1.5 font-medium px-2 py-1 rounded-lg border ${
                            theme === 'dark'
                              ? 'text-purple-300/90 bg-purple-950/50 border-purple-500/30'
                              : 'text-purple-800 bg-purple-100/70 border-purple-200'
                          }`}>
                            <Sparkles className="w-3 h-3 text-purple-500 shrink-0" />
                            <span>Version merged & restored to state from Save #{restoredInfo.saveNumber} ({formatTimeAgo(restoredInfo.commit.timestamp)})</span>
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
