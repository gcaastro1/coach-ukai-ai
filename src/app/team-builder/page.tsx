'use client';

import React, { useState } from 'react';
import { CourtBoard } from '../../components/CourtBoard';
import { PlayerDrawer } from '../../components/PlayerDrawer';
import { Character, Coach } from '../../types';
import { useAccount } from '../../hooks/useAccount';

export default function TeamBuilderPage() {
  const [enemyTeam, setEnemyTeam] = useState<Record<string, any>>({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<{ id: string, type: 'player' | 'coach' } | null>(null);
  
  const [mode, setMode] = useState<'all' | 'saved'>('all');
  const [school, setSchool] = useState<string>('none');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const schools = [
    { id: 'none', name: 'Nenhum' },
    { id: 'Karasuno', name: 'Karasuno' },
    { id: 'Aoba Johsai', name: 'Aoba Johsai' },
    { id: 'Nekoma', name: 'Nekoma' },
    { id: 'Date Tech', name: 'Date Tech' },
    { id: 'Fukurodani', name: 'Fukurodani' },
    { id: 'Shiratorizawa', name: 'Shiratorizawa' },
    { id: 'Inarizaki', name: 'Inarizaki' }
  ];

  const handleSlotClick = (slotId: string, type: 'player' | 'coach') => {
    // Only allow selecting players for the enemy team, no coach needed for enemy team logic usually, but let's allow if wanted
    if (type === 'coach') return; // For team builder we only care about enemy players
    setActiveSlot({ id: slotId, type });
    setIsDrawerOpen(true);
  };

  const handleSelectPlayer = (player: Character | Coach) => {
    if (activeSlot && activeSlot.type === 'player') {
      const playerNode = {
        character: player,
        level: 80,
        resonance: 5
      };
      setEnemyTeam((prev) => ({
        ...prev,
        [activeSlot.id]: playerNode,
      }));
    }
    setIsDrawerOpen(false);
    setActiveSlot(null);
  };

  const handleRemovePlayer = (slotId: string) => {
    setEnemyTeam(prev => {
      const newTeam = { ...prev };
      delete newTeam[slotId];
      return newTeam;
    });
  };

  const { savedPlayers } = useAccount();

  const generateTeam = async () => {
    // Verify if 7 players are selected (6 court + 1 libero)
    const requiredSlots = ['ws1', 'ws2', 'mb1', 'mb2', 'op', 's', 'li'];
    const hasAllPlayers = requiredSlots.every(slot => enemyTeam[slot]);
    
    if (!hasAllPlayers) {
      alert("Por favor, preencha todos os 7 espaços do time inimigo antes de gerar.");
      return;
    }

    setIsGenerating(true);
    setResult(null);

    try {
      const response = await fetch('/api/counter-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enemyTeam,
          mode,
          school,
          savedPlayers: mode === 'saved' ? savedPlayers : null
        })
      });

      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        setResult(data);
      }
    } catch (e) {
      console.error(e);
      alert("Ocorreu um erro ao gerar o time.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto bg-[#050505] min-h-screen relative">
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-900/20 via-blue-900/5 to-transparent pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-6 py-8 relative z-10">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2 flex items-center gap-3">
              <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Montagem de Elenco (Team Builder)
            </h1>
            <p className="text-white/50 text-sm max-w-2xl">
              Monte o time inimigo abaixo para que a IA sugira a melhor composição de contra-ataque para o seu time, respeitando as vantagens de estilo.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-wider">Usar personagens</label>
              <select 
                value={mode}
                onChange={(e) => setMode(e.target.value as 'all' | 'saved')}
                className="bg-[#1a1a1a] border border-white/10 text-xs font-bold text-white rounded-xl p-2.5 outline-none focus:border-blue-500/50"
              >
                <option value="all">Catálogo Completo</option>
                <option value="saved">Meus Personagens Salvos</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-wider">Foco em Escola</label>
              <select 
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="bg-[#1a1a1a] border border-white/10 text-xs font-bold text-white rounded-xl p-2.5 outline-none focus:border-blue-500/50"
              >
                {schools.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Lado Esquerdo: Input do Time Inimigo */}
          <div className="flex-1 max-w-[800px]">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="text-xs font-black uppercase tracking-widest text-red-500/50 border border-red-500/20 px-3 py-1 rounded-full bg-red-500/10">Time Inimigo</span>
              </div>
              
              <CourtBoard 
                team={enemyTeam} 
                onSlotClick={handleSlotClick} 
              />
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={generateTeam}
                  disabled={isGenerating}
                  className={`px-8 py-3 rounded-xl font-black uppercase tracking-wider transition-all duration-300 ${
                    isGenerating 
                      ? 'bg-blue-500/50 text-white cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]'
                  }`}
                >
                  {isGenerating ? 'Analisando...' : 'Gerar Contra-Ataque'}
                </button>
              </div>
            </div>
          </div>

          {/* Lado Direito: Resultados */}
          <div className="flex-1">
            {isGenerating && (
              <div className="h-full flex flex-col items-center justify-center space-y-6 animate-pulse p-10 bg-[#111] border border-white/5 rounded-2xl">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Construindo Estratégia</h3>
                  <p className="text-sm text-white/50">Cruzando banco de dados e calculando vantagens de especialidade...</p>
                </div>
              </div>
            )}

            {!isGenerating && result && (
              <div className="bg-[#111] border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
                <div>
                  <h2 className="text-xl font-black text-white mb-1 uppercase">Time Recomendado</h2>
                  <p className="text-xs text-white/50">Baseado no seu catálogo e nas vantagens de combate.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-wider mb-3">Titulares</h3>
                    <div className="space-y-3">
                      {result.starters.map((starter: any, idx: number) => (
                        <div key={idx} className="flex gap-3 items-start bg-black/40 p-3 rounded-lg border border-white/5">
                          <div className="shrink-0 w-12 h-12 bg-neutral-800 rounded-lg overflow-hidden border border-white/10">
                            {starter.characterId ? (
                              <img src={`/assets/characters/${starter.characterId}.png`} alt={starter.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/assets/placeholder.svg'; }} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/20 text-[10px] font-bold">{starter.position}</div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black bg-white/10 px-1.5 py-0.5 rounded text-white/80">{starter.position}</span>
                              <span className="text-sm font-bold text-white">{starter.name}</span>
                            </div>
                            <p className="text-xs text-white/60 leading-relaxed">{starter.reasoning}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="text-[10px] font-black text-orange-400 uppercase tracking-wider mb-3">Banco e Opções</h3>
                    <div className="space-y-3">
                      {result.bench.map((bench: any, idx: number) => (
                        <div key={idx} className="flex gap-3 items-start bg-black/40 p-3 rounded-lg border border-white/5">
                          <div className="shrink-0 w-10 h-10 bg-neutral-800 rounded-lg overflow-hidden border border-white/10">
                            {bench.characterId ? (
                              <img src={`/assets/characters/${bench.characterId}.png`} alt={bench.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/assets/placeholder.svg'; }} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/20 text-[10px] font-bold">...</div>
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white block mb-0.5">{bench.name}</span>
                            <p className="text-xs text-white/60 leading-relaxed">{bench.reasoning}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="text-[10px] font-black text-fuchsia-400 uppercase tracking-wider mb-3">Treinador Recomendado</h3>
                    <div className="flex gap-3 items-start bg-black/40 p-3 rounded-lg border border-white/5">
                       <div className="shrink-0 w-12 h-12 bg-neutral-800 rounded-lg overflow-hidden border border-white/10">
                          {result.coach.coachId ? (
                            <img src={`/assets/coaches/${result.coach.coachId}.png`} alt={result.coach.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/assets/placeholder-coach.svg'; }} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20 text-[10px] font-bold">TR</div>
                          )}
                        </div>
                        <div>
                          <span className="text-sm font-bold text-white block mb-1">{result.coach.name}</span>
                          <p className="text-xs text-white/60 leading-relaxed">{result.coach.reasoning}</p>
                        </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-wider mb-2">Análise Geral da Estratégia</h3>
                    <p className="text-xs text-blue-100/80 leading-relaxed">
                      {result.generalStrategy}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {!isGenerating && !result && (
              <div className="h-full flex flex-col items-center justify-center space-y-4 p-10 border border-dashed border-white/10 rounded-2xl bg-white/5">
                <svg className="w-12 h-12 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-sm text-white/40 font-bold uppercase tracking-wider">Aguardando Inserção do Time Inimigo</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <PlayerDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => { setIsDrawerOpen(false); setActiveSlot(null); }} 
        onSelect={handleSelectPlayer as any}
        slotType={activeSlot?.type || 'player'}
      />
    </main>
  );
}
