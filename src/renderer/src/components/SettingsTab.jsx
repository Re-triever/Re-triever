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
      <div className="p-4 bg-white rounded-xl border border-[rgba(224,122,95,0.2)] space-y-3 shadow-xs">
        <div className="flex items-center gap-2 border-b border-[rgba(224,122,95,0.15)] pb-3">
          <Settings className="w-4 h-4 text-[#E07A5F]" />
          <h3 className="text-xs font-bold text-[#2A201A] tracking-wide uppercase">
            App Preferences & Integrations
          </h3>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-xs font-semibold text-[#2A201A]">OS Context Menu Shortcut</p>
            <p className="text-[11px] text-[#786658]">Right-click any folder in macOS Finder or Windows Explorer</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#2A9D8F]/10 text-[#2A9D8F] border border-[#2A9D8F]/25 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Enabled
          </span>
        </div>
      </div>

      {/* 2. STORAGE & MEMORY MANAGEMENT CARD */}
      <div className="p-4 bg-white rounded-xl border border-[rgba(224,122,95,0.2)] space-y-3 shadow-xs">
        <div className="flex items-center gap-2 border-b border-[rgba(224,122,95,0.15)] pb-3">
          <HardDrive className="w-4 h-4 text-[#E07A5F]" />
          <h3 className="text-xs font-bold text-[#2A201A] tracking-wide uppercase">
            Storage & Memory Maintenance
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Clear Temp Memory Button */}
          <div className="p-3.5 bg-[oklch(0.962_0.059_95.617)] rounded-xl space-y-2 flex flex-col justify-between border border-[rgba(224,122,95,0.2)]">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2A201A]">
                <Zap className="w-4 h-4 text-[#E07A5F]" /> Clear Temp Memory
              </div>
              <p className="text-[11px] text-[#786658] mt-1">
                Delete all temporary file preview copies extracted to OS temp folder.
              </p>
            </div>
            <button
              disabled={busyAction === 'clear-temp'}
              onClick={handleRunClearTemp}
              className="peach-btn-primary w-full py-2 text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              {busyAction === 'clear-temp' ? 'Clearing...' : 'Clear Temp Files'}
            </button>
          </div>

          {/* Defrag & Compact Storage */}
          <div className="p-3.5 bg-[oklch(0.962_0.059_95.617)] rounded-xl space-y-2 flex flex-col justify-between border border-[rgba(224,122,95,0.2)]">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2A201A]">
                <Sparkles className="w-4 h-4 text-[#E07A5F]" /> Compact Database
              </div>
              <p className="text-[11px] text-[#786658] mt-1">
                Defragment SQLite database and purge unreferenced blobs to free space.
              </p>
            </div>
            <button
              disabled={busyAction === 'compact'}
              onClick={handleRunCompact}
              className="peach-btn-secondary w-full py-2 text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {busyAction === 'compact' ? 'Compacting...' : 'Compact Storage'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. DANGER ZONE & ADMINISTRATIVE RESET */}
      <div className="p-4 bg-white rounded-xl border border-[#E63946]/30 space-y-3 shadow-xs">
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
              <p className="text-xs font-semibold text-[#2A201A]">Reset All Storage & Data</p>
              <p className="text-[11px] text-[#786658]">Erase all commits, version blobs, and start fresh with clean slate</p>
            </div>
            <button
              onClick={() => setResetConfirmModal(true)}
              className="peach-btn-danger px-4 py-2 text-xs flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Erase Everything
            </button>
          </div>

          {/* Uninstall Re-triever Integrations */}
          <div className="flex items-center justify-between pt-3 border-t border-[#E63946]/20">
            <div>
              <p className="text-xs font-semibold text-[#2A201A]">Uninstall Integrations</p>
              <p className="text-[11px] text-[#786658]">De-register context menus and unwatch all folders</p>
            </div>
            <button
              onClick={() => setUninstallModal(true)}
              className="peach-btn-secondary px-4 py-2 text-xs text-[#E63946] hover:bg-[#E63946]/10 border-[#E63946]/30 flex items-center gap-1.5 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Uninstall App
            </button>
          </div>
        </div>
      </div>

      {/* RESET CONFIRMATION MODAL */}
      {resetConfirmModal && (
        <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-sm bg-white border border-[#E63946]/40 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-[#E63946] font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Complete Reset</span>
            </div>
            <p className="text-xs text-[#786658] leading-relaxed">
              Are you sure you want to delete all version histories, tracked files, and SQLite database data? <strong className="text-[#E63946]">This action cannot be undone.</strong>
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setResetConfirmModal(false)}
                className="peach-btn-secondary px-4 py-2 text-xs"
              >
                Cancel
              </button>
              <button
                disabled={busyAction === 'reset-data'}
                onClick={handleConfirmReset}
                className="peach-btn-danger px-4 py-2 text-xs disabled:opacity-50"
              >
                {busyAction === 'reset-data' ? 'Resetting...' : 'Yes, Erase Everything'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNINSTALL CONFIRMATION MODAL */}
      {uninstallModal && (
        <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-sm bg-white border border-[rgba(224,122,95,0.3)] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-[#2A201A] font-bold text-sm">
              <Trash2 className="w-5 h-5 text-[#E07A5F]" />
              <span>Uninstall Re-triever Integrations</span>
            </div>
            <p className="text-xs text-[#786658] leading-relaxed">
              This will unregister macOS Finder context menu shortcuts, stop watching all folders, and clear temporary preview files.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setUninstallModal(false)}
                className="peach-btn-secondary px-4 py-2 text-xs"
              >
                Cancel
              </button>
              <button
                disabled={busyAction === 'uninstall'}
                onClick={handleConfirmUninstall}
                className="peach-btn-primary px-4 py-2 text-xs disabled:opacity-50"
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
