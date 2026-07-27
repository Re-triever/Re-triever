import React from 'react';
import { Clock, Sparkles, Eye, RotateCcw } from 'lucide-react';
import { formatBytes, formatTimeAgo, getFileTypeBadge } from '../utils/diffUtils';

export default function ActivityFeed({
  theme,
  commits,
  onViewFileLog,
  onSelectCommitToRestore
}) {
  return (
    <div className="flex-1 overflow-y-auto space-y-2.5">
      {commits.length === 0 ? (
        <div className="py-12 text-center flex flex-col items-center justify-center text-slate-500 space-y-2">
          <Clock className={`w-8 h-8 stroke-1 ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`} />
          <p className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>No file saves recorded yet.</p>
          <p className={`text-[11px] max-w-[240px] ${theme === 'dark' ? 'text-slate-600' : 'text-slate-500'}`}>
            Re-triever will automatically back up and deduplicate files when you save them in watched folders.
          </p>
        </div>
      ) : (
        commits.map((commit) => {
          const fileName = commit.file_path ? commit.file_path.split('/').pop() : 'File';
          const folderName = commit.file_path ? commit.file_path.split('/').slice(-2, -1)[0] : '';
          const badge = getFileTypeBadge(fileName, theme);
          const isDeduped = commit.deduplicated_bytes > 0;

          return (
            <div 
              key={commit.id} 
              className={`p-3 border rounded-xl transition-all flex items-start justify-between group ${
                theme === 'dark'
                  ? 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700/80 text-slate-200'
                  : 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-slate-300 text-slate-800 shadow-xs'
              }`}
            >
              <div className="flex items-start space-x-3 min-w-0 flex-1 pr-2">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border mt-0.5 ${badge.color}`}>
                  {badge.label}
                </span>
                <div className="min-w-0 flex-1">
                  <div className={`text-xs font-semibold truncate flex items-center gap-1.5 ${
                    theme === 'dark' ? 'text-slate-200' : 'text-slate-900'
                  }`}>
                    {fileName}
                  </div>
                  <div className={`text-[11px] truncate mt-0.5 flex items-center gap-1 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    <span className={theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}>in</span> {folderName}
                    <span className={theme === 'dark' ? 'text-slate-600' : 'text-slate-300'}>•</span>
                    <span>{formatBytes(commit.file_size)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[10px] flex items-center gap-1 ${
                      theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      <Clock className={`w-3 h-3 ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`} />
                      {formatTimeAgo(commit.timestamp)}
                    </span>
                    {isDeduped && (
                      <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded border flex items-center gap-0.5 ${
                        theme === 'dark' 
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                          : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      }`}>
                        <Sparkles className="w-2.5 h-2.5" />
                        {formatBytes(commit.deduplicated_bytes)} deduplicated
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onViewFileLog(commit.file_path, fileName)}
                  className={`px-2 py-1 text-[11px] font-medium rounded-lg border transition-all flex items-center gap-1 shrink-0 ${
                    theme === 'dark'
                      ? 'bg-slate-800/80 hover:bg-slate-750 text-emerald-400 hover:text-emerald-300 border-slate-700/60'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                  }`}
                  title="View File Log & Timeline"
                >
                  <Eye className="w-3 h-3" />
                  Log
                </button>

                <button
                  onClick={() => onSelectCommitToRestore(commit)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-all flex items-center gap-1 shrink-0 ${
                    theme === 'dark'
                      ? 'bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white border-slate-700/80 hover:border-emerald-500'
                      : 'bg-slate-100 hover:bg-slate-800 text-slate-700 hover:text-white border-slate-300 hover:border-slate-800'
                  }`}
                >
                  <RotateCcw className="w-3 h-3" />
                  Restore
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
