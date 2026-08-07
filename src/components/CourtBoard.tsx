import React from 'react';
import { PlayerSlot } from './PlayerSlot';
import { TypeCounter } from './TypeCounter';
import { Character } from '../types';

interface CourtBoardProps {
  team: Record<string, any>;
  onSlotClick: (slotId: string, type: 'player' | 'coach') => void;
}

export const CourtBoard: React.FC<CourtBoardProps> = ({ team, onSlotClick }) => {
  return (
    <div className="w-full h-full max-h-[85vh] max-w-5xl mx-auto aspect-[4/7] sm:aspect-video relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#0a0a0a] flex-shrink-0 min-h-0">
      
      {/* Imagem de Fundo (Preenchendo todo o container panorâmico) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/others/bg-mgRDAJuW.webp')" }}
      >
        {/* Overlays para escurecer bordas e destacar UI */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* Painel Esquerdo (Contadores e Treinador) */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-20 w-36">
        <div className="hidden md:flex flex-col gap-2">
          <TypeCounter type="Quick" count={0} />
          <TypeCounter type="Block" count={0} />
          <TypeCounter type="Power" count={0} />
          <TypeCounter type="Receive" count={0} />
        </div>
        
        <div className="mt-2 md:mt-4 flex flex-col items-start gap-1">
          <div className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] ml-1">
            Treinador
          </div>
          <PlayerSlot id="coach" variant="coach" playerData={team['coach']} onClick={() => onSlotClick('coach', 'coach')} />
        </div>
      </div>

      {/* Banco de Reservas flutuante na direita */}
      <div className="absolute top-1/2 -translate-y-1/2 right-4 flex-col gap-3 z-20 hidden md:flex">
        <div className="w-full text-center text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
          Banco
        </div>
        <PlayerSlot id="bench-1" variant="circular" playerData={team['bench-1']} onClick={() => onSlotClick('bench-1', 'player')} />
        <PlayerSlot id="bench-2" variant="circular" playerData={team['bench-2']} onClick={() => onSlotClick('bench-2', 'player')} />
        <PlayerSlot id="bench-3" variant="circular" playerData={team['bench-3']} onClick={() => onSlotClick('bench-3', 'player')} />
        <PlayerSlot id="bench-4" variant="circular" playerData={team['bench-4']} onClick={() => onSlotClick('bench-4', 'player')} />
        <PlayerSlot id="bench-5" variant="circular" playerData={team['bench-5']} onClick={() => onSlotClick('bench-5', 'player')} />
        <PlayerSlot id="bench-6" variant="circular" playerData={team['bench-6']} onClick={() => onSlotClick('bench-6', 'player')} />
      </div>



      {/* Formação Principal (Centro da Quadra) */}
      <div className="flex flex-col items-center justify-center h-full gap-6 sm:gap-10 z-10 relative md:px-32">
        {/* Linha Superior (Rede) */}
        <div className="flex justify-center items-center gap-4 sm:gap-8 xl:gap-12 mt-4 sm:mt-0">
          <PlayerSlot id="front-1" playerData={team['front-1']} onClick={() => onSlotClick('front-1', 'player')} />
          <PlayerSlot id="front-2" playerData={team['front-2']} onClick={() => onSlotClick('front-2', 'player')} />
          <PlayerSlot id="front-3" playerData={team['front-3']} onClick={() => onSlotClick('front-3', 'player')} />
        </div>

        {/* Linha Inferior (Defesa) */}
        <div className="flex justify-center items-center gap-3 sm:gap-6 xl:gap-10">
          <PlayerSlot 
            id="back-libero" 
            isLiberoSlot 
            allowedPosition="Li" 
            playerData={team['back-libero']}
            onClick={() => onSlotClick('back-libero', 'player')} 
          />
          <PlayerSlot id="back-1" playerData={team['back-1']} onClick={() => onSlotClick('back-1', 'player')} />
          <PlayerSlot id="back-2" playerData={team['back-2']} onClick={() => onSlotClick('back-2', 'player')} />
          <PlayerSlot id="back-3" playerData={team['back-3']} onClick={() => onSlotClick('back-3', 'player')} />
        </div>
      </div>

    </div>
  );
};
