import React from 'react';
import { GitCompare, FileCheck, Plus, Minus, RotateCcw } from 'lucide-react';

export default function DiffViewerModal({
  diffModal,
  fileHistory,
  onClose,
  onSelectCommitToRestore
}) {
  if (!diffModal.isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-2xl bg-[#2B2B2C] border border-[#404042] rounded-2xl p-5 shadow-2xl space-y-3 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150 text-[#FEF1D7]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#404042] pb-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <GitCompare className="w-5 h-5 text-[#FF6F1E] shrink-0" />
            <h3 className="text-sm font-extrabold text-[#FEF1D7] truncate">
              {diffModal.prevCommit ? (
                <span className="flex items-center gap-2 flex-wrap">
                  <span>Visual Diff:</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#353536] text-[#FF6F1E] font-mono text-xs font-bold border border-[#404042]">
                    Save #{fileHistory.length - fileHistory.findIndex(c => c.id === diffModal.prevCommit.id)}
                  </span>
                  <span>➔</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#FF6F1E] text-white font-mono text-xs font-extrabold">
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
            className="w-7 h-7 rounded-full bg-[#353536] hover:bg-[#404042] text-[#FEF1D7]/70 hover:text-[#FEF1D7] flex items-center justify-center text-xs font-bold transition-colors shrink-0"
          >
            ✕
          </button>
        </div>

        {diffModal.loading ? (
          <div className="py-16 text-center text-xs text-[#FEF1D7]/60">
            Computing line-by-line diff...
          </div>
        ) : diffModal.isBinary ? (
          <div className="py-12 text-center space-y-3">
            <FileCheck className="w-12 h-12 mx-auto text-[#FEF1D7]/40" />
            <p className="text-sm font-bold text-[#FEF1D7]">Binary or Media Revision File</p>
            <p className="text-xs text-[#FEF1D7]/70 max-w-xs mx-auto">
              Line diff computation is not applicable for binary documents (PDF, DOCX, PPTX, Images).
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 space-y-2.5">
            {/* Diff Metrics Bar */}
            {diffModal.diffData && (
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#353536] border border-[#404042] text-xs shrink-0 font-semibold">
                <div className="flex items-center gap-4">
                  <span className="text-[#FF6F1E] font-bold flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    +{diffModal.diffData.added} lines
                  </span>
                  <span className="text-[#E63946] font-bold flex items-center gap-1">
                    <Minus className="w-4 h-4" />
                    -{diffModal.diffData.removed} lines
                  </span>
                  <span className="text-[#FEF1D7]/60">
                    {diffModal.diffData.unchanged} unchanged
                  </span>
                </div>
                <span className="text-xs font-mono text-[#FEF1D7]/60">
                  Commit: {diffModal.commit?.id.substring(0, 12)}
                </span>
              </div>
            )}

            {/* Diff Code Container */}
            <div className="flex-1 overflow-y-auto bg-[#353536] rounded-xl border border-[#404042] p-4 font-mono text-[11px] leading-relaxed space-y-1 select-text shadow-inner">
              {diffModal.diffData?.diff.map((line, idx) => (
                <div
                  key={idx}
                  className={`px-2.5 py-1 rounded flex items-start space-x-3 ${
                    line.type === 'add' ? 'bg-[#FF6F1E]/20 text-[#FF6F1E] border-l-2 border-[#FF6F1E]' :
                    line.type === 'delete' ? 'bg-[#E63946]/20 text-[#E63946] border-l-2 border-[#E63946]' :
                    'text-[#FEF1D7]/70 hover:bg-[#2B2B2C]'
                  }`}
                >
                  <span className="w-6 shrink-0 text-right select-none opacity-40 font-mono">
                    {line.type === 'add' ? '+' : line.type === 'delete' ? '-' : line.newLine}
                  </span>
                  <span className="whitespace-pre-wrap break-all font-mono">{line.text || ' '}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="pt-2 border-t border-[#404042] flex items-center justify-between shrink-0 font-mono">
          <span className="text-xs text-[#FEF1D7]/70 truncate">
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
                className="orange-btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
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
