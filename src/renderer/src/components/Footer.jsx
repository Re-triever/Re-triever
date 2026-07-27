import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer({ theme }) {
  return (
    <footer className={`px-4 py-2 border-t flex items-center justify-between text-[10px] transition-colors ${
      theme === 'dark' ? 'bg-black border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-500'
    }`}>
      <span>Zero-Setup Automatic Version Control</span>
      <span className="text-emerald-500 font-medium flex items-center gap-1">
        <ShieldCheck className="w-3 h-3" /> Re-triever Tray Active
      </span>
    </footer>
  );
}
