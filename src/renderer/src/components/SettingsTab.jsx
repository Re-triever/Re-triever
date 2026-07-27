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
  Zap,
  CheckCircle2
} from 'lucide-react';
import { formatBytes } from '../utils/diffUtils';

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
        theme === 'dark' ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-2 border-b pb-2.5">
          <Settings className="w-4 h-4 text-emerald-500" />
          <h3 className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            App Preferences & Appearance
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Theme Mode</p>
            <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Toggle between Dark Mode and Light Mode</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5 ${
              theme === 'dark'
                ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
                : 'bg-amber-100/80 text-amber-800 border-amber-300 hover:bg-amber-200/80 shadow-xs'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800/40">
          <div>
            <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>OS Finder / Explorer Context Menu</p>
            <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Right-click any folder to observe and track versions</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Enabled
          </span>
        </div>
      </div>

      {/* 2. STORAGE & MEMORY MANAGEMENT CARD */}
      <div className={`p-4 border rounded-xl space-y-3 ${
        theme === 'dark' ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-2 border-b pb-2.5">
          <HardDrive className="w-4 h-4 text-cyan-500" />
          <h3 className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Storage & Memory Maintenance
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Clear Temp Memory Button */}
          <div className={`p-3 border rounded-lg space-y-2 flex flex-col justify-between ${
            theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
                <Zap className="w-3.5 h-3.5" /> Clear Temp Memory
              </div>
              <p className={`text-[10px] mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Delete all temporary file preview copies extracted to OS temp folder.
              </p>
            </div>
            <button
              disabled={busyAction === 'clear-temp'}
              onClick={handleRunClearTemp}
              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Zap className="w-3 h-3" />
              {busyAction === 'clear-temp' ? 'Clearing...' : 'Clear Temp Files'}
            </button>
          </div>

          {/* Defrag & Compact Storage */}
          <div className={`p-3 border rounded-lg space-y-2 flex flex-col justify-between ${
            theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-500">
                <Sparkles className="w-3.5 h-3.5" /> Compact Database
              </div>
              <p className={`text-[10px] mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Defragment SQLite database and purge unreferenced blobs to free space.
              </p>
            </div>
            <button
              disabled={busyAction === 'compact'}
              onClick={handleRunCompact}
              className={`w-full py-1.5 border rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 ${
                theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-cyan-400 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-cyan-700 border-slate-300 shadow-xs'
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
        theme === 'dark' ? 'bg-rose-950/20 border-rose-500/30' : 'bg-rose-50/70 border-rose-200'
      }`}>
        <div className="flex items-center gap-2 border-b pb-2.5 border-rose-500/20">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <h3 className={`text-xs font-bold ${theme === 'dark' ? 'text-rose-300' : 'text-rose-900'}`}>
            Danger Zone & Administrative Reset
          </h3>
        </div>

        <div className="space-y-2.5">
          {/* Reset All Application Data */}
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>Reset All Storage & Database</p>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Erase all commits, version blobs, and start fresh with clean slate</p>
            </div>
            <button
              onClick={() => setResetConfirmModal(true)}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Data
            </button>
          </div>

          {/* Uninstall Re-triever Integrations */}
          <div className="flex items-center justify-between pt-2.5 border-t border-rose-500/20">
            <div>
              <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>Uninstall Integrations</p>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>De-register context menus, unwatch folders, and prepare for uninstall</p>
            </div>
            <button
              onClick={() => setUninstallModal(true)}
              className={`px-3 py-1.5 border rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                theme === 'dark'
                  ? 'bg-slate-900 hover:bg-rose-950 text-rose-300 border-rose-500/40'
                  : 'bg-white hover:bg-rose-100 text-rose-700 border-rose-300 shadow-xs'
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
          theme === 'dark' ? 'bg-slate-950/80' : 'bg-slate-900/40'
        }`}>
          <div className={`w-full max-w-sm border rounded-2xl p-4 shadow-2xl space-y-3 animate-in zoom-in-95 duration-150 ${
            theme === 'dark' ? 'bg-slate-900 border-rose-500/40 text-white' : 'bg-white border-rose-300 text-slate-900'
          }`}>
            <div className="flex items-center gap-2 text-rose-500 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>Confirm Complete Reset</span>
            </div>
            <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Are you sure you want to delete all version histories, tracked files, and SQLite database data? <span className="font-bold text-rose-400">This action cannot be undone.</span>
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setResetConfirmModal(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                  theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Cancel
              </button>
              <button
                disabled={busyAction === 'reset-data'}
                onClick={handleConfirmReset}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-md shadow-rose-600/20 disabled:opacity-50"
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
          theme === 'dark' ? 'bg-slate-950/80' : 'bg-slate-900/40'
        }`}>
          <div className={`w-full max-w-sm border rounded-2xl p-4 shadow-2xl space-y-3 animate-in zoom-in-95 duration-150 ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
              <Trash2 className="w-4 h-4" />
              <span>Uninstall Re-triever Integrations</span>
            </div>
            <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              This will unregister macOS Finder context menu shortcuts, stop watching all folders, and clear temporary preview files.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setUninstallModal(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                  theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Cancel
              </button>
              <button
                disabled={busyAction === 'uninstall'}
                onClick={handleConfirmUninstall}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold shadow-md shadow-purple-600/20 disabled:opacity-50"
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
