import { describe, it, expect } from 'vitest';
import { generateOptimalTeam } from './teamBuilder';
import { Modelo } from './charService';

describe('teamBuilder - generateOptimalTeam', () => {
  const mockCharacters: Modelo[] = [
    { id: '1', name: 'Shoyo Hinata', position: 'MB', rarity: 'UR', school: 'Karasuno', bonds: [2, 3] },
    { id: '2', name: 'Tobio Kageyama', position: 'S', rarity: 'UR', school: 'Karasuno', specialty: 'Ataque Rápido', bonds: [1, 3] },
    { id: '3', name: 'Kei Tsukishima', position: 'MB', rarity: 'SSR', school: 'Karasuno', bonds: [1, 2] },
    { id: '4', name: 'Daichi Sawamura', position: 'OP', rarity: 'SR', school: 'Karasuno' },
    { id: '5', name: 'Asahi Azumane', position: 'WS', rarity: 'SSR', school: 'Karasuno' },
    { id: '6', name: 'Yu Nishinoya', position: 'Li', rarity: 'UR', school: 'Karasuno', bonds: [4, 5] },
    { id: '7', name: 'Ryunosuke Tanaka', position: 'WS', rarity: 'SR', school: 'Karasuno' },
    { id: '8', name: 'Toru Oikawa', position: 'S', rarity: 'UR', school: 'Aoba Johsai', specialty: 'Poder' },
    { id: '9', name: 'Hajime Iwaizumi', position: 'WS', rarity: 'SSR', school: 'Aoba Johsai', bonds: [8] },
    { id: '10', name: 'Wakatoshi Ushijima', position: 'OP', rarity: 'UR', school: 'Shiratorizawa' },
    { id: '11', name: 'Kenma Kozume', position: 'S', rarity: 'SSR', school: 'Nekoma' },
    { id: '12', name: 'Tetsuro Kuroo', position: 'MB', rarity: 'UR', school: 'Nekoma', bonds: [11] },
    { id: '13', name: 'Kotaro Bokuto', position: 'WS', rarity: 'UR', school: 'Fukurodani' },
    // Duplicate test
    { id: '1a', name: 'Shoyo Hinata (SP)', position: 'MB', rarity: 'SP', school: 'Karasuno', bonds: [2, 3] },
  ];

  it('deve retornar exatamente 6 jogadores', () => {
    const team = generateOptimalTeam(mockCharacters, 'Qualquer');
    expect(team.length).toBe(6);
  });

  it('deve conter exatamente 1 Levantador (S) e no máximo 1 Líbero (Li)', () => {
    const team = generateOptimalTeam(mockCharacters, 'Qualquer');
    const setterCount = team.filter(c => c.position === 'S').length;
    const liberoCount = team.filter(c => c.position === 'Li').length;
    
    expect(setterCount).toBe(1);
    expect(liberoCount).toBeLessThanOrEqual(1);
  });

  it('não deve conter duplicatas do mesmo personagem base', () => {
    const team = generateOptimalTeam(mockCharacters, 'Qualquer');
    
    const hasHinataUR = team.some(c => c.id === '1');
    const hasHinataSP = team.some(c => c.id === '1a');
    
    // Apenas a versão SP (mais forte) deve ser selecionada se ambos estiverem no mock e as vagas permitirem.
    // Mas nunca os dois ao mesmo tempo.
    expect(hasHinataUR && hasHinataSP).toBe(false);
  });

  it('deve priorizar o Setter correto baseado na estratégia', () => {
    // Kageyama (Ataque Rápido) e Oikawa (Poder) têm raridade UR, então a base é igual.
    // O desempate virá do bônus de estratégia.
    
    const teamRapido = generateOptimalTeam(mockCharacters, 'Ataque Rápido');
    const setterRapido = teamRapido.find(c => c.position === 'S');
    expect(setterRapido?.name).toContain('Kageyama');

    const teamPoder = generateOptimalTeam(mockCharacters, 'Poder');
    const setterPoder = teamPoder.find(c => c.position === 'S');
    expect(setterPoder?.name).toContain('Oikawa');
  });
});
