import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricsStrip from './components/MetricsStrip';
import NavTabs from './components/NavTabs';
import ActivityFeed from './components/ActivityFeed';
import FileHistoryTab from './components/FileHistoryTab';
import FoldersTab from './components/FoldersTab';
import SettingsTab from './components/SettingsTab';
import DiffViewerModal from './components/DiffViewerModal';
import RestoreModal from './components/RestoreModal';
import Toast from './components/Toast';
import Footer from './components/Footer';
import { computeLineDiff } from './utils/diffUtils';

// Electron IPC accessor safely supported in Electron
const ipcRenderer = window.require ? window.require('electron').ipcRenderer : {
  invoke: async () => [],
  on: () => {},
  removeListener: () => {}
};

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('retriever_theme') || 'dark';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('retriever_theme', nextTheme);
  };

  const [activeTab, setActiveTab] = useState('activity'); // 'activity', 'history', 'folders'
  const [status, setStatus] = useState('active');
  const [commits, setCommits] = useState([]);
  const [watchedFolders, setWatchedFolders] = useState([]);
  const [trackedFiles, setTrackedFiles] = useState([]);
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

  // File History state
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileHistory, setFileHistory] = useState([]);
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  const [diffModal, setDiffModal] = useState({
    isOpen: false,
    commit: null,
    prevCommit: null,
    diffData: null,
    isBinary: false,
    loading: false
  });

  // Window dimension and fullscreen modes ('default', 'maximized')
  const [windowSizeMode, setWindowSizeMode] = useState('default');
  const [compareBaseId, setCompareBaseId] = useState('');
  const [compareTargetId, setCompareTargetId] = useState('');

  const handleToggleMaximize = async () => {
    try {
      const mode = await ipcRenderer.invoke('toggle-maximize');
      setWindowSizeMode(mode || 'default');
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetDefaultSize = async () => {
    try {
      const mode = await ipcRenderer.invoke('reset-default-size');
      setWindowSizeMode(mode || 'default');
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    try {
      const recentCommits = await ipcRenderer.invoke('get-recent-commits', 50);
      const folders = await ipcRenderer.invoke('get-watched-folders');
      const storageStats = await ipcRenderer.invoke('get-storage-stats');
      const allFiles = await ipcRenderer.invoke('get-all-tracked-files');

      setCommits(recentCommits || []);
      setWatchedFolders(folders || []);
      if (storageStats) setStats(storageStats);
      setTrackedFiles(allFiles || []);

      if (selectedFile) {
        const history = await ipcRenderer.invoke('get-file-history', selectedFile.filePath);
        const hist = history || [];
        setFileHistory(hist);
        if (hist.length >= 2) {
          setCompareBaseId(hist[hist.length - 1].id);
          setCompareTargetId(hist[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load application data:', err);
    }
  };

  useEffect(() => {
    loadData();

    const handleFileCommitted = (event, commit) => {
      setStatus('active');
      loadData();
      showToast(`Saved version of ${commit.file_path ? commit.file_path.split('/').pop() : 'file'}`);
    };

    const handleFolderAdded = () => {
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
  }, [selectedFile]);

  const handleSelectFile = async (fileObj) => {
    setSelectedFile(fileObj);
    try {
      const history = await ipcRenderer.invoke('get-file-history', fileObj.filePath);
      const hist = history || [];
      setFileHistory(hist);
      if (hist.length >= 2) {
        setCompareBaseId(hist[hist.length - 1].id);
        setCompareTargetId(hist[0].id);
      } else if (hist.length === 1) {
        setCompareBaseId(hist[0].id);
        setCompareTargetId(hist[0].id);
      } else {
        setCompareBaseId('');
        setCompareTargetId('');
      }
    } catch (err) {
      console.error('Failed to load file history:', err);
    }
  };

  const handleCompareAnyTwoVersions = async (baseCommitId, targetCommitId) => {
    if (!baseCommitId || !targetCommitId) {
      showToast('Please select both a Base version and a Target version to compare', 'info');
      return;
    }

    if (baseCommitId === targetCommitId) {
      showToast('You selected the same version for both Base and Target', 'info');
      return;
    }

    const baseCommit = fileHistory.find(c => c.id === baseCommitId);
    const targetCommit = fileHistory.find(c => c.id === targetCommitId);

    if (!baseCommit || !targetCommit) return;

    setDiffModal({
      isOpen: true,
      commit: targetCommit,
      prevCommit: baseCommit,
      diffData: null,
      isBinary: false,
      loading: true
    });

    try {
      const baseRes = await ipcRenderer.invoke('get-file-content', baseCommit.id);
      const targetRes = await ipcRenderer.invoke('get-file-content', targetCommit.id);

      if (baseRes.isBinary || targetRes.isBinary) {
        setDiffModal({
          isOpen: true,
          commit: targetCommit,
          prevCommit: baseCommit,
          diffData: null,
          isBinary: true,
          loading: false
        });
      } else {
        const diffResult = computeLineDiff(baseRes.content || '', targetRes.content || '');
        setDiffModal({
          isOpen: true,
          commit: targetCommit,
          prevCommit: baseCommit,
          diffData: diffResult,
          isBinary: false,
          loading: false
        });
      }
    } catch (err) {
      console.error('Failed to compute version comparison:', err);
      showToast('Error loading version content for comparison', 'error');
      setDiffModal({ isOpen: false, commit: null, prevCommit: null, diffData: null, isBinary: false, loading: false });
    }
  };

  const handleOpenDiffLog = async (commit, index) => {
    setDiffModal({
      isOpen: true,
      commit,
      prevCommit: null,
      diffData: null,
      isBinary: false,
      loading: true
    });

    try {
      const prevCommit = fileHistory[index + 1] || null;
      const currentRes = await ipcRenderer.invoke('get-file-content', commit.id);

      let prevContent = '';
      if (prevCommit) {
        const prevRes = await ipcRenderer.invoke('get-file-content', prevCommit.id);
        if (prevRes.success && !prevRes.isBinary) {
          prevContent = prevRes.content || '';
        }
      }

      if (currentRes.isBinary) {
        setDiffModal({
          isOpen: true,
          commit,
          prevCommit,
          diffData: null,
          isBinary: true,
          loading: false
        });
      } else {
        const diffResult = computeLineDiff(prevContent, currentRes.content || '');
        setDiffModal({
          isOpen: true,
          commit,
          prevCommit,
          diffData: diffResult,
          isBinary: false,
          loading: false
        });
      }
    } catch (e) {
      console.error(e);
      setDiffModal(prev => ({ ...prev, loading: false }));
    }
  };

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
      showToast(`Stopped watching: ${folderPath.split('/').pop()}`);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRestoreCommit = async (commit, overridePath = undefined) => {
    setRestoring(true);
    try {
      let targetPath = overridePath;
      if (targetPath === undefined) {
        const customPath = await ipcRenderer.invoke('select-file-save-dialog', commit.file_path.split('/').pop());
        if (!customPath) {
          setRestoring(false);
          return;
        }
        targetPath = customPath;
      }

      const isOverwriteCurrent = (targetPath === commit.file_path);

      const success = await ipcRenderer.invoke('restore-file-version', {
        commitId: commit.id,
        targetPath
      });

      if (success) {
        showToast(
          isOverwriteCurrent
            ? `Successfully restored & merged Save state to current file!`
            : `Exported version copy to ${targetPath.split('/').pop()}`,
          'success'
        );
        setSelectedCommit(null);
        setTimeout(() => loadData(), 600);
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

  const handleOpenTempVersion = async (commit, saveNumber) => {
    try {
      showToast(`Opening temporary preview for Save #${saveNumber}...`, 'info');
      const res = await ipcRenderer.invoke('open-temp-file-version', {
        commitId: commit.id,
        filePath: commit.file_path,
        saveNumber
      });
      if (res.success) {
        showToast(`Opened Save #${saveNumber} temp copy (Auto-clears on app exit)`, 'success');
      } else {
        showToast(`Failed to open temp version: ${res.error || 'Unknown error'}`, 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Error opening temp version file', 'error');
    }
  };

  const handleClearTempMemory = async () => {
    try {
      const res = await ipcRenderer.invoke('clear-temp-memory');
      if (res.success) {
        showToast(`Cleared ${res.count || 0} temporary preview files (${formatBytes(res.freedBytes || 0)})`, 'success');
      } else {
        showToast('Failed to clear temp memory', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Error clearing temp memory', 'error');
    }
  };

  const handleCompactStorage = async () => {
    try {
      const res = await ipcRenderer.invoke('compact-storage');
      if (res.success) {
        if (res.stats) setStats(res.stats);
        showToast('Storage successfully compacted & database defragmented', 'success');
      } else {
        showToast('Failed to compact storage', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Error compacting storage', 'error');
    }
  };

  const handleResetAllData = async () => {
    try {
      const res = await ipcRenderer.invoke('reset-all-data');
      if (res.success) {
        showToast('Successfully erased all data and reset to factory defaults', 'success');
        setSelectedFile(null);
        setFileHistory([]);
        loadData();
      } else {
        showToast(`Failed to reset data: ${res.error}`, 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Error resetting data', 'error');
    }
  };

  const handleUninstallIntegration = async () => {
    try {
      const res = await ipcRenderer.invoke('uninstall-app-integration');
      if (res.success) {
        showToast('Context menus de-registered and folder watching paused', 'info');
        loadData();
      } else {
        showToast(`Uninstall failed: ${res.error}`, 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Error de-registering app integrations', 'error');
    }
  };

  return (
    <div className={`w-full h-screen flex flex-col justify-between overflow-hidden border rounded-lg shadow-2xl transition-colors duration-200 ${
      theme === 'dark' ? 'bg-black border-zinc-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
    }`}>
      
      {/* 1. HEADER BAR */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        status={status}
        windowSizeMode={windowSizeMode}
        onToggleMaximize={handleToggleMaximize}
        onResetDefaultSize={handleResetDefaultSize}
      />

      {/* 2. STORAGE STATS METRICS STRIP */}
      <MetricsStrip
        theme={theme}
        stats={stats}
        watchedFolderCount={watchedFolders.length}
      />

      {/* 3. NAVIGATION TABS */}
      <NavTabs
        theme={theme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        folderCount={watchedFolders.length}
      />

      {/* 4. MAIN TAB CONTENT AREA */}
      <main className={`flex-1 overflow-hidden p-4 flex flex-col space-y-3 ${
        theme === 'dark' ? 'bg-black' : 'bg-slate-50'
      }`}>
        <Toast toast={toast} />

        {activeTab === 'activity' && (
          <ActivityFeed
            theme={theme}
            commits={commits}
            onViewFileLog={(filePath, fileName) => {
              setActiveTab('history');
              handleSelectFile({ filePath, fileName });
            }}
            onSelectCommitToRestore={(commit) => setSelectedCommit(commit)}
          />
        )}

        {activeTab === 'history' && (
          <FileHistoryTab
            theme={theme}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            trackedFiles={trackedFiles}
            fileSearchQuery={fileSearchQuery}
            setFileSearchQuery={setFileSearchQuery}
            fileHistory={fileHistory}
            onSelectFile={handleSelectFile}
            compareBaseId={compareBaseId}
            setCompareBaseId={setCompareBaseId}
            compareTargetId={compareTargetId}
            setCompareTargetId={setCompareTargetId}
            onCompareAnyTwoVersions={handleCompareAnyTwoVersions}
            onOpenDiffLog={handleOpenDiffLog}
            onSelectCommitToRestore={(commit) => setSelectedCommit(commit)}
            onOpenTempVersion={handleOpenTempVersion}
            onBackToActivity={() => setActiveTab('activity')}
          />
        )}

        {activeTab === 'folders' && (
          <FoldersTab
            theme={theme}
            watchedFolders={watchedFolders}
            onAddFolderDialog={handleAddFolderDialog}
            onRemoveFolder={handleRemoveFolder}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            theme={theme}
            toggleTheme={toggleTheme}
            stats={stats}
            onClearTempMemory={handleClearTempMemory}
            onCompactStorage={handleCompactStorage}
            onResetAllData={handleResetAllData}
            onUninstallIntegration={handleUninstallIntegration}
          />
        )}
      </main>

      {/* 5. GRAPHICAL DIFF VIEWER MODAL */}
      <DiffViewerModal
        theme={theme}
        diffModal={diffModal}
        fileHistory={fileHistory}
        onClose={() => setDiffModal({ isOpen: false, commit: null, prevCommit: null, diffData: null, isBinary: false, loading: false })}
        onSelectCommitToRestore={(commit) => setSelectedCommit(commit)}
      />

      {/* 6. RESTORE FILE VERSION MODAL OVERLAY */}
      <RestoreModal
        theme={theme}
        selectedCommit={selectedCommit}
        restoring={restoring}
        onClose={() => setSelectedCommit(null)}
        onRestoreCommit={handleRestoreCommit}
      />

      {/* 7. FOOTER */}
      <Footer theme={theme} />

    </div>
  );
}
