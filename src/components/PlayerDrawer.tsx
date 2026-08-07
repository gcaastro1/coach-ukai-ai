import React, { useState, useMemo } from 'react';
import { getCharacters } from '../utils/dataFetcher';
import { getCoaches } from '../utils/coachFetcher';
import { Character, Coach } from '../types';
import { SmartImage } from './SmartImage';

interface PlayerDrawerProps {
  isOpen: boolean;
  slotType: 'player' | 'coach';
  onClose: () => void;
  onSelect: (item: any) => void;
}

const RARITIES = ['UR', 'SSR', 'SR', 'R', 'N'];
const POSITIONS = ['S', 'WS', 'MB', 'OP', 'Li'];

export const PlayerDrawer: React.FC<PlayerDrawerProps> = ({ isOpen, slotType, onClose, onSelect }) => {
  const allCharacters = getCharacters();
  const allCoaches = getCoaches();
  
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);

  const toggleRarity = (r: string) => {
    setSelectedRarities(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
  };

  const togglePosition = (p: string) => {
    setSelectedPositions(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const filteredItems = useMemo(() => {
    if (slotType === 'coach') {
      return allCoaches; // Assuming coaches don't have rarity/position filters for now
    }

    return allCharacters.filter((char) => {
      // 1. Filtrar Treinador falso se houver
      const isCoach = char.position === ('Coach' as any);
      if (isCoach) return false;

      // 2. Filtrar por Raridade (OR dentro da categoria)
      if (selectedRarities.length > 0 && !selectedRarities.includes(char.rarity)) {
        return false;
      }

      // 3. Filtrar por Posição (OR dentro da categoria)
      if (selectedPositions.length > 0 && !selectedPositions.includes(char.position)) {
        return false;
      }

      return true;
    });
  }, [allCharacters, allCoaches, slotType, selectedRarities, selectedPositions]);
  
  const getRarityClasses = (r: string) => {
    const isActive = selectedRarities.includes(r);
    switch (r) {
      case 'UR': return isActive ? 'bg-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.6)] border-transparent' : 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20';
      case 'SSR': return isActive ? 'bg-yellow-500 text-white shadow-[0_0_10px_rgba(234,179,8,0.6)] border-transparent' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20';
      case 'SR': return isActive ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.6)] border-transparent' : 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20';
      case 'R': return isActive ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.6)] border-transparent' : 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20';
      case 'N': return isActive ? 'bg-gray-500 text-white shadow-[0_0_10px_rgba(107,114,128,0.6)] border-transparent' : 'bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500/20';
      default: return '';
    }
  };

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
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent relative">
          
          {/* Topo Fixo (Sticky) */}
          <div className="sticky top-0 z-20 bg-[#0f0f0f]/95 backdrop-blur-md pb-4 border-b border-gray-800">
            {/* Header */}
            <div className="p-5 flex justify-between items-center">
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
            
            {/* Área de Filtros */}
            {slotType === 'player' && (
              <div className="px-5 space-y-4">
                <div>
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] block mb-2">Raridade</span>
                  <div className="flex gap-2 flex-wrap">
                    {RARITIES.map(r => (
                      <button 
                        key={r}
                        onClick={() => toggleRarity(r)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${getRarityClasses(r)}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] block mb-2">Posição</span>
                  <div className="flex gap-2 flex-wrap">
                    {POSITIONS.map(pos => {
                      const isActive = selectedPositions.includes(pos);
                      return (
                        <button 
                          key={pos}
                          onClick={() => togglePosition(pos)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                            isActive 
                              ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.4)]' 
                              : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {pos}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lista/Grid de Jogadores/Treinadores */}
          <div className="p-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {filteredItems.map((item: any) => (
                <div 
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="flex flex-col items-center gap-2 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all hover:-translate-y-1 group"
                >
                  <div className="relative shrink-0">
                    <SmartImage 
                      playerId={String(item.id)}
                      type="mini"
                      isCoach={slotType === 'coach'}
                      alt={item.name} 
                      fallbackText="?"
                      className="w-16 h-16 rounded-full object-cover border-2 border-transparent group-hover:border-white/30 bg-neutral-800 transition-colors"
                    />
                    {slotType === 'player' && item.position && (
                      <img 
                        src={`/assets/others/positions/${item.position}.png`} 
                        alt={item.position} 
                        className="absolute -bottom-1 -right-1 w-6 h-6 drop-shadow-md"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                  </div>
                  <div className="text-center w-full">
                    <p className="text-white font-bold text-[11px] leading-tight truncate px-1" title={item.name}>{item.name.split(' ')[0]}</p>
                    <p className="text-white/40 text-[10px] font-semibold mt-0.5">
                      {slotType === 'coach' ? item.school : item.rarity}
                    </p>
                  </div>
                </div>
              ))}
              
              {filteredItems.length === 0 && (
                <div className="col-span-full py-10 text-center text-white/50 text-sm">
                  Nenhum registro encontrado com os filtros selecionados.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
