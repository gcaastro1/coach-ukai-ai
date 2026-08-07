import React from 'react';
import { CourtPosition, Character } from '../types';

interface PlayerSlotProps {
  id: string;
  isLiberoSlot?: boolean;
  allowedPosition?: CourtPosition;
  variant?: 'default' | 'circular' | 'coach';
  playerData?: Character | null;
  onClick: () => void;
}

export const PlayerSlot: React.FC<PlayerSlotProps> = ({ isLiberoSlot, variant = 'default', playerData, onClick }) => {
  const isCircular = variant === 'circular';
  const isCoach = variant === 'coach';

  let dimensions = 'w-20 h-28 sm:w-24 sm:h-36';
  let rounding = 'rounded-xl';
  
  if (isCircular) {
    dimensions = 'w-16 h-16 sm:w-20 sm:h-20';
    rounding = 'rounded-full';
  } else if (isCoach) {
    dimensions = 'w-16 h-16 sm:w-20 sm:h-20';
    rounding = 'rounded-lg';
  }

  const hasPlayer = !!playerData;
  const imageSuffix = isCircular ? '-mini.png' : '-default.png';
  // O Coach usará a pasta coaches futuramente se for o caso
  const imagePath = isCoach 
    ? `/assets/others/coaches/${playerData?.id}${imageSuffix}` 
    : `/assets/characters/${playerData?.id}${imageSuffix}`;

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onClick}
        className={`
          relative flex flex-col items-center justify-center overflow-hidden
          ${dimensions} ${rounding}
          transition-all duration-300
          ${hasPlayer 
            ? 'border-2 border-transparent hover:border-white/50 shadow-lg hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] bg-neutral-800' 
            : `border-2 border-dashed bg-black/30 backdrop-blur-md hover:scale-105 hover:bg-black/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] ${
                isLiberoSlot 
                  ? 'border-orange-500/70 hover:border-orange-400 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]' 
                  : 'border-white/50 hover:border-white/90'
              }`
          }
        `}
        aria-label={isLiberoSlot ? "Slot exclusivo para Líbero" : isCoach ? "Slot para Treinador" : "Slot de Jogador"}
      >
        {hasPlayer ? (
          <>
            <img 
              src={imagePath} 
              alt={playerData.name} 
              className={`w-full h-full object-cover ${rounding}`}
            />
            {/* Gradiente escuro para melhorar leitura se necessário */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
            <span className="absolute bottom-1 text-[10px] sm:text-xs font-bold text-white drop-shadow-md px-1 truncate w-full text-center">
              {playerData.name.split(' ')[0]}
            </span>
          </>
        ) : (
          <>
            <span className="text-white/70 text-3xl font-extralight drop-shadow-md">+</span>
            
            {isLiberoSlot && !isCircular && (
              <span className="absolute bottom-2 text-[10px] sm:text-xs font-bold text-orange-400 uppercase tracking-widest drop-shadow-md">
                Li
              </span>
            )}
          </>
        )}
      </button>

      {isCoach && (
        <span className="mt-2 text-[10px] sm:text-xs text-white/60 uppercase font-bold tracking-widest">
          Coach
        </span>
      )}
    </div>
  );
};
