import React from 'react';
import { CourtPosition } from '../types';

interface PlayerSlotProps {
  id: string;
  isLiberoSlot?: boolean;
  allowedPosition?: CourtPosition;
  onClick: () => void;
  // futuramente receberá o estado do PlayerNode
}

export const PlayerSlot: React.FC<PlayerSlotProps> = ({ isLiberoSlot, allowedPosition, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center 
        w-20 h-28 sm:w-24 sm:h-36 
        rounded-xl border-2 border-dashed transition-all duration-300
        bg-black/30 backdrop-blur-md 
        hover:scale-105 hover:bg-black/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]
        ${isLiberoSlot 
          ? 'border-orange-500/70 hover:border-orange-400 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]' 
          : 'border-white/50 hover:border-white/90'
        }
      `}
      aria-label={isLiberoSlot ? "Slot exclusivo para Líbero" : "Slot de Jogador"}
    >
      <span className="text-white/70 text-3xl font-extralight drop-shadow-md">+</span>
      
      {isLiberoSlot && (
        <span className="absolute bottom-2 text-[10px] sm:text-xs font-bold text-orange-400 uppercase tracking-widest drop-shadow-md">
          Li
        </span>
      )}
    </button>
  );
};
