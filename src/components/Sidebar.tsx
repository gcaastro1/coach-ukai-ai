'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Basic inline icons
const Icons = {
  Team: () => (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Matchup: () => (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Players: () => (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Memories: () => (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  Coaches: () => (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  ),
  Synergy: () => (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Guide: () => (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )
};

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const links = [
    { href: '/', label: 'Meu Time', icon: Icons.Team },
    { href: '/team-builder', label: 'Montagem de Elenco', icon: Icons.Matchup },
    { href: '/matchup', label: 'Simulador de Partida', icon: Icons.Matchup },
    { href: '/players', label: 'Jogadores', icon: Icons.Players },
    { href: '/memories', label: 'Memórias', icon: Icons.Memories },
    { href: '/coaches', label: 'Treinadores', icon: Icons.Coaches },
    { href: '/guide', label: 'Guia Tático', icon: Icons.Guide },
    { href: '/synergy', label: 'Análise de Sinergia', disabled: true, icon: Icons.Synergy }
  ];

  return (
    <aside className={`bg-[#0a0a0a] border-r border-gray-800 flex-col hidden md:flex shrink-0 h-screen overflow-y-auto transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`p-6 border-b border-gray-800 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <div className="flex flex-col">
            <h1 
              className="text-2xl font-black tracking-tight whitespace-nowrap overflow-hidden leading-none"
              style={{ fontFamily: "'Bricolage Grotesque', Poppins, Inter, sans-serif" }}
            >
              <span className="text-white">UK</span>
              <span className="text-orange-500">.AI!!</span>
            </h1>
            <span className="text-[10px] text-white/40 font-medium tracking-wide -mt-0.5 ml-0.5">by kyOn</span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white/50 hover:text-white transition-colors p-1"
          title={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          <svg className={`w-5 h-5 transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map(link => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          if (link.disabled) {
            return (
              <div 
                key={link.label} 
                className={`flex items-center px-4 py-3 rounded-lg text-white/30 cursor-not-allowed text-sm font-medium border border-transparent ${isCollapsed ? 'justify-center' : 'gap-3'}`}
                title={isCollapsed ? `${link.label} (Em Breve)` : undefined}
              >
                <Icon />
                {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">{link.label} <span className="text-[10px] uppercase bg-white/5 px-1.5 py-0.5 rounded ml-1">Em Breve</span></span>}
              </div>
            );
          }

          return (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors border ${
                isActive 
                  ? 'bg-white/10 text-white font-semibold border-white/5' 
                  : 'text-white/50 hover:bg-white/5 hover:text-white border-transparent'
              } ${isCollapsed ? 'justify-center' : 'gap-3'}`}
              title={isCollapsed ? link.label : undefined}
            >
              <Icon />
              {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">{link.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
