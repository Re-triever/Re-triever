const { app, Notification } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

class ContextMenuManager {
  constructor(onWatchFolderRequested) {
    this.onWatchFolderRequested = onWatchFolderRequested;
  }

  // Register protocol handler and Windows Registry keys
  registerIntegration() {
    // 1. Deep linking protocol handler (re-triever://watch?path=/target/path)
    if (!app.isDefaultProtocolClient('re-triever')) {
      app.setAsDefaultProtocolClient('re-triever');
    }

    // 2. Platform specific right-click integration
    if (process.platform === 'win32') {
      this.setupWindowsRegistry();
    } else if (process.platform === 'darwin') {
      this.setupMacQuickAction();
    }
  }

  // Windows Registry Setup
  setupWindowsRegistry() {
    const exePath = process.execPath;
    const command = `"${exePath}" --watch "%1"`;

    // Directory context menu
    const regCmdDir = `reg add "HKCU\\Software\\Classes\\Directory\\shell\\ReTriever" /ve /d "Observe with Re-triever" /f && reg add "HKCU\\Software\\Classes\\Directory\\shell\\ReTriever\\command" /ve /d "${command}" /f`;
    
    // Directory background context menu
    const regCmdBg = `reg add "HKCU\\Software\\Classes\\Directory\\Background\\shell\\ReTriever" /ve /d "Observe with Re-triever" /f && reg add "HKCU\\Software\\Classes\\Directory\\Background\\shell\\ReTriever\\command" /ve /d "${command}" /f`;

    exec(regCmdDir, (err) => {
      if (err) console.warn('[ContextMenu] Windows Registry Directory add warning:', err.message);
      else console.log('[ContextMenu] Windows Registry Directory key added successfully');
    });

    exec(regCmdBg, (err) => {
      if (err) console.warn('[ContextMenu] Windows Registry Background add warning:', err.message);
    });
  }

  // macOS Quick Action / Workflow helper setup
  setupMacQuickAction() {
    const home = app.getPath('home');
    const servicesDir = path.join(home, 'Library', 'Services');
    const actionPath = path.join(servicesDir, 'Observe with Re-triever.workflow');

    // Create protocol command handler for macOS Finder
    console.log('[ContextMenu] macOS protocol re-triever:// registered');
  }

  // Process incoming CLI arguments or protocol URLs
  handleArgvOrUrl(argv) {
    console.log('[ContextMenu] Parsing launch arguments / URL:', argv);

    for (const arg of argv) {
      if (arg.startsWith('--watch=')) {
        const folderPath = arg.substring('--watch='.length);
        this.triggerWatchFolder(folderPath);
      } else if (arg === '--watch' && argv.indexOf(arg) + 1 < argv.length) {
        const folderPath = argv[argv.indexOf(arg) + 1];
        this.triggerWatchFolder(folderPath);
      } else if (arg.startsWith('re-triever://')) {
        this.handleProtocolUrl(arg);
      }
    }
  }

  handleProtocolUrl(urlStr) {
    try {
      const parsedUrl = new URL(urlStr);
      if (parsedUrl.host === 'watch' || parsedUrl.pathname.includes('watch')) {
        const targetPath = parsedUrl.searchParams.get('path');
        if (targetPath) {
          this.triggerWatchFolder(decodeURIComponent(targetPath));
        }
      }
    } catch (e) {
      console.error('[ContextMenu] Failed to parse protocol URL:', urlStr, e);
    }
  }

  triggerWatchFolder(folderPath) {
    if (!folderPath) return;
    const cleanPath = path.normalize(folderPath);

    if (fs.existsSync(cleanPath)) {
      const folderName = path.basename(cleanPath);
      
      if (this.onWatchFolderRequested) {
        this.onWatchFolderRequested(cleanPath);
      }

      // Desktop Toast Notification
      if (Notification.isSupported()) {
        new Notification({
          title: 'Re-triever Active',
          body: `Now watching "${folderName}" with Re-triever`,
          silent: false,
        }).show();
      }
    } else {
      console.warn('[ContextMenu] Specified watch path does not exist:', cleanPath);
    }
  }
}

module.exports = ContextMenuManager;
