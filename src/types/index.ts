export type CourtPosition = 'S' | 'WS' | 'MB' | 'OP' | 'Li';
export type Rarity = 'N' | 'R' | 'SR' | 'SSR' | 'UR' | 'SP';

export interface Character {
  id: number;
  name: string;
  position: CourtPosition;
  rarity: Rarity;
  school: string;
  specialty: string;
  bonds: number[] | null;
}

export interface Memory {
  id: number;
  name: string;
  position: CourtPosition;
  rarity: Rarity;
  parameters: string[];
}

export interface Bond {
  id: number;
  character_ids: number[];
  parameters: string[];
  name: string;
  description: string;
}

export interface RawCharacter extends Omit<Character, 'bonds'> {
  bonds: string | null;
}

export interface RawMemory extends Omit<Memory, 'parameters'> {
  parameters: string;
}

export interface RawBond extends Omit<Bond, 'character_ids' | 'parameters'> {
  character_ids: string;
  parameters: string;
}

export interface UserMemory {
  memoryId: number;
  level: number;
}

export interface UserCharacter {
  characterId: number;
  level: number;
  awakening: number;
  memory: UserMemory | null;
}

export interface PlayerNode {
  character: Character;
  level: number;
  awakening: number;
  memory: {
    data: Memory;
    level: number;
  } | null;
}

export interface CoachStats {
  set: number;
  serve: number;
  receive: number;
  block: number;
  save: number;
  quickAtk: number;
  powerAtk: number;
}

export interface CoachLevelBonus {
  level: number;
  description: string;
}

export interface Coach {
  id: number;
  name: string;
  school: string;
  expertGuidance: string;
  baseStats: CoachStats;
  levelBonuses: CoachLevelBonus[];
}
