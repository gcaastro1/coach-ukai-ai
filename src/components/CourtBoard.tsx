import React, { useState } from 'react';
import { PlayerSlot } from './PlayerSlot';
import { TypeCounter } from './TypeCounter';
import { Character } from '../types';

import { SchoolBuff } from '../utils/buffUtils';
import { SchoolBondsModal } from './SchoolBondsModal';

interface CourtBoardProps {
  team: Record<string, any>;
  teamBuffs?: {
    schoolCounts: Record<string, number>;
    specialtyCounts: Record<string, number>;
    activeSchoolBuffs: SchoolBuff[];
    availableSpecialtyBuffs: string[];
    activePlayerBonds?: any[];
  };
  activeSpecialtyBuff?: string | null;
  onSlotClick: (slotId: string, type: 'player' | 'coach') => void;
  onSelectSpecialtyBuff?: (buff: string) => void;
  onSwapPlayers?: (sourceSlotId: string, targetSlotId: string) => void;
  onRemovePlayer?: (slotId: string) => void;
  onSuggestTeam?: () => void;
  onRotateTeam?: () => void;
  hasAiStrategy?: boolean;
  onViewStrategy?: () => void;
}

export const CourtBoard: React.FC<CourtBoardProps> = ({ team, teamBuffs, activeSpecialtyBuff, onSlotClick, onSelectSpecialtyBuff, onSwapPlayers, onRemovePlayer, onSuggestTeam, onRotateTeam, hasAiStrategy, onViewStrategy }) => {
  const [isSchoolBondsModalOpen, setIsSchoolBondsModalOpen] = useState(false);

  return (
    <>
      <div className="w-full h-full max-h-[85vh] max-w-5xl mx-auto aspect-[4/7] sm:aspect-video relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#0a0a0a] flex-shrink-0 min-h-0">
        
        {/* Imagem de Fundo (Preenchendo todo o container panorâmico) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/others/bg-mgRDAJuW.webp')" }}
      >
        {/* Overlays para escurecer bordas e destacar UI */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* Botões de Ação Top Right */}
      <div className="absolute top-4 right-4 sm:right-28 z-30 flex gap-2">
        {hasAiStrategy && onViewStrategy && (
          <button
            onClick={onViewStrategy}
            className="flex items-center gap-2 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/50 text-indigo-200 px-4 py-2 rounded-xl backdrop-blur-sm transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.6)] font-bold uppercase tracking-wider text-xs"
            title="Ver Estratégia da IA"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="hidden sm:inline">Estratégia (IA)</span>
          </button>
        )}

        {onRotateTeam && (
          <button
            onClick={onRotateTeam}
            className="bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 text-blue-200 p-3 rounded-full backdrop-blur-sm transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] group"
            title="Rotacionar Equipe"
          >
            <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
        
        {onSuggestTeam && (
          <button
            onClick={onSuggestTeam}
            className="bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 text-purple-200 p-3 rounded-full backdrop-blur-sm transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.6)] group"
            title="Sugerir Time Ideal"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </button>
        )}
      </div>

      {/* Painel Esquerdo (Contadores e Treinador) */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-20 w-36">
        <div className="hidden md:flex flex-col gap-2">
          {(['Quick', 'Block', 'Power', 'Receive'] as const).map(type => (
            <TypeCounter 
              key={type}
              type={type} 
              count={teamBuffs?.specialtyCounts[type] || 0} 
              isActive={activeSpecialtyBuff === type}
              isAvailable={teamBuffs?.availableSpecialtyBuffs.includes(type)}
              onClick={() => {
                if (teamBuffs?.availableSpecialtyBuffs.includes(type) && onSelectSpecialtyBuff) {
                  onSelectSpecialtyBuff(type);
                }
              }}
            />
          ))}
        </div>
        
        <div className="mt-2 md:mt-4 flex flex-col items-start gap-1">
          <div className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] ml-1">
            Treinador
          </div>
          <PlayerSlot id="coach" variant="coach" playerData={team['coach']} onClick={() => onSlotClick('coach', 'coach')} onRemove={onRemovePlayer} />
        </div>

        {/* Botão de Buffs de Escola e Vínculos */}
        {teamBuffs && (
          <div className="mt-4 hidden md:flex flex-col gap-2">
            <button 
              onClick={() => setIsSchoolBondsModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg py-2 px-3 backdrop-blur-md text-left transition-colors"
            >
              <div className="text-white font-bold text-xs tracking-wide">Vínculos Ativos</div>
              <div className="text-white/70 text-[10px] leading-tight mt-0.5">
                {teamBuffs.activeSchoolBuffs.length + (teamBuffs.activePlayerBonds?.length || 0)} ativo(s)
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Banco de Reservas flutuante na direita */}
      <div className="absolute top-1/2 -translate-y-1/2 right-4 flex-col gap-3 z-20 hidden md:flex">
        <div className="w-full text-center text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
          Banco
        </div>
        <PlayerSlot id="bench-1" variant="circular" playerData={team['bench-1']?.character || team['bench-1']} onClick={() => onSlotClick('bench-1', 'player')} onRemove={onRemovePlayer} />
        <PlayerSlot id="bench-2" variant="circular" playerData={team['bench-2']?.character || team['bench-2']} onClick={() => onSlotClick('bench-2', 'player')} onRemove={onRemovePlayer} />
        <PlayerSlot id="bench-3" variant="circular" playerData={team['bench-3']?.character || team['bench-3']} onClick={() => onSlotClick('bench-3', 'player')} onRemove={onRemovePlayer} />
        <PlayerSlot id="bench-4" variant="circular" playerData={team['bench-4']?.character || team['bench-4']} onClick={() => onSlotClick('bench-4', 'player')} onRemove={onRemovePlayer} />
        <PlayerSlot id="bench-5" variant="circular" playerData={team['bench-5']?.character || team['bench-5']} onClick={() => onSlotClick('bench-5', 'player')} onRemove={onRemovePlayer} />
        <PlayerSlot id="bench-6" variant="circular" playerData={team['bench-6']?.character || team['bench-6']} onClick={() => onSlotClick('bench-6', 'player')} onRemove={onRemovePlayer} />
      </div>



      {/* Formação Principal (Centro da Quadra) */}
      <div className="flex flex-col items-center justify-center h-full gap-6 sm:gap-10 z-10 relative md:px-32">
        {/* Linha Superior (Rede) */}
        <div className="flex justify-center items-center gap-4 sm:gap-8 xl:gap-12 mt-4 sm:mt-0">
          <PlayerSlot id="front-1" playerData={team['front-1']?.character || team['front-1']} onClick={() => onSlotClick('front-1', 'player')} onSwap={onSwapPlayers} onRemove={onRemovePlayer} />
          <PlayerSlot id="front-2" playerData={team['front-2']?.character || team['front-2']} onClick={() => onSlotClick('front-2', 'player')} onSwap={onSwapPlayers} onRemove={onRemovePlayer} />
          <PlayerSlot id="front-3" playerData={team['front-3']?.character || team['front-3']} onClick={() => onSlotClick('front-3', 'player')} onSwap={onSwapPlayers} onRemove={onRemovePlayer} />
        </div>

        {/* Linha Inferior (Defesa) */}
        <div className="flex justify-center items-center gap-3 sm:gap-6 xl:gap-10">
          <PlayerSlot 
            id="back-libero" 
            isLiberoSlot 
            allowedPosition="Li" 
            playerData={team['back-libero']?.character || team['back-libero']}
            onClick={() => onSlotClick('back-libero', 'player')} 
            onSwap={onSwapPlayers}
            onRemove={onRemovePlayer}
          />
          <PlayerSlot id="back-1" playerData={team['back-1']?.character || team['back-1']} onClick={() => onSlotClick('back-1', 'player')} onSwap={onSwapPlayers} onRemove={onRemovePlayer} />
          <PlayerSlot id="back-2" playerData={team['back-2']?.character || team['back-2']} onClick={() => onSlotClick('back-2', 'player')} onSwap={onSwapPlayers} onRemove={onRemovePlayer} />
          <PlayerSlot id="back-3" playerData={team['back-3']?.character || team['back-3']} onClick={() => onSlotClick('back-3', 'player')} onSwap={onSwapPlayers} onRemove={onRemovePlayer} />
        </div>
      </div>

    </div>

      <SchoolBondsModal 
        isOpen={isSchoolBondsModalOpen}
        onClose={() => setIsSchoolBondsModalOpen(false)}
        activeSchoolBuffs={teamBuffs?.activeSchoolBuffs || []}
        team={team}
      />
    </>
  );
};
