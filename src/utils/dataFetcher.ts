import charactersData from '../data/characters.json';
import memoriesData from '../data/memories.json';
import bondsData from '../data/bonds.json';
import { Character, Memory, RawCharacter, RawMemory, Bond, RawBond } from '../types';
export const getCharacters = (): Character[] => {
  const raw: RawCharacter[] = charactersData as RawCharacter[];
  return raw.map((char) => ({
    ...char,
    bonds: char.bonds ? JSON.parse(char.bonds) : null,
  }));
};

export const getMemories = (): Memory[] => {
  const raw: RawMemory[] = memoriesData as RawMemory[];
  return raw.map((mem) => ({
    ...mem,
    parameters: JSON.parse(mem.parameters),
  }));
};

export const getCharacterById = (id: number): Character | undefined => {
  return getCharacters().find((c) => c.id === id);
};

export const getMemoryById = (id: number): Memory | undefined => {
  return getMemories().find((m) => m.id === id);
};

export const getBonds = (): Bond[] => {
  const raw: RawBond[] = bondsData as RawBond[];
  return raw.map((bond) => ({
    ...bond,
    character_ids: JSON.parse(bond.character_ids),
    parameters: JSON.parse(bond.parameters),
  }));
};

export const getBondById = (id: number): Bond | undefined => {
  return getBonds().find((b) => b.id === id);
};
