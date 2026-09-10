'use server';

import { getAllCharacters, Modelo } from '../utils/charService';
import { generateOptimalTeam } from '../utils/teamBuilder';

/**
 * Server Action para gerar o time ótimo com base na lógica local.
 */
export async function suggestOptimalTeam(strategy: string): Promise<Modelo[]> {
  try {
    const characters = await getAllCharacters();
    const optimalTeam = generateOptimalTeam(characters, strategy);
    return optimalTeam;
  } catch (error) {
    console.error("Erro ao gerar time ótimo via Server Action:", error);
    throw new Error("Não foi possível gerar o time ideal.");
  }
}
