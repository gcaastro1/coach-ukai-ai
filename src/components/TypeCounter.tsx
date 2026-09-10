import React from 'react';

type PlayStyle = 'Quick' | 'Block' | 'Power' | 'Receive';

interface TypeCounterProps {
  type: PlayStyle;
  count: number;
  isActive?: boolean;
  isAvailable?: boolean;
  onClick?: () => void;
}

const typeStyles: Record<PlayStyle, { color: string, label: string }> = {
  Quick: { color: 'bg-yellow-500', label: 'Rápido' },
  Block: { color: 'bg-emerald-500', label: 'Bloqueio' },
  Power: { color: 'bg-red-500', label: 'Potente' },
  Receive: { color: 'bg-blue-500', label: 'Recepção' },
};

export const TypeCounter: React.FC<TypeCounterProps> = ({ type, count, isActive, isAvailable, onClick }) => {
  const { color, label } = typeStyles[type];
  const typeName = type.toLowerCase();
  
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-center gap-2 border rounded-xl p-2 px-3 w-fit backdrop-blur-md transition-all shadow-lg select-none ${onClick ? 'cursor-pointer' : ''} ${
        isActive 
          ? `bg-black/60 border-${color.split('-')[1]}-500 shadow-[0_0_10px_rgba(255,255,255,0.2)] scale-105` 
          : isAvailable 
            ? 'bg-black/40 border-white/40 hover:bg-black/50 hover:border-white/60'
            : 'bg-black/40 border-white/10 hover:bg-black/60 opacity-60'
      }`}
    >
      <img src={`/assets/others/types/${typeName}.png`} alt={type} title={label} className="w-6 h-6 drop-shadow-md" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
      <span className={`font-bold text-base sm:text-lg ${isActive || isAvailable ? 'text-white' : 'text-white/50'}`}>{count}</span>
    </div>
  );
};
