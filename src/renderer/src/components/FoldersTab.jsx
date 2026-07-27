import React from 'react';
import { Info, FolderPlus, Folder, Trash2 } from 'lucide-react';

export default function FoldersTab({
  watchedFolders,
  onAddFolderDialog,
  onRemoveFolder
}) {
  return (
    <div className="flex-1 overflow-y-auto space-y-3 pr-1">
      {/* OS Context Menu Banner */}
      <div className="p-4 bg-white rounded-xl border border-[rgba(224,122,95,0.2)] flex items-start gap-3 shadow-xs">
        <div className="w-8 h-8 rounded-full bg-[#E07A5F]/10 text-[#E07A5F] flex items-center justify-center font-bold shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs text-[#786658] leading-relaxed">
          <strong className="text-[#2A201A]">OS Context Menu Shortcut Active:</strong> Right-click any folder in macOS Finder or Windows Explorer and click <span className="text-[#E07A5F] font-semibold underline">"Observe with Re-triever"</span> to monitor it automatically.
        </div>
      </div>

      {/* Add Folder Button */}
      <button
        onClick={onAddFolderDialog}
        className="peach-btn-primary w-full py-3 text-xs flex items-center justify-center gap-2"
      >
        <FolderPlus className="w-4 h-4" />
        Add Monitored Folder Manually
      </button>

      {/* Folders List */}
      <div className="space-y-2">
        {watchedFolders.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#786658] bg-white rounded-xl border border-[rgba(224,122,95,0.2)] shadow-xs">
            No folders watched yet. Click above or right-click any folder in your OS.
          </div>
        ) : (
          watchedFolders.map((folder) => (
            <div
              key={folder.id || folder.path}
              className="p-3.5 bg-white hover:bg-[#FFFBF7] rounded-xl border border-[rgba(224,122,95,0.2)] flex items-center justify-between transition-all group shadow-xs"
            >
              <div className="flex items-center space-x-3.5 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-xl bg-[#E07A5F]/10 group-hover:bg-[#E07A5F] text-[#E07A5F] group-hover:text-white flex items-center justify-center shrink-0 transition-colors border border-[rgba(224,122,95,0.2)]">
                  <Folder className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#2A201A] truncate group-hover:text-[#E07A5F] transition-colors">
                    {folder.path.split('/').pop() || folder.path}
                  </p>
                  <p className="text-[11px] truncate font-mono text-[#786658] mt-0.5">
                    {folder.path}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onRemoveFolder(folder.path)}
                className="p-2 text-[#786658] hover:text-[#E63946] hover:bg-[#E63946]/10 rounded-full transition-colors"
                title="Stop Watching"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
