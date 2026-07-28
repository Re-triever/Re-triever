import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="px-5 py-3 bg-[#353536] border-t border-[#404042] flex items-center justify-between text-xs text-[#FEF1D7]/70">
      <span className="font-semibold text-[#FEF1D7]">Zero-Setup Automatic Version Control</span>

      <div className="flex items-center space-x-1.5 text-[#FF6F1E] font-bold text-xs">
        <ShieldCheck className="w-4 h-4" />
        <span>Tray Engine Active</span>
      </div>
    </footer>
  );
}
