'use client';

import React from 'react';
import Link from 'next/link';
import { getCoaches } from '../../utils/coachFetcher';
import { Coach } from '../../types';

function CoachCard({ coach }: { coach: Coach }) {
  const [selectedRarity, setSelectedRarity] = React.useState<'Rare' | 'Epic' | 'Legendary'>(coach.rarity);

  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 flex flex-col md:flex-row gap-6">
      
      {/* Imagem do Treinador */}
      <div className="w-48 shrink-0 flex flex-col items-center justify-center bg-black/20 rounded-lg p-4 border border-white/5">
        <div className="w-24 h-24 mb-4 relative">
            <img 
              src={`/assets/others/coaches/${coach.id}-default.png`} 
              alt={coach.name} 
              className="w-full h-full object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
        </div>
        <h3 className="text-lg font-black text-center uppercase tracking-wide">{coach.name}</h3>
        <span className="text-xs text-white/50 font-bold uppercase tracking-widest">{coach.school}</span>
      </div>

      {/* Passiva & Atributos */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Expert Guidance (Passiva)</h4>
            <div className="flex gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
              {(['Rare', 'Epic', 'Legendary'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedRarity(r)}
                  className={`px-3 py-1 text-[10px] font-black uppercase rounded transition-colors ${
                    selectedRarity === r 
                      ? r === 'Legendary' ? 'bg-orange-500 text-white' : r === 'Epic' ? 'bg-purple-500 text-white' : 'bg-blue-600 text-white'
                      : 'text-white/40 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {r === 'Legendary' ? 'Legend' : r}
                </button>
              ))}
            </div>
          </div>
          <p className="text-white/90 text-sm leading-relaxed font-medium bg-white/5 p-4 rounded-lg border border-white/10 min-h-[80px]">
            {coach.expertGuidance[selectedRarity]}
          </p>
        </div>
      </div>

    </div>
  );
}

export default function CoachesPage() {
  const coaches = getCoaches();

  return (
    <div className="flex h-screen w-full bg-[#121212] text-white overflow-hidden">
      
      {/* Menu Lateral Esquerdo */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-gray-800 flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-black tracking-tight text-white/90">Construtor de Equipe</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/" className="block px-4 py-3 rounded-lg text-white/50 hover:bg-white/5 hover:text-white transition-colors text-sm font-medium border border-transparent">Jogadores</Link>
          <a href="#" className="block px-4 py-3 rounded-lg text-white/50 hover:bg-white/5 hover:text-white transition-colors text-sm font-medium border border-transparent">Memórias</a>
          <Link href="/coaches" className="block px-4 py-3 rounded-lg bg-white/10 text-white font-semibold text-sm transition-colors border border-white/5">Treinadores</Link>
          <a href="#" className="block px-4 py-3 rounded-lg text-white/50 hover:bg-white/5 hover:text-white transition-colors text-sm font-medium border border-transparent">Análise de Sinergia</a>
        </nav>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 flex flex-col relative overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-gray-800/50 flex items-center px-8 bg-[#121212]/80 backdrop-blur-md z-20 shrink-0">
          <h2 className="text-lg font-bold text-white/80 tracking-wide">Lista de Treinadores</h2>
        </header>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 min-h-0 scrollbar-thin scrollbar-thumb-white/10">
          <div className="max-w-6xl mx-auto space-y-6">
            {coaches.map((coach) => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
