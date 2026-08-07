import React from 'react';
import { CourtPosition, Character } from '../types';
import { SmartImage } from './SmartImage';

interface PlayerSlotProps {
  id: string;
  isLiberoSlot?: boolean;
  variant?: 'default' | 'circular' | 'coach';
  playerData?: Character | null;
  onClick?: () => void;
}

const PositionBadge = ({ position, isMini }: { position: string, isMini: boolean }) => {
  const getColors = (pos: string) => {
    switch(pos) {
      case 'S': return 'bg-green-600 text-white border-white';
      case 'WS': return 'bg-blue-600 text-white border-white';
      case 'MB': return 'bg-red-600 text-white border-white';
      case 'OP': return 'bg-yellow-500 text-black border-white';
      case 'Li': return 'bg-orange-500 text-white border-white';
      default: return 'bg-gray-500 text-white border-gray-300';
    }
  };
  
  const size = isMini ? 'w-5 h-5 sm:w-6 sm:h-6 text-[9px] sm:text-[10px]' : 'w-6 h-6 sm:w-7 sm:h-7 text-[10px] sm:text-xs';
  return (
    <div className={`${size} rounded-full border-[1.5px] flex items-center justify-center font-black shadow-md ${getColors(position)}`}>
      {position}
    </div>
  );
};

const SpecialtyBadge = ({ specialty }: { specialty: string }) => {
  const getColors = (spec: string) => {
    switch(spec.toLowerCase()) {
      case 'quick': return 'bg-yellow-400 text-black border-yellow-200';
      case 'block': return 'bg-green-600 text-white border-green-300';
      case 'power': return 'bg-red-600 text-white border-red-300';
      case 'receive': return 'bg-blue-600 text-white border-blue-300';
      case 'serve': return 'bg-purple-600 text-white border-purple-300';
      case 'set': return 'bg-teal-600 text-white border-teal-300';
      default: return 'bg-gray-500 text-white border-gray-300';
    }
  };
  
  const abbr = specialty.substring(0, 1).toUpperCase();

  return (
    <div className={`w-4 h-4 sm:w-5 sm:h-5 rotate-45 border flex items-center justify-center shadow-md ${getColors(specialty)}`} title={specialty}>
      <span className="-rotate-45 text-[8px] sm:text-[9px] font-black drop-shadow-sm">{abbr}</span>
    </div>
  );
};

export const PlayerSlot: React.FC<PlayerSlotProps> = ({ isLiberoSlot, variant = 'default', playerData, onClick }) => {
  const isMini = variant === 'circular';
  const isCoach = variant === 'coach';

  let dimensions = 'w-20 h-28 sm:w-[6rem] sm:h-[8.5rem]'; // Proporção de carta retangular
  let rounding = 'rounded-md';
  
  if (isMini) {
    dimensions = 'w-12 h-14 sm:w-14 sm:h-16'; // Mini card quadrado com barra em baixo
    rounding = 'rounded-md';
  } else if (isCoach) {
    dimensions = 'w-16 h-16 sm:w-20 sm:h-20';
    rounding = 'rounded-lg';
  }

  const hasPlayer = !!playerData;
  const getNameWithoutVersion = (name: string) => name.split(' (')[0];
  const getVersion = (name: string) => {
    const match = name.match(/\(([^)]+)\)/);
    return match ? match[1] : null;
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onClick}
        className={`
          relative flex flex-col overflow-hidden bg-white
          ${dimensions} ${rounding}
          transition-all duration-300
          ${hasPlayer 
            ? 'border border-white/80 shadow-xl hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]' 
            : `border-2 border-dashed bg-black/30 backdrop-blur-md hover:scale-105 hover:bg-black/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] items-center justify-center ${
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
            <div className="relative flex-1 w-full overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
              {/* Elemento gráfico de fundo */}
              <div className="absolute inset-0 bg-white/5 opacity-50 mix-blend-overlay" />
              
              <SmartImage 
                playerId={String(playerData.id)} 
                type={isMini ? 'mini' : 'default'}
                isCoach={isCoach}
                alt={playerData.name} 
                fallbackText={playerData.name.split(' ')[0]}
                className="w-full h-full object-cover relative z-10"
              />
              
              {/* Tipos (Canto Inferior Esquerdo) */}
              {!isMini && !isCoach && playerData.specialty && (
                <div className="absolute bottom-1.5 left-2 flex flex-col gap-1.5 z-20">
                  {playerData.specialty.split(', ').map(spec => (
                    <SpecialtyBadge key={spec} specialty={spec} />
                  ))}
                </div>
              )}

              {/* Posição (Canto Inferior Direito) */}
              {!isCoach && (
                <div className="absolute bottom-1 right-1 z-20">
                  <PositionBadge position={playerData.position} isMini={isMini} />
                </div>
              )}
            </div>
            
            {/* Faixa de Nome */}
            <div className={`w-full bg-white text-black flex flex-col items-center justify-center p-0.5 z-20 shrink-0 border-t border-gray-300 shadow-[0_-2px_5px_rgba(0,0,0,0.1)] ${isMini ? 'h-4 sm:h-5' : 'h-6 sm:h-8'}`}>
              <span className={`${isMini ? 'text-[7px] sm:text-[8px]' : 'text-[8.5px] sm:text-[10px]'} font-black uppercase leading-none truncate w-full text-center px-0.5`}>
                {getNameWithoutVersion(playerData.name)}
              </span>
              {!isMini && getVersion(playerData.name) && (
                <span className="text-[7px] sm:text-[8px] font-bold leading-tight text-gray-600 truncate px-0.5 w-full text-center mt-0.5">
                  ({getVersion(playerData.name)})
                </span>
              )}
            </div>
          </>
        ) : (
          /* Empty State */
          <>
            <div className="absolute inset-0 border-2 border-transparent" />
            <svg className={`text-white/30 drop-shadow-md ${isMini ? 'w-5 h-5' : 'w-8 h-8 sm:w-10 sm:h-10'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className={`font-black text-white/40 uppercase tracking-widest drop-shadow-md mt-1 ${isMini ? 'text-[8px]' : 'text-[10px] sm:text-xs'}`}>
              {isLiberoSlot ? 'Li' : isCoach ? 'Coach' : 'Slot'}
            </span>
          </>
        )}
      </button>
      
      {!hasPlayer && !isMini && !isCoach && (
        <span className="mt-2 text-[10px] font-bold text-white/50 tracking-wider">
          {isLiberoSlot ? "LÍBERO" : "JOGADOR"}
        </span>
      )}
    </div>
  );
};
