import React from 'react';
import { RotateCcw, FolderPlus } from 'lucide-react';
import { formatBytes, formatTimeAgo } from '../utils/diffUtils';

export default function RestoreModal({
  theme,
  selectedCommit,
  restoring,
  onClose,
  onRestoreCommit
}) {
  if (!selectedCommit) return null;

  return (
    <div className={`fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${
      theme === 'dark' ? 'bg-slate-950/80' : 'bg-slate-900/40'
    }`}>
      <div className={`w-full max-w-sm border rounded-2xl p-4 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 ${
          theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-purple-500" />
            <h3 className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Restore & Merge File Version</h3>
          </div>
          <button 
            onClick={onClose}
            className={`text-xs font-bold px-1.5 py-0.5 rounded ${
              theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            ✕
          </button>
        </div>

        <div className={`p-3 rounded-xl border space-y-2 ${
          theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`text-xs font-semibold truncate ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>
            {selectedCommit.file_path.split('/').pop()}
          </div>
          <div className={`text-[11px] font-mono truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            {selectedCommit.file_path}
          </div>
          <div className={`flex items-center justify-between text-[10px] pt-1 border-t ${
            theme === 'dark' ? 'text-slate-400 border-slate-900' : 'text-slate-500 border-slate-200'
          }`}>
            <span>Timestamp: {formatTimeAgo(selectedCommit.timestamp)}</span>
            <span>Size: {formatBytes(selectedCommit.file_size)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <button
            disabled={restoring}
            onClick={() => onRestoreCommit(selectedCommit, selectedCommit.file_path)}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {restoring ? 'Restoring File...' : '⚡ Overwrite Current File Directly'}
          </button>

          <button
            disabled={restoring}
            onClick={() => onRestoreCommit(selectedCommit, undefined)}
            className={`w-full py-2 border rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
              theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-xs'
            }`}
          >
            <FolderPlus className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
            📁 Export / Save as Custom Copy...
          </button>

          <button
            disabled={restoring}
            onClick={onClose}
            className={`w-full py-1.5 rounded-xl text-xs font-medium transition-all ${
              theme === 'dark' ? 'bg-slate-900 hover:bg-slate-800 text-slate-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
