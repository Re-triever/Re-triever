<div align="center">

  <br />
  <br />
  <img src="src/renderer/src/assets/app_icon.png" width="240" height="240" alt="Re:triever Icon" style="margin-bottom: 24px;" />
  <h1 align="center"><font color="#ff6f1d">Re</font><font color="#343636">:triever</font></h1>

  <br />

  <h3>Instant Time-Travel & Automatic Version Control for Your Files</h3>

  <p align="center">
    <b>Never lose a save, overwrite a draft, or regret an edit again.</b><br />
    A free, zero-setup background utility for <b>macOS</b> & <b>Windows</b> that silently backs up every file save automatically.
  </p>

  <br />

  <p align="center">
    <a href="https://re-triever.github.io/Re-triever/"><img src="https://img.shields.io/badge/Live%20Website-re--triever.github.io%2FRe--triever-FF6F1E?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Website" /></a>
  </p>

  <p align="center">
    <a href="#-download--installation"><img src="https://img.shields.io/badge/macOS-Supported-brightgreen?logo=apple&style=for-the-badge&logoColor=white" alt="macOS Support" /></a>
    &nbsp;
    <a href="#-download--installation"><img src="https://img.shields.io/badge/Windows-10%20%2F%2011-blue?logo=windows&style=for-the-badge&logoColor=white" alt="Windows Support" /></a>
    &nbsp;
    <a href="https://re-triever.github.io/Re-triever/"><img src="https://img.shields.io/badge/100%25-Free%20%26%20Private-orange?style=for-the-badge" alt="100% Free" /></a>
    &nbsp;
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge" alt="License: GPLv3" /></a>
  </p>

  ---

</div>

<br />

> [!NOTE]
> **<span style="color: #ff6f1d;">Re</span><span style="color: #343636;">:triever</span>** is 100% Free forever. No subscriptions, no cloud sign-ups, no file size limits, and no ads. All file backups stay completely private on your computer.

---

## 🌟 Why You’ll Love <span style="color: #ff6f1d;">Re</span><span style="color: #343636;">:triever</span>

Have you ever accidentally overwritten an important document, lost hours of work on a design draft, or wished you could jump back to how your file looked yesterday?

**<span style="color: #ff6f1d;">Re</span><span style="color: #343636;">:triever</span>** is your safety net. It sits quietly in your menu bar or system tray and automatically remembers every single time you save a file (<kbd>⌘ Cmd</kbd> + <kbd>S</kbd> or <kbd>Ctrl</kbd> + <kbd>S</kbd>).

```
   Save any File  ──►  Re:triever Remembers Automatically  ──►  Restore Any Revision Anytime
 (Docs, Code, Sheets)        (Zero Setup Required)               (1-Click Instant Restore)
```

---

## 🔥 Key Highlights

### ⚡ Zero Setup Required
Simply launch <span style="color: #ff6f1d;">Re</span><span style="color: #343636;">:triever</span> once, and it goes to work in your background. No complicated setup, no login screens, and no manual backup buttons to click.

### 📁 1-Click Folder Watching
Right-click any folder in **macOS Finder** or **Windows Explorer** and click **"Observe with Re:triever"**. <span style="color: #ff6f1d;">Re</span><span style="color: #343636;">:triever</span> will automatically watch every file inside that folder from then on.

### 🔍 Visual Change History & Line Diffs
Want to see exactly what changed between two versions? Inspect your complete revision timeline, see line-by-line additions and deletions, or compare any two saved versions side-by-side.

### ⏪ 1-Click Instant Restore
Need to undo a mistake? Overwrite your current file with any past version in one click, or export an isolated preview copy so you can compare before replacing your work.

### 💾 Smart Storage Engine
<span style="color: #ff6f1d;">Re</span><span style="color: #343636;">:triever</span> automatically optimizes disk space so saving hundreds of revisions won’t clutter your hard drive. It only stores the exact changes between saves, saving up to 90% of your disk space.

### 🔒 100% Local & Completely Private
Your files are your business. <span style="color: #ff6f1d;">Re</span><span style="color: #343636;">:triever</span> works entirely offline. Your documents, code, and history never leave your computer and are never sent to external servers.

---

## 💻 Platform Support

<span style="color: #ff6f1d;">Re</span><span style="color: #343636;">:triever</span> is built natively for **macOS** and **Windows**:

| Platform | Features Supported | How to Use |
| :--- | :--- | :--- |
| 🍎 **macOS** (Big Sur to Sequoia) | Menu Bar Popover & Finder Context Menu | Right-click any folder in Finder ➔ **Observe with Re:triever** |
| 🪟 **Windows** (Windows 10 & 11) | Taskbar Tray Popover & Explorer Right-Click | Right-click any folder in File Explorer ➔ **Observe with Re:triever** |

---

## 📥 Download & Installation

### Option 1: Download Ready-to-Run Installers
Download the latest free release for your operating system:
- **macOS**: Download the `.dmg` installer or `.zip` application.
- **Windows**: Download the `.exe` installer.

### Option 2: Run from Source
If you prefer running from source:
```bash
# Clone the repository
git clone https://github.com/Re-triever/Re-triever.git
cd Re-triever

# Install & Build
npm install
npm run build

# Launch Re:triever
npm run electron:dev
```

---

## 🛡️ macOS Gatekeeper & Windows SmartScreen Notice

> [!IMPORTANT]
> Because **<span style="color: #ff6f1d;">Re</span><span style="color: #343636;">:triever</span>** is an open-source community project built on GitHub Actions without expensive commercial developer certificates, **macOS Gatekeeper** and **Windows SmartScreen** may display an *"Unidentified Developer"* or *"Unrecognized App"* warning on first launch. **This is a standard false positive.**

### 🍎 On macOS (Fixing "macOS cannot verify that this app is free from malware"):
> macOS Sequoia / Sonoma / Ventura display this standard prompt for all open-source apps downloaded outside the Mac App Store that are not notarized with Apple's $99/year fee.

1. **Right-Click (or Control-Click)** `Re:triever.app` in Finder and select **Open**.
2. Click **Open** on the security dialog box.
3. **Or via System Settings**: Go to **System Settings ➔ Privacy & Security**, scroll down to Security, and click **Open Anyway**.
4. **Or via Terminal**: Clear quarantine in 1 command:
   ```bash
   sudo xattr -rd com.apple.quarantine /Applications/Re:triever.app
   ```

### 🪟 On Windows:
1. Double-click `Re-triever-Setup-1.0.0.exe`.
2. When the blue *Windows protected your PC* screen appears, click **More info**.
3. Click **Run anyway**.

---

## 🎯 How to Use <span style="color: #ff6f1d;">Re</span><span style="color: #343636;">:triever</span> in 3 Easy Steps

1. **Watch a Folder**: Right-click any folder on your computer and click **"Observe with Re:triever"**.
2. **Work Normally**: Edit and save your files in Word, VS Code, Photoshop, Excel, or any application as you normally do.
3. **Time-Travel**: Click the golden retriever icon in your Menu Bar or System Tray anytime to inspect past versions, preview diffs, or restore any save!

---

## 📄 License

**<span style="color: #ff6f1d;">Re</span><span style="color: #343636;">:triever</span>** is free, open-source software released under the **[GNU General Public License v3.0 (GPLv3)](LICENSE)**. Everyone is free to use, share, and improve it under strong copyleft protection.

<div align="center">

  ---
  <sub>Created with ❤️ for <b>macOS</b> & <b>Windows</b> by the <b><span style="color: #ff6f1d;">Re</span><span style="color: #343636;">:triever</span></b> team.</sub>

</div>
