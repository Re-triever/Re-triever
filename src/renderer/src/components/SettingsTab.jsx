import React, { useState } from 'react';
import { 
  Settings, 
  Trash2, 
  HardDrive, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles,
  Zap
} from 'lucide-react';

export default function SettingsTab({
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
      <div className="p-4 bg-[#2B2B2C] rounded-xl border border-[#404042] space-y-3 shadow-xs">
        <div className="flex items-center gap-2 border-b border-[#404042] pb-3">
          <Settings className="w-4 h-4 text-[#FF6F1E]" />
          <h3 className="text-xs font-bold text-[#FEF1D7] tracking-wide uppercase">
            App Preferences & Integrations
          </h3>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-xs font-semibold text-[#FEF1D7]">OS Context Menu Shortcut</p>
            <p className="text-[11px] text-[#FEF1D7]/70">Right-click any folder in macOS Finder or Windows Explorer</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FF6F1E]/15 text-[#FF6F1E] border border-[#FF6F1E]/30 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Enabled
          </span>
        </div>
      </div>

      {/* 2. STORAGE & MEMORY MANAGEMENT CARD */}
      <div className="p-4 bg-[#2B2B2C] rounded-xl border border-[#404042] space-y-3 shadow-xs">
        <div className="flex items-center gap-2 border-b border-[#404042] pb-3">
          <HardDrive className="w-4 h-4 text-[#FF6F1E]" />
          <h3 className="text-xs font-bold text-[#FEF1D7] tracking-wide uppercase">
            Storage & Memory Maintenance
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Clear Temp Memory Button */}
          <div className="p-3.5 bg-[#353536] rounded-xl space-y-2 flex flex-col justify-between border border-[#404042]">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#FEF1D7]">
                <Zap className="w-4 h-4 text-[#FF6F1E]" /> Clear Temp Memory
              </div>
              <p className="text-[11px] text-[#FEF1D7]/70 mt-1">
                Delete all temporary file preview copies extracted to OS temp folder.
              </p>
            </div>
            <button
              disabled={busyAction === 'clear-temp'}
              onClick={handleRunClearTemp}
              className="orange-btn-primary w-full py-2 text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              {busyAction === 'clear-temp' ? 'Clearing...' : 'Clear Temp Files'}
            </button>
          </div>

          {/* Defrag & Compact Storage */}
          <div className="p-3.5 bg-[#353536] rounded-xl space-y-2 flex flex-col justify-between border border-[#404042]">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#FEF1D7]">
                <Sparkles className="w-4 h-4 text-[#FF6F1E]" /> Compact Database
              </div>
              <p className="text-[11px] text-[#FEF1D7]/70 mt-1">
                Defragment SQLite database and purge unreferenced blobs to free space.
              </p>
            </div>
            <button
              disabled={busyAction === 'compact'}
              onClick={handleRunCompact}
              className="orange-btn-secondary w-full py-2 text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {busyAction === 'compact' ? 'Compacting...' : 'Compact Storage'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. DANGER ZONE & ADMINISTRATIVE RESET */}
      <div className="p-4 bg-[#2B2B2C] rounded-xl border border-[#E63946]/30 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 border-b border-[#E63946]/20 pb-3">
          <AlertTriangle className="w-4 h-4 text-[#E63946]" />
          <h3 className="text-xs font-bold text-[#E63946] tracking-wide uppercase">
            Danger Zone & Administrative Reset
          </h3>
        </div>

        <div className="space-y-3">
          {/* Reset All Application Data */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#FEF1D7]">Reset All Storage & Data</p>
              <p className="text-[11px] text-[#FEF1D7]/70">Erase all commits, version blobs, and start fresh with clean slate</p>
            </div>
            <button
              onClick={() => setResetConfirmModal(true)}
              className="orange-btn-danger px-4 py-2 text-xs flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Erase Everything
            </button>
          </div>

          {/* Uninstall Re:triever Integrations */}
          <div className="flex items-center justify-between pt-3 border-t border-[#E63946]/20">
            <div>
              <p className="text-xs font-semibold text-[#FEF1D7]">Uninstall Integrations</p>
              <p className="text-[11px] text-[#FEF1D7]/70">De-register context menus and unwatch all folders</p>
            </div>
            <button
              onClick={() => setUninstallModal(true)}
              className="orange-btn-secondary px-4 py-2 text-xs text-[#E63946] hover:bg-[#E63946]/10 border-[#E63946]/30 flex items-center gap-1.5 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Uninstall App
            </button>
          </div>
        </div>
      </div>

      {/* RESET CONFIRMATION MODAL */}
      {resetConfirmModal && (
        <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-sm bg-[#2B2B2C] border border-[#E63946]/40 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-[#E63946] font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Complete Reset</span>
            </div>
            <p className="text-xs text-[#FEF1D7]/80 leading-relaxed">
              Are you sure you want to delete all version histories, tracked files, and SQLite database data? <strong className="text-[#E63946]">This action cannot be undone.</strong>
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setResetConfirmModal(false)}
                className="orange-btn-secondary px-4 py-2 text-xs"
              >
                Cancel
              </button>
              <button
                disabled={busyAction === 'reset-data'}
                onClick={handleConfirmReset}
                className="orange-btn-danger px-4 py-2 text-xs disabled:opacity-50"
              >
                {busyAction === 'reset-data' ? 'Resetting...' : 'Yes, Erase Everything'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNINSTALL CONFIRMATION MODAL */}
      {uninstallModal && (
        <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-sm bg-[#2B2B2C] border border-[#FF6F1E]/40 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-[#FEF1D7] font-bold text-sm">
              <Trash2 className="w-5 h-5 text-[#FF6F1E]" />
              <span>Uninstall Re:triever Integrations</span>
            </div>
            <p className="text-xs text-[#FEF1D7]/80 leading-relaxed">
              This will unregister macOS Finder context menu shortcuts, stop watching all folders, and clear temporary preview files.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setUninstallModal(false)}
                className="orange-btn-secondary px-4 py-2 text-xs"
              >
                Cancel
              </button>
              <button
                disabled={busyAction === 'uninstall'}
                onClick={handleConfirmUninstall}
                className="orange-btn-primary px-4 py-2 text-xs disabled:opacity-50"
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
