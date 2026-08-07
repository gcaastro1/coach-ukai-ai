import React from 'react';

type PlayStyle = 'Quick' | 'Block' | 'Power' | 'Receive';

interface TypeCounterProps {
  type: PlayStyle;
  count: number;
}

const typeStyles: Record<PlayStyle, { color: string, label: string }> = {
  Quick: { color: 'bg-yellow-500', label: 'Quick' },
  Block: { color: 'bg-emerald-500', label: 'Block' },
  Power: { color: 'bg-red-500', label: 'Power' },
  Receive: { color: 'bg-blue-500', label: 'Receive' },
};

export const TypeCounter: React.FC<TypeCounterProps> = ({ type, count }) => {
  const { color, label } = typeStyles[type];
  const typeName = type.toLowerCase();
  
  return (
    <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl p-2 w-full sm:w-32 lg:w-40 backdrop-blur-md transition-all hover:bg-black/60 shadow-lg">
      <img src={`/assets/others/types/${typeName}.png`} alt={type} className="w-6 h-6 drop-shadow-md" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
      <span className="text-white/80 text-xs sm:text-sm font-medium flex-1 tracking-wide">{label}</span>
      <span className="text-white font-bold text-base sm:text-lg">{count}</span>
    </div>
  );
};
