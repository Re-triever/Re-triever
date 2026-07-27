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
    // Hide dock icon on macOS to operate purely in menu bar
    if (app.dock) {
      app.dock.hide();
    }

    this.createTrayIcon();
    this.createPopoverWindow();
  }

  // Generate dynamic native tray icon canvas (16x16 with status indicator dot)
  createTrayIconImage(status = 'active') {
    // Standard icon representation using canvas/nativeImage PNG buffer or SVG
    // We create a clean 22x22 template image with status dot
    const colorHex = status === 'chunking' ? '#F59E0B' : status === 'error' ? '#EF4444' : '#10B981';
    
    const svgIcon = `
      <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="11" r="8" fill="none" stroke="#FFFFFF" stroke-width="2"/>
        <path d="M8 11 L10 13 L14 9" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
        <circle cx="17" cy="5" r="4" fill="${colorHex}"/>
      </svg>
    `;

    return nativeImage.createFromBuffer(Buffer.from(svgIcon));
  }

  createTrayIcon() {
    const icon = this.createTrayIconImage(this.status);
    this.tray = new Tray(icon);
    this.tray.setToolTip('Re-triever - Version Control Active');

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
      width: 420,
      height: 600,
      show: false,
      frame: false,
      resizable: false,
      alwaysOnTop: true,
      skipTaskbar: true,
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
