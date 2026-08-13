import { Character } from '../types';
import bondsData from '../data/bonds.json';

export type PlayStyle = 'Quick' | 'Block' | 'Power' | 'Receive';

export interface SchoolBuff {
  school: string;
  requiredCount: number;
  effect: string;
}

export interface SpecialtyBuff {
  specialty: PlayStyle;
  requiredCount: number;
  effect: string;
}

export const SCHOOL_BUFFS: SchoolBuff[] = [
  { school: 'Aoba Johsai', requiredCount: 4, effect: 'Aumenta em 15% o atributo Ataque Potente de todos os jogadores presentes' },
  { school: 'Karasuno', requiredCount: 4, effect: 'Aumenta em 10% os atributos Ataque Potente e Ataque Rápido de todos os jogadores presentes' },
  { school: 'Nekoma', requiredCount: 4, effect: 'Aumenta em 15% o atributo Recepção de todos os jogadores presentes' },
  { school: 'Date Kogyo', requiredCount: 4, effect: 'Aumenta em 15% o atributo Bloqueio de todos os jogadores presentes' },
  { school: 'Shiratorizawa', requiredCount: 4, effect: 'Aumenta em 10% os atributos Percepção e Força de todos os jogadores presentes' },
  { school: 'Fukurodani', requiredCount: 4, effect: 'O Moral do Time aumenta em 20 no início da partida' },
  { school: 'Johzenji', requiredCount: 4, effect: 'Todos os jogadores do seu lado ganham 2 acúmulos de "Joga Forte". Cada acúmulo aumenta os atributos' },
  { school: 'Inarizaki', requiredCount: 4, effect: 'Aumenta a Técnica de Ataque e a Técnica de Defesa de todos os jogadores na quadra em 5%' },
];

export const SPECIALTY_BUFFS: SpecialtyBuff[] = [
  { specialty: 'Power', requiredCount: 4, effect: 'Oposto à Recepção: O poder de ação dos seus jogadores aumenta em 15%/20%/25%' },
  { specialty: 'Quick', requiredCount: 4, effect: 'Oposto ao Bloqueio: O poder de ação dos seus jogadores aumenta em 15%/20%/25%' },
  { specialty: 'Block', requiredCount: 4, effect: 'Oposto ao Ataque Potente: O poder de ação dos seus jogadores aumenta em 15%/20%/25%' },
  { specialty: 'Receive', requiredCount: 5, effect: 'Oposto ao Ataque Rápido: O poder de ação dos seus jogadores aumenta em 15%/20%/25%' },
];

const COURT_SLOTS = ['front-1', 'front-2', 'front-3', 'back-1', 'back-2', 'back-3', 'back-libero'];

export function calculateTeamBuffs(team: Record<string, any>) {
  const schoolCounts: Record<string, number> = {};
  const specialtyCounts: Record<string, number> = {
    Quick: 0,
    Block: 0,
    Power: 0,
    Receive: 0
  };

  // Only count characters present in the active court slots
  COURT_SLOTS.forEach(slot => {
    const node = team[slot];
    const character = node?.character || node; // Handle both full Node or just Character object

    if (character && character.school) {
      schoolCounts[character.school] = (schoolCounts[character.school] || 0) + 1;
    }

    if (character && character.specialty) {
      const charSpecialties = character.specialty.split(', ').map((s: string) => s.trim());
      charSpecialties.forEach((spec: string) => {
        if (specialtyCounts[spec] !== undefined) {
          specialtyCounts[spec] += 1;
        }
      });
    }
  });

  const activeSchoolBuffs = SCHOOL_BUFFS.filter(buff => (schoolCounts[buff.school] || 0) >= buff.requiredCount);
  const availableSpecialtyBuffs = SPECIALTY_BUFFS.filter(buff => specialtyCounts[buff.specialty] >= buff.requiredCount).map(b => b.specialty);

  const activePlayerBonds: any[] = [];
  const playersInCourt = COURT_SLOTS.map(slot => team[slot]?.character || team[slot]).filter(Boolean);

  bondsData.forEach((bond: any) => {
    try {
      if (!bond.character_ids) return;
      const requiredIds = JSON.parse(bond.character_ids) as number[];
      const activatingPlayers = requiredIds.map(id => playersInCourt.find((p: any) => p.id === id));
      if (activatingPlayers.every(p => p !== undefined)) {
        activePlayerBonds.push(bond);
      }
    } catch(e) {}
  });

  return {
    schoolCounts,
    specialtyCounts,
    activeSchoolBuffs,
    availableSpecialtyBuffs,
    activePlayerBonds,
  };
}
