import { expect, test, describe } from 'vitest';
import { Modelo } from './scoring';
import { PlayerNode, Character, Memory } from '../types';

describe('Modelo - Engine de Scoring', () => {
  const createMockCharacter = (id: number, name: string, position: Character['position']): Character => ({
    id,
    name,
    position,
    rarity: 'SSR',
    school: 'Karasuno',
    specialty: 'Power',
    bonds: null,
  });

  const mockMemory: Memory = {
    id: 1,
    name: 'Test Memory',
    position: 'WS',
    rarity: 'SSR',
    parameters: ['10/10/10/10/10'],
  };

  const createMockPlayer = (charId: number, name: string, position: Character['position'], level = 10, awakening = 0): PlayerNode => ({
    character: createMockCharacter(charId, name, position),
    level,
    awakening,
    memory: { data: mockMemory, level: 1 },
  });

  test('Deve disparar um erro se receber um time sem nenhum jogador na posição S', () => {
    const team: PlayerNode[] = [
      createMockPlayer(1, 'Hinata', 'MB'),
      createMockPlayer(2, 'Tsukishima', 'MB'),
      createMockPlayer(3, 'Asahi', 'WS'),
      createMockPlayer(4, 'Tanaka', 'WS'),
      createMockPlayer(5, 'Daichi', 'OP'),
      createMockPlayer(6, 'Nishinoya', 'Li'),
    ];
    
    expect(() => Modelo(team)).toThrowError(/É obrigatório ter pelo menos 1 jogador na posição S/);
  });

  test('Deve disparar um erro se receber um time com mais de 1 jogador na posição Li', () => {
    const team: PlayerNode[] = [
      createMockPlayer(1, 'Kageyama', 'S'),
      createMockPlayer(2, 'Tsukishima', 'MB'),
      createMockPlayer(3, 'Asahi', 'WS'),
      createMockPlayer(4, 'Tanaka', 'WS'),
      createMockPlayer(5, 'Nishinoya', 'Li'),
      createMockPlayer(6, 'Yaku', 'Li'),
    ];
    
    expect(() => Modelo(team)).toThrowError(/É permitido no máximo 1 jogador na posição Li/);
  });

  test('Deve disparar um erro se receber dois personagens com o mesmo nome base', () => {
    const team: PlayerNode[] = [
      createMockPlayer(1, 'Kageyama', 'S'),
      createMockPlayer(2, 'Shoyo Hinata', 'MB'),
      createMockPlayer(3, 'Shoyo Hinata (Treino)', 'WS'),
      createMockPlayer(4, 'Tanaka', 'WS'),
      createMockPlayer(5, 'Daichi', 'OP'),
      createMockPlayer(6, 'Nishinoya', 'Li'),
    ];
    
    expect(() => Modelo(team)).toThrowError(/Não é permitido escalar duas versões do mesmo personagem: Shoyo Hinata/);
  });

  test('Deve retornar o Score final correto para um time válido', () => {
    const team: PlayerNode[] = [
      createMockPlayer(1109, 'Kageyama', 'S', 10, 2), // 1109 é TOBIO KAGEYAMA
      createMockPlayer(1110, 'Hinata', 'MB', 10, 0),  // 1110 é SHOYO HINATA
      createMockPlayer(3, 'Asahi', 'WS', 10, 0),
      createMockPlayer(4, 'Tanaka', 'WS', 10, 0),
      createMockPlayer(5, 'Daichi', 'OP', 10, 0),
      createMockPlayer(6, 'Nishinoya', 'Li', 10, 0),
    ];
    
    // Teste de bond: Kageyama (1109) possui o bond 1001 (Rápido de Maluco) 
    // que exige os IDs 1110 e 1109 em quadra
    team[0].character.bonds = [1001];

    // Cálculo:
    // Base SSR Lvl 10 = 10 * 100 * 2.0 = 2000
    // Memory Lvl 1 (+10%) = 2000 + 200 = 2200 (para cada player)
    // Bond do Kageyama (Awakening 2, Active 1) = 1 + (1 * (0.05 + 2 * 0.02)) = 1.09
    // Score Kageyama = 2200 * 1.09 = 2398
    // Total = 2398 + (5 * 2200) = 13398
    
    const score = Modelo(team);
    expect(score).toBe(13398);
  });
});
