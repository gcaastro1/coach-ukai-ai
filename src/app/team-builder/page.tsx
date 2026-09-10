'use client';

import React, { useState, useMemo } from 'react';
import { CourtBoard } from '../../components/CourtBoard';
import { PlayerDrawer } from '../../components/PlayerDrawer';
import { Character, Coach, UserCharacter } from '../../types';
import { useAccount } from '../../hooks/useAccount';
import { getCharacters } from '../../utils/dataFetcher';
import { getCoaches } from '../../utils/coachFetcher';
import { generateCounterTeam, generateClubContestTeam } from '../../utils/autoBuilder';
import { calculateTeamBuffs } from '../../utils/buffUtils';

export default function TeamBuilderPage() {
  const { savedPlayers } = useAccount();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<{ id: string, type: 'player' | 'coach', side: 'enemy' | 'mine' } | null>(null);
  
  const [enemyTeam, setEnemyTeam] = useState<Record<string, any>>({});
  const [myTeam, setMyTeam] = useState<Record<string, any>>({});
  
  const [mode, setMode] = useState<'all' | 'saved'>('saved');
  const [gameMode, setGameMode] = useState<'pvp' | 'club_contest'>('pvp');
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategyResult, setStrategyResult] = useState<string>('');

  const allCharacters = useMemo(() => getCharacters(), []);
  const allCoaches = useMemo(() => getCoaches(), []);

  const handleSlotClick = (slotId: string, type: 'player' | 'coach', side: 'enemy' | 'mine') => {
    setActiveSlot({ id: slotId, type, side });
    setIsDrawerOpen(true);
  };

  const handleSelectPlayer = (player: Character | Coach) => {
    if (activeSlot) {
      const isMine = activeSlot.side === 'mine';
      const targetTeamSet = isMine ? setMyTeam : setEnemyTeam;
      
      let playerNode: any;
      if (activeSlot.type === 'coach') {
        playerNode = player;
      } else {
        // Find saved data if applicable
        let level = 80;
        let resonance = 0;
        let potentials = {};
        
        if (isMine) {
          const saved = savedPlayers[player.id as number];
          if (saved) {
            level = saved.level;
            resonance = saved.resonance || 0;
            potentials = saved.potentials || {};
          }
        }
        
        playerNode = {
          character: player,
          level,
          resonance,
          potentials
        };
      }

      targetTeamSet((prev) => ({
        ...prev,
        [activeSlot.id]: playerNode,
      }));
    }
    setIsDrawerOpen(false);
    setActiveSlot(null);
  };

  const handleRemovePlayer = (slotId: string, side: 'enemy' | 'mine') => {
    const targetTeamSet = side === 'mine' ? setMyTeam : setEnemyTeam;
    targetTeamSet((prev) => {
      const newTeam = { ...prev };
      delete newTeam[slotId];
      return newTeam;
    });
  };

  const handleSwapPlayers = (sourceSlot: string, targetSlot: string, side: 'enemy' | 'mine') => {
    if (sourceSlot === targetSlot) return;

    const targetTeamSet = side === 'mine' ? setMyTeam : setEnemyTeam;

    targetTeamSet((prev) => {
      const newTeam = { ...prev };
      const sourcePlayer = newTeam[sourceSlot];
      const targetPlayer = newTeam[targetSlot];

      const isSourceLiberoSlot = sourceSlot === 'back-libero';
      const isTargetLiberoSlot = targetSlot === 'back-libero';
      
      const sourceChar = sourcePlayer?.character || sourcePlayer;
      const targetChar = targetPlayer?.character || targetPlayer;

      if (isTargetLiberoSlot && sourceChar && sourceChar.position !== 'Li') {
        alert('Apenas jogadores da posição Líbero (Li) podem ser colocados neste slot.');
        return prev;
      }
      
      if (isSourceLiberoSlot && targetChar && targetChar.position !== 'Li') {
        alert('Apenas jogadores da posição Líbero (Li) podem ser colocados neste slot.');
        return prev;
      }
      
      newTeam[sourceSlot] = targetPlayer || null;
      newTeam[targetSlot] = sourcePlayer || null;
      
      return newTeam;
    });
  };

  const handleGenerateCounter = () => {
    const slots = ['front-1', 'front-2', 'front-3', 'back-1', 'back-2', 'back-3', 'back-libero'];
    const filledSlots = slots.filter(slot => enemyTeam[slot]);
    
    if (filledSlots.length === 0) {
      alert('Por favor, adicione ao menos um jogador no time inimigo para que a IA possa analisar o foco tático e sugerir seu time.');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      try {
        const options = {
          onlyOwned: mode === 'saved',
          specialtyCount: 4,
          savedPlayers: Object.values(savedPlayers),
          allCharacters,
          allCoaches,
          gameMode
        };

        let generatedTeam;
        if (gameMode === 'club_contest') {
          generatedTeam = generateClubContestTeam(enemyTeam, options);
        } else {
          generatedTeam = generateCounterTeam(enemyTeam, options);
        }
        
        setMyTeam(generatedTeam);
        setStrategyResult(generatedTeam.strategy || 'Estratégia otimizada.');
      } catch (e) {
        console.error(e);
        alert('Erro ao calcular time automático.');
      } finally {
        setIsGenerating(false);
      }
    }, 600); // tempo para dar um feedback visual legal
  };

  const enemyTeamBuffs = useMemo(() => calculateTeamBuffs(enemyTeam), [enemyTeam]);
  const myTeamBuffs = useMemo(() => calculateTeamBuffs(myTeam), [myTeam]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#050505] min-h-screen relative pb-32">
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-red-900/10 via-red-900/5 to-transparent pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 relative z-10">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2 flex items-center gap-3">
              <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Simulador de Arena
            </h1>
            <p className="text-white/50 text-sm max-w-2xl">
              Monte o time inimigo acima para que a IA analise a estratégia e sugira o seu time de contra-ataque.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-wider">Modo de Jogo</label>
              <select 
                value={gameMode}
                onChange={(e) => setGameMode(e.target.value as 'pvp' | 'club_contest')}
                className="bg-[#1a1a1a] border border-white/10 text-xs font-bold text-white rounded-xl p-2.5 outline-none focus:border-red-500/50"
              >
                <option value="pvp">PvP Normal (Counter)</option>
                <option value="club_contest">Disputa do Clube</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-wider">Base de Dados</label>
              <select 
                value={mode}
                onChange={(e) => setMode(e.target.value as 'all' | 'saved')}
                className="bg-[#1a1a1a] border border-white/10 text-xs font-bold text-white rounded-xl p-2.5 outline-none focus:border-red-500/50"
              >
                <option value="all">Todo o Jogo (Personagens 80)</option>
                <option value="saved">Meus Personagens (Sua Conta)</option>
              </select>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-16 items-center">
          
          {/* QUADRA INIMIGA */}
          <div className="w-full relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 px-6 py-1.5 bg-red-900/40 border border-red-500/30 rounded-full backdrop-blur-sm">
              <span className="text-xs font-black uppercase tracking-widest text-red-400">Time Inimigo</span>
            </div>
            
            <div className="w-full flex justify-center scale-90 sm:scale-100 origin-top">
              <CourtBoard 
                team={enemyTeam} 
                teamBuffs={enemyTeamBuffs}
                onSlotClick={(id, type) => handleSlotClick(id, type, 'enemy')} 
                onSwapPlayers={(src, tgt) => handleSwapPlayers(src, tgt, 'enemy')}
                onRemovePlayer={(id) => handleRemovePlayer(id, 'enemy')}
              />
            </div>
          </div>

          {/* BOTÃO CENTRAL DE AÇÃO */}
          <div className="relative w-full max-w-4xl flex items-center justify-center -my-8 z-30">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2" />
            
            <button
              onClick={handleGenerateCounter}
              disabled={isGenerating || Object.keys(enemyTeam).length === 0}
              className={`relative px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-3 overflow-hidden group ${
                isGenerating || Object.keys(enemyTeam).length === 0
                  ? 'bg-neutral-800 text-white/50 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:shadow-[0_0_60px_rgba(220,38,38,0.6)] hover:-translate-y-1'
              }`}
            >
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analisando Tática...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  {gameMode === 'club_contest' ? 'Gerar Time Club Contest' : 'Gerar Counter Automático'}
                </>
              )}
            </button>
          </div>

          {/* ESTRATÉGIA GERADA (SE EXISTIR) */}
          {strategyResult && (
            <div className="w-full max-w-4xl bg-blue-900/20 border border-blue-500/20 rounded-2xl p-6 shadow-2xl backdrop-blur-sm -my-4 z-20">
              <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Análise do Algoritmo
              </h3>
              <div className="text-sm text-blue-50/80 leading-relaxed font-medium">
                {strategyResult}
              </div>
            </div>
          )}

          {/* SUA QUADRA */}
          <div className="w-full relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 px-6 py-1.5 bg-blue-900/40 border border-blue-500/30 rounded-full backdrop-blur-sm">
              <span className="text-xs font-black uppercase tracking-widest text-blue-400">Meu Time (Counter)</span>
            </div>
            
            <div className="w-full flex justify-center scale-90 sm:scale-100 origin-top">
              <CourtBoard 
                invertView={true}
                team={myTeam} 
                teamBuffs={myTeamBuffs}
                onSlotClick={(id, type) => handleSlotClick(id, type, 'mine')} 
                onSwapPlayers={(src, tgt) => handleSwapPlayers(src, tgt, 'mine')}
                onRemovePlayer={(id) => handleRemovePlayer(id, 'mine')}
              />
            </div>
          </div>

        </div>
      </div>

      <PlayerDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => { setIsDrawerOpen(false); setActiveSlot(null); }} 
        onSelect={handleSelectPlayer as any}
        slotType={activeSlot?.type || 'player'}
        activeSlotId={activeSlot?.id}
        team={activeSlot?.side === 'mine' ? myTeam : enemyTeam}
      />
    </div>
  );
}
