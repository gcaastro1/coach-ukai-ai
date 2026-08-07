'use client';

import React from 'react';
import { PlayerSlot } from './PlayerSlot';

export const CourtLayout: React.FC = () => {
  const handleSlotClick = (slotId: string) => {
    console.log(`Slot ${slotId} clicado. Abrir menu lateral...`);
    // Futura integração com o Side Menu para seleção
  };

  return (
    <div className="w-full flex justify-center items-center p-4">
      <div 
        className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-[3/5] sm:aspect-[4/7] bg-cover bg-center rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        style={{ backgroundImage: "url('/assets/others/bg-mgRDAJuW.webp')" }}
      >
        {/* Overlay escuro opcional para garantir contraste */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40 pointer-events-none" />
        
        <div className="relative w-full h-full flex flex-col justify-around py-8 px-2 z-10">
          
          {/* Linha Superior (Frente/Rede) - 3 slots */}
          <div className="flex justify-center items-center gap-3 sm:gap-5">
            <PlayerSlot id="front-1" onClick={() => handleSlotClick('front-1')} />
            <PlayerSlot id="front-2" onClick={() => handleSlotClick('front-2')} />
            <PlayerSlot id="front-3" onClick={() => handleSlotClick('front-3')} />
          </div>

          {/* Linha Inferior (Fundo/Defesa) - 4 slots (Líbero à esquerda) */}
          <div className="flex justify-center items-center gap-2 sm:gap-4 mt-8">
            <PlayerSlot 
              id="back-libero" 
              isLiberoSlot 
              allowedPosition="Li" 
              onClick={() => handleSlotClick('back-libero')} 
            />
            <PlayerSlot id="back-1" onClick={() => handleSlotClick('back-1')} />
            <PlayerSlot id="back-2" onClick={() => handleSlotClick('back-2')} />
            <PlayerSlot id="back-3" onClick={() => handleSlotClick('back-3')} />
          </div>

        </div>
      </div>
    </div>
  );
};
