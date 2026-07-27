const { app, ipcMain, dialog } = require('electron');
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

// Core Rust vs JS dispatchers
function commitFileCore(filePath) {
  if (nativeCore && nativeCore.commitFile) {
    const resStr = nativeCore.commitFile(filePath);
    return JSON.parse(resStr);
  }
  return jsFallback.commitFile(filePath);
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
  if (nativeCore && nativeCore.getStorageStats) {
    return JSON.parse(nativeCore.getStorageStats());
  }
  return jsFallback.getStats();
}

function restoreFileVersionCore(commitId, targetPath) {
  if (nativeCore && nativeCore.restoreFileVersion) {
    return nativeCore.restoreFileVersion(commitId, targetPath);
  }
  return jsFallback.restoreVersion(commitId, targetPath);
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
});

app.on('open-url', (event, url) => {
  event.preventDefault();
  if (contextMenuManager) {
    contextMenuManager.handleProtocolUrl(url);
  }
});
