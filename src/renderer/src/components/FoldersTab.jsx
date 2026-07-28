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
      <div className="p-4 bg-[#2B2B2C] rounded-xl border border-[#404042] flex items-start gap-3 shadow-xs">
        <div className="w-8 h-8 rounded-full bg-[#FF6F1E]/15 text-[#FF6F1E] flex items-center justify-center font-bold shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs text-[#FEF1D7]/80 leading-relaxed">
          <strong className="text-[#FEF1D7]">OS Context Menu Shortcut Active:</strong> Right-click any folder in macOS Finder or Windows Explorer and click <span className="text-[#FF6F1E] font-semibold underline">"Observe with Re:triever"</span> to monitor it automatically.
        </div>
      </div>

      {/* Add Folder Button */}
      <button
        onClick={onAddFolderDialog}
        className="orange-btn-primary w-full py-3 text-xs flex items-center justify-center gap-2"
      >
        <FolderPlus className="w-4 h-4" />
        Add Monitored Folder Manually
      </button>

      {/* Folders List */}
      <div className="space-y-2">
        {watchedFolders.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#FEF1D7]/70 bg-[#2B2B2C] rounded-xl border border-[#404042] shadow-xs">
            No folders watched yet. Click above or right-click any folder in your OS.
          </div>
        ) : (
          watchedFolders.map((folder) => (
            <div
              key={folder.id || folder.path}
              className="p-3.5 bg-[#2B2B2C] hover:bg-[#404042] rounded-xl border border-[#404042] flex items-center justify-between transition-all group shadow-xs"
            >
              <div className="flex items-center space-x-3.5 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-xl bg-[#FF6F1E]/15 group-hover:bg-[#FF6F1E] text-[#FF6F1E] group-hover:text-white flex items-center justify-center shrink-0 transition-colors border border-[#FF6F1E]/30">
                  <Folder className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#FEF1D7] truncate group-hover:text-[#FF6F1E] transition-colors">
                    {folder.path.split('/').pop() || folder.path}
                  </p>
                  <p className="text-[11px] truncate font-mono text-[#FEF1D7]/70 mt-0.5">
                    {folder.path}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onRemoveFolder(folder.path)}
                className="p-2 text-[#FEF1D7]/70 hover:text-[#E63946] hover:bg-[#E63946]/15 rounded-full transition-colors"
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
