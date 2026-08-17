import React, { useState } from 'react';
import { Memory } from '../types';
import { getMemoryDescriptionById } from '../utils/dataFetcher';
import { formatSkillDescription } from '../utils/skillFormatter';
import { SmartImage } from './SmartImage';

interface MemoryDetailsModalProps {
  isOpen: boolean;
  memory: Memory | null;
  onClose: () => void;
}

export const MemoryDetailsModal: React.FC<MemoryDetailsModalProps> = ({ 
  isOpen, 
  memory, 
  onClose 
}) => {
  const [level, setLevel] = useState(1);

  if (!isOpen || !memory) return null;

  const description = getMemoryDescriptionById(memory.id);
  
  // Calculate max level
  let maxLevel = 1;
  try {
    if (memory.parameters.length > 0) {
      maxLevel = memory.parameters[0].split('/').length;
    }
  } catch (e) {}

  const formattedDesc = description 
    ? formatSkillDescription(description, JSON.stringify(memory.parameters), level)
    : 'Descrição não encontrada.';

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 z-50 transition-opacity backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0f0f0f] border border-gray-800 shadow-2xl z-50 rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="relative h-40 shrink-0 bg-neutral-900 border-b border-gray-800 flex items-center justify-center p-5 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm"
            style={{ backgroundImage: `url('/assets/others/minibg/background_${memory.rarity.toLowerCase()}.png')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
          
          <div className="relative z-10 w-48 h-32 rounded-lg border-2 border-white/20 overflow-hidden shadow-lg bg-black/50">
             <img 
               className="w-full h-full object-cover" 
               alt={memory.name} 
               src={`/assets/memories/${memory.id}.png`}
               onError={(e) => { e.currentTarget.src = '/assets/placeholder-memory.svg'; }}
             />
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 bg-black/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          <div className="text-center space-y-2">
            <div className="flex justify-center items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase bg-white/10 px-2 py-0.5 rounded text-white/70">
                {memory.rarity}
              </span>
              <span className="text-[10px] font-black uppercase bg-white/10 px-2 py-0.5 rounded text-white/70">
                {memory.position}
              </span>
            </div>
            <h2 className="text-xl font-black text-white leading-tight">
              {memory.name}
            </h2>
          </div>

          <div className="bg-neutral-900 border border-white/5 rounded-xl p-5 relative">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.2em]">Efeito da Memória</h3>
              
              {maxLevel > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase">Nível</span>
                  <input 
                    type="range" 
                    min="1" 
                    max={maxLevel} 
                    value={level} 
                    onChange={(e) => setLevel(parseInt(e.target.value, 10))}
                    className="w-24 accent-blue-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs font-bold text-blue-400 w-4 text-right">{level}</span>
                </div>
              )}
            </div>
            <p className="text-[15px] text-white/90 leading-relaxed font-medium">
              {formattedDesc}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
