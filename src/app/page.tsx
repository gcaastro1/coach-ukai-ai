'use client';

import React, { useState } from 'react';
import { CourtBoard } from '../components/CourtBoard';
import { PlayerDrawer } from '../components/PlayerDrawer';
import { Character } from '../types';

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [team, setTeam] = useState<Record<string, Character>>({});

  const handleSlotClick = (slotId: string) => {
    setActiveSlot(slotId);
    setIsDrawerOpen(true);
  };

  const handleSelectPlayer = (player: Character) => {
    if (activeSlot) {
      setTeam((prev) => ({
        ...prev,
        [activeSlot]: player,
      }));
    }
    setIsDrawerOpen(false);
    setActiveSlot(null);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white overflow-x-hidden">
      <CourtBoard team={team} onSlotClick={handleSlotClick} />
      <PlayerDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onSelect={handleSelectPlayer} 
      />
    </main>
  );
}
