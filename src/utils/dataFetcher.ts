import charactersData from '../data/characters.json';
import memoriesData from '../data/memories.json';
import { Character, Memory, RawCharacter, RawMemory } from '../types';

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
