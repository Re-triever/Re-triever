import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  FolderPlus, 
  History, 
  HardDrive, 
  RotateCcw, 
  Folder, 
  FileText, 
  FileCheck, 
  Sparkles, 
  Zap, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Info,
  AlertCircle
} from 'lucide-react';

// Electron IPC accessor safely supported in Electron
const ipcRenderer = window.require ? window.require('electron').ipcRenderer : {
  invoke: async () => [],
  on: () => {},
  removeListener: () => {}
};

export default function App() {
  const [activeTab, setActiveTab] = useState('activity'); // 'activity', 'folders', 'restore'
  const [status, setStatus] = useState('active'); // 'active', 'chunking', 'idle', 'error'
  const [commits, setCommits] = useState([]);
  const [watchedFolders, setWatchedFolders] = useState([]);
  const [stats, setStats] = useState({
    totalCommits: 0,
    totalBlobs: 0,
    totalStoredBytes: 0,
    totalDeduplicatedBytes: 0,
    totalOriginalBytes: 0,
    watchedFolderCount: 0
  });

  const [selectedCommit, setSelectedCommit] = useState(null);
  const [restoring, setRestoring] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    try {
      const recentCommits = await ipcRenderer.invoke('get-recent-commits', 50);
      const folders = await ipcRenderer.invoke('get-watched-folders');
      const storageStats = await ipcRenderer.invoke('get-storage-stats');

      setCommits(recentCommits || []);
      setWatchedFolders(folders || []);
      if (storageStats) setStats(storageStats);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  useEffect(() => {
    loadData();

    const handleFileCommitted = (event, data) => {
      showToast(`Chunked & saved ${data.filePath ? data.filePath.split('/').pop() : 'file'}`, 'success');
      loadData();
    };

    const handleFolderAdded = (event, folderPath) => {
      showToast(`Now observing "${folderPath.split('/').pop()}"`, 'info');
      loadData();
    };

    const handleStatusUpdate = (event, newStatus) => {
      setStatus(newStatus);
    };

    const handleStatsUpdated = (event, newStats) => {
      if (newStats) setStats(newStats);
    };

    ipcRenderer.on('file-committed', handleFileCommitted);
    ipcRenderer.on('folder-added', handleFolderAdded);
    ipcRenderer.on('status-update', handleStatusUpdate);
    ipcRenderer.on('stats-updated', handleStatsUpdated);

    return () => {
      ipcRenderer.removeListener('file-committed', handleFileCommitted);
      ipcRenderer.removeListener('folder-added', handleFolderAdded);
      ipcRenderer.removeListener('status-update', handleStatusUpdate);
      ipcRenderer.removeListener('stats-updated', handleStatsUpdated);
    };
  }, []);

  const handleAddFolderDialog = async () => {
    try {
      const folderPath = await ipcRenderer.invoke('select-folder-dialog');
      if (folderPath) {
        const added = await ipcRenderer.invoke('add-watched-folder', folderPath);
        if (added) {
          showToast(`Added folder: ${folderPath.split('/').pop()}`);
          loadData();
        } else {
          showToast('Folder is already being watched', 'info');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveFolder = async (folderPath) => {
    try {
      await ipcRenderer.invoke('remove-watched-folder', folderPath);
      showToast(`Stopped watching ${folderPath.split('/').pop()}`);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRestoreCommit = async (commit, overridePath = null) => {
    setRestoring(true);
    try {
      let targetPath = overridePath || commit.file_path;
      if (!overridePath) {
        const customPath = await ipcRenderer.invoke('select-file-save-dialog', commit.file_path.split('/').pop());
        if (!customPath) {
          setRestoring(false);
          return;
        }
        targetPath = customPath;
      }

      const success = await ipcRenderer.invoke('restore-file-version', {
        commitId: commit.id,
        targetPath
      });

      if (success) {
        showToast(`Restored version to ${targetPath.split('/').pop()}`, 'success');
        setSelectedCommit(null);
      } else {
        showToast('Failed to restore file version', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error restoring file', 'error');
    } finally {
      setRestoring(false);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatTimeAgo = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getFileTypeBadge = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['pptx', 'ppt'].includes(ext)) return { label: 'PPTX', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
    if (['docx', 'doc'].includes(ext)) return { label: 'DOCX', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    if (['xlsx', 'xls', 'csv'].includes(ext)) return { label: 'XLSX', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    if (['pdf'].includes(ext)) return { label: 'PDF', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    if (['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(ext)) return { label: 'IMG', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
    return { label: ext.toUpperCase().substring(0, 4) || 'FILE', color: 'bg-slate-700/50 text-slate-300 border-slate-600/30' };
  };

  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col justify-between overflow-hidden border border-slate-800/80 rounded-lg shadow-2xl">
      
      {/* HEADER BAR */}
      <header className="px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <RotateCcw className="w-4 h-4 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              Re-triever
              <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                CDC v1.0
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Background Version Control</p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center space-x-2 bg-slate-950/60 px-2.5 py-1 rounded-full border border-slate-800">
          <span className={`w-2 h-2 rounded-full ${
            status === 'chunking' ? 'bg-amber-400 status-dot-chunking' :
            status === 'error' ? 'bg-red-500' : 'bg-emerald-400 status-dot-active'
          }`} />
          <span className="text-[11px] font-medium text-slate-300 capitalize">
            {status === 'chunking' ? 'Chunking...' : 'Watching'}
          </span>
        </div>
      </header>

      {/* STORAGE STATS METRICS STRIP */}
      <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800/60 grid grid-cols-3 gap-2">
        <div className="flex flex-col items-start bg-slate-900/80 p-2 rounded-md border border-slate-800/50">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400" /> Saved
          </div>
          <div className="text-xs font-bold text-emerald-400 mt-0.5">
            {formatBytes(stats.totalDeduplicatedBytes || 0)}
          </div>
        </div>

        <div className="flex flex-col items-start bg-slate-900/80 p-2 rounded-md border border-slate-800/50">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" /> Saves
          </div>
          <div className="text-xs font-bold text-white mt-0.5">
            {stats.totalCommits || 0}
          </div>
        </div>

        <div className="flex flex-col items-start bg-slate-900/80 p-2 rounded-md border border-slate-800/50">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Folder className="w-3 h-3 text-purple-400" /> Folders
          </div>
          <div className="text-xs font-bold text-purple-300 mt-0.5">
            {stats.watchedFolderCount || watchedFolders.length}
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="px-4 pt-2.5 bg-slate-950 flex border-b border-slate-800/80 space-x-1">
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-t-md border-t border-x transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'activity'
              ? 'bg-slate-900 text-white border-slate-800 border-b-transparent shadow-sm'
              : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          Activity Feed
        </button>

        <button
          onClick={() => setActiveTab('folders')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-t-md border-t border-x transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'folders'
              ? 'bg-slate-900 text-white border-slate-800 border-b-transparent shadow-sm'
              : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Folder className="w-3.5 h-3.5" />
          Folders ({watchedFolders.length})
        </button>
      </div>

      {/* TAB CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 bg-slate-950/80 space-y-3">

        {/* TOAST ALERTS */}
        {toast && (
          <div className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 ${
            toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
            toast.type === 'info' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' :
            'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toast.message}</span>
          </div>
        )}

        {/* 1. ACTIVITY FEED TAB */}
        {activeTab === 'activity' && (
          <div className="space-y-2.5">
            {commits.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center text-slate-500 space-y-2">
                <Clock className="w-8 h-8 stroke-1 text-slate-600" />
                <p className="text-xs font-medium">No file saves recorded yet.</p>
                <p className="text-[11px] text-slate-600 max-w-[240px]">
                  Re-triever will automatically back up and deduplicate files when you save them in watched folders.
                </p>
              </div>
            ) : (
              commits.map((commit) => {
                const fileName = commit.file_path ? commit.file_path.split('/').pop() : 'File';
                const folderName = commit.file_path ? commit.file_path.split('/').slice(-2, -1)[0] : '';
                const badge = getFileTypeBadge(fileName);
                const isDeduped = commit.deduplicated_bytes > 0;

                return (
                  <div 
                    key={commit.id} 
                    className="p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-xl transition-all flex items-start justify-between group"
                  >
                    <div className="flex items-start space-x-3 min-w-0 flex-1 pr-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border mt-0.5 ${badge.color}`}>
                        {badge.label}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-slate-200 truncate flex items-center gap-1.5">
                          {fileName}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5 flex items-center gap-1">
                          <span className="text-slate-500">in</span> {folderName}
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-500">{formatBytes(commit.file_size)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-600" />
                            {formatTimeAgo(commit.timestamp)}
                          </span>
                          {isDeduped && (
                            <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5" />
                              {formatBytes(commit.deduplicated_bytes)} deduplicated
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedCommit(commit)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white rounded-lg border border-slate-700/80 hover:border-emerald-500 transition-all flex items-center gap-1 shrink-0 opacity-90 group-hover:opacity-100"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Restore
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* 2. WATCHED FOLDERS TAB */}
        {activeTab === 'folders' && (
          <div className="space-y-3">
            {/* Context menu instruction card */}
            <div className="p-3 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-xl">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-300 leading-relaxed">
                  <span className="font-semibold text-white">OS Context Menu Ready:</span> Right-click any folder in Explorer or Finder and choose <span className="text-emerald-400 font-medium">"Observe with Re-triever"</span> to track it instantly.
                </div>
              </div>
            </div>

            {/* Add folder button */}
            <button
              onClick={handleAddFolderDialog}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 border border-dashed border-slate-700 hover:border-emerald-500/80 rounded-xl text-xs font-semibold text-slate-200 hover:text-emerald-400 transition-all flex items-center justify-center gap-2 group"
            >
              <FolderPlus className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              Add Folder Manually
            </button>

            {/* Folders List */}
            <div className="space-y-2">
              {watchedFolders.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No folders watched yet. Click above or use the OS context menu.
                </div>
              ) : (
                watchedFolders.map((folder) => (
                  <div
                    key={folder.id || folder.path}
                    className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                        <Folder className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-200 truncate">
                          {folder.path.split('/').pop() || folder.path}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate font-mono mt-0.5">
                          {folder.path}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveFolder(folder.path)}
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
        )}
      </main>

      {/* RESTORE FILE VERSION MODAL OVERLAY */}
      {selectedCommit && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white">Restore File Version</h3>
              </div>
              <button 
                onClick={() => setSelectedCommit(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-200 truncate">
                {selectedCommit.file_path.split('/').pop()}
              </div>
              <div className="text-[11px] text-slate-400 font-mono truncate">
                {selectedCommit.file_path}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                <span>Timestamp: {formatTimeAgo(selectedCommit.timestamp)}</span>
                <span>Size: {formatBytes(selectedCommit.file_size)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                disabled={restoring}
                onClick={() => handleRestoreCommit(selectedCommit)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {restoring ? 'Restoring File...' : 'Choose Output Location...'}
              </button>

              <button
                disabled={restoring}
                onClick={() => setSelectedCommit(null)}
                className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="px-4 py-2 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
        <span>Zero-Setup CDC Version Control</span>
        <span className="text-emerald-400 font-medium flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Re-triever Tray Active
        </span>
      </footer>

    </div>
  );
}
