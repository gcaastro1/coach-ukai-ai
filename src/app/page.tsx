'use client';

import React, { useState } from 'react';
import { CourtBoard } from '../components/CourtBoard';
import { PlayerDrawer } from '../components/PlayerDrawer';
import { CoachDetailsModal } from '../components/CoachDetailsModal';
import { Character, Coach, AllocatedCoach } from '../types';
import Link from 'next/link';

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<{ id: string, type: 'player' | 'coach' } | null>(null);
  const [team, setTeam] = useState<Record<string, any>>({});
  const [selectedCoachDetails, setSelectedCoachDetails] = useState<AllocatedCoach | null>(null);

  const handleSlotClick = (slotId: string, type: 'player' | 'coach') => {
    setActiveSlot({ id: slotId, type });
    if (type === 'coach' && team[slotId]) {
      // Se já houver um coach alocado, abre os detalhes
      setSelectedCoachDetails(team[slotId]);
    } else {
      setIsDrawerOpen(true);
    }
  };

  const handleSelectPlayer = (player: any) => {
    if (activeSlot) {
      setTeam((prev) => ({
        ...prev,
        [activeSlot.id]: player,
      }));
    }
    setIsDrawerOpen(false);
    setActiveSlot(null);
  };

  const handleUpdateCoach = (updatedCoach: AllocatedCoach) => {
    // Find the slot id where this coach is allocated. Usually 'coach'.
    // Since we know the active coach is selectedCoachDetails, we can just update the team with its ID if we know the slot.
    // In our team state, it's keyed by slotId. We'll find it by matching coach.id.
    const slotId = Object.keys(team).find(key => team[key]?.id === updatedCoach.id);
    if (slotId) {
      setTeam(prev => ({ ...prev, [slotId]: updatedCoach }));
      setSelectedCoachDetails(updatedCoach);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#121212] text-white overflow-hidden">
      
      {/* Menu Lateral Esquerdo */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-gray-800 flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-black tracking-tight text-white/90">Construtor de Equipe</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/" className="block px-4 py-3 rounded-lg bg-white/10 text-white font-semibold text-sm transition-colors border border-white/5">Jogadores</Link>
          <a href="#" className="block px-4 py-3 rounded-lg text-white/50 hover:bg-white/5 hover:text-white transition-colors text-sm font-medium border border-transparent">Memórias</a>
          <Link href="/coaches" className="block px-4 py-3 rounded-lg text-white/50 hover:bg-white/5 hover:text-white transition-colors text-sm font-medium border border-transparent">Treinadores</Link>
          <a href="#" className="block px-4 py-3 rounded-lg text-white/50 hover:bg-white/5 hover:text-white transition-colors text-sm font-medium border border-transparent">Análise de Sinergia</a>
        </nav>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 flex flex-col relative overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-gray-800/50 flex items-center px-8 bg-[#121212]/80 backdrop-blur-md z-20 shrink-0">
          <h2 className="text-lg font-bold text-white/80 tracking-wide">HAIKYU!! FLYHIGH Builder</h2>
        </header>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-start sm:items-center justify-center min-h-0">
          <CourtBoard team={team} onSlotClick={handleSlotClick} />
        </div>
      </main>

      <PlayerDrawer 
        isOpen={isDrawerOpen} 
        slotType={activeSlot?.type || 'player'}
        activeSlotId={activeSlot?.id}
        team={team}
        onClose={() => setIsDrawerOpen(false)} 
        onSelect={handleSelectPlayer} 
      />

      <CoachDetailsModal 
        isOpen={!!selectedCoachDetails}
        coach={selectedCoachDetails}
        onClose={() => setSelectedCoachDetails(null)}
        onSwap={() => {
          setSelectedCoachDetails(null);
          setIsDrawerOpen(true);
        }}
        onUpdate={handleUpdateCoach}
      />
    </div>
  );
}
