import React from 'react';
import { Coach } from '../types';

interface CoachDetailsModalProps {
  isOpen: boolean;
  coach: Coach | null;
  onClose: () => void;
  onSwap: () => void;
}

export const CoachDetailsModal: React.FC<CoachDetailsModalProps> = ({ isOpen, coach, onClose, onSwap }) => {
  if (!isOpen || !coach) return null;

  const renderStatBar = (label: string, value: number, max: number = 100) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    return (
      <div className="flex items-center gap-2 mb-2">
        <span className="w-20 text-xs font-bold text-white/70 uppercase">{label}</span>
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-white/30 to-white/80 rounded-full" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="w-8 text-right text-xs font-black text-white">{value}</span>
      </div>
    );
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 z-50 transition-opacity backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#0f0f0f] border border-gray-800 shadow-2xl z-50 rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[#1a1a1a]">
          <div>
            <h2 className="text-xl font-black text-white tracking-wide">{coach.name}</h2>
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest mt-0.5">{coach.school}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          
          {/* Expert Guidance */}
          <div>
            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-3">Expert Guidance</h3>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-white/90 text-sm leading-relaxed font-medium">
                {coach.expertGuidance}
              </p>
            </div>
          </div>

          {/* Base Stats */}
          <div>
            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-3">Base Stats</h3>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              {renderStatBar('Set', coach.baseStats.set)}
              {renderStatBar('Serve', coach.baseStats.serve)}
              {renderStatBar('Receive', coach.baseStats.receive)}
              {renderStatBar('Block', coach.baseStats.block)}
              {renderStatBar('Save', coach.baseStats.save)}
              {renderStatBar('Quick Atk', coach.baseStats.quickAtk)}
              {renderStatBar('Power Atk', coach.baseStats.powerAtk)}
            </div>
          </div>

          {/* Level Bonuses */}
          <div>
            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-3">Tabela de Evolução</h3>
            <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5">
              {coach.levelBonuses.map((bonus, idx) => (
                <div key={bonus.level} className={`flex items-center p-3 ${idx !== coach.levelBonuses.length - 1 ? 'border-b border-white/5' : ''}`}>
                  <div className="w-16 shrink-0 flex items-center justify-center">
                    <span className="text-[10px] font-black text-white/40 uppercase bg-white/10 px-2 py-1 rounded">LVL {bonus.level}</span>
                  </div>
                  <div className="flex-1 pl-3 text-sm text-white/80 font-medium">
                    {bonus.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-800 bg-[#121212] flex gap-3">
          <button 
            onClick={onSwap}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-colors text-sm uppercase tracking-wider"
          >
            Trocar Treinador
          </button>
        </div>

      </div>
    </>
  );
};
