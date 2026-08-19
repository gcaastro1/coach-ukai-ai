'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const CourtBoard = dynamic(() => import('../components/CourtBoard').then(mod => mod.CourtBoard));
const PlayerDrawer = dynamic(() => import('../components/PlayerDrawer').then(mod => mod.PlayerDrawer), { ssr: false });
const CoachDetailsModal = dynamic(() => import('../components/CoachDetailsModal').then(mod => mod.CoachDetailsModal), { ssr: false });
const PlayerDetailsModal = dynamic(() => import('../components/PlayerDetailsModal').then(mod => mod.PlayerDetailsModal), { ssr: false });
const AutoBuilderModal = dynamic(() => import('../components/AutoBuilderModal').then(mod => mod.AutoBuilderModal), { ssr: false });
const AiStrategyModal = dynamic(() => import('../components/AiStrategyModal').then(mod => mod.AiStrategyModal), { ssr: false });

import { generateSuggestedTeam, AutoBuilderOptions } from '../utils/autoBuilder';

import { Character, Coach, AllocatedCoach } from '../types';
import { calculateTeamBuffs, PlayStyle } from '../utils/buffUtils';
import Link from 'next/link';
import { useAccount } from '../hooks/useAccount';

export default function Home() {
  const { savedPlayers } = useAccount();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<{ id: string, type: 'player' | 'coach' } | null>(null);
  const [team, setTeam] = useState<Record<string, any>>({});
  const [activeSpecialtyBuff, setActiveSpecialtyBuff] = useState<string | null>(null);
  const [isAutoBuilderOpen, setIsAutoBuilderOpen] = useState(false);
  const [selectedCoachDetails, setSelectedCoachDetails] = useState<AllocatedCoach | null>(null);
  const [selectedPlayerDetails, setSelectedPlayerDetails] = useState<{ slotId: string, node: any } | null>(null);

  const teamBuffs = React.useMemo(() => calculateTeamBuffs(team), [team]);

  // Auto-select first available specialty buff if none is selected or current is no longer available
  React.useEffect(() => {
    if (teamBuffs.availableSpecialtyBuffs.length > 0) {
      if (!activeSpecialtyBuff || !teamBuffs.availableSpecialtyBuffs.includes(activeSpecialtyBuff as PlayStyle)) {
        setActiveSpecialtyBuff(teamBuffs.availableSpecialtyBuffs[0]);
      }
    } else {
      setActiveSpecialtyBuff(null);
    }
  }, [teamBuffs.availableSpecialtyBuffs, activeSpecialtyBuff]);

  const handleSlotClick = (slotId: string, type: 'player' | 'coach') => {
    setActiveSlot({ id: slotId, type });
    if (type === 'coach' && team[slotId]) {
      // Se já houver um coach alocado, abre os detalhes
      setSelectedCoachDetails(team[slotId]);
    } else if (type === 'player' && team[slotId]) {
      // Se já houver um jogador alocado, abre os detalhes dele
      setSelectedPlayerDetails({ slotId, node: team[slotId] });
    } else {
      setIsDrawerOpen(true);
    }
  };

  const handleSelectPlayer = (player: any) => {
    if (activeSlot) {
      if (activeSlot.type === 'player') {
        const savedData = savedPlayers[player.id];
        let initialMemory = null;
        
        if (savedData?.memory) {
          const memoryData = require('../data/memories.json').find((m: any) => m.id === savedData.memory?.memoryId);
          if (memoryData) {
            initialMemory = {
              data: memoryData,
              level: savedData.memory.level
            };
          }
        }

        const playerNode = {
          character: player,
          level: savedData ? savedData.level : 80,
          awakening: savedData ? savedData.awakening : 0,
          resonance: savedData?.resonance || 0,
          potentials: savedData?.potentials || {},
          bonusStats: savedData?.bonusStats || {},
          memory: initialMemory
        };
        setTeam((prev) => ({
          ...prev,
          [activeSlot.id]: playerNode,
        }));
      } else {
        setTeam((prev) => ({
          ...prev,
          [activeSlot.id]: player,
        }));
      }
    }
    setIsDrawerOpen(false);
    setActiveSlot(null);
  };

  const handleUpdateCoach = (updatedCoach: AllocatedCoach) => {
    // Find the slot id where this coach is allocated. Usually 'coach'.
    // Since we know the active coach is selectedCoachDetails, we can just update the team with its ID if we know the slot.
    // In our team state, it's keyed by slotId. We'll find it by matching coach.id.
    const slotId = Object.keys(team).find(key => team[key]?.id === updatedCoach.id);
    if (slotId) {
      setTeam(prev => ({ ...prev, [slotId]: updatedCoach }));
      setSelectedCoachDetails(updatedCoach);
    }
  };

  const handleUpdatePlayer = (updatedNode: any) => {
    if (selectedPlayerDetails) {
      setTeam(prev => ({ ...prev, [selectedPlayerDetails.slotId]: updatedNode }));
      setSelectedPlayerDetails({ ...selectedPlayerDetails, node: updatedNode });
    }
  };

  const handleSwapPlayers = (sourceSlot: string, targetSlot: string) => {
    if (sourceSlot === targetSlot) return;

    setTeam((prev) => {
      const newTeam = { ...prev };
      
      const sourcePlayer = newTeam[sourceSlot];
      const targetPlayer = newTeam[targetSlot];

      const isSourceLiberoSlot = sourceSlot === 'back-libero';
      const isTargetLiberoSlot = targetSlot === 'back-libero';
      
      const sourceChar = sourcePlayer?.character || sourcePlayer;
      const targetChar = targetPlayer?.character || targetPlayer;

      // Se tentar mover para o slot de libero, verificar se o jogador é Líbero
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

  const [isGeneratingTeam, setIsGeneratingTeam] = useState(false);
  const [aiStrategy, setAiStrategy] = useState<string | null>(null);
  const [isAiStrategyModalOpen, setIsAiStrategyModalOpen] = useState(false);

  const handleRemovePlayer = (slotId: string) => {
    setTeam((prev) => {
      const newTeam = { ...prev };
      delete newTeam[slotId];
      return newTeam;
    });
  };

  const handleGenerateTeam = async (options: Omit<AutoBuilderOptions, 'savedPlayers' | 'allCharacters'>) => {
    setIsGeneratingTeam(true);
    setAiStrategy(null);
    try {
      const { getCharacters } = await import('../utils/dataFetcher');
      const allCharacters = getCharacters();
      const { getCoaches } = await import('../utils/coachFetcher');
      const allCoaches = getCoaches();

      const res = await fetch('/api/build-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...options,
          savedPlayers: Object.values(savedPlayers),
          allCharacters,
          allCoaches
        })
      });
      const data = await res.json();
      
      if (data.error) {
        alert(data.error);
        return;
      }

      setAiStrategy(data.strategy);
      delete data.strategy; // Remove a strategy do objeto do time para não quebrar a tipagem do setTeam
      
      setTeam(data);
      setIsAutoBuilderOpen(false);
    } catch (e) {
      console.error(e);
      alert('Erro ao contatar a IA para montagem de time.');
    } finally {
      setIsGeneratingTeam(false);
    }
  };

  const handleRotatePlayers = () => {
    setTeam((prev) => {
      // Rotação oficial de vôlei (Sentido horário na quadra: 1->6->5->4->3->2->1)
      const newTeam = { ...prev };
      
      newTeam['front-1'] = prev['back-1'] || null; // 5 -> 4
      newTeam['front-2'] = prev['front-1'] || null; // 4 -> 3
      newTeam['front-3'] = prev['front-2'] || null; // 3 -> 2
      newTeam['back-3'] = prev['front-3'] || null; // 2 -> 1
      newTeam['back-2'] = prev['back-3'] || null; // 1 -> 6
      newTeam['back-1'] = prev['back-2'] || null; // 6 -> 5

      // Limpar as chaves para não ficar undefined
      for (const key of ['front-1', 'front-2', 'front-3', 'back-1', 'back-2', 'back-3']) {
        if (newTeam[key] === undefined) newTeam[key] = null;
      }
      
      return newTeam;
    });
  };

  return (
    <>

        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-start sm:justify-center min-h-0 gap-8">

          <CourtBoard 
            team={team} 
            onSlotClick={handleSlotClick}  
            teamBuffs={teamBuffs}
            activeSpecialtyBuff={activeSpecialtyBuff}
            onSelectSpecialtyBuff={(buff) => setActiveSpecialtyBuff(buff)}
            onSwapPlayers={handleSwapPlayers}
            onRemovePlayer={handleRemovePlayer}
            onSuggestTeam={() => setIsAutoBuilderOpen(true)}
            onRotateTeam={handleRotatePlayers}
            hasAiStrategy={!!aiStrategy}
            onViewStrategy={() => setIsAiStrategyModalOpen(true)}
          />

        </div>

      <PlayerDrawer 
        isOpen={isDrawerOpen} 
        slotType={activeSlot?.type || 'player'}
        activeSlotId={activeSlot?.id}
        team={team}
        onClose={() => setIsDrawerOpen(false)} 
        onSelect={handleSelectPlayer} 
      />

      <AutoBuilderModal
        isOpen={isAutoBuilderOpen}
        isGenerating={isGeneratingTeam}
        onClose={() => setIsAutoBuilderOpen(false)}
        onGenerate={handleGenerateTeam}
      />

      <AiStrategyModal
        isOpen={isAiStrategyModalOpen}
        onClose={() => setIsAiStrategyModalOpen(false)}
        strategy={aiStrategy}
      />

      <CoachDetailsModal 
        isOpen={!!selectedCoachDetails}
        coach={selectedCoachDetails}
        onClose={() => setSelectedCoachDetails(null)}
        onSwap={() => {
          setSelectedCoachDetails(null);
          setIsDrawerOpen(true);
        }}
        onUpdate={handleUpdateCoach}
      />

      <PlayerDetailsModal
        isOpen={!!selectedPlayerDetails}
        playerNode={selectedPlayerDetails?.node || null}
        onClose={() => setSelectedPlayerDetails(null)}
        onSwap={() => {
          if (selectedPlayerDetails) {
            setActiveSlot({ id: selectedPlayerDetails.slotId, type: 'player' });
          }
          setSelectedPlayerDetails(null);
          setIsDrawerOpen(true);
        }}
        onUpdate={handleUpdatePlayer}
      />
    </>
  );
}
