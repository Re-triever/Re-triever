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
      theme === 'dark' ? 'bg-zinc-950/85' : 'bg-zinc-900/40'
    }`}>
      <div className={`w-full max-w-sm border rounded-2xl p-4 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 ${
        theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 ${
          theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'
        }`}>
          <div className="flex items-center gap-2">
            <RotateCcw className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
            <h3 className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Restore & Merge File Version</h3>
          </div>
          <button 
            onClick={onClose}
            className={`text-xs font-bold px-1.5 py-0.5 rounded ${
              theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            ✕
          </button>
        </div>

        <div className={`p-3 rounded-xl border space-y-2 ${
          theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
        }`}>
          <div className={`text-xs font-semibold truncate ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-900'}`}>
            {selectedCommit.file_path.split('/').pop()}
          </div>
          <div className={`text-[11px] font-mono truncate ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {selectedCommit.file_path}
          </div>
          <div className={`flex items-center justify-between text-[10px] pt-1 border-t ${
            theme === 'dark' ? 'text-zinc-400 border-zinc-800' : 'text-zinc-500 border-zinc-200'
          }`}>
            <span>Timestamp: {formatTimeAgo(selectedCommit.timestamp)}</span>
            <span>Size: {formatBytes(selectedCommit.file_size)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <button
            disabled={restoring}
            onClick={() => onRestoreCommit(selectedCommit, selectedCommit.file_path)}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {restoring ? 'Restoring File...' : '⚡ Overwrite Current File Directly'}
          </button>

          <button
            disabled={restoring}
            onClick={() => onRestoreCommit(selectedCommit, undefined)}
            className={`w-full py-2 border rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
              theme === 'dark'
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300 shadow-xs'
            }`}
          >
            <FolderPlus className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`} />
            📁 Export / Save as Custom Copy...
          </button>

          <button
            disabled={restoring}
            onClick={onClose}
            className={`w-full py-1.5 rounded-xl text-xs font-medium transition-all ${
              theme === 'dark' ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
