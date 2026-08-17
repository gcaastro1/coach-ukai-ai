'use client';

import React, { useState, useMemo } from 'react';
import { CourtBoard } from '../../components/CourtBoard';
import { PlayerDrawer } from '../../components/PlayerDrawer';
import { Character } from '../../types';
import { getCharacters } from '../../utils/dataFetcher';
import { useAccount } from '../../hooks/useAccount';
import ReactMarkdown from 'react-markdown';

export default function MatchupPage() {
  const { savedPlayers } = useAccount();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<{ id: string, type: 'player' | 'coach' } | null>(null);
  const [enemyTeam, setEnemyTeam] = useState<Record<string, any>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [targetSchool, setTargetSchool] = useState<string>('');

  const allCharacters = getCharacters();
  const SCHOOLS = useMemo(() => {
    const schools = new Set(allCharacters.map(c => c.school));
    return Array.from(schools).filter(Boolean).sort();
  }, [allCharacters]);

  const handleSlotClick = (slotId: string, type: 'player' | 'coach') => {
    if (type === 'coach') return; // We don't need coaches for the enemy
    setActiveSlot({ id: slotId, type });
    setIsDrawerOpen(true);
  };

  const handleSelectPlayer = (player: any) => {
    if (activeSlot && activeSlot.type === 'player') {
      // Just save the raw character for the enemy team, we don't need levels or potentials
      setEnemyTeam((prev) => ({
        ...prev,
        [activeSlot.id]: player,
      }));
    }
    setIsDrawerOpen(false);
    setActiveSlot(null);
  };

  const handleRemovePlayer = (slotId: string) => {
    setEnemyTeam((prev) => {
      const newTeam = { ...prev };
      delete newTeam[slotId];
      return newTeam;
    });
  };

  const handleSwapPlayers = (sourceSlot: string, targetSlot: string) => {
    if (sourceSlot === targetSlot) return;

    setEnemyTeam((prev) => {
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

  const handleAnalyzeMatchup = async () => {
    const slots = ['setter', 'front-spiker-left', 'front-spiker-right', 'front-blocker', 'back-spiker-left', 'back-spiker-right', 'back-libero'];
    const filledSlots = slots.filter(slot => enemyTeam[slot]);
    
    if (filledSlots.length < 7) {
      alert('Por favor, preencha todos os 7 espaços do time inimigo antes de analisar.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const res = await fetch('/api/analyze-matchup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enemyTeam,
          savedPlayers: Object.values(savedPlayers),
          targetSchool: targetSchool || undefined
        })
      });
      const data = await res.json();
      
      if (data.error) {
        alert(data.error);
        return;
      }

      setAnalysisResult(data);
    } catch (e) {
      console.error(e);
      alert('Erro ao contatar a IA para análise de matchup.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-start min-h-0 relative">
      <header className="w-full max-w-5xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Simulador de Partida</h1>
          <p className="text-white/50 text-sm mt-2">Monte o time adversário para que a IA sugira o seu melhor time counter.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <select 
            value={targetSchool}
            onChange={(e) => setTargetSchool(e.target.value)}
            disabled={isAnalyzing}
            className="w-full sm:w-auto bg-[#0f0f0f] border border-gray-800 text-white/80 text-sm rounded-xl p-3 outline-none focus:border-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Sem Bônus de Escola (Foco em Força)</option>
            {SCHOOLS.map(school => (
              <option key={school} value={school}>{school}</option>
            ))}
          </select>
          
          <button 
            onClick={handleAnalyzeMatchup}
            disabled={isAnalyzing}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analisando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Analisar Oponente
              </>
            )}
          </button>
        </div>
      </header>

      {/* Exibição do Resultado da IA */}
      {analysisResult && (
        <div className="w-full max-w-5xl mb-8 bg-red-950/30 border border-red-500/30 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-wider">Estratégia Counter</h2>
              <p className="text-sm text-red-200/60">Análise de vantagens e desvantagens sugerida pela IA</p>
            </div>
          </div>
          
          <div className="prose prose-invert prose-red max-w-none prose-sm sm:prose-base bg-black/40 p-6 rounded-xl border border-red-500/10 text-red-50/90 shadow-inner">
            <ReactMarkdown>{analysisResult.analysis}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Tabuleiro do Oponente */}
      <div className="w-full flex justify-center pb-20">
        <div className="w-full max-w-4xl relative">
          <h3 className="absolute -top-10 left-1/2 -translate-x-1/2 text-lg font-black text-white/40 uppercase tracking-widest z-10">
            Time Inimigo
          </h3>
          <CourtBoard 
            team={enemyTeam}
            onSlotClick={handleSlotClick}
            onSwapPlayers={handleSwapPlayers}
            onRemovePlayer={handleRemovePlayer}
          />
        </div>
      </div>

      <PlayerDrawer 
        isOpen={isDrawerOpen} 
        slotType={activeSlot?.type || 'player'}
        activeSlotId={activeSlot?.id}
        team={enemyTeam}
        onClose={() => setIsDrawerOpen(false)} 
        onSelect={handleSelectPlayer} 
      />
    </div>
  );
}
