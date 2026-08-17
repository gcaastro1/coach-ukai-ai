'use client';

import React, { useState } from 'react';
import { getMemories } from '../../utils/dataFetcher';
import { Memory } from '../../types';
import { MemoryCard } from '../../components/MemoryCard';
import { MemoryDetailsModal } from '../../components/MemoryDetailsModal';

export default function MemoriesPage() {
  const memories = getMemories();
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  // Group by rarity for better UI (optional, but requested layout is usually a grid)
  const rarities = ['SP', 'UR', 'SSR', 'SR', 'R', 'N'];
  
  const sortedMemories = [...memories].sort((a, b) => {
    return rarities.indexOf(a.rarity) - rarities.indexOf(b.rarity) || a.id - b.id;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-start min-h-0">
      <header className="w-full max-w-6xl mb-8">
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Cartas de Memória</h1>
        <p className="text-white/50 text-sm mt-2">Explore e confira os efeitos de todas as memórias do jogo.</p>
      </header>

      <div className="w-full max-w-6xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {sortedMemories.map(memory => (
          <MemoryCard 
            key={memory.id} 
            memory={memory} 
            onClick={(mem) => setSelectedMemory(mem)} 
          />
        ))}
      </div>

      <MemoryDetailsModal
        isOpen={!!selectedMemory}
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
      />
    </div>
  );
}
