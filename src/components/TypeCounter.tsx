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
  
  return (
    <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-3 w-full sm:w-32 lg:w-40 backdrop-blur-md transition-all hover:bg-black/60 shadow-lg">
      <div className={`w-3 h-3 rounded-full ${color} shadow-[0_0_8px_currentColor] flex-shrink-0`} />
      <span className="text-white/80 text-sm font-medium flex-1 tracking-wide">{label}</span>
      <span className="text-white font-bold text-lg">{count}</span>
    </div>
  );
};
