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
          ? 'bg-zinc-900 border-zinc-800'
          : 'bg-white border-zinc-200 shadow-xs'
      }`}>
        <div className="flex items-start gap-2.5">
          <Info className={`w-4 h-4 shrink-0 mt-0.5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`} />
          <div className={`text-[11px] leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
            <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>OS Context Menu Ready:</span> Right-click any folder in Explorer or Finder and choose <span className={`font-semibold underline ${theme === 'dark' ? 'text-white' : 'text-black'}`}>"Observe with Re-triever"</span> to track it instantly.
          </div>
        </div>
      </div>

      {/* Add folder button */}
      <button
        onClick={onAddFolderDialog}
        className={`w-full py-2.5 border border-dashed rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 group ${
          theme === 'dark'
            ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-200 hover:text-white'
            : 'bg-white hover:bg-zinc-50 border-zinc-300 text-zinc-800 hover:text-black shadow-xs'
        }`}
      >
        <FolderPlus className={`w-4 h-4 transition-colors ${theme === 'dark' ? 'text-zinc-400 group-hover:text-white' : 'text-zinc-500 group-hover:text-black'}`} />
        Add Folder Manually
      </button>

      {/* Folders List */}
      <div className="space-y-2">
        {watchedFolders.length === 0 ? (
          <div className={`py-8 text-center text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
            No folders watched yet. Click above or use the OS context menu.
          </div>
        ) : (
          watchedFolders.map((folder) => (
            <div
              key={folder.id || folder.path}
              className={`p-3 border rounded-xl flex items-center justify-between group ${
                theme === 'dark'
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-200'
                  : 'bg-white border-zinc-200 text-zinc-800 shadow-xs'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0 pr-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-100 border-zinc-300 text-black'
                }`}>
                  <Folder className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-semibold truncate ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-900'}`}>
                    {folder.path.split('/').pop() || folder.path}
                  </p>
                  <p className={`text-[10px] truncate font-mono mt-0.5 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {folder.path}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onRemoveFolder(folder.path)}
                className="p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
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
