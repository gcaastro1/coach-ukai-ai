import React from 'react';
import { getCharacters } from '../utils/dataFetcher';
import { Character } from '../types';
import { SmartImage } from './SmartImage';

interface PlayerDrawerProps {
  isOpen: boolean;
  slotType: 'player' | 'coach';
  onClose: () => void;
  onSelect: (player: Character) => void;
}

export const PlayerDrawer: React.FC<PlayerDrawerProps> = ({ isOpen, slotType, onClose, onSelect }) => {
  const allCharacters = getCharacters();
  const characters = allCharacters.filter((char) => 
    slotType === 'coach' ? char.position === 'Coach' : char.position !== 'Coach'
  );
  
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 transition-opacity backdrop-blur-sm" 
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div 
        className={`
          fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#0f0f0f] border-l border-gray-800 shadow-2xl z-50 
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[#121212]">
          <h2 className="text-xl font-black text-white tracking-wide">
            Selecionar {slotType === 'coach' ? 'Treinador' : 'Jogador'}
          </h2>
          <button 
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            aria-label="Fechar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Área de Filtros (Placeholder UI) */}
        {slotType === 'player' && (
          <div className="p-5 border-b border-gray-800 bg-[#121212]/50 shrink-0">
             <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] block mb-2">Raridade</span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold hover:bg-orange-500/20 transition">UR</button>
                    <button className="px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs font-bold hover:bg-yellow-500/20 transition">SSR</button>
                    <button className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold hover:bg-purple-500/20 transition">SR</button>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] block mb-2">Posição</span>
                  <div className="flex gap-2 flex-wrap">
                    {['S', 'WS', 'MB', 'OP', 'Li'].map(pos => (
                      <button key={pos} className="px-3 py-1.5 rounded-lg bg-white/5 text-white/70 border border-white/10 text-xs font-bold hover:bg-white/10 hover:text-white transition">{pos}</button>
                    ))}
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* Lista/Grid de Jogadores */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {characters.map((char) => (
              <div 
                key={char.id}
                onClick={() => onSelect(char)}
                className="flex flex-col items-center gap-2 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all hover:-translate-y-1 group"
              >
                <div className="relative shrink-0">
                  <SmartImage 
                    playerId={String(char.id)}
                    type="mini"
                    isCoach={slotType === 'coach'}
                    alt={char.name} 
                    fallbackText="?"
                    className="w-16 h-16 rounded-full object-cover border-2 border-transparent group-hover:border-white/30 bg-neutral-800 transition-colors"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-[#1a1a1a] text-[9px] font-black px-1.5 py-0.5 rounded border border-gray-700 text-orange-400">
                    {char.position}
                  </span>
                </div>
                <div className="text-center w-full">
                  <p className="text-white font-bold text-[11px] leading-tight truncate px-1" title={char.name}>{char.name.split(' ')[0]}</p>
                  <p className="text-white/40 text-[10px] font-semibold mt-0.5">{char.rarity}</p>
                </div>
              </div>
            ))}
            
            {characters.length === 0 && (
              <div className="col-span-full py-10 text-center text-white/50 text-sm">
                Nenhum personagem encontrado.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
