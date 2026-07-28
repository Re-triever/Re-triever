import React from 'react';
import { RotateCcw, FolderPlus } from 'lucide-react';
import { formatBytes, formatTimeAgo } from '../utils/diffUtils';

export default function RestoreModal({
  selectedCommit,
  restoring,
  onClose,
  onRestoreCommit
}) {
  if (!selectedCommit) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-sm bg-[#2B2B2C] border border-[#404042] rounded-2xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 text-[#FEF1D7]">
        <div className="flex items-center justify-between border-b border-[#404042] pb-3">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[#FF6F1E]" />
            <h3 className="text-sm font-bold text-[#FEF1D7]">Restore File Version</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#353536] hover:bg-[#404042] text-[#FEF1D7]/70 hover:text-[#FEF1D7] flex items-center justify-center text-xs font-bold transition-colors shrink-0"
          >
            ✕
          </button>
        </div>

        <div className="p-3.5 bg-[#353536] rounded-xl border border-[#404042] space-y-2">
          <div className="text-xs font-bold text-[#FEF1D7] truncate">
            {selectedCommit.file_path.split('/').pop()}
          </div>
          <div className="text-[11px] font-mono text-[#FEF1D7]/60 truncate">
            {selectedCommit.file_path}
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#FEF1D7]/60 pt-2 border-t border-[#404042]">
            <span>Saved {formatTimeAgo(selectedCommit.timestamp)}</span>
            <span>{formatBytes(selectedCommit.file_size)}</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            disabled={restoring}
            onClick={() => onRestoreCommit(selectedCommit, selectedCommit.file_path)}
            className="orange-btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            {restoring ? 'Restoring File...' : '⚡ Overwrite Current File Directly'}
          </button>

          <button
            disabled={restoring}
            onClick={() => onRestoreCommit(selectedCommit, undefined)}
            className="orange-btn-secondary w-full py-2.5 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FolderPlus className="w-4 h-4 text-[#FEF1D7]/70" />
            📁 Export / Save as Custom Copy...
          </button>

          <button
            disabled={restoring}
            onClick={onClose}
            className="w-full py-2 rounded-full text-xs font-semibold text-[#FEF1D7]/70 hover:text-[#FEF1D7] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
