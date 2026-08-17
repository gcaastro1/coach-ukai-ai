'use client';

import React, { useState } from 'react';
import { getCharacters } from '../../utils/dataFetcher';
import { Character } from '../../types';
import { SmartImage } from '../../components/SmartImage';
import { PlayerDetailsModal } from '../../components/PlayerDetailsModal';
import { useAccount } from '../../hooks/useAccount';

export default function PlayersPage() {
  const allCharacters = getCharacters();
  const { savedPlayers, savePlayer } = useAccount();
  const [selectedPlayer, setSelectedPlayer] = useState<{ slotId: string, node: any } | null>(null);

  // Sorting
  const rarities = ['SP', 'UR', 'SSR', 'SR', 'R', 'N'];
  const sortedCharacters = [...allCharacters].sort((a, b) => {
    return rarities.indexOf(a.rarity) - rarities.indexOf(b.rarity) || a.id - b.id;
  });

  const handleCardClick = (character: Character) => {
    const savedData = savedPlayers[character.id];
    let initialMemory = null;
    
    if (savedData?.memory) {
      const memoryData = require('../../data/memories.json').find((m: any) => m.id === savedData.memory?.memoryId);
      if (memoryData) {
        initialMemory = {
          data: memoryData,
          level: savedData.memory.level
        };
      }
    }

    const playerNode = {
      character: character,
      level: savedData ? savedData.level : 80,
      awakening: savedData ? savedData.awakening : 0,
      resonance: savedData?.resonance || 0,
      skillLevels: savedData?.skillLevels || {},
      potentials: savedData?.potentials || {},
      bonusStats: savedData?.bonusStats || {},
      memory: initialMemory
    };
    setSelectedPlayer({ slotId: 'preview', node: playerNode });
  };

  const handleUpdatePlayer = (updatedNode: any) => {
    savePlayer({
      characterId: updatedNode.character.id,
      level: updatedNode.level,
      awakening: updatedNode.awakening,
      resonance: updatedNode.resonance,
      skillLevels: updatedNode.skillLevels || {},
      potentials: updatedNode.potentials || {},
      bonusStats: updatedNode.bonusStats || {},
      memory: updatedNode.memory ? {
        memoryId: updatedNode.memory.data.id,
        level: updatedNode.memory.level
      } : null
    });
    setSelectedPlayer({ slotId: 'preview', node: updatedNode });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-start min-h-0">
      <header className="w-full max-w-6xl mb-8">
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Todos os Jogadores</h1>
        <p className="text-white/50 text-sm mt-2">Clique em um jogador para ver os detalhes, habilidades e gerenciar o nível.</p>
      </header>

      <div className="w-full max-w-6xl grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {sortedCharacters.map(char => {
          const isOwned = !!savedPlayers[char.id];
          return (
            <div 
              key={char.id} 
              onClick={() => handleCardClick(char)}
              className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105 border-2 ${isOwned ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-transparent hover:border-white/20'}`}
            >
              <SmartImage playerId={String(char.id)} type="default" alt={char.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute bottom-2 left-2 right-2 text-center">
                <span className="text-[10px] font-black text-white drop-shadow-md leading-tight line-clamp-2">{char.name}</span>
              </div>
              {isOwned && (
                <div className="absolute top-2 right-2 bg-blue-600 rounded-full w-5 h-5 flex items-center justify-center border border-blue-400">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <PlayerDetailsModal
        isOpen={!!selectedPlayer}
        playerNode={selectedPlayer?.node || null}
        onClose={() => setSelectedPlayer(null)}
        onSwap={() => {}} // Not used here
        onUpdate={handleUpdatePlayer}
        hideSwapButton={true}
      />
    </div>
  );
}
