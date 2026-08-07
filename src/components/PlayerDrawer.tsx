import React from 'react';
import { getCharacters } from '../utils/dataFetcher';
import { Character } from '../types';

interface PlayerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (player: Character) => void;
}

export const PlayerDrawer: React.FC<PlayerDrawerProps> = ({ isOpen, onClose, onSelect }) => {
  const characters = getCharacters();
  
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
          fixed top-0 right-0 h-full w-80 sm:w-96 bg-neutral-900 border-l border-white/10 shadow-2xl z-50 
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-neutral-950">
          <h2 className="text-xl font-bold text-white tracking-wide">Selecionar Jogador</h2>
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
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {characters.map((char) => (
            <div 
              key={char.id}
              onClick={() => onSelect(char)}
              className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <img 
                src={`/assets/characters/${char.id}-mini.png`} 
                alt={char.name} 
                className="w-12 h-12 rounded-full object-cover border border-white/20 bg-neutral-800"
              />
              <div className="flex-1">
                <p className="text-white font-bold text-sm">{char.name}</p>
                <div className="flex gap-2 text-xs font-semibold mt-1">
                  <span className="text-orange-400">{char.position}</span>
                  <span className="text-white/50">{char.rarity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
