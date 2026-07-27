import React from 'react';
import { GitCompare, FileCheck, Plus, Minus, RotateCcw } from 'lucide-react';

export default function DiffViewerModal({
  theme,
  diffModal,
  fileHistory,
  onClose,
  onSelectCommitToRestore
}) {
  if (!diffModal.isOpen) return null;

  return (
    <div className={`fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4 ${
      theme === 'dark' ? 'bg-slate-950/85' : 'bg-slate-900/40'
    }`}>
      <div className={`w-full max-w-2xl border rounded-2xl p-4 shadow-2xl space-y-3 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Modal Header */}
        <div className={`flex items-center justify-between border-b pb-3 shrink-0 ${
          theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2 min-w-0">
            <GitCompare className="w-4 h-4 text-emerald-500 shrink-0" />
            <h3 className={`text-xs font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {diffModal.prevCommit ? (
                <span className="flex items-center gap-1.5 flex-wrap">
                  <span>Visual Diff:</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                    Save #{fileHistory.length - fileHistory.findIndex(c => c.id === diffModal.prevCommit.id)}
                  </span>
                  <span>➔</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                    Save #{fileHistory.length - fileHistory.findIndex(c => c.id === diffModal.commit.id)}
                  </span>
                </span>
              ) : (
                "Visual Change Log & Diff Viewer"
              )}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className={`text-xs font-bold px-2 py-1 rounded transition-colors shrink-0 ${
              theme === 'dark' ? 'text-slate-400 hover:text-white bg-slate-800' : 'text-slate-500 hover:text-slate-900 bg-slate-100'
            }`}
          >
            ✕
          </button>
        </div>

        {diffModal.loading ? (
          <div className={`py-16 text-center text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            Computing line-by-line diff...
          </div>
        ) : diffModal.isBinary ? (
          <div className="py-12 text-center space-y-3">
            <FileCheck className={`w-10 h-10 mx-auto ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`} />
            <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>Binary or Media Revision File</p>
            <p className={`text-[11px] max-w-xs mx-auto ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
              Line diff computation is not applicable for binary documents (PDF, DOCX, PPTX, Images).
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 space-y-2">
            {/* Diff Metrics Bar */}
            {diffModal.diffData && (
              <div className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs shrink-0 ${
                theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" />
                    +{diffModal.diffData.added} lines
                  </span>
                  <span className="text-rose-500 font-bold flex items-center gap-1">
                    <Minus className="w-3.5 h-3.5" />
                    -{diffModal.diffData.removed} lines
                  </span>
                  <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
                    {diffModal.diffData.unchanged} unchanged
                  </span>
                </div>
                <span className={`text-[11px] font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Commit: {diffModal.commit?.id.substring(0, 12)}
                </span>
              </div>
            )}

            {/* Diff Code Container */}
            <div className="flex-1 overflow-y-auto bg-slate-950 rounded-xl border border-slate-800 p-3 font-mono text-[11px] leading-relaxed space-y-0.5 select-text shadow-inner">
              {diffModal.diffData?.diff.map((line, idx) => (
                <div
                  key={idx}
                  className={`px-2 py-0.5 rounded flex items-start space-x-2 ${
                    line.type === 'add' ? 'bg-emerald-950/60 text-emerald-300 border-l-2 border-emerald-500' :
                    line.type === 'delete' ? 'bg-rose-950/60 text-rose-300 border-l-2 border-rose-500' :
                    'text-slate-400 hover:bg-slate-900/50'
                  }`}
                >
                  <span className="w-5 shrink-0 text-right select-none opacity-40">
                    {line.type === 'add' ? '+' : line.type === 'delete' ? '-' : line.newLine}
                  </span>
                  <span className="whitespace-pre-wrap break-all">{line.text || ' '}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className={`pt-2 border-t flex items-center justify-between shrink-0 ${
          theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <span className={`text-[10px] font-mono ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
            {diffModal.commit?.file_path.split('/').pop()}
          </span>
          <div className="flex items-center gap-2">
            {diffModal.commit && (
              <button
                onClick={() => {
                  const c = diffModal.commit;
                  onClose();
                  onSelectCommitToRestore(c);
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restore this State
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
