import React from 'react';
import { Memory } from '../types';

interface MemoryCardProps {
  memory: Memory;
  onClick: (memory: Memory) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onClick }) => {
  const getRarityColors = (rarity: string) => {
    switch(rarity.toUpperCase()) {
      case 'UR': return { border: 'border-red-400', gradient: 'from-red-600/90 to-rose-500/90' };
      case 'SSR': return { border: 'border-purple-400', gradient: 'from-purple-600/90 to-fuchsia-500/90' };
      case 'SR': return { border: 'border-blue-400', gradient: 'from-blue-600/90 to-sky-500/90' };
      case 'SP': return { border: 'border-[#a5b4fc]', gradient: 'from-[#6366f1]/90 to-[#818cf8]/90' };
      case 'R': return { border: 'border-green-400', gradient: 'from-emerald-600/90 to-teal-500/90' };
      case 'N': return { border: 'border-gray-400', gradient: 'from-gray-600/90 to-slate-500/90' };
      default: return { border: 'border-white/50', gradient: 'from-black/90 to-gray-800/90' };
    }
  };

  const colors = getRarityColors(memory.rarity);

  return (
    <div 
      id={memory.id.toString()} 
      className={`memory-card-wrapper no-select relative aspect-[3/2] cursor-pointer rounded-sm overflow-hidden group border-2 ${colors.border} hover:border-white transition-all shadow-md`}
      onClick={() => onClick(memory)}
    >
      <img 
        className="memory-card-bg absolute inset-0 w-full h-full object-cover" 
        alt={memory.rarity} 
        draggable="false" 
        src={`/assets/memories/bg_${memory.rarity.toLowerCase()}.png`} 
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
      
      <img 
        className="memory-card-img absolute inset-0 w-full h-full object-cover" 
        alt={memory.name} 
        draggable="false" 
        src={`/assets/memories/${memory.id}.png`}
        onError={(e) => { e.currentTarget.src = '/assets/placeholder-memory.svg'; }}
      />

      {/* Bottom Bar Gradient */}
      <div className={`absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r ${colors.gradient} flex items-center px-1 gap-2 border-t border-white/30 backdrop-blur-sm`}>
        
        {/* Position Icon (Rarity badge or position) */}
        <div className="w-6 h-6 shrink-0 flex items-center justify-center">
           <img src={`/assets/others/positions/${memory.position.toUpperCase()}.png`} alt={memory.position} className="w-full h-full object-contain drop-shadow-md" onError={(e) => {
             // Fallback text if type icon doesn't exist
             e.currentTarget.style.display = 'none';
             if (e.currentTarget.nextElementSibling) {
                (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
             }
           }} />
           <span className="text-[10px] font-black text-white drop-shadow-md hidden">{memory.position}</span>
        </div>

        <span className="text-[10px] font-bold text-white drop-shadow-md truncate w-full">
          {memory.name}
        </span>
      </div>
    </div>
  );
};
