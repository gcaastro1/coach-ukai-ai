import advantagesData from '../data/coachAdvantages.json';
import { PositionalAdvantage } from '../types';

interface AdvantagesDB {
  rare: PositionalAdvantage[];
  epic: PositionalAdvantage[];
  legendary: PositionalAdvantage[];
  mythic: PositionalAdvantage[];
}

export function getAdvantagesByRarity(rarity: 'rare' | 'epic' | 'legendary' | 'mythic'): PositionalAdvantage[] {
  return (advantagesData as AdvantagesDB)[rarity] || [];
}

export function getAdvantageById(id: number | string): PositionalAdvantage | undefined {
  const allAdvantages = [
    ...(advantagesData as AdvantagesDB).rare,
    ...(advantagesData as AdvantagesDB).epic,
    ...(advantagesData as AdvantagesDB).legendary,
    ...(advantagesData as AdvantagesDB).mythic,
  ];
  return allAdvantages.find(adv => adv.id.toString() === id.toString());
}
