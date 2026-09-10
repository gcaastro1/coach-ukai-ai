import React, { useMemo, useState } from 'react';
import { SchoolBuff } from '../utils/buffUtils';
import { SmartImage } from './SmartImage';
import { Character } from '../types';
import charactersData from '../data/characters.json';

interface SynergyPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamBuffs?: {
    activeSchoolBuffs: SchoolBuff[];
    activePlayerBonds?: any[];
    potentialBonds?: { bond: any, missingIds: number[] }[];
  };
  team: Record<string, any>;
}

const COURT_SLOTS = ['front-1', 'front-2', 'front-3', 'back-1', 'back-2', 'back-3', 'back-libero'];

function getRarityBg(rarity?: string): string {
  if (!rarity) return '';
  return `url('/assets/others/minibg/background_${rarity.toLowerCase()}.png')`;
}

const AccordionCard: React.FC<{
  title: string;
  description: React.ReactNode;
  titleColorClass: string;
  containerClass: string;
  children: React.ReactNode;
}> = ({ title, description, titleColorClass, containerClass, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${containerClass} rounded-xl p-4 transition-all duration-300`}>
      <div 
        className="flex justify-between items-center cursor-pointer select-none" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className={`font-bold ${titleColorClass}`}>{title}</h4>
        <button className="p-1 rounded-full hover:bg-white/10 transition-colors">
          <svg className={`w-5 h-5 text-white/50 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="text-white/70 text-sm mb-4 leading-snug">
          {description}
        </div>
      </div>
      
      <div className="mt-3">
        {children}
      </div>
    </div>
  );
};

export const SynergyPanelModal: React.FC<SynergyPanelModalProps> = ({ isOpen, onClose, teamBuffs, team }) => {
  if (!isOpen) return null;

  const activeSchoolBuffs = teamBuffs?.activeSchoolBuffs || [];
  const activeBonds = teamBuffs?.activePlayerBonds || [];
  const potentialBonds = teamBuffs?.potentialBonds || [];

  const nodesInCourt = COURT_SLOTS.map(slot => team[slot]).filter(Boolean);

  const formatBondDescription = (bond: any, activatingNodes: any[]) => {
    let formattedDesc = bond.description;
    const minLevel = activatingNodes.length > 0 ? Math.min(...activatingNodes.map(n => n.level || 80)) : 80;
    
    let bondIndex = 4;
    if (minLevel < 20) bondIndex = 0;
    else if (minLevel < 40) bondIndex = 1;
    else if (minLevel < 60) bondIndex = 2;
    else if (minLevel < 70) bondIndex = 3;
    
    if (bond.parameters) {
      try {
        const params = JSON.parse(bond.parameters) as string[];
        params.forEach((param, index) => {
          let actualValue = param;
          if (param.includes('/')) {
            const parts = param.split('/');
            actualValue = parts[Math.min(bondIndex, parts.length - 1)];
          }
          formattedDesc = formattedDesc.replace(new RegExp(`\\{${index}\\}`, 'g'), actualValue);
        });
      } catch (e) {}
    }
    return formattedDesc;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0 bg-gradient-to-r from-purple-900/20 to-transparent">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <span className="text-yellow-400">⚡</span> Sinergias do Time
            </h2>
            <p className="text-white/50 text-sm mt-1">Veja os vínculos ativos e descubra como fortalecer seu elenco.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors bg-black/20" aria-label="Close">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
          
          {/* Coluna Esquerda: Sinergias Ativas */}
          <div className="flex-1 space-y-4">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Ativos ({activeSchoolBuffs.length + activeBonds.length})
            </h3>
            
            {activeSchoolBuffs.length === 0 && activeBonds.length === 0 ? (
              <div className="text-center text-white/50 py-10 bg-white/5 border border-white/5 rounded-xl border-dashed">
                Nenhum vínculo ativo no momento.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Vínculos Pessoais Ativos */}
                {activeBonds.map((bond, index) => {
                  const requiredIds = JSON.parse(bond.character_ids) as number[];
                  const activatingNodes = requiredIds.map(id => nodesInCourt.find(n => (n.character || n).id === id)).filter(Boolean);
                  
                  return (
                    <AccordionCard
                      key={`bond-${bond.id}-${index}`}
                      title={bond.name}
                      description={formatBondDescription(bond, activatingNodes)}
                      titleColorClass="text-green-400"
                      containerClass="bg-gradient-to-r from-green-900/20 to-transparent border border-green-500/20"
                    >
                      <div className="flex flex-wrap gap-2">
                        {activatingNodes.map((node: any) => {
                          const player = node.character || node;
                          return (
                            <div 
                              key={player.id} 
                              className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/20 bg-[#0a0a0a] bg-cover bg-center shadow-lg"
                              style={{ backgroundImage: getRarityBg(player.rarity) }}
                              title={player.name}
                            >
                              <SmartImage 
                                playerId={String(player.id)} 
                                type="mini" 
                                alt={player.name} 
                                fallbackText={player.name.split(' ')[0]} 
                                className="absolute inset-0 w-full h-full object-cover scale-[1.02] origin-bottom relative z-10"
                              />
                              <div className="absolute inset-0 bg-black/20 z-0" />
                            </div>
                          )
                        })}
                      </div>
                    </AccordionCard>
                  );
                })}

                {/* Vínculos Escolares Ativos */}
                {activeSchoolBuffs.map(buff => {
                  const activatingPlayers = nodesInCourt
                    .filter(node => (node.character || node).school === buff.school)
                    .map(node => node.character || node);

                  return (
                    <AccordionCard
                      key={buff.school}
                      title={buff.school}
                      description={buff.effect}
                      titleColorClass="text-white"
                      containerClass="bg-gradient-to-r from-white/10 to-transparent border border-white/10"
                    >
                      <div className="flex flex-wrap gap-2">
                        {activatingPlayers.map((player: Character) => (
                          <div 
                            key={player.id} 
                            className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/20 bg-[#0a0a0a] bg-cover bg-center shadow-lg"
                            style={{ backgroundImage: getRarityBg(player.rarity) }}
                            title={player.name}
                          >
                            <SmartImage 
                              playerId={String(player.id)} 
                              type="mini" 
                              alt={player.name} 
                              fallbackText={player.name.split(' ')[0]} 
                              className="absolute inset-0 w-full h-full object-cover scale-[1.02] origin-bottom relative z-10"
                            />
                            <div className="absolute inset-0 bg-black/20 z-0" />
                          </div>
                        ))}
                      </div>
                    </AccordionCard>
                  );
                })}
              </div>
            )}
          </div>

          {/* Coluna Direita: Sugestões (Quase Lá) */}
          <div className="flex-1 space-y-4">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              Quase Lá ({potentialBonds.length})
            </h3>
            
            {potentialBonds.length === 0 ? (
              <div className="text-center text-white/50 py-10 bg-white/5 border border-white/5 rounded-xl border-dashed">
                Não há sugestões no momento.
              </div>
            ) : (
              <div className="space-y-4">
                {potentialBonds.map(({bond, missingIds}, index) => {
                  const requiredIds = JSON.parse(bond.character_ids) as number[];
                  // Present characters
                  const presentIds = requiredIds.filter(id => !missingIds.includes(id));
                  const presentNodes = presentIds.map(id => nodesInCourt.find(n => (n.character || n).id === id)).filter(Boolean);
                  // Missing characters objects
                  const missingCharacters = missingIds.map(id => charactersData.find(c => c.id === id)).filter(Boolean);

                  return (
                    <AccordionCard
                      key={`pot-bond-${bond.id}-${index}`}
                      title={bond.name}
                      description={formatBondDescription(bond, presentNodes)}
                      titleColorClass="text-yellow-500"
                      containerClass="bg-gradient-to-r from-yellow-900/10 to-transparent border border-yellow-500/20 opacity-80 hover:opacity-100"
                    >
                      <div className="flex items-center gap-3 bg-black/30 p-2 rounded-lg mt-1">
                        <div className="flex -space-x-2">
                          {presentNodes.map((node: any) => {
                            const player = node.character || node;
                            return (
                              <div key={player.id} className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 z-10" style={{ backgroundImage: getRarityBg(player.rarity) }} title={player.name}>
                                <SmartImage playerId={String(player.id)} type="mini" alt={player.name} fallbackText="?" className="absolute inset-0 w-full h-full object-cover scale-[1.02] origin-bottom relative z-10" />
                              </div>
                            )
                          })}
                        </div>
                        <div className="text-white/30 text-xs">+</div>
                        <div className="flex gap-2">
                          {missingCharacters.map((player: any) => (
                            <div key={player.id} className="flex items-center gap-2">
                              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-yellow-500/50 grayscale" style={{ backgroundImage: getRarityBg(player.rarity) }}>
                                <SmartImage playerId={String(player.id)} type="mini" alt={player.name} fallbackText="?" className="absolute inset-0 w-full h-full object-cover scale-[1.02] origin-bottom relative z-10" />
                              </div>
                              <span className="text-xs text-yellow-400 font-medium">Adicione {player.name.split(' ')[0]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionCard>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
