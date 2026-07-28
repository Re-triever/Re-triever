import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className={`p-3 rounded-full border text-xs font-bold flex items-center gap-2.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 shrink-0 ${
      toast.type === 'error' ? 'bg-[#2B2B2C] border-[#E63946] text-[#E63946]' :
      toast.type === 'info' ? 'bg-[#2B2B2C] border-[#FEF1D7] text-[#FEF1D7]' :
      'bg-[#2B2B2C] border-[#FF6F1E] text-[#FF6F1E]'
    }`}>
      {toast.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0 text-[#E63946]" /> :
       toast.type === 'info' ? <Info className="w-4 h-4 shrink-0 text-[#FEF1D7]" /> :
       <CheckCircle2 className="w-4 h-4 shrink-0 text-[#FF6F1E]" />}
      <span className="text-[#FEF1D7] font-semibold">{toast.message}</span>
    </div>
  );
}
