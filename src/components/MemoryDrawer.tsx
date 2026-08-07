import React, { useMemo } from 'react';
import { getMemories } from '../utils/dataFetcher';
import { Memory } from '../types';

interface MemoryDrawerProps {
  isOpen: boolean;
  targetPosition: string; // To filter memories
  onClose: () => void;
  onSelect: (memory: Memory) => void;
}

const RARITIES = ['SP', 'UR', 'SSR', 'SR', 'R', 'N'];

export const MemoryDrawer: React.FC<MemoryDrawerProps> = ({ isOpen, targetPosition, onClose, onSelect }) => {
  const allMemories = getMemories();

  const filteredMemories = useMemo(() => {
    const filtered = allMemories.filter((mem) => {
      // Memory must match the position of the character
      return mem.position === targetPosition || mem.position === ('Coach' as any); // Some general? No, memories are WS, MB, S, OP, Li
    });

    const rarityOrder: Record<string, number> = { 'SP': 6, 'UR': 5, 'SSR': 4, 'SR': 3, 'R': 2, 'N': 1 };
    
    return filtered.sort((a, b) => {
      const orderA = rarityOrder[a.rarity] || 0;
      const orderB = rarityOrder[b.rarity] || 0;
      return orderB - orderA;
    });
  }, [allMemories, targetPosition]);
  
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] transition-opacity backdrop-blur-sm" 
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div 
        className={`
          fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#0f0f0f] border-l border-gray-800 shadow-2xl z-[70] 
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
                Selecionar Memória
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
            
            <div className="px-5">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] block">Filtro Automático: {targetPosition}</span>
            </div>
          </div>

          {/* Lista/Grid de Memórias */}
          <div className="p-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {filteredMemories.map((item: Memory) => (
                <div 
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className={`flex flex-col items-center gap-2 p-2 rounded-xl border transition-all group cursor-pointer bg-white/5 hover:bg-white/10 border-white/5 hover:-translate-y-1`}
                >
                  <div className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent bg-neutral-800 transition-colors group-hover:border-white/30`}>
                    
                    {/* Background da Raridade */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('/assets/others/minibg/background_${item.rarity.toLowerCase()}.png')` }}
                    />
                    
                    {/* Imagem da Memória */}
                    <img 
                      src={`/assets/memories/${item.id}.png`}
                      alt={item.name} 
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    
                    {/* Badge da Raridade */}
                    <span className="absolute bottom-1 right-1 text-[9px] font-black bg-black/60 px-1 rounded text-white shadow">
                      {item.rarity}
                    </span>
                  </div>
                  
                  <div className="text-center w-full">
                    <p className="text-white/90 font-bold text-[10px] leading-tight line-clamp-2 px-1" title={item.name}>
                      {item.name || 'Memória'}
                    </p>
                  </div>
                </div>
              ))}
              
              {filteredMemories.length === 0 && (
                <div className="col-span-full py-10 text-center text-white/50 text-sm">
                  Nenhuma memória encontrada para a posição {targetPosition}.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
