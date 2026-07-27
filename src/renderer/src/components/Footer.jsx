import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="px-5 py-3 bg-[oklch(0.962_0.059_95.617)] border-t border-[#EEDCC8] flex items-center justify-between text-xs text-[#786658]">
      <span className="font-semibold text-[#2A201A]">Zero-Setup Automatic Version Control</span>

      <div className="flex items-center space-x-1.5 text-[#2A9D8F] font-bold text-xs">
        <ShieldCheck className="w-4 h-4" />
        <span>Tray Engine Active</span>
      </div>
    </footer>
  );
}
