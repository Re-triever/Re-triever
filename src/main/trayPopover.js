const { app, Tray, BrowserWindow, Menu, nativeImage, screen } = require('electron');
const path = require('path');

class TrayPopoverManager {
  constructor(getRendererUrl) {
    this.getRendererUrl = getRendererUrl;
    this.tray = null;
    this.popoverWindow = null;
    this.status = 'active'; // 'active', 'chunking', 'idle', 'error'
  }

  init() {
    // Enable dock icon on macOS for easy access alongside Menu Bar
    if (app.dock) {
      app.dock.show();
      app.dock.setIcon(this.createTrayIconImage('active'));
    }

    this.createTrayIcon();
    this.createPopoverWindow();
  }

  // Generate dynamic native tray icon image with status indicator dot
  createTrayIconImage(status = 'active') {
    const colorHex = status === 'chunking' ? '#F59E0B' : status === 'error' ? '#EF4444' : '#10B981';
    
    const svgIcon = `<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
      <rect width="22" height="22" rx="6" fill="#10B981"/>
      <path d="M7 11 L10 14 L15 8" fill="none" stroke="#090D16" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="17" cy="5" r="4" fill="${colorHex}" stroke="#FFFFFF" stroke-width="1.5"/>
    </svg>`;

    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgIcon)}`;
    const img = nativeImage.createFromDataURL(dataUrl);
    return img.resize({ width: 22, height: 22 });
  }

  createTrayIcon() {
    const icon = this.createTrayIconImage(this.status);
    this.tray = new Tray(icon);
    this.tray.setToolTip('Re-triever - Version Control Active');

    // Add visible title in macOS Menu Bar
    if (process.platform === 'darwin') {
      this.tray.setTitle(' Re-triever');
    }

    this.tray.on('click', () => {
      this.togglePopover();
    });

    this.tray.on('right-click', () => {
      const contextMenu = Menu.buildFromTemplate([
        { label: 'Re-triever Version Control', enabled: false },
        { type: 'separator' },
        { label: 'Open Tray Window', click: () => this.showPopover() },
        { label: 'Quit Re-triever', click: () => app.quit() }
      ]);
      this.tray.popUpContextMenu(contextMenu);
    });
  }

  setStatus(status) {
    this.status = status;
    if (this.tray) {
      const updatedIcon = this.createTrayIconImage(status);
      this.tray.setImage(updatedIcon);
      this.tray.setToolTip(`Re-triever - ${status === 'chunking' ? 'Saving file version...' : 'Active'}`);
    }

    if (this.popoverWindow && !this.popoverWindow.isDestroyed()) {
      this.popoverWindow.webContents.send('status-update', status);
    }
  }

  createPopoverWindow() {
    this.popoverWindow = new BrowserWindow({
      width: 960,
      height: 680,
      minWidth: 720,
      minHeight: 500,
      show: false,
      frame: false,
      resizable: true,
      alwaysOnTop: true,
      skipTaskbar: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false
      }
    });

    const url = this.getRendererUrl();
    if (url.startsWith('http')) {
      this.popoverWindow.loadURL(url);
    } else {
      this.popoverWindow.loadFile(url);
    }

    // Auto hide when window loses focus (Micro-footprint experience like 1Password/Dropbox)
    this.popoverWindow.on('blur', () => {
      if (this.popoverWindow && !this.popoverWindow.isDestroyed()) {
        this.popoverWindow.hide();
      }
    });
  }

  togglePopover() {
    if (!this.popoverWindow) return;
    if (this.popoverWindow.isVisible()) {
      this.popoverWindow.hide();
    } else {
      this.showPopover();
    }
  }

  showPopover() {
    if (!this.popoverWindow || !this.tray) return;

    const trayBounds = this.tray.getBounds();
    const windowBounds = this.popoverWindow.getBounds();
    const display = screen.getDisplayNearestPoint({ x: trayBounds.x, y: trayBounds.y });
    const workArea = display.workArea;

    let x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2);
    let y = Math.round(trayBounds.y + trayBounds.height);

    // macOS menu bar top vs Windows taskbar bottom/top positioning
    if (process.platform === 'darwin') {
      y = Math.round(trayBounds.y + trayBounds.height + 4);
    } else {
      // If taskbar is at bottom
      if (trayBounds.y > workArea.height / 2) {
        y = Math.round(trayBounds.y - windowBounds.height - 4);
      }
    }

    // Clamp to screen bounds
    x = Math.max(workArea.x + 8, Math.min(x, workArea.x + workArea.width - windowBounds.width - 8));

    if (!x || x <= 10) {
      x = Math.round(workArea.x + workArea.width - windowBounds.width - 20);
    }
    if (!y || y <= 10) {
      y = Math.round(workArea.y + 30);
    }

    this.popoverWindow.setPosition(x, y, false);
    this.popoverWindow.show();
    this.popoverWindow.focus();
  }

  getWebContents() {
    return this.popoverWindow ? this.popoverWindow.webContents : null;
  }
}

module.exports = TrayPopoverManager;
