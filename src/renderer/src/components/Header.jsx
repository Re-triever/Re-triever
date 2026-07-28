import React from 'react';
import appIcon from '../assets/app_icon.png';
import { Maximize2, Minimize2, RotateCcw } from 'lucide-react';

export default function Header({
  status,
  windowSizeMode,
  onToggleMaximize,
  onResetDefaultSize
}) {
  return (
    <header className="px-5 py-3.5 bg-[#353536] border-b border-[#404042] flex items-center justify-between">
      {/* Brand & Mascot Profile */}
      <div className="flex items-center space-x-3">
        <div className="relative w-10 h-10 rounded-full border-2 border-[#FF6F1E] overflow-hidden flex items-center justify-center shrink-0 shadow-md shadow-[#FF6F1E]/20">
          <img src={appIcon} alt="Re-triever App Mascot" className="w-full h-full object-cover scale-110" />
        </div>

        <div>
          <h1 className="text-sm font-extrabold tracking-tight text-[#FEF1D7] flex items-center gap-2">
            Re:triever
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FF6F1E] text-white shadow-xs">
              v1.0
            </span>
          </h1>
          <p className="text-[11px] font-medium text-[#FEF1D7]/70">Background Version Control</p>
        </div>
      </div>

      {/* Controls & Status Bar */}
      <div className="flex items-center space-x-2.5">
        {/* Fullscreen / Maximize Toggle */}
        <button
          onClick={onToggleMaximize}
          className="p-2 rounded-full bg-[#2B2B2C] hover:bg-[#404042] text-[#FEF1D7]/80 hover:text-[#FEF1D7] transition-all border border-[#404042] shadow-xs"
          title={windowSizeMode !== 'default' ? "Return to Default Window Size" : "Maximize Window"}
        >
          {windowSizeMode !== 'default' ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>

        {/* Reset Default Size */}
        {windowSizeMode !== 'default' && (
          <button
            onClick={onResetDefaultSize}
            className="px-3 py-1.5 rounded-full bg-[#2B2B2C] hover:bg-[#404042] text-[#FEF1D7] border border-[#404042] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            title="Reset window to default dimensions"
          >
            <RotateCcw className="w-3 h-3" />
            Compact Size
          </button>
        )}

        {/* Status Indicator Pill */}
        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#2B2B2C] border border-[#404042] shadow-xs">
          <span className={`w-2.5 h-2.5 rounded-full ${
            status === 'chunking' ? 'bg-[#FEF1D7] status-dot-chunking' :
            status === 'error' ? 'bg-[#E63946]' : 'bg-[#FF6F1E] status-dot-active'
          }`} />
          <span className="text-xs font-bold text-[#FEF1D7] capitalize">
            {status === 'chunking' ? 'Chunking Files...' : 'Watching Active'}
          </span>
        </div>
      </div>
    </header>
  );
}
