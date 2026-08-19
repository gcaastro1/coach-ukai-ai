import React, { useState, useEffect } from 'react';
import Image from 'next/image';


interface SmartImageProps {
  playerId: string;
  type: 'default' | 'mini';
  isCoach?: boolean;
  alt: string;
  className?: string;
  fallbackText?: string;
}

const EXTENSIONS = ['png', 'webp', 'jpg'];

export const SmartImage: React.FC<SmartImageProps> = ({ 
  playerId, 
  type, 
  isCoach = false, 
  alt, 
  className = '',
  fallbackText = '?'
}) => {
  const [extIndex, setExtIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setExtIndex(0);
    setHasError(false);
  }, [playerId]);

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-neutral-800 border-2 border-transparent ${className}`}>
        <span className="text-white/60 font-bold text-[10px] sm:text-xs text-center truncate px-1 w-full">
          {fallbackText}
        </span>
      </div>
    );
  }

  const currentExt = EXTENSIONS[extIndex];
  let src = '';

  if (isCoach) {
    const suffix = type === 'mini' ? '-mini' : '-default';
    src = `/assets/others/coaches/${playerId}${suffix}.${currentExt}`;
  } else {
    // Nova estrutura de pastas para personagens
    const subfolder = type === 'mini' ? 'mini' : 'default';
    src = `/assets/characters/${subfolder}/${playerId}.${currentExt}`;
  }

  return (
    <Image 
      src={src} 
      alt={alt} 
      width={type === 'mini' ? 120 : 400}
      height={type === 'mini' ? 120 : 600}
      className={className}
      onError={() => {
        if (extIndex < EXTENSIONS.length - 1) {
          setExtIndex(prev => prev + 1);
        } else {
          setHasError(true);
        }
      }}
    />
  );
};
