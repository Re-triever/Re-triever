import React from 'react';
import goldenRetrieverIcon from '../assets/golden-retriever.png';
import { Maximize2, Minimize2, RotateCcw } from 'lucide-react';

export default function Header({
  status,
  windowSizeMode,
  onToggleMaximize,
  onResetDefaultSize
}) {
  return (
    <header className="px-5 py-3.5 bg-[oklch(0.962_0.059_95.617)] border-b border-[#EEDCC8] flex items-center justify-between">
      {/* Brand & Mascot Profile */}
      <div className="flex items-center space-x-3">
        <div className="relative w-10 h-10 rounded-full border-2 border-[#E07A5F] overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
          <img src={goldenRetrieverIcon} alt="Golden Retriever Mascot" className="w-full h-full object-cover scale-110" />
        </div>

        <div>
          <h1 className="text-sm font-extrabold tracking-tight text-[#2A201A] flex items-center gap-2">
            Re-triever
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E07A5F] text-white shadow-xs">
              v1.0
            </span>
          </h1>
          <p className="text-[11px] font-medium text-[#786658]">Background Version Control</p>
        </div>
      </div>

      {/* Controls & Status Bar */}
      <div className="flex items-center space-x-2.5">
        {/* Fullscreen / Maximize Toggle */}
        <button
          onClick={onToggleMaximize}
          className="p-2 rounded-full bg-white hover:bg-[#FFF8F2] text-[#786658] hover:text-[#2A201A] transition-all border border-[#EEDCC8] shadow-xs"
          title={windowSizeMode !== 'default' ? "Return to Default Window Size" : "Maximize Window"}
        >
          {windowSizeMode !== 'default' ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>

        {/* Reset Default Size */}
        {windowSizeMode !== 'default' && (
          <button
            onClick={onResetDefaultSize}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-[#FFF8F2] text-[#2A201A] border border-[#EEDCC8] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            title="Reset window to default dimensions"
          >
            <RotateCcw className="w-3 h-3" />
            Compact Size
          </button>
        )}

        {/* Status Indicator Pill */}
        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EEDCC8] shadow-xs">
          <span className={`w-2.5 h-2.5 rounded-full ${
            status === 'chunking' ? 'bg-[#E76F51] status-dot-chunking' :
            status === 'error' ? 'bg-[#E63946]' : 'bg-[#2A9D8F] status-dot-active'
          }`} />
          <span className="text-xs font-bold text-[#2A201A] capitalize">
            {status === 'chunking' ? 'Chunking Files...' : 'Watching Active'}
          </span>
        </div>
      </div>
    </header>
  );
}
