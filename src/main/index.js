const { app, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const FileWatcherService = require('./watcher');
const ContextMenuManager = require('./contextMenu');
const TrayPopoverManager = require('./trayPopover');

// Try loading native Rust napi-rs core module from build/
let nativeCore = null;
try {
  const possiblePaths = [
    path.join(__dirname, '../../build/index.node'),
    path.join(__dirname, '../../build/re-triever-core.node'),
    path.join(__dirname, '../../build/index.darwin-arm64.node'),
    path.join(__dirname, '../../core/re-triever-core.node')
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      nativeCore = require(p);
      console.log('[Re-triever Main] Native Rust core loaded successfully from:', p);
      break;
    }
  }
} catch (e) {
  console.warn('[Re-triever Main] Native core not found or failed to load. Will fallback once compiled:', e.message);
}

// Memory fallback store if Rust core is compiling or initializing
class JSStorageFallback {
  constructor() {
    this.home = app.getPath('home');
    this.retrieverDir = path.join(this.home, '.re-triever');
    this.blobsDir = path.join(this.retrieverDir, 'blobs');
    this.metadataFile = path.join(this.retrieverDir, 'metadata.json');

    if (!fs.existsSync(this.blobsDir)) {
      fs.mkdirSync(this.blobsDir, { recursive: true });
    }

    this.data = {
      watchedFolders: [],
      commits: [],
      stats: {
        totalCommits: 0,
        totalBlobs: 0,
        totalStoredBytes: 0,
        totalDeduplicatedBytes: 0,
        totalOriginalBytes: 0,
        watchedFolderCount: 0
      }
    };

    if (fs.existsSync(this.metadataFile)) {
      try {
        this.data = JSON.parse(fs.readFileSync(this.metadataFile, 'utf-8'));
      } catch (e) {
        console.error('Failed to parse metadata json:', e);
      }
    }
  }

  save() {
    fs.writeFileSync(this.metadataFile, JSON.stringify(this.data, null, 2));
  }

  commitFile(filePath) {
    if (!fs.existsSync(filePath)) return null;
    const stats = fs.statSync(filePath);
    const content = fs.readFileSync(filePath);
    const crypto = require('crypto');
    const hash = crypto.createHash('blake2b512').update(content).digest('hex').substring(0, 32);

    const blobPath = path.join(this.blobsDir, hash);
    let deduplicated = 0;
    if (fs.existsSync(blobPath)) {
      deduplicated = stats.size;
    } else {
      fs.writeFileSync(blobPath, content);
      this.data.stats.totalBlobs += 1;
      this.data.stats.totalStoredBytes += stats.size;
    }

    const commitId = `${hash.substring(0, 8)}-${Date.now()}`;
    const commit = {
      id: commitId,
      file_path: filePath,
      file_size: stats.size,
      commit_hash: hash,
      timestamp: new Date().toISOString(),
      chunk_count: 1,
      deduplicated_bytes: deduplicated
    };

    this.data.commits.unshift(commit);
    this.data.stats.totalCommits += 1;
    this.data.stats.totalOriginalBytes += stats.size;
    this.data.stats.totalDeduplicatedBytes += deduplicated;

    this.save();
    return commit;
  }

  addFolder(folderPath) {
    if (!this.data.watchedFolders.find(f => f.path === folderPath)) {
      this.data.watchedFolders.unshift({
        id: Date.now(),
        path: folderPath,
        added_at: new Date().toISOString(),
        active: true
      });
      this.data.stats.watchedFolderCount = this.data.watchedFolders.length;
      this.save();
      return true;
    }
    return false;
  }

  removeFolder(folderPath) {
    this.data.watchedFolders = this.data.watchedFolders.filter(f => f.path !== folderPath);
    this.data.stats.watchedFolderCount = this.data.watchedFolders.length;
    this.save();
    return true;
  }

  getWatchedFolders() {
    return this.data.watchedFolders;
  }

  getCommits(limit = 50) {
    return this.data.commits.slice(0, limit);
  }

  getAllTrackedFiles() {
    const fileMap = new Map();
    for (const c of this.data.commits) {
      if (!c.file_path) continue;
      if (!fileMap.has(c.file_path)) {
        fileMap.set(c.file_path, {
          filePath: c.file_path,
          fileName: c.file_path.split('/').pop(),
          commitCount: 0,
          latestCommit: c,
          totalDeduplicatedBytes: 0,
          fileSize: c.file_size
        });
      }
      const entry = fileMap.get(c.file_path);
      entry.commitCount += 1;
      entry.totalDeduplicatedBytes += (c.deduplicated_bytes || 0);
    }
    return Array.from(fileMap.values());
  }

  getFileHistory(filePath) {
    return this.data.commits.filter(c => c.file_path === filePath);
  }

  getFileContent(commitId) {
    const commit = this.data.commits.find(c => c.id === commitId);
    if (!commit) return { success: false, error: 'Commit not found' };

    const blobPath = path.join(this.blobsDir, commit.commit_hash);
    if (!fs.existsSync(blobPath)) return { success: false, error: 'Blob file missing' };

    try {
      const buffer = fs.readFileSync(blobPath);
      const isBinary = buffer.some(byte => byte === 0);
      if (isBinary) {
        return { success: true, isBinary: true, content: null, commit };
      }
      return { success: true, isBinary: false, content: buffer.toString('utf-8'), commit };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  getStats() {
    return this.data.stats;
  }

  restoreVersion(commitId, targetPath) {
    const commit = this.data.commits.find(c => c.id === commitId);
    if (!commit) return false;

    const blobPath = path.join(this.blobsDir, commit.commit_hash);
    if (!fs.existsSync(blobPath)) return false;

    const content = fs.readFileSync(blobPath);
    const parent = path.dirname(targetPath);
    if (!fs.existsSync(parent)) {
      fs.mkdirSync(parent, { recursive: true });
    }
    fs.writeFileSync(targetPath, content);
    return true;
  }
}

const jsFallback = new JSStorageFallback();

// Application instances
let trayManager = null;
let watcherService = null;
let contextMenuManager = null;

// Initialize Single Instance Lock
const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine) => {
    if (contextMenuManager) {
      contextMenuManager.handleArgvOrUrl(commandLine);
    }
    if (trayManager) {
      trayManager.showPopover();
    }
  });
}

// Pending restores map to tag newly created commits with restored_from metadata
const pendingRestoreMap = new Map();

// Core Rust vs JS dispatchers
function commitFileCore(filePath) {
  const normPath = path.normalize(filePath).toLowerCase();
  const pendingRestore = pendingRestoreMap.get(normPath);

  let commitInfo;
  if (nativeCore && nativeCore.commitFile) {
    const resStr = nativeCore.commitFile(filePath);
    commitInfo = JSON.parse(resStr);
  } else {
    commitInfo = jsFallback.commitFile(filePath);
  }

  if (pendingRestore && (Date.now() - pendingRestore.timestamp < 15000)) {
    if (commitInfo) {
      commitInfo.restored_from = pendingRestore.commitId;
      commitInfo.is_restored = true;
    }
    pendingRestoreMap.delete(normPath);
  }

  return commitInfo;
}

function addFolderCore(folderPath) {
  if (nativeCore && nativeCore.addWatchedFolder) {
    nativeCore.addWatchedFolder(folderPath);
  }
  return jsFallback.addFolder(folderPath);
}

function removeFolderCore(folderPath) {
  if (nativeCore && nativeCore.removeWatchedFolder) {
    nativeCore.removeWatchedFolder(folderPath);
  }
  return jsFallback.removeFolder(folderPath);
}

function getWatchedFoldersCore() {
  if (nativeCore && nativeCore.getWatchedFolders) {
    return JSON.parse(nativeCore.getWatchedFolders());
  }
  return jsFallback.getWatchedFolders();
}

function getRecentCommitsCore(limit = 50) {
  if (nativeCore && nativeCore.getRecentCommits) {
    return JSON.parse(nativeCore.getRecentCommits(limit));
  }
  return jsFallback.getCommits(limit);
}

function getStorageStatsCore() {
  let stats = {};
  if (nativeCore && nativeCore.getStorageStats) {
    try {
      stats = JSON.parse(nativeCore.getStorageStats());
    } catch (e) {
      console.error('Failed to parse storage stats from native core:', e);
      stats = {};
    }
  } else {
    stats = jsFallback.getStats();
  }

  const totalCommits = stats.total_commits !== undefined ? stats.total_commits : (stats.totalCommits || 0);
  const totalBlobs = stats.total_blobs !== undefined ? stats.total_blobs : (stats.totalBlobs || 0);
  const totalStoredBytes = stats.total_stored_bytes !== undefined ? stats.total_stored_bytes : (stats.totalStoredBytes || 0);
  const totalDeduplicatedBytes = stats.total_deduplicated_bytes !== undefined ? stats.total_deduplicated_bytes : (stats.totalDeduplicatedBytes || 0);
  const totalOriginalBytes = stats.total_original_bytes !== undefined ? stats.total_original_bytes : (stats.totalOriginalBytes || 0);
  const watchedFolderCount = stats.watched_folder_count !== undefined ? stats.watched_folder_count : (stats.watchedFolderCount || 0);

  return {
    totalCommits,
    totalBlobs,
    totalStoredBytes,
    totalDeduplicatedBytes,
    totalOriginalBytes,
    watchedFolderCount,
    total_commits: totalCommits,
    total_blobs: totalBlobs,
    total_stored_bytes: totalStoredBytes,
    total_deduplicated_bytes: totalDeduplicatedBytes,
    total_original_bytes: totalOriginalBytes,
    watched_folder_count: watchedFolderCount
  };
}

function restoreFileVersionCore(commitId, targetPath) {
  const normPath = path.normalize(targetPath).toLowerCase();
  pendingRestoreMap.set(normPath, {
    commitId,
    timestamp: Date.now()
  });

  if (nativeCore && nativeCore.restoreFileVersion) {
    return nativeCore.restoreFileVersion(commitId, targetPath);
  }
  return jsFallback.restoreVersion(commitId, targetPath);
}

function getAllTrackedFilesCore() {
  const commits = getRecentCommitsCore(1000) || [];
  const fileMap = new Map();
  for (const c of commits) {
    if (!c.file_path) continue;
    const normKey = path.normalize(c.file_path).toLowerCase();
    if (!fileMap.has(normKey)) {
      fileMap.set(normKey, {
        filePath: c.file_path,
        fileName: path.basename(c.file_path),
        commitCount: 0,
        latestCommit: c,
        totalDeduplicatedBytes: 0,
        fileSize: c.file_size
      });
    }
    const entry = fileMap.get(normKey);
    entry.commitCount += 1;
    entry.totalDeduplicatedBytes += (c.deduplicated_bytes || 0);
  }
  return Array.from(fileMap.values());
}

function getFileHistoryCore(filePath) {
  const commits = getRecentCommitsCore(1000) || [];
  if (!filePath) return [];
  const targetNorm = path.normalize(filePath).toLowerCase();
  return commits.filter(c => c.file_path && path.normalize(c.file_path).toLowerCase() === targetNorm);
}

function getFileContentCore(commitId) {
  const commits = getRecentCommitsCore(1000) || [];
  const commit = commits.find(c => c.id === commitId || (c.id && c.id.startsWith(commitId)));
  if (!commit) {
    return jsFallback.getFileContent(commitId);
  }

  const retrieverDir = path.join(app.getPath('home'), '.re-triever');
  const blobPath = path.join(retrieverDir, 'blobs', commit.commit_hash);

  if (!fs.existsSync(blobPath)) {
    return { success: false, error: 'Blob file missing' };
  }

  try {
    const buffer = fs.readFileSync(blobPath);
    const isBinary = buffer.some(byte => byte === 0);
    if (isBinary) {
      return { success: true, isBinary: true, content: null, commit };
    }
    return { success: true, isBinary: false, content: buffer.toString('utf-8'), commit };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

app.whenReady().then(() => {
  // Renderer URL (Vite Dev Server vs Static Build file)
  const getRendererUrl = () => {
    if (process.env.VITE_DEV_SERVER_URL) {
      return process.env.VITE_DEV_SERVER_URL;
    }
    return path.join(__dirname, '../renderer/dist/index.html');
  };

  // 1. Setup System Tray & Popover
  trayManager = new TrayPopoverManager(getRendererUrl);
  trayManager.init();

  // Auto-show popover window on app launch for immediate user interaction
  setTimeout(() => {
    if (trayManager) {
      trayManager.showPopover();
      console.log('\n======================================================');
      console.log('⚡ Re-triever is running in your System Tray / Menu Bar!');
      console.log('👉 Click the Re-triever icon in your top Menu Bar (near clock)');
      console.log('======================================================\n');
    }
  }, 500);

  // 2. Setup Watcher Service
  watcherService = new FileWatcherService(
    async (filePath) => {
      const commitInfo = commitFileCore(filePath);
      const webContents = trayManager.getWebContents();
      if (webContents) {
        webContents.send('file-committed', { filePath, commitInfo });
        webContents.send('stats-updated', getStorageStatsCore());
      }
    },
    (status, details) => {
      trayManager.setStatus(status);
    }
  );

  // 3. Setup OS Context Menu & Deep-link Manager
  contextMenuManager = new ContextMenuManager((folderPath) => {
    addFolderCore(folderPath);
    watcherService.addFolder(folderPath);
    const webContents = trayManager.getWebContents();
    if (webContents) {
      webContents.send('folder-added', folderPath);
      webContents.send('stats-updated', getStorageStatsCore());
    }
  });

  contextMenuManager.registerIntegration();
  contextMenuManager.handleArgvOrUrl(process.argv);

  // Restore watched folders from storage
  const existingFolders = getWatchedFoldersCore();
  for (const f of existingFolders) {
    if (f.path && fs.existsSync(f.path)) {
      watcherService.addFolder(f.path);
    }
  }

  // IPC Event Handlers
  ipcMain.handle('get-recent-commits', async (event, limit) => {
    return getRecentCommitsCore(limit);
  });

  ipcMain.handle('get-watched-folders', async () => {
    return getWatchedFoldersCore();
  });

  ipcMain.handle('get-storage-stats', async () => {
    return getStorageStatsCore();
  });

  ipcMain.handle('add-watched-folder', async (event, folderPath) => {
    const success = addFolderCore(folderPath);
    if (success) {
      watcherService.addFolder(folderPath);
    }
    return success;
  });

  ipcMain.handle('remove-watched-folder', async (event, folderPath) => {
    const success = removeFolderCore(folderPath);
    if (success) {
      watcherService.removeFolder(folderPath);
    }
    return success;
  });

  ipcMain.handle('restore-file-version', async (event, { commitId, targetPath }) => {
    return restoreFileVersionCore(commitId, targetPath);
  });

  ipcMain.handle('get-all-tracked-files', async () => {
    return getAllTrackedFilesCore();
  });

  ipcMain.handle('get-file-history', async (event, filePath) => {
    return getFileHistoryCore(filePath);
  });

  ipcMain.handle('get-file-content', async (event, commitId) => {
    return getFileContentCore(commitId);
  });

  ipcMain.handle('select-folder-dialog', async () => {
    const window = trayManager.popoverWindow;
    const result = await dialog.showOpenDialog(window, {
      properties: ['openDirectory']
    });
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return null;
  });

  ipcMain.handle('select-file-save-dialog', async (event, defaultName) => {
    const window = trayManager.popoverWindow;
    const result = await dialog.showSaveDialog(window, {
      defaultPath: defaultName
    });
    if (!result.canceled && result.filePath) {
      return result.filePath;
    }
    return null;
  });

  ipcMain.handle('toggle-maximize', async () => {
    const window = trayManager ? trayManager.popoverWindow : null;
    if (window) {
      if (window.isMaximized() || window.isFullScreen()) {
        window.unmaximize();
        window.setFullScreen(false);
        return 'default';
      } else {
        window.maximize();
        return 'maximized';
      }
    }
    return 'default';
  });

  ipcMain.handle('reset-default-size', async () => {
    const window = trayManager ? trayManager.popoverWindow : null;
    if (window) {
      if (window.isFullScreen()) window.setFullScreen(false);
      if (window.isMaximized()) window.unmaximize();
      window.setSize(960, 680);
      if (trayManager) {
        trayManager.showPopover();
      }
      return 'default';
    }
    return 'default';
  });

  ipcMain.handle('is-maximized', async () => {
    const window = trayManager ? trayManager.popoverWindow : null;
    return window ? (window.isMaximized() || window.isFullScreen()) : false;
  });

  ipcMain.handle('open-temp-file-version', async (event, { commitId, filePath, saveNumber }) => {
    try {
      const ext = path.extname(filePath);
      const baseName = path.basename(filePath, ext);
      const tempDir = app.getPath('temp');

      const safeBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const tempFileName = `${safeBaseName}_Save#${saveNumber || 'ver'}_${Date.now()}${ext}`;
      const tempFilePath = path.join(tempDir, tempFileName);

      const restored = restoreFileVersionCore(commitId, tempFilePath);
      if (!restored) return { success: false, error: 'Failed to extract temp version file' };

      activeTempFiles.add(tempFilePath);
      await shell.openPath(tempFilePath);

      return { success: true, tempPath: tempFilePath };
    } catch (err) {
      console.error('Error opening temp version:', err);
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('clear-temp-memory', async () => {
    return clearTempMemoryCore();
  });

  ipcMain.handle('compact-storage', async () => {
    try {
      // Return updated storage stats
      return { success: true, stats: getStorageStatsCore() };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle('reset-all-data', async () => {
    return resetAllDataCore();
  });

  ipcMain.handle('uninstall-app-integration', async () => {
    return uninstallIntegrationCore();
  });
});

function clearTempMemoryCore() {
  const tempDir = app.getPath('temp');
  let freedBytes = 0;
  let count = 0;
  try {
    const files = fs.readdirSync(tempDir);
    for (const f of files) {
      if (f.includes('Save#') || f.startsWith('Re-triever') || activeTempFiles.has(path.join(tempDir, f))) {
        const p = path.join(tempDir, f);
        try {
          const stat = fs.statSync(p);
          freedBytes += stat.size;
          fs.unlinkSync(p);
          count++;
          activeTempFiles.delete(p);
        } catch (e) {}
      }
    }
  } catch (e) {
    console.error('Error clearing temp memory:', e);
  }
  return { success: true, count, freedBytes };
}

function resetAllDataCore() {
  try {
    if (watcherService) {
      watcherService.unwatchAll();
    }
    const home = app.getPath('home');
    const retrieverDir = path.join(home, '.re-triever');
    if (fs.existsSync(retrieverDir)) {
      fs.rmSync(retrieverDir, { recursive: true, force: true });
    }
    fs.mkdirSync(retrieverDir, { recursive: true });
    return { success: true };
  } catch (e) {
    console.error('Error resetting all data:', e);
    return { success: false, error: e.message };
  }
}

function uninstallIntegrationCore() {
  try {
    if (contextMenuManager) {
      contextMenuManager.unregister();
    }
    if (watcherService) {
      watcherService.unwatchAll();
    }
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

const activeTempFiles = new Set();

function cleanupTempFiles() {
  for (const file of activeTempFiles) {
    try {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log(`[Temp Cleanup] Deleted preview temp file: ${file}`);
      }
    } catch (e) {
      console.error(`[Temp Cleanup] Failed to delete ${file}:`, e);
    }
  }
  activeTempFiles.clear();
}

app.on('before-quit', cleanupTempFiles);
app.on('will-quit', cleanupTempFiles);

app.on('open-url', (event, url) => {
  event.preventDefault();
  if (contextMenuManager) {
    contextMenuManager.handleProtocolUrl(url);
  }
});

app.on('activate', () => {
  if (trayManager) {
    trayManager.showPopover();
  }
});
