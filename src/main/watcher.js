const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');

class FileWatcherService {
  constructor(commitCallback, statusCallback) {
    this.commitCallback = commitCallback; // fn(filePath) -> commitInfo
    this.statusCallback = statusCallback; // fn(status, details)
    this.watchers = new Map(); // folderPath -> FSWatcher
    this.watchedFolders = new Set();
  }

  // Regex to ignore temp, lock, and hidden files (e.g. ~$Doc.docx, .DS_Store, .tmp)
  static IGNORE_PATTERN = /(^|[\/\\])\..|^~\$|\.tmp$|\.crdownload$/;

  addFolder(folderPath) {
    const normalizedPath = path.normalize(folderPath);
    if (this.watchers.has(normalizedPath)) {
      return false;
    }

    if (!fs.existsSync(normalizedPath)) {
      console.warn(`[Watcher] Path does not exist: ${normalizedPath}`);
      return false;
    }

    console.log(`[Watcher] Monitoring folder: ${normalizedPath}`);

    const watcher = chokidar.watch(normalizedPath, {
      ignored: FileWatcherService.IGNORE_PATTERN,
      persistent: true,
      ignoreInitial: true, // ignore pre-existing files on startup, only watch changes
      awaitWriteFinish: {
        stabilityThreshold: 1500,
        pollInterval: 200,
      },
      depth: 10,
    });

    watcher.on('add', (filePath) => this.handleFileChange('add', filePath));
    watcher.on('change', (filePath) => this.handleFileChange('change', filePath));
    watcher.on('error', (error) => console.error(`[Watcher Error] ${folderPath}:`, error));

    this.watchers.set(normalizedPath, watcher);
    this.watchedFolders.add(normalizedPath);
    return true;
  }

  removeFolder(folderPath) {
    const normalizedPath = path.normalize(folderPath);
    const watcher = this.watchers.get(normalizedPath);
    if (watcher) {
      watcher.close();
      this.watchers.delete(normalizedPath);
      this.watchedFolders.delete(normalizedPath);
      console.log(`[Watcher] Stopped monitoring folder: ${normalizedPath}`);
      return true;
    }
    return false;
  }

  async handleFileChange(event, filePath) {
    // Double check file filter
    const fileName = path.basename(filePath);
    if (FileWatcherService.IGNORE_PATTERN.test(fileName) || fileName.startsWith('~$')) {
      return;
    }

    try {
      if (this.statusCallback) {
        this.statusCallback('chunking', { filePath });
      }

      console.log(`[Watcher] File ${event}: ${filePath}`);
      if (this.commitCallback) {
        await this.commitCallback(filePath);
      }

      if (this.statusCallback) {
        this.statusCallback('idle', { filePath });
      }
    } catch (err) {
      console.error(`[Watcher] Failed to process ${filePath}:`, err);
      if (this.statusCallback) {
        this.statusCallback('error', { filePath, error: err.message });
      }
    }
  }

  getWatchedFolders() {
    return Array.from(this.watchedFolders);
  }

  closeAll() {
    for (const [path, watcher] of this.watchers.entries()) {
      watcher.close();
    }
    this.watchers.clear();
    this.watchedFolders.clear();
  }
}

module.exports = FileWatcherService;
