import React, { useState, useEffect } from 'react';
import { Coach } from '../types';

interface CoachDetailsModalProps {
  isOpen: boolean;
  coach: Coach | null;
  onClose: () => void;
  onSwap: () => void;
}

export const CoachDetailsModal: React.FC<CoachDetailsModalProps> = ({ isOpen, coach, onClose, onSwap }) => {
  const [selectedRarity, setSelectedRarity] = useState<'Rare' | 'Epic' | 'Legendary'>('Rare');

  useEffect(() => {
    if (coach) {
      setSelectedRarity(coach.rarity);
    }
  }, [coach]);

  if (!isOpen || !coach) return null;



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
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Expert Guidance</h3>
              
              {/* Rarity Selector */}
              <div className="flex gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                {(['Rare', 'Epic', 'Legendary'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => setSelectedRarity(r)}
                    className={`px-3 py-1 text-[10px] font-black uppercase rounded transition-colors ${
                      selectedRarity === r 
                        ? r === 'Legendary' ? 'bg-orange-500 text-white' : r === 'Epic' ? 'bg-purple-500 text-white' : 'bg-blue-600 text-white'
                        : 'text-white/40 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {r === 'Legendary' ? 'Legend' : r}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-white/90 text-sm leading-relaxed font-medium">
                {coach.expertGuidance[selectedRarity]}
              </p>
            </div>
          </div>



          {/* Level Bonuses / Positional Advantages */}
          <div>
            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-3">Vantagens de Posição (APR)</h3>
            <p className="text-white/60 text-xs mb-3">
              No Nv. 3, 6, 9, 12 e 15, o treinador obtém aleatoriamente 1 Vantagem de Posição baseada em sua raridade ({coach.rarity}).
            </p>
            
            {/* Probabilities based on rarity */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {coach.rarity === 'Rare' && (
                <>
                  <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded font-bold border border-blue-500/30">70% Raro</span>
                  <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded font-bold border border-purple-500/30">30% Épico</span>
                </>
              )}
              {coach.rarity === 'Epic' && (
                <>
                  <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded font-bold border border-blue-500/30">40% Raro</span>
                  <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded font-bold border border-purple-500/30">50% Épico</span>
                  <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded font-bold border border-orange-500/30">10% Lendário</span>
                </>
              )}
              {coach.rarity === 'Legendary' && (
                <>
                  <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded font-bold border border-blue-500/30">30% Raro</span>
                  <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded font-bold border border-purple-500/30">40% Épico</span>
                  <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded font-bold border border-orange-500/30">25% Lendário</span>
                  <span className="bg-pink-500/20 text-pink-400 text-xs px-2 py-1 rounded font-bold border border-pink-500/30">5% Mítico</span>
                </>
              )}
            </div>

            <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5">
              {[3, 6, 9, 12, 15].map((lvl, idx) => (
                <div key={lvl} className={`flex items-center p-3 ${idx !== 4 ? 'border-b border-white/5' : ''}`}>
                  <div className="w-16 shrink-0 flex items-center justify-center">
                    <span className="text-[10px] font-black text-white/40 uppercase bg-white/10 px-2 py-1 rounded">LVL {lvl}</span>
                  </div>
                  <div className="flex-1 pl-3 text-sm text-white/80 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white/20"></span>
                    Sorteia 1 Vantagem de Posição
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
