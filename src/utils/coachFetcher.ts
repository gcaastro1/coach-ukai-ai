import coachesData from '../data/coaches.json';
import { Coach } from '../types';

export function getCoaches(): Coach[] {
  return coachesData as Coach[];
}

export function getCoachById(id: number): Coach | undefined {
  return (coachesData as Coach[]).find(c => c.id === id);
}
