import React from 'react';

interface AiStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategy: string | null;
}

export const AiStrategyModal: React.FC<AiStrategyModalProps> = ({ isOpen, onClose, strategy }) => {
  if (!isOpen || !strategy) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 z-50 transition-opacity backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0f0f0f] border border-indigo-500/30 shadow-[0_0_40px_rgba(79,70,229,0.2)] z-50 rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-indigo-900/30 bg-indigo-950/20 shrink-0 flex items-center gap-3">
          <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h2 className="text-xl font-black text-indigo-200 uppercase tracking-widest">Estratégia do Time (IA)</h2>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <p className="text-sm text-indigo-100/90 leading-relaxed whitespace-pre-wrap">
            {strategy}
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-[#121212]">
          <button 
            onClick={onClose}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-colors text-sm uppercase tracking-wider"
          >
            Fechar
          </button>
        </div>
      </div>
    </>
  );
};
