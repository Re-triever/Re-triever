import React, { useState } from 'react';
import { 
  Settings, 
  Trash2, 
  HardDrive, 
  RotateCcw, 
  Sun, 
  Moon, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles,
  Zap
} from 'lucide-react';

export default function SettingsTab({
  theme,
  toggleTheme,
  stats,
  onClearTempMemory,
  onCompactStorage,
  onResetAllData,
  onUninstallIntegration
}) {
  const [resetConfirmModal, setResetConfirmModal] = useState(false);
  const [uninstallModal, setUninstallModal] = useState(false);
  const [busyAction, setBusyAction] = useState('');

  const handleRunClearTemp = async () => {
    setBusyAction('clear-temp');
    await onClearTempMemory();
    setBusyAction('');
  };

  const handleRunCompact = async () => {
    setBusyAction('compact');
    await onCompactStorage();
    setBusyAction('');
  };

  const handleConfirmReset = async () => {
    setBusyAction('reset-data');
    await onResetAllData();
    setBusyAction('');
    setResetConfirmModal(false);
  };

  const handleConfirmUninstall = async () => {
    setBusyAction('uninstall');
    await onUninstallIntegration();
    setBusyAction('');
    setUninstallModal(false);
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-4 pr-1">
      
      {/* 1. GENERAL PREFERENCES CARD */}
      <div className={`p-4 border rounded-xl space-y-3 ${
        theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-2 border-b pb-2.5 border-zinc-800/40">
          <Settings className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
          <h3 className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
            App Preferences & Appearance
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>Theme Mode</p>
            <p className={`text-[11px] ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Toggle between Dark Mode and Light Mode</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5 ${
              theme === 'dark'
                ? 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700 hover:text-white'
                : 'bg-zinc-100 text-zinc-800 border-zinc-300 hover:bg-zinc-200 hover:text-black shadow-xs'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/40">
          <div>
            <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>OS Finder / Explorer Context Menu</p>
            <p className={`text-[11px] ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Right-click any folder to observe and track versions</p>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
            theme === 'dark' ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-zinc-100 text-zinc-900 border-zinc-300'
          }`}>
            <ShieldCheck className="w-3 h-3" /> Enabled
          </span>
        </div>
      </div>

      {/* 2. STORAGE & MEMORY MANAGEMENT CARD */}
      <div className={`p-4 border rounded-xl space-y-3 ${
        theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-2 border-b pb-2.5 border-zinc-800/40">
          <HardDrive className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
          <h3 className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
            Storage & Memory Maintenance
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Clear Temp Memory Button */}
          <div className={`p-3 border rounded-lg space-y-2 flex flex-col justify-between ${
            theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <div>
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                <Zap className="w-3.5 h-3.5" /> Clear Temp Memory
              </div>
              <p className={`text-[10px] mt-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Delete all temporary file preview copies extracted to OS temp folder.
              </p>
            </div>
            <button
              disabled={busyAction === 'clear-temp'}
              onClick={handleRunClearTemp}
              className="w-full py-1.5 bg-black hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-black rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Zap className="w-3 h-3" />
              {busyAction === 'clear-temp' ? 'Clearing...' : 'Clear Temp Files'}
            </button>
          </div>

          {/* Defrag & Compact Storage */}
          <div className={`p-3 border rounded-lg space-y-2 flex flex-col justify-between ${
            theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <div>
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                <Sparkles className="w-3.5 h-3.5" /> Compact Database
              </div>
              <p className={`text-[10px] mt-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Defragment SQLite database and purge unreferenced blobs to free space.
              </p>
            </div>
            <button
              disabled={busyAction === 'compact'}
              onClick={handleRunCompact}
              className={`w-full py-1.5 border rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 ${
                theme === 'dark'
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                  : 'bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-300 shadow-xs'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              {busyAction === 'compact' ? 'Compacting...' : 'Compact Storage'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. DANGER ZONE & UNINSTALL CARD */}
      <div className={`p-4 border rounded-xl space-y-3 ${
        theme === 'dark' ? 'bg-zinc-900/90 border-red-500/30' : 'bg-white border-red-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-2 border-b pb-2.5 border-red-500/20">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <h3 className={`text-xs font-bold ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>
            Danger Zone & Administrative Reset
          </h3>
        </div>

        <div className="space-y-2.5">
          {/* Reset All Application Data */}
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-900'}`}>Reset All Storage & Database</p>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>Erase all commits, version blobs, and start fresh with clean slate</p>
            </div>
            <button
              onClick={() => setResetConfirmModal(true)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Data
            </button>
          </div>

          {/* Uninstall Re-triever Integrations */}
          <div className="flex items-center justify-between pt-2.5 border-t border-red-500/20">
            <div>
              <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-900'}`}>Uninstall Integrations</p>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>De-register context menus, unwatch folders, and prepare for uninstall</p>
            </div>
            <button
              onClick={() => setUninstallModal(true)}
              className={`px-3 py-1.5 border rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                theme === 'dark'
                  ? 'bg-zinc-800 hover:bg-red-950 text-red-400 border-red-500/40'
                  : 'bg-white hover:bg-red-50 text-red-700 border-red-300 shadow-xs'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Uninstall App
            </button>
          </div>
        </div>
      </div>

      {/* RESET CONFIRMATION MODAL */}
      {resetConfirmModal && (
        <div className={`fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${
          theme === 'dark' ? 'bg-zinc-950/85' : 'bg-zinc-900/40'
        }`}>
          <div className={`w-full max-w-sm border rounded-2xl p-4 shadow-2xl space-y-3 animate-in zoom-in-95 duration-150 ${
            theme === 'dark' ? 'bg-zinc-900 border-red-500/40 text-white' : 'bg-white border-red-300 text-zinc-900'
          }`}>
            <div className="flex items-center gap-2 text-red-500 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>Confirm Complete Reset</span>
            </div>
            <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
              Are you sure you want to delete all version histories, tracked files, and SQLite database data? <span className="font-bold text-red-500">This action cannot be undone.</span>
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setResetConfirmModal(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                  theme === 'dark' ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                Cancel
              </button>
              <button
                disabled={busyAction === 'reset-data'}
                onClick={handleConfirmReset}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold shadow-md shadow-red-600/20 disabled:opacity-50"
              >
                {busyAction === 'reset-data' ? 'Resetting...' : 'Yes, Erase Everything'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNINSTALL CONFIRMATION MODAL */}
      {uninstallModal && (
        <div className={`fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${
          theme === 'dark' ? 'bg-zinc-950/85' : 'bg-zinc-900/40'
        }`}>
          <div className={`w-full max-w-sm border rounded-2xl p-4 shadow-2xl space-y-3 animate-in zoom-in-95 duration-150 ${
            theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <div className={`flex items-center gap-2 font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              <Trash2 className="w-4 h-4" />
              <span>Uninstall Re-triever Integrations</span>
            </div>
            <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
              This will unregister macOS Finder context menu shortcuts, stop watching all folders, and clear temporary preview files.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setUninstallModal(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                  theme === 'dark' ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                Cancel
              </button>
              <button
                disabled={busyAction === 'uninstall'}
                onClick={handleConfirmUninstall}
                className="px-3 py-1.5 bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black rounded-lg text-xs font-bold shadow-md disabled:opacity-50"
              >
                {busyAction === 'uninstall' ? 'Uninstalling...' : 'Uninstall Integrations'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
