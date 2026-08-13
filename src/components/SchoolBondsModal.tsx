import React from 'react';
import { SchoolBuff } from '../utils/buffUtils';
import { SmartImage } from './SmartImage';
import { Character } from '../types';
import bondsData from '../data/bonds.json';

interface SchoolBondsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSchoolBuffs: SchoolBuff[];
  team: Record<string, any>;
}

const COURT_SLOTS = ['front-1', 'front-2', 'front-3', 'back-1', 'back-2', 'back-3', 'back-libero'];

function getRarityBg(rarity?: string): string {
  if (!rarity) return '';
  return `url('/assets/others/minibg/background_${rarity.toLowerCase()}.png')`;
}

export const SchoolBondsModal: React.FC<SchoolBondsModalProps> = ({ isOpen, onClose, activeSchoolBuffs, team }) => {
  if (!isOpen) return null;

  const playersInCourt = COURT_SLOTS.map(slot => team[slot]?.character || team[slot]).filter(Boolean) as Character[];
  
  // Calculate player bonds from bonds.json
  const activeBonds: { name: string; description: string; players: Character[] }[] = [];
  
  bondsData.forEach((bond: any) => {
    try {
      if (!bond.character_ids) return;
      const requiredIds = JSON.parse(bond.character_ids) as number[];
      
      // Encontra os jogadores na quadra que batem com os IDs do vínculo
      const activatingPlayers = requiredIds.map(id => playersInCourt.find(p => p.id === id));
      
      // Se todos os jogadores necessários estão na quadra
      if (activatingPlayers.every(p => p !== undefined)) {
        let formattedDesc = bond.description;
        
        // Substitui {0}, {1}, etc pelos parâmetros do bond
        if (bond.parameters) {
          const params = JSON.parse(bond.parameters) as string[];
          params.forEach((param, index) => {
            formattedDesc = formattedDesc.replace(new RegExp(`\\{${index}\\}`, 'g'), param);
          });
        }
        
        activeBonds.push({
          name: bond.name,
          description: formattedDesc,
          players: activatingPlayers as Character[]
        });
      }
    } catch (e) {
      console.error("Error parsing bond", bond.id, e);
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Vínculos Escolares Ativos</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors" aria-label="Close">
            <span className="text-xl leading-none px-1">&#10005;</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {activeSchoolBuffs.length === 0 && activeBonds.length === 0 ? (
            <div className="text-center text-white/50 py-8">
              Nenhum vínculo ativo no momento.<br />
              <span className="text-sm">Coloque 4 ou mais jogadores da mesma escola ou jogadores com vínculos pessoais na quadra para ativar.</span>
            </div>
          ) : (
            <div className="space-y-6">
              {activeSchoolBuffs.map(buff => {
                // Find players in court slots that belong to this school
                const activatingPlayers = COURT_SLOTS.map(slot => team[slot])
                  .filter(node => node && (node.character || node).school === buff.school)
                  .map(node => node.character || node);

                return (
                  <div key={buff.school} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-white">{buff.school}</h3>
                      <p className="text-white/70 text-sm mt-1">{buff.effect}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {activatingPlayers.map((player: Character) => (
                        <div 
                          key={player.id} 
                          className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 bg-[#0a0a0a] bg-cover bg-center shadow-lg"
                          style={{ backgroundImage: getRarityBg(player.rarity) }}
                        >
                          <SmartImage 
                            playerId={String(player.id)} 
                            type="mini" 
                            alt={player.name} 
                            fallbackText={player.name.split(' ')[0]} 
                            className="w-full h-full object-cover relative z-10"
                          />
                          <div className="absolute inset-0 bg-black/20 z-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {activeBonds.map((bond, index) => (
                <div key={`bond-${index}`} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white">Vínculo: {bond.name}</h3>
                    <p className="text-white/70 text-sm mt-1">{bond.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {bond.players.map((player: Character) => (
                      <div 
                        key={player.id} 
                        className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 bg-[#0a0a0a] bg-cover bg-center shadow-lg"
                        style={{ backgroundImage: getRarityBg(player.rarity) }}
                      >
                        <SmartImage 
                          playerId={String(player.id)} 
                          type="mini" 
                          alt={player.name} 
                          fallbackText={player.name.split(' ')[0]} 
                          className="w-full h-full object-cover relative z-10"
                        />
                        <div className="absolute inset-0 bg-black/20 z-0" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
