import React from 'react';
import goldenRetrieverIcon from '../assets/golden-retriever.png';
import { Sun, Moon, Maximize2, Minimize2, RotateCcw } from 'lucide-react';

export default function Header({
  theme,
  toggleTheme,
  status,
  windowSizeMode, // 'default', 'maximized', 'fullscreen'
  onToggleMaximize,
  onResetDefaultSize
}) {
  return (
    <header className={`px-4 py-3 border-b flex items-center justify-between transition-colors ${
      theme === 'dark' ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'
    }`}>
      {/* Brand & Mascot Avatar */}
      <div className="flex items-center space-x-2.5">
        <div className={`w-9 h-9 rounded-xl border overflow-hidden flex items-center justify-center shrink-0 ${
          theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-100 border-zinc-300'
        }`}>
          <img src={goldenRetrieverIcon} alt="Golden Retriever Mascot" className="w-full h-full object-cover scale-110" />
        </div>
        <div>
          <h1 className={`text-sm font-extrabold tracking-tight flex items-center gap-1.5 ${
            theme === 'dark' ? 'text-white' : 'text-zinc-900'
          }`}>
            Re-triever
            <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full border ${
              theme === 'dark' ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-zinc-100 text-zinc-800 border-zinc-300'
            }`}>
              v1.0
            </span>
          </h1>
          <p className={`text-[11px] font-medium ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Background Version Control</p>
        </div>
      </div>

      {/* Controls Bar: Theme, Fullscreen/Maximize, Reset Default Size, Status Pill */}
      <div className="flex items-center space-x-2">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`p-1.5 rounded-lg border transition-all flex items-center justify-center ${
            theme === 'dark' 
              ? 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700 hover:text-white' 
              : 'bg-zinc-100 text-zinc-800 border-zinc-300 hover:bg-zinc-200 hover:text-black shadow-xs'
          }`}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* Fullscreen / Maximize Toggle */}
        <button
          onClick={onToggleMaximize}
          className={`p-1.5 rounded-lg border transition-all flex items-center justify-center ${
            theme === 'dark' 
              ? 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700' 
              : 'bg-zinc-100 text-zinc-800 border-zinc-300 hover:bg-zinc-200 shadow-xs'
          }`}
          title={windowSizeMode !== 'default' ? "Return to Default Window Size" : "Maximize / Fullscreen Window"}
        >
          {windowSizeMode !== 'default' ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>

        {/* Reset to Default Window Size Button (if expanded) */}
        {windowSizeMode !== 'default' && (
          <button
            onClick={onResetDefaultSize}
            className={`px-2 py-1 rounded-lg border text-[11px] font-semibold transition-all flex items-center gap-1 ${
              theme === 'dark'
                ? 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700'
                : 'bg-zinc-100 text-zinc-800 border-zinc-300 hover:bg-zinc-200 shadow-xs'
            }`}
            title="Reset window to default compact dimensions (960x680)"
          >
            <RotateCcw className="w-3 h-3" />
            Default Size
          </button>
        )}

        {/* Status Indicator Pill */}
        <div className={`flex items-center space-x-2 px-2.5 py-1 rounded-full border ${
          theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-300'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            status === 'chunking' ? 'bg-amber-400 status-dot-chunking' :
            status === 'error' ? 'bg-red-500' : 'bg-emerald-500 status-dot-active'
          }`} />
          <span className={`text-[11px] font-medium capitalize ${
            theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
          }`}>
            {status === 'chunking' ? 'Chunking...' : 'Watching'}
          </span>
        </div>
      </div>
    </header>
  );
}
