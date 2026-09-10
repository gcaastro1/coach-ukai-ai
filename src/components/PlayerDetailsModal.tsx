import React, { useState, useEffect } from 'react';
import { PlayerNode, Memory } from '../types';
import { calculateCharacterStats } from '../utils/statCalculator';
import { characterGrowthData } from '../data/characterGrowth';
import { MemoryDrawer } from './MemoryDrawer';
import { PotentialDrawer } from './PotentialDrawer';
import { SmartImage } from './SmartImage';
import { useAccount } from '../hooks/useAccount';
import { PotentialSlotID, EquippedPotential } from '../types';
import potentialsData from '../data/potentials.json';
import { suggestPotentials } from '../utils/potentialSuggester';
import { formatSkillDescription } from '../utils/skillFormatter';
import guidesData from '../data/guides.json';
import memoriesData from '../data/memories.json';
import { getMemoryDescriptionById } from '../utils/dataFetcher';
import { potentialSlotsConfig } from '../data/potentialStats';

interface PlayerDetailsModalProps {
  isOpen: boolean;
  playerNode: PlayerNode | null;
  onClose: () => void;
  onSwap: () => void;
  onUpdate: (updatedNode: PlayerNode) => void;
  hideSwapButton?: boolean;
}

export const PlayerDetailsModal: React.FC<PlayerDetailsModalProps> = ({ 
  isOpen, 
  playerNode, 
  onClose, 
  onSwap, 
  onUpdate,
  hideSwapButton
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'guide' | 'skills' | 'resonance' | 'bonus'>('info');
  const [characterDetails, setCharacterDetails] = useState<any>(null);
  const [activePotentialSlot, setActivePotentialSlot] = useState<PotentialSlotID | null>(null);
  const [isMemoryDrawerOpen, setIsMemoryDrawerOpen] = useState(false);
  const [showMemoryEffect, setShowMemoryEffect] = useState(false);
  const [selectedBuildIndex, setSelectedBuildIndex] = useState(0);

  const characterGuide = playerNode?.character?.id ? (guidesData as any)[playerNode.character.id] : null;
  const builds = characterGuide?.builds || [];
  const currentBuild = builds[selectedBuildIndex];

  const parseMarkdownTips = (text: string, characterPosition: string) => {
    if (!text) return '';
    const lines = text.split('\n');
    const processedLines: string[] = [];
    
    for (let line of lines) {
      line = line.replace(/\[cite:.*?\]/g, '');
      line = line.replace(/^\*\*\*(.*?)\*\*\*$/g, '$1');
      line = line.trim();
      if (!line) continue;

      if (line.match(/\*\s+\*\*Composição/i) || line.match(/## Composição/i)) {
        processedLines.push(`<h4 class="text-sm font-black text-white/50 mt-8 mb-4 uppercase tracking-[0.2em] border-b border-white/10 pb-2 flex items-center gap-2"><svg class="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>Composição de Equipe</h4>`);
        continue;
      }

      const memoryMatch = line.match(/\*\s+\*\*Memória:\s+(.*?)\*\*/i);
      if (memoryMatch) {
        const memoryName = memoryMatch[1].trim();
        let memory = memoriesData.find((m: any) => m.name === memoryName);
        
        // Fuzzy matching logic to handle user variations in guides.json
        if (!memory) {
           const cleanName = memoryName.replace(/\s*\((SP|UR|SSR|SR|R|N)\)$/i, '').trim();
           
           // 1. Try to find a memory that contains the cleaned string (e.g. ignoring the (SP) suffix)
           memory = memoriesData.find((m: any) => m.name.toLowerCase().includes(cleanName.toLowerCase()));
           
           // 2. If still not found, extract the character name and match by character name + rarity
           if (!memory && cleanName.includes(':')) {
              const charNameParts = cleanName.split(':');
              const charName = charNameParts[charNameParts.length - 1].trim();
              
              const rarityMatch = memoryName.match(/\((SP|UR|SSR|SR|R|N)\)$/i);
              const expectedRarity = rarityMatch ? rarityMatch[1].toUpperCase() : null;
              
              memory = memoriesData.find((m: any) => {
                 const nameMatches = m.name.toLowerCase().includes(charName.toLowerCase());
                 const rarityMatches = expectedRarity ? m.rarity === expectedRarity : true;
                 return nameMatches && rarityMatches;
              });
           }
        }
        
        if (memory && memory.position !== 'All' && memory.position !== characterPosition) {
          continue;
        }
        
        if (memory) {
          processedLines.push(`
            <div class="flex flex-col sm:flex-row gap-4 p-4 mt-4 bg-[#121212] border border-white/5 rounded-xl relative overflow-hidden group">
              <div class="w-20 h-20 shrink-0 rounded-xl border border-white/10 overflow-hidden relative z-10 group-hover:scale-105 transition-transform">
                <img src="/assets/memories/${memory.id}.png" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 relative z-10">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-[10px] font-black uppercase bg-white/10 px-2 py-0.5 rounded text-white/70">${memory.rarity}</span>
                  <span class="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">${memory.position}</span>
                </div>
                <h5 class="text-base font-black text-orange-400 leading-tight mb-2 tracking-tight">${memory.name}</h5>
                <div class="text-sm text-white/70 leading-relaxed font-medium description-block"></div>
              </div>
            </div>
          `);
        } else {
          processedLines.push(`<li class="mt-4 font-black text-orange-400 text-sm tracking-wide uppercase">${memoryName}</li>`);
        }
        continue;
      }
      
      const logicMatch = line.match(/^\*\s+\*Lógica:\*(.*)$/);
      if (logicMatch) {
         const logicText = logicMatch[1].trim();
         if (processedLines.length > 0 && processedLines[processedLines.length - 1].includes('description-block')) {
           processedLines[processedLines.length - 1] = processedLines[processedLines.length - 1].replace(
             '<div class="text-sm text-white/70 leading-relaxed font-medium description-block"></div>',
             `<div class="text-sm text-white/70 leading-relaxed font-medium description-block border-t border-white/5 pt-2 mt-2">${logicText}</div>`
           );
         } else {
           processedLines.push(`<p class="text-sm text-white/50 pl-4 border-l-2 border-orange-500/30 mt-2 font-medium italic">${logicText}</p>`);
         }
         continue;
      }

      if (line.startsWith('### ')) {
        processedLines.push(`<h4 class="text-sm font-black text-orange-400 tracking-[0.1em] mb-3 mt-8 border-b border-white/10 pb-2 flex items-center gap-2">${line.substring(4)}</h4>`);
      } else if (line.startsWith('## ')) {
        processedLines.push(`<h5 class="text-xs font-black text-white/60 uppercase tracking-[0.15em] mb-3 mt-6">${line.substring(3)}</h5>`);
      } else if (line.startsWith('* ')) {
        let content = line.substring(2);
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
        processedLines.push(`<li class="text-sm text-white/80 mb-2 flex items-start gap-3"><span class="text-orange-500 mt-0.5 shrink-0">✦</span><span class="leading-relaxed">${content}</span></li>`);
      } else {
        let content = line;
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
        processedLines.push(`<p class="mb-3 text-sm text-white/80 leading-relaxed">${content}</p>`);
      }
    }

    return processedLines.join('\n');
  };
  const { isPlayerSaved, savePlayer, removePlayer } = useAccount();
  const [level, setLevel] = useState<number>(80);
  const [resonance, setResonance] = useState<number>(0);
  const [awakening, setAwakening] = useState<number>(0);

  const handleAutoBuild = () => {
    if (!playerNode || !currentBuild) return;

    const set4Name = currentBuild.set4;
    const set2Name = currentBuild.set2?.replace('Flex (Qualquer conjunto de 2)', '')?.trim();
    
    // Encontra IDs
    const set4Id = potentialsData.find((p: any) => p.name.toLowerCase() === set4Name?.toLowerCase())?.id || 'power_vibe';
    let set2Id = 'power_rise';
    if (set2Name && set2Name.toLowerCase() !== 'flex') {
       set2Id = potentialsData.find((p: any) => p.name.toLowerCase() === set2Name.toLowerCase())?.id || 'power_rise';
    }

    const mainStats = currentBuild.mainStats || {};
    const newPotentials: Record<PotentialSlotID, EquippedPotential> = { ...(playerNode.potentials as any) };

    const getDefaultStat = (slot: PotentialSlotID) => potentialSlotsConfig[slot].possibleStats[0];

    // Slots I, II, III, IV recebem o set 4
    newPotentials['I'] = { setId: set4Id, mainStat: getDefaultStat('I') };
    newPotentials['II'] = { setId: set4Id, mainStat: mainStats['II'] || getDefaultStat('II') };
    newPotentials['III'] = { setId: set4Id, mainStat: getDefaultStat('III') };
    newPotentials['IV'] = { setId: set4Id, mainStat: mainStats['IV'] || getDefaultStat('IV') };

    // Slots V, VI recebem o set 2
    newPotentials['V'] = { setId: set2Id, mainStat: getDefaultStat('V') };
    newPotentials['VI'] = { setId: set2Id, mainStat: mainStats['VI'] || getDefaultStat('VI') };

    const updatedNode = { ...playerNode, potentials: newPotentials };
    onUpdate(updatedNode);
  };

  useEffect(() => {
    if (playerNode) {
      setLevel(playerNode.level);
      setResonance(playerNode.resonance || 0);
      setActiveTab('info'); // Reset tab on open only when changing character or opening
      
      // Carregar os detalhes do JSON
      import(`../data/characters-details/${playerNode.character.id}.json`)
        .then((m) => setCharacterDetails(m.default || m))
        .catch(e => console.error("Failed to load character details", e));
    }
  }, [playerNode?.character?.id]);

  if (!isOpen || !playerNode) return null;

  const character = playerNode.character;
  const growthTiers = characterGrowthData[character.id.toString()] || [];
  const rawStats = calculateCharacterStats(level, growthTiers, false);

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = parseInt(e.target.value, 10);
    setLevel(newLevel);
    onUpdate({
      ...playerNode,
      level: newLevel,
      resonance,
    });
  };

  const handleResonanceChange = (newResonance: number) => {
    setResonance(newResonance);
    onUpdate({
      ...playerNode,
      level,
      resonance: newResonance,
    });
  };

  const handleMemoryLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = parseInt(e.target.value, 10);
    if (playerNode.memory) {
      onUpdate({
        ...playerNode,
        memory: {
          ...playerNode.memory,
          level: newLevel,
        }
      });
    }
  };

  const handleBonusChange = (statName: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const currentBonus = playerNode.bonusStats || {};
    onUpdate({
      ...playerNode,
      bonusStats: {
        ...currentBonus,
        [statName]: numValue
      }
    });
  };

  const handleMemorySelect = (memory: Memory) => {
    onUpdate({
      ...playerNode,
      memory: {
        data: memory,
        level: 1, // Default memory level
      },
    });
    setIsMemoryDrawerOpen(false);
  };

  const equippedMemory = playerNode.memory?.data;
  const equippedPotentials = playerNode.potentials || {};

  // Calculate active set bonuses
  const setCounts = Object.values(equippedPotentials).reduce((acc, pot) => {
    if (pot?.setId) {
      acc[pot.setId] = (acc[pot.setId] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const activeSets = Object.entries(setCounts)
    .filter(([_, count]) => count >= 2)
    .map(([setId, count]) => {
      const setInfo = potentialsData.find(p => p.id === setId);
      return {
        ...setInfo!,
        pieces: count >= 4 ? 4 : 2
      };
    });

  const handlePotentialSelect = (slotId: PotentialSlotID, setId: string, mainStat: string) => {
    onUpdate({
      ...playerNode,
      potentials: {
        ...equippedPotentials,
        [slotId]: { setId, mainStat }
      }
    });
  };

  const handlePotentialRemove = (slotId: PotentialSlotID) => {
    const newPotentials = { ...equippedPotentials };
    delete newPotentials[slotId];
    onUpdate({
      ...playerNode,
      potentials: newPotentials
    });
  };



  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 z-50 transition-opacity backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-[#0a0a0a] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] z-50 rounded-3xl overflow-hidden flex flex-col max-h-[95vh] ring-1 ring-white/5">
        
        {/* Header */}
        <div className={`relative h-28 shrink-0 border-b border-white/10 flex items-center px-6 py-4 overflow-hidden ${
          character.rarity === 'UR' ? 'bg-gradient-to-br from-red-950/80 via-black to-black' : 
          character.rarity === 'SSR' ? 'bg-gradient-to-br from-yellow-950/80 via-black to-black' : 
          'bg-gradient-to-br from-purple-950/80 via-black to-black'
        }`}>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm"
            style={{ backgroundImage: `url('/assets/others/minibg/background_${character.rarity.toLowerCase()}.png')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
          
          <div className="relative z-10 flex items-center gap-4 w-full">
            <div className="w-16 h-16 shrink-0 rounded-full border-2 border-white/20 overflow-hidden bg-black/50">
               <SmartImage 
                  playerId={String(character.id)}
                  type="mini"
                  isCoach={false}
                  alt={character.name} 
                  fallbackText="?"
                  className="w-full h-full object-cover scale-[0.85] origin-bottom"
                />
            </div>
            <div className="flex-1 pr-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase bg-white/10 px-2 py-0.5 rounded text-white/70">
                  {character.rarity}
                </span>
                <span className="text-[10px] font-black uppercase bg-white/10 px-2 py-0.5 rounded text-white/70">
                  {character.position}
                </span>
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-black text-white leading-tight truncate" title={character.name.replace(/\s*\(.*?\)/, '')}>
                  {character.name.replace(/\s*\(.*?\)/, '')}
                </h2>
                {character.name.match(/\((.*?)\)/) && (
                  <span className="text-xs font-bold text-white/50 truncate mt-0.5" title={character.name.match(/\((.*?)\)/)?.[1]}>
                    {character.name.match(/\((.*?)\)/)?.[1]}
                  </span>
                )}
              </div>
            </div>
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

        {/* Tabs */}
        <div className="flex border-b border-white/5 bg-[#0a0a0a] shrink-0 px-4">
          <button 
            onClick={() => setActiveTab('info')}
            className={`px-6 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'info' ? 'border-orange-500 text-orange-400 bg-orange-500/5' : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            Atributos
          </button>
          <button 
            onClick={() => setActiveTab('guide')}
            className={`px-6 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 flex items-center gap-2 ${activeTab === 'guide' ? 'border-purple-500 text-purple-400 bg-purple-500/5' : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Guia
          </button>
          <button 
            onClick={() => setActiveTab('skills')}
            className={`px-6 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'skills' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            Habilidades
          </button>
          <button 
            onClick={() => setActiveTab('resonance')}
            className={`px-6 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'resonance' ? 'border-green-500 text-green-400 bg-green-500/5' : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            Ressonância
          </button>
          <button 
            onClick={() => setActiveTab('bonus')}
            className={`px-6 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'bonus' ? 'border-red-500 text-red-400 bg-red-500/5' : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            Bônus
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-white/10">
          {activeTab === 'guide' && (
            <div className="space-y-8 animate-fadeIn">
              {characterGuide ? (
                <>
                  <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-xl font-black text-white mb-1 tracking-tight">Guia de Build</h3>
                      <p className="text-sm text-white/50 font-medium">Recomendações e estratégias</p>
                    </div>
                    {builds.length > 1 && (
                      <div className="flex gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5">
                        {builds.map((build: any, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedBuildIndex(idx)}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${selectedBuildIndex === idx ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                          >
                            Build {idx + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-8">
                    {currentBuild && (
                      <>
                        {/* Recommended Potentials */}
                        <div>
                          <h4 className="text-sm font-black text-white/50 mb-4 uppercase tracking-[0.2em] border-b border-white/10 pb-2 flex items-center gap-2">
                            <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                            Potenciais Sugeridos
                          </h4>
                        
                        <div className="flex flex-col gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                          <h5 className="text-sm font-bold text-white mb-2">{currentBuild.name}</h5>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Set 4 */}
                            {currentBuild.set4 && (() => {
                              const potIdInfo = potentialsData.find(p => p.name === currentBuild.set4);
                              return (
                                <div className="bg-[#121212] border border-white/5 rounded-xl p-3 flex items-center gap-3 relative overflow-hidden group hover:border-orange-500/30 transition-colors shadow-md">
                                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                  {potIdInfo && (
                                    <div className="w-12 h-12 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                      <img src={`/assets/others/potentials/${potIdInfo.id.replace(/_/g, '-')}.png`} className="w-full h-full object-contain" />
                                    </div>
                                  )}
                                  <div>
                                    <span className="text-[9px] font-black uppercase text-white/30 block mb-0.5">Conjunto de 4 Peças</span>
                                    <p className="text-xs font-bold text-white/90 leading-tight">{currentBuild.set4}</p>
                                  </div>
                                </div>
                              )
                            })()}
                            
                            {/* Set 2 */}
                            {currentBuild.set2 && (() => {
                              const potIdInfo = potentialsData.find(p => p.name === currentBuild.set2);
                              return (
                                <div className="bg-[#121212] border border-white/5 rounded-xl p-3 flex items-center gap-3 relative overflow-hidden group hover:border-orange-500/30 transition-colors shadow-md">
                                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                  {potIdInfo && (
                                    <div className="w-12 h-12 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                      <img src={`/assets/others/potentials/${potIdInfo.id.replace(/_/g, '-')}.png`} className="w-full h-full object-contain" />
                                    </div>
                                  )}
                                  <div>
                                    <span className="text-[9px] font-black uppercase text-white/30 block mb-0.5">Conjunto de 2 Peças</span>
                                    <p className="text-xs font-bold text-white/90 leading-tight">{currentBuild.set2}</p>
                                  </div>
                                </div>
                              )
                            })()}
                          </div>
                          
                          {/* Logic */}
                          {currentBuild.logic && (
                            <p className="text-xs text-white/60 italic border-l-2 border-white/10 pl-3 mt-2">{currentBuild.logic}</p>
                          )}

                          {/* Main Stats */}
                          {currentBuild.mainStats && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                               <h6 className="text-[10px] font-black uppercase text-white/40 mb-3">Atributos Principais Recomendados</h6>
                               <div className="flex gap-4">
                                 {Object.entries(currentBuild.mainStats).map(([slot, stat]) => (
                                   <div key={slot} className="bg-black/30 px-3 py-2 rounded-lg border border-white/5 flex-1 text-center">
                                     <span className="block text-[10px] font-bold text-white/30 mb-1">Slot {slot}</span>
                                     <span className="block text-[11px] font-black text-orange-400">{stat as React.ReactNode}</span>
                                   </div>
                                 ))}
                               </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                    {/* General Tips & Substats & Memories (Markdown) */}
                    {characterGuide.tips && (
                        <div>
                          <div 
                            className="prose prose-invert max-w-none guide-content prose-p:text-sm prose-p:text-white/70 prose-p:leading-relaxed prose-li:text-sm prose-li:text-white/70"
                            dangerouslySetInnerHTML={{ 
                              __html: parseMarkdownTips(characterGuide.tips, character.position) 
                            }}
                          />
                        </div>
                      )}

                      {/* How to Play */}
                      {characterGuide.howToPlay && (
                        <div className="mt-8 pt-8 border-t border-white/10">
                          <h4 className="text-sm font-black text-blue-400 mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Como Jogar
                          </h4>
                          <div 
                            className="prose prose-invert max-w-none guide-content prose-p:text-sm prose-p:text-white/70 prose-p:leading-relaxed prose-li:text-sm prose-li:text-white/70"
                            dangerouslySetInnerHTML={{ 
                              __html: parseMarkdownTips(characterGuide.howToPlay, character.position) 
                            }}
                          />
                        </div>
                      )}
                    </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white/5 rounded-3xl border border-white/5">
                  <svg className="w-16 h-16 text-white/10 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Nenhum guia disponível</p>
                  <p className="text-xs text-white/30 mt-2 max-w-xs mx-auto">Em breve adicionaremos recomendações de build para este personagem.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'info' && (
            <>
          
          {/* Level Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">
                Nível
              </label>
              <span className="text-sm font-bold text-blue-400">
                Lv. {level}
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="80" 
              value={level} 
              onChange={handleLevelChange}
              className="w-full accent-blue-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Resonance Selector */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">
                Ressonância
              </label>
              <span className="text-sm font-bold text-orange-400">
                Nv. {resonance}
              </span>
            </div>
            <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl border border-white/5">
              {[0, 1, 2, 3, 4, 5].map((res) => (
                <button
                  key={res}
                  onClick={() => handleResonanceChange(res)}
                  className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                    resonance === res 
                      ? 'bg-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.5)]' 
                      : 'bg-white/10 text-white/40 hover:bg-white/20'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          {/* Raw Stats */}
          <div>
             <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-3">
               Status (Base + Bônus)
             </h3>
             <div className="grid grid-cols-2 gap-2">
               {Object.entries(rawStats).map(([stat, val]) => {
                 const ptStat = {
                    'Serve': 'Saque',
                    'Set': 'Passe',
                    'Power Attack': 'Ataque Potente',
                    'Receive': 'Recepção',
                    'Block': 'Bloqueio',
                    'Quick Attack': 'Ataque Rápido',
                    'Save': 'Defesa'
                 }[stat] || stat;
                 const bonusVal = playerNode.bonusStats?.[ptStat] || 0;
                 return (
                 <div key={stat} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                   <span className="text-[10px] font-bold text-white/60 uppercase">{ptStat}</span>
                   <span className="text-sm font-black text-white">{(val as number) + bonusVal}</span>
                 </div>
               )})}
               
               {/* Additional Bonus Stats not in rawStats */}
               {Object.entries(playerNode.bonusStats || {})
                 .filter(([stat]) => !['Saque', 'Passe', 'Ataque Potente', 'Recepção', 'Bloqueio', 'Ataque Rápido', 'Defesa'].includes(stat))
                 .map(([stat, bonusVal]) => {
                   if (bonusVal === 0) return null;
                   const isPercentage = ['Força', 'Técnica de Ataque', 'Percepção', 'Reflexo', 'Empenho', 'Técnica de Defesa'].includes(stat);
                   return (
                     <div key={stat} className="flex justify-between items-center bg-green-500/5 px-3 py-2 rounded-lg border border-green-500/20">
                       <span className="text-[10px] font-bold text-green-400/80 uppercase">{stat}</span>
                       <span className="text-sm font-black text-green-400">+{bonusVal}{isPercentage ? '%' : ''}</span>
                     </div>
                   );
                 })
               }
             </div>
          </div>

          {/* Equipped Memory */}
          <div>
             <div className="flex justify-between items-center mb-3">
               <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">
                 Memória Equipada
               </h3>
               {playerNode.memory && (
                 <div className="flex items-center gap-2 relative">
                   <span className="text-xs font-bold text-blue-400">
                     Nv. {playerNode.memory.level}
                   </span>
                   <button 
                     onClick={() => setShowMemoryEffect(!showMemoryEffect)}
                     className="text-white/40 hover:text-white transition-colors p-1 bg-white/5 rounded-full"
                     title="Ver efeito da memória"
                   >
                     <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                   </button>
                   {showMemoryEffect && equippedMemory && (
                      <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-20">
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-wider mb-2">Efeito (Nv. {playerNode.memory.level})</h4>
                        <p className="text-xs text-white/80 leading-relaxed whitespace-pre-wrap">
                          {getMemoryDescriptionById(equippedMemory.id) 
                            ? formatSkillDescription(getMemoryDescriptionById(equippedMemory.id)!, JSON.stringify(equippedMemory.parameters), playerNode.memory.level)
                            : 'Efeito não encontrado.'}
                        </p>
                      </div>
                   )}
                 </div>
               )}
             </div>
             {equippedMemory ? (
                <div className="flex flex-col gap-3">
                  <div 
                    onClick={() => setIsMemoryDrawerOpen(true)}
                    className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors group"
                  >
                    <div className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-neutral-800">
                       <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url('/assets/others/minibg/background_${equippedMemory.rarity.toLowerCase()}.png')` }}
                        />
                        <img 
                          src={`/assets/memories/${equippedMemory.id}.png`}
                          alt={equippedMemory.name} 
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.src = '/assets/placeholder-memory.svg'; }}
                        />
                    </div>
                    <div className="flex-1">
                      <span className="text-[9px] font-black uppercase bg-black/40 px-1.5 py-0.5 rounded text-white/80 inline-block mb-1">
                        {equippedMemory.rarity}
                      </span>
                      <p className="text-sm font-bold text-white leading-tight line-clamp-2">
                        {equippedMemory.name || 'Memória'}
                      </p>
                    </div>
                    <div className="shrink-0 text-white/20 group-hover:text-white/60 px-2 transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Memory Level Slider */}
                  <div className="px-1">
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      value={playerNode.memory?.level || 1} 
                      onChange={handleMemoryLevelChange}
                      className="w-full accent-blue-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] font-bold text-white/30 mt-1.5 px-1">
                      <span>Lv. 1</span>
                      <span>Lv. 5</span>
                    </div>
                  </div>
                </div>
             ) : (
                <button 
                  onClick={() => setIsMemoryDrawerOpen(true)}
                  className="w-full flex flex-col items-center justify-center p-6 bg-white/5 border border-dashed border-white/20 rounded-xl hover:bg-white/10 transition-colors gap-2"
                >
                  <svg className="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-xs font-bold text-white/60 uppercase">Equipar Memória</span>
                </button>
             )}
          </div>

           {/* Potentials */}
           <div>
               <div className="flex justify-between items-center mb-3">
                 <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">
                   Potenciais Equipados
                 </h3>
                 {currentBuild && (
                   <button 
                     onClick={handleAutoBuild}
                     className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors border border-orange-500/30 group"
                     title="Preenche os slots com a build recomendada"
                   >
                     <svg className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                     </svg>
                     Equipar Recomendados
                   </button>
                 )}
               </div>
             <div className="grid grid-cols-3 gap-2">
               {(['I', 'II', 'III', 'IV', 'V', 'VI'] as PotentialSlotID[]).map((slotId) => {
                 const equipped = equippedPotentials[slotId];
                 const setInfo = equipped ? potentialsData.find(p => p.id === equipped.setId) : null;
                 
                 return (
                   <button
                     key={slotId}
                     onClick={() => setActivePotentialSlot(slotId)}
                     className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all h-24 overflow-hidden group ${
                       equipped
                         ? 'bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/30 hover:border-orange-400/50'
                         : 'bg-white/5 border-dashed border-white/20 hover:bg-white/10 hover:border-white/30'
                     }`}
                   >
                     {equipped && setInfo && (
                       <div 
                         className="absolute inset-2 bg-contain bg-no-repeat bg-center opacity-10 group-hover:opacity-20 transition-opacity scale-75" 
                         style={{ backgroundImage: `url('/assets/others/potentials/${setInfo.id.replace(/_/g, '-')}.png')` }} 
                       />
                     )}
                     <div className="absolute top-2 left-2 z-10 text-[10px] font-black text-white/30">{slotId}</div>
                     {equipped && setInfo ? (
                       <div className="relative z-10 flex flex-col items-center w-full mt-2">
                         <span className="text-[9px] font-bold text-orange-400 text-center leading-tight line-clamp-2 drop-shadow-md">
                           {setInfo.name}
                         </span>
                         <span className="text-[10px] font-black text-white mt-1 text-center truncate w-full px-1 drop-shadow-md">
                           {equipped.mainStat}
                         </span>
                       </div>
                     ) : (
                       <svg className="w-5 h-5 text-white/20 mt-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                       </svg>
                     )}
                   </button>
                 );
               })}
             </div>

             {/* Active Set Bonuses */}
             {activeSets.length > 0 && (
               <div className="mt-4 space-y-2">
                 <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Efeitos de Conjunto Ativos</h4>
                 {activeSets.map(set => (
                   <div key={set.id} className="bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-lg">
                     <div className="flex justify-between items-center mb-1">
                       <span className="text-xs font-black text-blue-400">{set.name}</span>
                       <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
                         {set.pieces} Peças
                       </span>
                     </div>
                     <p className="text-[10px] text-white/70 leading-tight">
                       <strong className="text-white/50">2P:</strong> {set.effect2p}
                     </p>
                     {set.pieces >= 4 && (
                       <p className="text-[10px] text-white/70 leading-tight mt-0.5">
                         <strong className="text-white/50">4P:</strong> {set.effect4p}
                       </p>
                     )}
                   </div>
                 ))}
               </div>
             )}

              {playerNode.suggestedSubStats && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <h4 className="text-[10px] font-black text-green-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Sub-Atributos Recomendados
                  </h4>
                  <p className="text-xs text-green-100/80 leading-relaxed whitespace-pre-wrap">
                    {playerNode.suggestedSubStats}
                  </p>
                </div>
              )}


           </div>

            </>
          )}

          {activeTab === 'bonus' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-black text-red-400/80 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Atributos Ofensivos
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Saque', 'Passe', 'Ataque Potente', 'Ataque Rápido', 'Força', 'Técnica de Ataque', 'Percepção'].map(stat => {
                    const isPercentage = ['Força', 'Técnica de Ataque', 'Percepção'].includes(stat);
                    return (
                      <div key={stat} className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-white/60 uppercase">{stat} {isPercentage && '(%)'}</label>
                        <input 
                          type="number" 
                          min="0"
                          step={isPercentage ? "0.1" : "1"}
                          value={playerNode.bonusStats?.[stat] || ''} 
                          onChange={(e) => handleBonusChange(stat, e.target.value)}
                          placeholder="0"
                          className="bg-black border border-white/10 text-sm font-black text-white rounded-lg px-3 py-2 outline-none focus:border-red-500/50 focus:bg-red-500/5 transition-all"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black text-blue-400/80 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Atributos Defensivos
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Recepção', 'Bloqueio', 'Defesa', 'Reflexo', 'Empenho', 'Técnica de Defesa'].map(stat => {
                    const isPercentage = ['Reflexo', 'Empenho', 'Técnica de Defesa'].includes(stat);
                    return (
                      <div key={stat} className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-white/60 uppercase">{stat} {isPercentage && '(%)'}</label>
                        <input 
                          type="number" 
                          min="0"
                          step={isPercentage ? "0.1" : "1"}
                          value={playerNode.bonusStats?.[stat] || ''} 
                          onChange={(e) => handleBonusChange(stat, e.target.value)}
                          placeholder="0"
                          className="bg-black border border-white/10 text-sm font-black text-white rounded-lg px-3 py-2 outline-none focus:border-blue-500/50 focus:bg-blue-500/5 transition-all"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-4">
              {characterDetails?.skills?.filter((s: any) => s.name).map((skill: any) => {
                const isOwned = isPlayerSaved(character.id);
                const skillLevels = playerNode.skillLevels || {};
                const currentLevel = skillLevels[skill.id] || 1;
                const formattedDesc = formatSkillDescription(skill.description, skill.parameters, currentLevel);
                
                // Get max level by parsing parameters array length
                let maxLevel = 1;
                try {
                  const params = JSON.parse(skill.parameters);
                  if (params.length > 0) {
                    maxLevel = params[0].split('/').length;
                  }
                } catch(e) {}

                return (
                  <div key={skill.id} className="bg-neutral-900 border border-white/5 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-black text-white/90 uppercase">{skill.name}</h3>
                      {isOwned && maxLevel > 1 && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-white/40 uppercase">Nível</span>
                          <select 
                            value={currentLevel}
                            onChange={(e) => {
                              const newLevel = parseInt(e.target.value, 10);
                              onUpdate({
                                ...playerNode,
                                skillLevels: { ...(playerNode.skillLevels || {}), [skill.id]: newLevel }
                              });
                            }}
                            className="bg-black border border-white/10 text-xs font-bold text-blue-400 rounded p-1 outline-none"
                          >
                            {Array.from({ length: maxLevel }).map((_, i) => (
                              <option key={i+1} value={i+1}>{i+1}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      {(!isOwned || maxLevel === 1) && (
                        <span className="text-xs font-bold text-blue-400">Nv. {currentLevel}</span>
                      )}
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">{formattedDesc}</p>
                  </div>
                );
              })}
              {!characterDetails && (
                <div className="text-center py-10 text-white/40 text-sm font-bold animate-pulse">
                  Carregando habilidades...
                </div>
              )}
            </div>
          )}

          {activeTab === 'resonance' && (
            <div className="space-y-4">
              {characterDetails?.skills?.filter((s: any) => !s.name).map((resPassive: any, index: number) => {
                const resLevel = index === 0 ? 2 : 4;
                const isUnlocked = resonance >= resLevel;
                const formattedDesc = formatSkillDescription(resPassive.description, resPassive.parameters, 1);
                
                return (
                  <div key={resPassive.id} className={`bg-neutral-900 border rounded-xl p-4 transition-colors ${isUnlocked ? 'border-orange-500/50' : 'border-white/5 opacity-50'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className={`text-sm font-black uppercase ${isUnlocked ? 'text-orange-400' : 'text-white/40'}`}>
                        Passiva de Ressonância {resLevel}
                      </h3>
                      {!isUnlocked && <span className="text-[10px] font-bold text-white/30 uppercase bg-white/5 px-2 py-1 rounded">Bloqueado</span>}
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">{formattedDesc}</p>
                  </div>
                );
              })}
              {!characterDetails && (
                <div className="text-center py-10 text-white/40 text-sm font-bold animate-pulse">
                  Carregando ressonâncias...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-[#121212] flex gap-3">
          <button 
            onClick={() => {
              savePlayer({
                characterId: character.id,
                level: level,
                awakening: 0,
                resonance: resonance,
                memory: playerNode.memory ? { memoryId: playerNode.memory.data.id, level: playerNode.memory.level } : null,
                potentials: equippedPotentials,
                skillLevels: playerNode.skillLevels,
                bonusStats: playerNode.bonusStats,
                suggestedSubStats: playerNode.suggestedSubStats
              });
            }}
            className="flex-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 font-bold py-3 rounded-xl transition-colors text-sm uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {isPlayerSaved(character.id) ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Atualizar Conta
              </>
            ) : (
              'Salvar na Conta'
            )}
          </button>
          {isPlayerSaved(character.id) && (
            <button 
              onClick={() => removePlayer(character.id)}
              className="px-4 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 rounded-xl transition-colors flex items-center justify-center"
              title="Remover da Conta"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          )}
          {!hideSwapButton && (
            <button 
              onClick={onSwap}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-colors text-sm uppercase tracking-wider"
            >
              Trocar Jogador
            </button>
          )}
        </div>
      </div>

      <MemoryDrawer 
        isOpen={isMemoryDrawerOpen}
        targetPosition={character.position}
        onClose={() => setIsMemoryDrawerOpen(false)}
        onSelect={handleMemorySelect}
      />

      {activePotentialSlot && (
        <PotentialDrawer
          isOpen={!!activePotentialSlot}
          slotId={activePotentialSlot}
          equipped={equippedPotentials[activePotentialSlot]}
          onClose={() => setActivePotentialSlot(null)}
          onSelect={(setId, mainStat) => handlePotentialSelect(activePotentialSlot, setId, mainStat)}
          onRemove={() => handlePotentialRemove(activePotentialSlot)}
        />
      )}
    </>
  );
};
