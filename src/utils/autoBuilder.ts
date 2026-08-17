import { Character, PlayerNode, CourtPosition, UserCharacter } from '../types';
import bondsData from '../data/bonds.json';

export interface AutoBuilderOptions {
  targetSpecialty: string;
  specialtyCount: number;
  onlyOwned: boolean;
  targetSchool?: string;
  savedPlayers: UserCharacter[];
  allCharacters: Character[];
}

const RARITY_SCORE: Record<string, number> = {
  'SP': 5000,
  'UR': 3000,
  'SSR': 1500,
  'SR': 800,
  'R': 300,
  'N': 100
};

// Heurística simples de quais posições preferem a rede (front) ou o fundo (back)
const FRONT_ROW_POSITIONS = ['MB', 'S'];
const BACK_ROW_POSITIONS = ['OP', 'WS'];

// Calcula pontuação base de um personagem
function getBaseScore(char: Character, options: AutoBuilderOptions): number {
  let score = RARITY_SCORE[char.rarity] || 0;
  
  if (options.onlyOwned) {
    const saved = options.savedPlayers.find(p => p.characterId === char.id);
    if (saved) {
      score += (saved.level * 10);
      score += ((saved.resonance || 0) * 50);
    }
  } else {
    // Se estiver usando todos do BD, simula que estão nível maximo
    score += (80 * 10);
  }

  return score;
}

export function generateSuggestedTeam(options: AutoBuilderOptions): Record<string, PlayerNode | null> {
  // 1. Filtrar o pool de jogadores disponíveis
  let pool = options.allCharacters;
  if (options.onlyOwned) {
    const savedIds = new Set(options.savedPlayers.map(p => p.characterId));
    pool = pool.filter(c => savedIds.has(c.id));
  }

  // 2. Separar líberos do resto
  const liberos = pool.filter(c => c.position === 'Li');
  const fieldPlayers = pool.filter(c => c.position !== 'Li');

  // Calcular score de todos no pool
  const scoredPlayers = fieldPlayers.map(char => ({
    char,
    score: getBaseScore(char, options)
  })).sort((a, b) => b.score - a.score);

  const scoredLiberos = liberos.map(char => ({
    char,
    score: getBaseScore(char, options)
  })).sort((a, b) => b.score - a.score);

  // 3. Escolher o melhor Líbero
  let bestLibero = scoredLiberos.length > 0 ? scoredLiberos[0].char : null;

  // 4. Escolher os 6 melhores jogadores de linha
  // Vamos usar um método guloso (greedy) que tenta maximizar as sinergias
  let selectedLineup: Character[] = [];
  
  // Pegamos os X melhores que já fecham a meta de especialidade
  const specialtyMatches = scoredPlayers.filter(p => 
    p.char.specialty?.toLowerCase().includes(options.targetSpecialty.toLowerCase())
  );
  
  let countAdded = 0;
  for (const p of specialtyMatches) {
    if (countAdded >= options.specialtyCount) break;
    if (!selectedLineup.find(x => x.name.split(' (')[0] === p.char.name.split(' (')[0])) {
      selectedLineup.push(p.char);
      countAdded++;
    }
  }

  // Preencher o restante focado nos bonds
  while (selectedLineup.length < 6) {
    let bestCandidate: Character | null = null;
    let bestCandidateScore = -1;

    for (const p of scoredPlayers) {
      // Ignorar duplicatas de nome base
      if (selectedLineup.find(x => x.name.split(' (')[0] === p.char.name.split(' (')[0])) continue;
      
      let currentScore = p.score;
      
      // Avaliar vínculos
      if (p.char.bonds) {
        p.char.bonds.forEach(bondId => {
          const bondDef = bondsData.find((b: any) => b.id === bondId);
          if (bondDef && bondDef.character_ids) {
            try {
              const requiredIds = JSON.parse(bondDef.character_ids) as number[];
              // Quantos do vinculo já estão no time?
              const overlap = requiredIds.filter(id => 
                selectedLineup.find(s => s.id === id) || (bestLibero && bestLibero.id === id)
              ).length;
              if (overlap > 0) {
                // Ganha mais score por ativar sinergia
                currentScore += (overlap * 1000);
              }
            } catch(e){}
          }
        });
      }

      if (currentScore > bestCandidateScore) {
        bestCandidateScore = currentScore;
        bestCandidate = p.char;
      }
    }

    if (bestCandidate) {
      selectedLineup.push(bestCandidate);
    } else {
      break; // Não tem mais jogadores no pool
    }
  }

  // 5. Posicionar jogadores (Front vs Back)
  // Front: prefere MB, S, Block, Quick
  // Back: prefere OP, WS, Receive, Dig
  
  // Pontuar afinidade de Front
  const lineupWithAffinity = selectedLineup.map(char => {
    let frontAffinity = 0;
    if (FRONT_ROW_POSITIONS.includes(char.position)) frontAffinity += 10;
    if (BACK_ROW_POSITIONS.includes(char.position)) frontAffinity -= 10;
    
    const spec = (char.specialty || '').toLowerCase();
    if (spec.includes('bloqueio') || spec.includes('rápido') || spec.includes('passe')) frontAffinity += 5;
    if (spec.includes('recepção') || spec.includes('defesa') || spec.includes('saque')) frontAffinity -= 5;
    
    const score = scoredPlayers.find(p => p.char.id === char.id)?.score || 0;

    return { char, frontAffinity, score, isServer: spec.includes('saque') };
  });

  // Identificar o melhor sacador
  let bestServer = null;
  const servers = lineupWithAffinity.filter(x => x.isServer).sort((a, b) => b.score - a.score);
  if (servers.length > 0) {
    bestServer = servers[0].char;
  } else {
    // Fallback: seleciona o de maior score geral
    bestServer = [...lineupWithAffinity].sort((a, b) => b.score - a.score)[0].char;
  }

  // Remove o bestServer dos restantes
  const remaining = lineupWithAffinity.filter(x => x.char.id !== bestServer!.id);
  
  // Ordena os restantes por frontAffinity
  remaining.sort((a, b) => b.frontAffinity - a.frontAffinity);

  // front-1 será o bestServer, front-2 e front-3 serão os 2 de maior frontAffinity
  const front = [bestServer!, ...remaining.slice(0, 2).map(x => x.char)];
  const back = remaining.slice(2, 5).map(x => x.char);

  const createNode = (char: Character | null): PlayerNode | null => {
    if (!char) return null;
    let level = 80;
    let resonance = 0;
    let potentials = {};
    if (options.onlyOwned) {
      const saved = options.savedPlayers.find(p => p.characterId === char.id);
      if (saved) {
        level = saved.level;
        resonance = saved.resonance || 0;
        if (saved.potentials) potentials = saved.potentials;
      }
    }
    return {
      character: char,
      level,
      awakening: 0,
      resonance,
      potentials,
      memory: null
    };
  };

  return {
    'front-1': createNode(front[0] || null),
    'front-2': createNode(front[1] || null),
    'front-3': createNode(front[2] || null),
    'back-1': createNode(back[0] || null),
    'back-2': createNode(back[1] || null),
    'back-3': createNode(back[2] || null),
    'back-libero': createNode(bestLibero),
    'coach': null, // Por enquanto não sugerimos Coach automaticamente
    'bench-1': null,
    'bench-2': null,
    'bench-3': null,
    'bench-4': null,
    'bench-5': null,
    'bench-6': null,
  };
}
