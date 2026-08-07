import coachesData from '../data/coaches.json';
import { Coach } from '../types';

export function getCoaches(): Coach[] {
  return coachesData as Coach[];
}

export function getCoachById(id: string | number): Coach | undefined {
  return (coachesData as Coach[]).find(c => c.id === id);
}
