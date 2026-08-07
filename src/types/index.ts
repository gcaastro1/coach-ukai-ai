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

export interface RawCharacter extends Omit<Character, 'bonds'> {
  bonds: string | null;
}

export interface RawMemory extends Omit<Memory, 'parameters'> {
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
