import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 shrink-0 ${
      toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
      toast.type === 'info' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' :
      'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
    }`}>
      <CheckCircle2 className="w-4 h-4 shrink-0" />
      <span>{toast.message}</span>
    </div>
  );
}
