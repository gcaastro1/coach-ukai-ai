import React from 'react';
import { CourtPosition, Character } from '../types';
import { SmartImage } from './SmartImage';
import styles from './PlayerSlot.module.css';

interface PlayerSlotProps {
  id: string;
  isLiberoSlot?: boolean;
  allowedPosition?: string;
  variant?: 'default' | 'circular' | 'coach';
  playerData?: Character | null;
  onClick?: () => void;
}

// Helper to determine glow color based on rarity
function getRarityColor(rarity?: string): string {
  if (!rarity) return 'rgba(255, 255, 255, 0.3)';
  switch(rarity.toUpperCase()) {
    case 'UR': return 'rgba(234, 179, 8, 0.6)'; // yellow-500
    case 'SSR': return 'rgba(168, 85, 247, 0.6)'; // purple-500
    case 'SR': return 'rgba(59, 130, 246, 0.6)'; // blue-500
    case 'R': return 'rgba(34, 197, 94, 0.6)'; // green-500
    default: return 'rgba(255, 255, 255, 0.3)';
  }
}

export const PlayerSlot: React.FC<PlayerSlotProps> = ({ isLiberoSlot, variant = 'default', playerData, onClick }) => {
  const isMini = variant === 'circular';
  const isCoach = variant === 'coach';

  const hasPlayer = !!playerData;

  // Determine variant classes
  const variantClass = isMini ? styles['mini-slot'] : isCoach ? styles['coach-slot'] : '';
  const emptyClass = !hasPlayer && isLiberoSlot ? styles['libero-slot'] : '';
  
  const inlineStyles = hasPlayer && playerData?.rarity 
    ? { '--glow-color': getRarityColor(playerData.rarity) } as React.CSSProperties
    : {};

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onClick}
        className={`${styles['character-card']} ${variantClass} ${emptyClass}`}
        style={inlineStyles}
        data-has-player={hasPlayer}
        aria-label={isLiberoSlot ? "Slot exclusivo para Líbero" : isCoach ? "Slot para Treinador" : "Slot de Jogador"}
      >
        {hasPlayer ? (
          <>
            {/* 1. Frame de Fundo */}
            <div className={styles['character-card__frame']}>
               {/* Aqui pode entrar texturas baseadas na escola ou raridade depois */}
            </div>

            {/* 2. Imagem do Personagem */}
            <SmartImage 
              playerId={String(playerData.id)} 
              type={isMini ? 'mini' : 'default'}
              isCoach={isCoach}
              alt={playerData.name} 
              fallbackText={playerData.name.split(' ')[0]}
              className={styles['character-card__image']}
            />
            
            {/* 3. Overlay de Gradiente */}
            <div className={styles['character-card__overlay']} />

            {/* 4. Badge de Posição (Canto superior esquerdo) */}
            {!isMini && !isCoach && playerData.position && (
              <div className={styles['character-card__position-badge-container']}>
                <img 
                  src={`/assets/others/positions/${playerData.position}.png`} 
                  alt={playerData.position} 
                  className={styles['position-badge']}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            )}

            {/* 5. Container de Informações (Base do Card) */}
            <div className={styles['character-card__info-container']}>
              <span className={styles['character-card__name']}>
                {playerData.name}
              </span>
              
              {!isMini && !isCoach && playerData.specialty && (
                <div className={styles['character-card__styles']}>
                  {playerData.specialty.split(', ').map(spec => {
                    const specName = spec.toLowerCase();
                    return (
                      <img 
                        key={specName} 
                        src={`/assets/others/types/${specName}.png`} 
                        alt={specName} 
                        className={styles['style-icon']}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <svg className={styles['empty-icon']} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {!isMini && (
              <span className={styles['empty-text']}>
                {isLiberoSlot ? 'Li' : isCoach ? 'Coach' : 'Slot'}
              </span>
            )}
          </div>
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
