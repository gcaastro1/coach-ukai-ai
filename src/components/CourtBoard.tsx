'use client';

import React from 'react';
import { PlayerSlot } from './PlayerSlot';
import { TypeCounter } from './TypeCounter';

export const CourtBoard: React.FC = () => {
  const handleSlotClick = (slotId: string) => {
    console.log(`Slot ${slotId} clicado. Abrir menu lateral...`);
  };

  return (
    <div className="w-full min-h-screen bg-neutral-950 text-white flex justify-center items-center p-4 sm:p-8">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 xl:gap-16 justify-center items-center lg:items-stretch">
        
        {/* Painel Esquerdo: Contadores de Estilo */}
        <div className="flex flex-row lg:flex-col gap-3 sm:gap-4 justify-center w-full lg:w-auto order-2 lg:order-1 flex-wrap">
          <TypeCounter type="Quick" count={0} />
          <TypeCounter type="Block" count={0} />
          <TypeCounter type="Power" count={0} />
          <TypeCounter type="Receive" count={0} />
        </div>

        {/* Área Central: Quadra & Treinador */}
        <div className="flex flex-col gap-6 items-center w-full max-w-sm sm:max-w-md xl:max-w-lg order-1 lg:order-2 flex-1 shrink-0">
          <div 
            className="relative w-full aspect-[4/7] bg-cover bg-center rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            style={{ backgroundImage: "url('/assets/others/bg-mgRDAJuW.webp')" }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40 pointer-events-none" />
            
            <div className="relative w-full h-full flex flex-col justify-around py-10 px-4 z-10">
              {/* Linha Superior (Rede) */}
              <div className="flex justify-center items-center gap-3 sm:gap-6">
                <PlayerSlot id="front-1" onClick={() => handleSlotClick('front-1')} />
                <PlayerSlot id="front-2" onClick={() => handleSlotClick('front-2')} />
                <PlayerSlot id="front-3" onClick={() => handleSlotClick('front-3')} />
              </div>

              {/* Linha Inferior (Defesa) - Líbero na esquerda */}
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

          {/* Slot do Treinador */}
          <div className="flex justify-center">
            <PlayerSlot id="coach" variant="coach" onClick={() => handleSlotClick('coach')} />
          </div>
        </div>

        {/* Painel Direito: Banco de Reservas */}
        <div className="flex flex-row lg:flex-col gap-3 sm:gap-4 justify-center items-center w-full lg:w-auto order-3 flex-wrap">
          <div className="w-full text-center hidden lg:block text-white/50 text-xs font-bold uppercase tracking-widest mb-2">
            Banco
          </div>
          <PlayerSlot id="bench-1" variant="circular" onClick={() => handleSlotClick('bench-1')} />
          <PlayerSlot id="bench-2" variant="circular" onClick={() => handleSlotClick('bench-2')} />
          <PlayerSlot id="bench-3" variant="circular" onClick={() => handleSlotClick('bench-3')} />
          <PlayerSlot id="bench-4" variant="circular" onClick={() => handleSlotClick('bench-4')} />
          <PlayerSlot id="bench-5" variant="circular" onClick={() => handleSlotClick('bench-5')} />
          <PlayerSlot id="bench-6" variant="circular" onClick={() => handleSlotClick('bench-6')} />
        </div>

      </div>
    </div>
  );
};
