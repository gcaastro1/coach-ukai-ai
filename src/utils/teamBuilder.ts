import { Modelo } from './charService';

// Mapa de pesos por raridade
const RARITY_WEIGHT: Record<string, number> = {
  'SP': 6,
  'UR': 5,
  'SSR': 4,
  'SR': 3,
  'R': 2,
  'N': 1,
};

function getBaseName(name?: string): string {
  if (!name) return '';
  return name.split(' (')[0].trim();
}

function getRarityScore(char: Modelo): number {
  const rarity = char.rarity as string;
  return (RARITY_WEIGHT[rarity] || 1) * 100;
}

function calculateBaseScore(char: Modelo, strategy: string): number {
  let score = getRarityScore(char);
  
  // Bônus estratégico para o Levantador
  if (char.position === 'S' && char.specialty) {
    const stratLower = strategy.toLowerCase();
    const specLower = (char.specialty as string).toLowerCase();
    
    // Se a especialidade bater com a estratégia (ex: "Ataque Rápido" vs "ataque rápido")
    if (stratLower.includes(specLower) || specLower.includes(stratLower)) {
      score += 2000; // Forte peso para o setter certo garantir o lugar
    }
  }
  
  return score;
}

function calculateTeamScore(team: Modelo[], strategy: string): number {
  let totalScore = 0;
  const teamIds = new Set(team.map(c => c.id));
  const schoolsCount: Record<string, number> = {};

  // Calcula scores base
  for (const char of team) {
    let charScore = calculateBaseScore(char, strategy);
    
    // Sinergia de Escola
    if (char.school) {
      schoolsCount[char.school] = (schoolsCount[char.school] || 0) + 1;
    }

    // Sinergia de Bonds (IDs)
    if (Array.isArray(char.bonds)) {
      let activeBonds = 0;
      for (const bondId of char.bonds) {
        if (teamIds.has(String(bondId))) {
          activeBonds++;
        }
      }
      if (activeBonds > 0) {
        charScore += charScore * (0.10 * activeBonds); // +10% por bond ativo
      }
    }

    totalScore += charScore;
  }

  // Aplica bônus de escola (se muitos jogadores da mesma escola)
  for (const school in schoolsCount) {
    const count = schoolsCount[school];
    if (count >= 2) {
      totalScore += count * 50; // +50 pontos por cada membro da mesma escola além do primeiro
    }
  }

  return totalScore;
}

function getCombinations<T>(array: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (array.length === 0) return [];
  
  const [first, ...rest] = array;
  const withFirst = getCombinations(rest, k - 1).map(combo => [first, ...combo]);
  const withoutFirst = getCombinations(rest, k);
  
  return [...withFirst, ...withoutFirst];
}

/**
 * Calcula a melhor composição de 6 jogadores com base nas regras táticas e mecânicas do jogo.
 */
export function generateOptimalTeam(availableCharacters: Modelo[], strategy: string): Modelo[] {
  // 1. Filtro de duplicatas (mesmo nome base)
  // Se houver múltiplas versões do mesmo personagem, pega a de maior Score Base
  const uniqueCharsMap = new Map<string, Modelo>();
  
  for (const char of availableCharacters) {
    const baseName = getBaseName(char.name || char.id);
    const currentScore = calculateBaseScore(char, strategy);
    
    if (uniqueCharsMap.has(baseName)) {
      const existing = uniqueCharsMap.get(baseName)!;
      if (currentScore > calculateBaseScore(existing, strategy)) {
        uniqueCharsMap.set(baseName, char);
      }
    } else {
      uniqueCharsMap.set(baseName, char);
    }
  }

  const validPool = Array.from(uniqueCharsMap.values());

  // 2. Separa por posições
  const setters = validPool.filter(c => c.position === 'S').sort((a, b) => calculateBaseScore(b, strategy) - calculateBaseScore(a, strategy));
  const liberos = validPool.filter(c => c.position === 'Li').sort((a, b) => calculateBaseScore(b, strategy) - calculateBaseScore(a, strategy));
  const attackers = validPool.filter(c => ['WS', 'MB', 'OP'].includes(c.position as string)).sort((a, b) => calculateBaseScore(b, strategy) - calculateBaseScore(a, strategy));

  // Otimização: Pegar apenas os X melhores de cada pra evitar explosão combinatória
  const topSetters = setters.slice(0, 3);
  const topLiberos = liberos.slice(0, 2);
  const topAttackers = attackers.slice(0, 12);

  let bestTeam: Modelo[] = [];
  let bestScore = -1;

  // 3. Gerar combinações possíveis
  // Caso A: Com 1 Líbero
  // Precisamos de 1 S, 1 Li, e 4 Attackers
  if (topSetters.length >= 1 && topLiberos.length >= 1 && topAttackers.length >= 4) {
    const attackerCombos = getCombinations(topAttackers, 4);
    for (const s of topSetters) {
      for (const li of topLiberos) {
        for (const atkCombo of attackerCombos) {
          const team = [s, li, ...atkCombo];
          const score = calculateTeamScore(team, strategy);
          if (score > bestScore) {
            bestScore = score;
            bestTeam = team;
          }
        }
      }
    }
  }

  // Caso B: Sem Líbero
  // Precisamos de 1 S, 0 Li, e 5 Attackers
  if (topSetters.length >= 1 && topAttackers.length >= 5) {
    const attackerCombos = getCombinations(topAttackers, 5);
    for (const s of topSetters) {
      for (const atkCombo of attackerCombos) {
        const team = [s, ...atkCombo];
        const score = calculateTeamScore(team, strategy);
        if (score > bestScore) {
          bestScore = score;
          bestTeam = team;
        }
      }
    }
  }

  // Se por algum motivo o pool for muito pequeno (menos de 6 jogadores totais válidos)
  if (bestTeam.length === 0) {
    // Retorna um fallback apenas preenchendo as vagas possíveis até dar 6
    const allSorted = validPool.sort((a, b) => calculateBaseScore(b, strategy) - calculateBaseScore(a, strategy));
    return allSorted.slice(0, 6);
  }

  return bestTeam;
}
