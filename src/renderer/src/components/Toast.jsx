import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className={`p-3 rounded-full border text-xs font-bold flex items-center gap-2.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 shrink-0 ${
      toast.type === 'error' ? 'bg-white border-[#E63946] text-[#E63946]' :
      toast.type === 'info' ? 'bg-white border-[#2A9D8F] text-[#2A9D8F]' :
      'bg-white border-[#E07A5F] text-[#E07A5F]'
    }`}>
      {toast.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0 text-[#E63946]" /> :
       toast.type === 'info' ? <Info className="w-4 h-4 shrink-0 text-[#2A9D8F]" /> :
       <CheckCircle2 className="w-4 h-4 shrink-0 text-[#E07A5F]" />}
      <span className="text-[#2A201A] font-semibold">{toast.message}</span>
    </div>
  );
}
