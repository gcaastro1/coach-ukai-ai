import React, { useState, useEffect } from 'react';
import { PlayerNode, Memory } from '../types';
import { calculateCharacterStats } from '../utils/statCalculator';
import { characterGrowthData } from '../data/characterGrowth';
import { MemoryDrawer } from './MemoryDrawer';
import { SmartImage } from './SmartImage';

interface PlayerDetailsModalProps {
  isOpen: boolean;
  playerNode: PlayerNode | null;
  onClose: () => void;
  onSwap: () => void;
  onUpdate: (updatedNode: PlayerNode) => void;
}

export const PlayerDetailsModal: React.FC<PlayerDetailsModalProps> = ({ 
  isOpen, 
  playerNode, 
  onClose, 
  onSwap, 
  onUpdate 
}) => {
  const [level, setLevel] = useState<number>(80);
  const [isMemoryDrawerOpen, setIsMemoryDrawerOpen] = useState(false);

  useEffect(() => {
    if (playerNode) {
      setLevel(playerNode.level);
    }
  }, [playerNode]);

  if (!isOpen || !playerNode) return null;

  const character = playerNode.character;
  const growthTiers = characterGrowthData[character.id.toString()] || [];
  const rawStats = calculateCharacterStats(level, growthTiers, false);

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = parseInt(e.target.value, 10);
    setLevel(newLevel);
    onUpdate({
      ...playerNode,
      level: newLevel,
    });
  };

  const handleMemorySelect = (memory: Memory) => {
    onUpdate({
      ...playerNode,
      memory: {
        data: memory,
        level: 1, // Default memory level
      },
    });
    setIsMemoryDrawerOpen(false);
  };

  const equippedMemory = playerNode.memory?.data;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 z-50 transition-opacity backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0f0f0f] border border-gray-800 shadow-2xl z-50 rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="relative h-40 bg-neutral-900 border-b border-gray-800 flex items-end p-5 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm"
            style={{ backgroundImage: `url('/assets/others/minibg/background_${character.rarity.toLowerCase()}.png')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
          
          <div className="relative z-10 flex items-center gap-4 w-full">
            <div className="w-20 h-20 shrink-0 rounded-full border-2 border-white/20 overflow-hidden bg-black/50">
               <SmartImage 
                  playerId={String(character.id)}
                  type="mini"
                  isCoach={false}
                  alt={character.name} 
                  fallbackText="?"
                  className="w-full h-full object-cover scale-[0.85] origin-bottom"
                />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase bg-white/10 px-2 py-0.5 rounded text-white/70">
                  {character.rarity}
                </span>
                <span className="text-[10px] font-black uppercase bg-white/10 px-2 py-0.5 rounded text-white/70">
                  {character.position}
                </span>
              </div>
              <h2 className="text-xl font-black text-white leading-tight truncate" title={character.name}>
                {character.name}
              </h2>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 bg-black/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          
          {/* Level Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">
                Nível
              </label>
              <span className="text-sm font-bold text-blue-400">
                Lv. {level}
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="80" 
              value={level} 
              onChange={handleLevelChange}
              className="w-full accent-blue-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Raw Stats */}
          <div>
             <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-3">
               Status Base
             </h3>
             <div className="grid grid-cols-2 gap-2">
               {Object.entries(rawStats).map(([stat, val]) => (
                 <div key={stat} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                   <span className="text-[10px] font-bold text-white/60 uppercase">{stat}</span>
                   <span className="text-sm font-black text-white">{val}</span>
                 </div>
               ))}
             </div>
          </div>

          {/* Equipped Memory */}
          <div>
             <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-3">
               Memória Equipada
             </h3>
             {equippedMemory ? (
                <div 
                  onClick={() => setIsMemoryDrawerOpen(true)}
                  className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors group"
                >
                  <div className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-neutral-800">
                     <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('/assets/others/minibg/background_${equippedMemory.rarity.toLowerCase()}.png')` }}
                      />
                      <img 
                        src={`/assets/memories/${equippedMemory.id}.png`}
                        alt={equippedMemory.name} 
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                  </div>
                  <div className="flex-1">
                    <span className="text-[9px] font-black uppercase bg-black/40 px-1.5 py-0.5 rounded text-white/80 inline-block mb-1">
                      {equippedMemory.rarity}
                    </span>
                    <p className="text-sm font-bold text-white leading-tight line-clamp-2">
                      {equippedMemory.name || 'Memória'}
                    </p>
                  </div>
                  <div className="shrink-0 text-white/20 group-hover:text-white/60 px-2 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                </div>
             ) : (
                <button 
                  onClick={() => setIsMemoryDrawerOpen(true)}
                  className="w-full flex flex-col items-center justify-center p-6 bg-white/5 border border-dashed border-white/20 rounded-xl hover:bg-white/10 transition-colors gap-2"
                >
                  <svg className="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-xs font-bold text-white/60 uppercase">Equipar Memória</span>
                </button>
             )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-[#121212] flex gap-3">
          <button 
            onClick={onSwap}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-colors text-sm uppercase tracking-wider"
          >
            Trocar Jogador
          </button>
        </div>
      </div>

      <MemoryDrawer 
        isOpen={isMemoryDrawerOpen}
        targetPosition={character.position}
        onClose={() => setIsMemoryDrawerOpen(false)}
        onSelect={handleMemorySelect}
      />
    </>
  );
};
