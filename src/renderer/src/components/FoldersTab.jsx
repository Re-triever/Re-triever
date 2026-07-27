import React from 'react';
import { Info, FolderPlus, Folder, Trash2 } from 'lucide-react';

export default function FoldersTab({
  theme,
  watchedFolders,
  onAddFolderDialog,
  onRemoveFolder
}) {
  return (
    <div className="flex-1 overflow-y-auto space-y-3">
      {/* Context menu instruction card */}
      <div className={`p-3 border rounded-xl ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/20'
          : 'bg-gradient-to-r from-emerald-50 via-slate-50 to-slate-50 border-emerald-200'
      }`}>
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div className={`text-[11px] leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
            <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>OS Context Menu Ready:</span> Right-click any folder in Explorer or Finder and choose <span className="text-emerald-500 font-medium">"Observe with Re-triever"</span> to track it instantly.
          </div>
        </div>
      </div>

      {/* Add folder button */}
      <button
        onClick={onAddFolderDialog}
        className={`w-full py-2.5 border border-dashed rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 group ${
          theme === 'dark'
            ? 'bg-slate-900 hover:bg-slate-850 border-slate-700 hover:border-emerald-500/80 text-slate-200 hover:text-emerald-400'
            : 'bg-white hover:bg-slate-50 border-slate-300 hover:border-emerald-600 text-slate-800 hover:text-emerald-600 shadow-xs'
        }`}
      >
        <FolderPlus className={`w-4 h-4 transition-colors ${theme === 'dark' ? 'text-slate-400 group-hover:text-emerald-400' : 'text-slate-500 group-hover:text-emerald-600'}`} />
        Add Folder Manually
      </button>

      {/* Folders List */}
      <div className="space-y-2">
        {watchedFolders.length === 0 ? (
          <div className={`py-8 text-center text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
            No folders watched yet. Click above or use the OS context menu.
          </div>
        ) : (
          watchedFolders.map((folder) => (
            <div
              key={folder.id || folder.path}
              className={`p-3 border rounded-xl flex items-center justify-between group ${
                theme === 'dark'
                  ? 'bg-slate-900/60 border-slate-800/80 text-slate-200'
                  : 'bg-white border-slate-200/90 text-slate-800 shadow-xs'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0 pr-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  theme === 'dark' ? 'bg-slate-800' : 'bg-purple-50 border border-purple-200'
                }`}>
                  <Folder className="w-4 h-4 text-purple-500" />
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-semibold truncate ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>
                    {folder.path.split('/').pop() || folder.path}
                  </p>
                  <p className={`text-[10px] truncate font-mono mt-0.5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                    {folder.path}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onRemoveFolder(folder.path)}
                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
