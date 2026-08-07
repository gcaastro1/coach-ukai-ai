import { PlayerNode } from '../types';

export interface ScoreResult {
  score: number;
  valid: boolean;
  errors: string[];
}

const getBaseName = (name: string) => name.split(' (')[0].trim();

// 1. Base Layer
const calculateBaseStats = (player: PlayerNode): number => {
  let rarityMultiplier = 1.0;
  switch (player.character.rarity) {
    case 'N': rarityMultiplier = 1.0; break;
    case 'R': rarityMultiplier = 1.2; break;
    case 'SR': rarityMultiplier = 1.5; break;
    case 'SSR': rarityMultiplier = 2.0; break;
    case 'UR': rarityMultiplier = 2.5; break;
    case 'SP': rarityMultiplier = 3.0; break;
  }
  // Formula base simulada (status bruto baseado no nivel)
  return player.level * 100 * rarityMultiplier;
};

// 2. Memory Layer
const calculateMemoryBonus = (player: PlayerNode): number => {
  if (!player.memory) return 0;
  
  const { data, level } = player.memory;
  // Arrays escalonados são 1-indexed em relação ao nível (nível 1 = index 0)
  const index = Math.max(0, level - 1);
  
  let totalBonus = 0;
  data.parameters.forEach(paramStr => {
    const values = paramStr.split('/');
    // Se o array de parameters for menor que o level máximo, usa o último disponível
    const valueStr = values[Math.min(index, values.length - 1)];
    const num = parseFloat(valueStr);
    if (!isNaN(num)) {
      totalBonus += num;
    }
  });
  
  return totalBonus;
};

export function Modelo(team: PlayerNode[]): ScoreResult {
  const errors: string[] = [];
  
  // -- Regras de Validação de Time (Escalação) --
  if (team.length !== 6) {
    errors.push(`O time titular precisa ter exatamente 6 personagens escalados (atual: ${team.length}).`);
  }
  
  let setterCount = 0;
  let liberoCount = 0;
  const baseNames = new Set<string>();
  
  for (const player of team) {
    if (player.character.position === 'S') setterCount++;
    if (player.character.position === 'Li') liberoCount++;
    
    const baseName = getBaseName(player.character.name);
    if (baseNames.has(baseName)) {
      errors.push(`Não é permitido escalar duas versões do mesmo personagem: ${baseName}.`);
    }
    baseNames.add(baseName);
  }
  
  if (setterCount < 1) {
    errors.push('É obrigatório ter pelo menos 1 jogador na posição S (Levantador).');
  }
  
  if (liberoCount > 1) {
    errors.push('É permitido no máximo 1 jogador na posição Li (Líbero).');
  }
  
  if (errors.length > 0) {
    return { score: 0, valid: false, errors };
  }
  
  let totalScore = 0;
  const teamIds = new Set(team.map(p => p.character.id));
  
  for (const player of team) {
    // 1. Base Layer
    const baseStat = calculateBaseStats(player);
    
    // 2. Memory Layer
    // Aplica o buff (tratado aqui de forma abstrata como um boost percentual/fixo somado ao status)
    const memoryBonusAmount = calculateMemoryBonus(player);
    let playerStat = baseStat + (baseStat * (memoryBonusAmount / 100)); // Boost percentual simples
    
    // 3. Bonds Layer (Sinergia)
    if (player.character.bonds) {
      let activeBonds = 0;
      for (const bondId of player.character.bonds) {
        if (teamIds.has(bondId)) {
          activeBonds++;
        }
      }
      
      if (activeBonds > 0) {
        // Multiplicador depende do nível de Awakening do personagem que gerou o vínculo
        const bondMultiplier = 1 + (activeBonds * (0.05 + (player.awakening * 0.02))); 
        playerStat *= bondMultiplier;
      }
    }
    
    // 4. Output parcial
    totalScore += playerStat;
  }
  
  return {
    score: Math.round(totalScore),
    valid: true,
    errors: []
  };
}
