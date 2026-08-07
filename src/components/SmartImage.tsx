import React, { useState, useEffect } from 'react';

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

  const folder = isCoach ? 'others/coaches' : 'characters';
  const suffix = type === 'mini' ? '-mini' : '-default';
  
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
  const src = `/assets/${folder}/${playerId}${suffix}.${currentExt}`;

  return (
    <img 
      src={src} 
      alt={alt} 
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
