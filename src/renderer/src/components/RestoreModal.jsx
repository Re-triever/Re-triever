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
    <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="w-full max-w-sm bg-[#28201D] border border-[#382D28] rounded-2xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 text-[#FAF0E6]">
        <div className="flex items-center justify-between border-b border-[#382D28] pb-3">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[#E07A5F]" />
            <h3 className="text-sm font-bold text-[#FAF0E6]">Restore File Version</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#342B28] hover:bg-[#423733] text-[#9C8E87] hover:text-[#FAF0E6] flex items-center justify-center text-xs font-bold transition-colors shrink-0"
          >
            ✕
          </button>
        </div>

        <div className="p-3.5 bg-[#1E1715] rounded-xl border border-[#382D28] space-y-2">
          <div className="text-xs font-bold text-[#FAF0E6] truncate">
            {selectedCommit.file_path.split('/').pop()}
          </div>
          <div className="text-[11px] font-mono text-[#9C8E87] truncate">
            {selectedCommit.file_path}
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#9C8E87] pt-2 border-t border-[#382D28]">
            <span>Saved {formatTimeAgo(selectedCommit.timestamp)}</span>
            <span>{formatBytes(selectedCommit.file_size)}</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            disabled={restoring}
            onClick={() => onRestoreCommit(selectedCommit, selectedCommit.file_path)}
            className="peach-btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            {restoring ? 'Restoring File...' : '⚡ Overwrite Current File Directly'}
          </button>

          <button
            disabled={restoring}
            onClick={() => onRestoreCommit(selectedCommit, undefined)}
            className="peach-btn-secondary w-full py-2.5 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FolderPlus className="w-4 h-4 text-[#9C8E87]" />
            📁 Export / Save as Custom Copy...
          </button>

          <button
            disabled={restoring}
            onClick={onClose}
            className="w-full py-2 rounded-full text-xs font-semibold text-[#9C8E87] hover:text-[#FAF0E6] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
