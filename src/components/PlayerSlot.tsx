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

export const PlayerSlot: React.FC<PlayerSlotProps> = ({ isLiberoSlot, variant = 'default', playerData, onClick }) => {
  const isMini = variant === 'circular';
  const isCoach = variant === 'coach';

  let dimensions = 'w-20 h-28 sm:w-24 sm:h-36';
  let rounding = 'rounded-xl';
  
  if (isMini) {
    dimensions = 'w-10 h-10 sm:w-12 sm:h-12';
    rounding = 'rounded-full';
  } else if (isCoach) {
    dimensions = 'w-16 h-16 sm:w-20 sm:h-20';
    rounding = 'rounded-lg';
  }

  const hasPlayer = !!playerData;

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
            <SmartImage 
              playerId={String(playerData.id)} 
              type={isMini ? 'mini' : 'default'}
              isCoach={isCoach}
              alt={playerData.name} 
              fallbackText={playerData.name.split(' ')[0]}
              className={`w-full h-full object-cover ${rounding}`}
            />
            
            {/* Ícones de Posição e Tipo para cartas em tamanho Default */}
            {!isMini && !isCoach && (
              <>
                {/* Tipos (Specialty) no canto superior esquerdo */}
                {playerData.specialty && (
                  <div className="absolute top-1 left-1 flex flex-col gap-0.5 z-20">
                    {playerData.specialty.split(', ').map(spec => {
                      const specName = spec.toLowerCase();
                      return (
                        <img 
                          key={specName} 
                          src={`/assets/others/types/${specName}.png`} 
                          alt={specName} 
                          className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-md"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      );
                    })}
                  </div>
                )}
                
                {/* Posição no canto inferior direito, acima do nome */}
                <div className="absolute bottom-5 sm:bottom-6 right-1 z-20">
                  <img 
                    src={`/assets/others/positions/${playerData.position}.png`} 
                    alt={playerData.position} 
                    className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-md"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              </>
            )}

            {/* Gradiente escuro para melhorar leitura do nome */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />
            <span className="absolute bottom-1 z-20 text-[10px] sm:text-xs font-bold text-white drop-shadow-md px-1 truncate w-full text-center">
              {playerData.name.split(' ')[0]}
            </span>
          </>
        ) : (
          <>
            <svg className={`text-white/30 drop-shadow-md ${isMini ? 'w-4 h-4' : 'w-8 h-8 sm:w-10 sm:h-10'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {!isMini && (
              <span className="text-[10px] sm:text-xs font-black text-white/40 uppercase tracking-widest drop-shadow-md mt-1">
                {isLiberoSlot ? 'Li' : isCoach ? 'Coach' : 'Slot'}
              </span>
            )}
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
