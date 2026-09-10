import { Character, PlayerNode, CourtPosition, UserCharacter, Coach } from '../types';
import bondsData from '../data/bonds.json';

export interface AutoBuilderOptions {
  targetSpecialty: string;
  specialtyCount: number;
  onlyOwned: boolean;
  targetSchool?: string;
  savedPlayers: UserCharacter[];
  allCharacters: Character[];
  allCoaches?: Coach[];
  gameMode?: 'pvp' | 'club_contest';
}

import buffsMapData from '../data/buffsMap.json';

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
  
  // 1. Calcular bônus base de buffs semânticos
  const buffsInfo = (buffsMapData as any)[char.id.toString()];
  
  const evaluateBuffs = (buffDict: Record<string, number>, multiplier: number) => {
    if (!buffDict) return 0;
    let extra = 0;
    for (const [buffType, val] of Object.entries(buffDict)) {
      // Buff de Stamina é sempre valioso (principalmente no Club Contest)
      if (buffType === 'stamina') extra += val * 5 * multiplier;
      
      // Se o buff bate com o targetSpecialty requisitado
      if (options.targetSpecialty) {
        const specMap: Record<string, string> = {
          'power': 'Potente',
          'quick': 'Rápido',
          'block': 'Bloqueio',
          'receive': 'Recepção',
          'serve': 'Saque'
        };
        if (specMap[buffType] === options.targetSpecialty) {
          extra += val * 10 * multiplier;
        }
      }
    }
    return extra;
  };

  if (buffsInfo) {
    // Buffs base e buffs de vínculo valem pontuação padrão
    score += evaluateBuffs(buffsInfo.base_buffs, 1.0);
    score += evaluateBuffs(buffsInfo.bond_buffs, 0.5); // Vínculos valem menos pois dependem de parceiros
  }

  if (options.onlyOwned) {
    const saved = options.savedPlayers.find(p => p.characterId === char.id);
    if (saved) {
      score += (saved.level * 10);
      score += ((saved.resonance || 0) * 50);
      
      // Se o usuário tem ressonância, e a ressonância dá buffs, avaliar!
      if (buffsInfo && saved.resonance && saved.resonance >= 2) {
        // Simplificação: se ressonância >= 2, consideramos que ativou os buffs
        // O ideal seria verificar o nível exato da ressonância, mas pegamos o genérico
        score += evaluateBuffs(buffsInfo.resonance_buffs, 1.0);
      }
    }
  } else {
    // Se estiver usando todos do BD, simula que estão nível maximo e com as ressonâncias
    score += (80 * 10);
    if (buffsInfo) {
      score += evaluateBuffs(buffsInfo.resonance_buffs, 1.0);
    }
  }

  return score;
}

export function generateSuggestedTeam(options: AutoBuilderOptions): any {
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
  // Vamos usar um método que tenta maximizar as sinergias e respeitar os limites de posições reais do vôlei
  const selectedLineup: Character[] = [];
  const requiredPositions = ['S', 'MB', 'MB', 'WS', 'WS', 'OP'];
  let countAddedSpecialty = 0;

  for (const reqPos of requiredPositions) {
    let bestCandidate: Character | null = null;
    let bestCandidateScore = -1;

    for (const p of scoredPlayers) {
      // Ignorar se já estiver no time (mesmo nome base)
      if (selectedLineup.find(x => x.name.split(' (')[0] === p.char.name.split(' (')[0])) continue;
      
      // O jogador deve bater com a posição desejada
      if (p.char.position !== reqPos) {
        // Fallback: se pedir OP e não tiver, aceita WS.
        if (!(reqPos === 'OP' && p.char.position === 'WS')) {
          continue;
        }
      }

      let currentScore = p.score;
      
      const hasSpecialty = p.char.specialty?.toLowerCase().includes(options.targetSpecialty.toLowerCase());
      
      // Bônus gigantesco se tiver a especialidade desejada e ainda precisarmos dela
      if (countAddedSpecialty < options.specialtyCount && hasSpecialty) {
        currentScore += 100000;
      }
      
      // Avaliar vínculos
      if (p.char.bonds) {
        p.char.bonds.forEach(bondId => {
          const bondDef = bondsData.find((b: any) => b.id === bondId);
          if (bondDef && bondDef.character_ids) {
            try {
              const requiredIds = JSON.parse(bondDef.character_ids) as number[];
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
      if (bestCandidate.specialty?.toLowerCase().includes(options.targetSpecialty.toLowerCase())) {
        countAddedSpecialty++;
      }
    }
  }

  // Fallback: Se não conseguiu preencher 6 por falta de posições específicas, preenche com os melhores restantes
  if (selectedLineup.length < 6) {
    for (const p of scoredPlayers) {
      if (selectedLineup.length >= 6) break;
      if (selectedLineup.find(x => x.name.split(' (')[0] === p.char.name.split(' (')[0])) continue;
      selectedLineup.push(p.char);
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
  
  // Ordena os restantes por frontAffinity (maior para menor)
  remaining.sort((a, b) => {
    // Dá um bônus para Levantadores (S) ficarem na frente se não forem sacadores (Setter Dump)
    let aAffinity = a.frontAffinity;
    let bAffinity = b.frontAffinity;
    if (a.char.position === 'S' && !a.isServer) aAffinity += 15;
    if (b.char.position === 'S' && !b.isServer) bAffinity += 15;
    
    return bAffinity - aAffinity;
  });

  // front-1, front-2 e front-3 serão os 3 de maior afinidade para a rede (MBs, etc)
  const front = remaining.slice(0, 3).map(x => x.char);
  
  // back-1 será o bestServer (posição de saque), back-2 e back-3 os restantes de menor afinidade
  const back = [bestServer!, ...remaining.slice(3, 5).map(x => x.char)];

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

  // 6. Escolher o melhor Treinador (Coach)
  let bestCoach: Coach | null = null;
  if (options.allCoaches && options.allCoaches.length > 0) {
    // Tenta encontrar um coach que combine com a targetSchool
    if (options.targetSchool && options.targetSchool !== 'none') {
      bestCoach = options.allCoaches.find(c => c.school === options.targetSchool) || null;
    }
    // Fallback para o primeiro coach se não encontrou um específico
    if (!bestCoach) {
      bestCoach = options.allCoaches[0];
    }
  }

  // 7. Gerar texto descritivo da estratégia
  const schoolCountMap: Record<string, number> = {};
  selectedLineup.forEach(c => {
    if (c.school) {
      schoolCountMap[c.school] = (schoolCountMap[c.school] || 0) + 1;
    }
  });
  const dominantSchool = Object.entries(schoolCountMap).sort((a, b) => b[1] - a[1])[0];

  const strategyText = `Esta equipe foi otimizada matematicamente pelo algoritmo local focando na especialidade "${options.targetSpecialty}". ` +
    (dominantSchool && dominantSchool[1] >= 2 ? `A escola predominante é ${dominantSchool[0]} com ${dominantSchool[1]} personagens no time titular. ` : '') +
    (bestCoach ? `O treinador sugerido é ${bestCoach.name}, que traz benefícios adicionais à composição.` : '');

  return {
    'front-1': createNode(front[0] || null),
    'front-2': createNode(front[1] || null),
    'front-3': createNode(front[2] || null),
    'back-1': createNode(back[0] || null),
    'back-2': createNode(back[1] || null),
    'back-3': createNode(back[2] || null),
    'back-libero': createNode(bestLibero),
    'coach': bestCoach,
    'bench-1': null,
    'bench-2': null,
    'bench-3': null,
    'bench-4': null,
    'bench-5': null,
    'bench-6': null,
    strategy: strategyText
  };
}

// Lógica de Vantagem Tática para o Arena Simulator
const TACTICAL_COUNTERS: Record<string, string[]> = {
  'Quick': ['Receive'],
  'Power': ['Block'],
  'Block': ['Quick'],
  'Receive': ['Power'],
  'Serve': ['Receive']
};

export function analyzeEnemyTeam(enemyTeam: Record<string, any>) {
  const counts: Record<string, number> = {};
  
  // Analisar especialidades dos inimigos escalados
  Object.values(enemyTeam).forEach(node => {
    if (!node) return;
    const char = node.character || node;
    if (char.specialty) {
      const spec = char.specialty as string;
      if (spec.includes('Rápido')) counts['Quick'] = (counts['Quick'] || 0) + 1;
      if (spec.includes('Potente') || spec.includes('Força')) counts['Power'] = (counts['Power'] || 0) + 1;
      if (spec.includes('Bloqueio')) counts['Block'] = (counts['Block'] || 0) + 1;
      if (spec.includes('Recepção') || spec.includes('Defesa')) counts['Receive'] = (counts['Receive'] || 0) + 1;
      if (spec.includes('Saque')) counts['Serve'] = (counts['Serve'] || 0) + 1;
    }
  });

  // Qual a especialidade predominante do inimigo?
  let topEnemySpec = 'Power'; // default
  let maxCount = 0;
  for (const [spec, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      topEnemySpec = spec;
    }
  }

  // Qual é o melhor counter para isso?
  const possibleCounters = TACTICAL_COUNTERS[topEnemySpec] || ['Power'];
  const targetCounter = possibleCounters[0]; // Pega o principal counter
  
  return {
    enemyFocus: topEnemySpec,
    recommendedCounter: targetCounter
  };
}

export function generateCounterTeam(enemyTeam: Record<string, any>, options: Omit<AutoBuilderOptions, 'targetSpecialty'>) {
  const analysis = analyzeEnemyTeam(enemyTeam);
  
  // Traduz a especialidade counter para a string usada em português
  const specMap: Record<string, string> = {
    'Quick': 'Rápido',
    'Power': 'Potente',
    'Block': 'Bloqueio',
    'Receive': 'Recepção',
    'Serve': 'Saque'
  };

  const targetSpecialtyText = specMap[analysis.recommendedCounter] || 'Potente';

  // Usa o auto builder base com o target dinâmico
  const team = generateSuggestedTeam({
    ...options,
    targetSpecialty: targetSpecialtyText
  });

  // Atualiza a estratégia com o contexto do inimigo
  const enemySpecMap: Record<string, string> = {
    'Quick': 'Ataque Rápido',
    'Power': 'Ataque Potente',
    'Block': 'Bloqueio',
    'Receive': 'Recepção',
    'Serve': 'Saque'
  };

  team.strategy = `Análise Tática: O time inimigo apresenta forte foco em ${enemySpecMap[analysis.enemyFocus] || 'Ataque Potente'}. ` +
    `Para neutralizá-los, a IA focou em montar uma composição especializada em ${targetSpecialtyText}, ` +
    `visando explorar a Vantagem Tática mecânica do jogo. ` + team.strategy;
    
  return team;
}



export function generateClubContestTeam(enemyTeam: Record<string, any>, options: Omit<AutoBuilderOptions, 'targetSpecialty'>): any {
  let pool = options.allCharacters;
  if (options.onlyOwned) {
    const savedIds = new Set(options.savedPlayers.map(p => p.characterId));
    pool = pool.filter(c => savedIds.has(c.id));
  }
  
  // 1. Descobrir a especialidade do Boss
  const analysis = analyzeEnemyTeam(enemyTeam);
  const specMap: Record<string, string> = {
    'Quick': 'Rápido',
    'Power': 'Potente',
    'Block': 'Bloqueio',
    'Receive': 'Recepção',
    'Serve': 'Saque'
  };
  const targetSpecialtyText = specMap[analysis.recommendedCounter] || 'Potente';
  const fullOptions = { ...options, targetSpecialty: targetSpecialtyText };

  // 2. Identificar personagens-chave de Club Contest
  const coreNames = ['Aran Ojiro', 'Taketora Yamamoto', 'Kita Shinsuke', 'Ryunosuke Tanaka'];
  
  // Sugawara e Watari buffam especificamente Ataque Potente, então só são "Core" se o foco for esse
  if (targetSpecialtyText === 'Potente') {
    coreNames.push('Koshi Sugawara', 'Shinji Watari');
  }
  
  const corePlayers = pool.filter(c => coreNames.some(name => c.name.includes(name)));

  const selectedLineup: Character[] = [];
  // Regra real do jogo: não há cota rígida (ex: 2 MB, 1 OP). Basta ter no mínimo 1 S, 1 MB, 1 WS, 1 Li.
  // As duas vagas restantes (FLEX) podem ser preenchidas por qualquer posição (exceto Li).
  const requiredPositions = ['S', 'MB', 'WS', 'FLEX', 'FLEX'];
  let bestLibero: Character | null = null;
  let currentSpecialtyCount = 0;

  // Função auxiliar para checar especialidade
  const hasSpec = (c: Character) => (c.specialty || '').toLowerCase().includes(targetSpecialtyText.toLowerCase());

  // Selecionar o Líbero
  const liberos = pool.filter(c => c.position === 'Li');
  // Se o Watari tem a especialidade, ou se a gente só quiser pegar ele mesmo
  const watari = liberos.find(c => c.name.includes('Watari'));
  
  if (watari) {
    bestLibero = watari;
  } else if (liberos.length > 0) {
    // Pegar o líbero que tenha a especialidade se precisar, senão o de maior score
    liberos.sort((a, b) => {
      let scoreA = getBaseScore(a, fullOptions) + (hasSpec(a) ? 100000 : 0);
      let scoreB = getBaseScore(b, fullOptions) + (hasSpec(b) ? 100000 : 0);
      return scoreB - scoreA;
    });
    bestLibero = liberos[0];
  }
  
  if (bestLibero && hasSpec(bestLibero)) currentSpecialtyCount++;

  // 3. Preencher o restante (Prioridade: 1º Bater cota de 4 da especialidade counter, 2º Personagens Core, 3º Bônus de Escola)
  // Descobrir qual escola tem a maioria no lineup (até agora só tem o líbero, então será Karasuno por padrão)
  const dominantSchool = bestLibero?.school || 'Karasuno';
  // Helper to extract base name (e.g. "KORAI HOSHIUMI (Esportes)" -> "KORAI HOSHIUMI")
  const getBaseName = (name: string) => name.split('(')[0].trim().toLowerCase();

  // Separar o restante do pool que não está no lineup
  const liberoBaseName = bestLibero ? getBaseName(bestLibero.name) : null;
  const remainingPool = pool.filter(c => c.position !== 'Li' && (!bestLibero || getBaseName(c.name) !== liberoBaseName));

  // Para cada posição restante, tentar pegar o melhor char
  for (const reqPos of requiredPositions) {
    const currentSchoolCount = [...selectedLineup, bestLibero].filter(c => c?.school === dominantSchool).length;
    
    // Regra do Robot Blocker: Se estamos numa vaga FLEX, ainda precisamos fechar a escola dominante (4 chars)
    // e já temos um MB titular, puxamos o pior MB da escola dominante para economizar stamina no Club Contest.
    if (reqPos === 'FLEX' && currentSchoolCount < 4 && selectedLineup.filter(c => c.position === 'MB').length === 1) {
      const robotBlockers = remainingPool.filter(c => c.position === 'MB' && c.school === dominantSchool);
      robotBlockers.sort((a, b) => {
        let scoreA = getBaseScore(a, fullOptions) - (hasSpec(a) ? 100000 : 0);
        let scoreB = getBaseScore(b, fullOptions) - (hasSpec(b) ? 100000 : 0);
        return scoreA - scoreB;
      });
      
      if (robotBlockers.length > 0) {
        const chosen = robotBlockers[0];
        selectedLineup.push(chosen);
        const chosenBaseName = getBaseName(chosen.name);
        for (let i = remainingPool.length - 1; i >= 0; i--) {
          if (getBaseName(remainingPool[i].name) === chosenBaseName) {
            remainingPool.splice(i, 1);
          }
        }
        if (hasSpec(chosen)) currentSpecialtyCount++;
        continue;
      }
    }

    // Caso normal: Pega o mais forte
    let candidates = remainingPool.filter(c => c.position === reqPos);
    
    // FLEX permite qualquer posição (já que o pool não tem Líberos)
    if (reqPos === 'FLEX') {
      candidates = remainingPool;
    }
    
    candidates.sort((a, b) => {
      let scoreA = getBaseScore(a, fullOptions);
      let scoreB = getBaseScore(b, fullOptions);
      
      const isCoreA = coreNames.some(name => a.name.includes(name));
      const isCoreB = coreNames.some(name => b.name.includes(name));
      
      // Bônus gigantesco para ativar a especialidade counter (Prioridade Máxima até chegar em 4)
      if (hasSpec(a) && currentSpecialtyCount < 4) scoreA += 500000;
      if (hasSpec(b) && currentSpecialtyCount < 4) scoreB += 500000;
      
      // Bônus para Core Players (Prioridade Secundária)
      if (isCoreA) scoreA += 100000;
      if (isCoreB) scoreB += 100000;
      
      // Ignorar Tanaka SR se for core
      if (isCoreA && a.name.includes('Tanaka') && a.rarity !== 'SSR') scoreA -= 500000;
      if (isCoreB && b.name.includes('Tanaka') && b.rarity !== 'SSR') scoreB -= 500000;

      // Calcular bônus de Sinergia (Vínculos) com o time atual
      const currentTeam = [...selectedLineup, bestLibero].filter(Boolean) as Character[];
      const getBondCount = (char: Character) => {
        let count = 0;
        try {
          const bonds = JSON.parse(char.bonds || '[]');
          count += bonds.filter((id: number) => currentTeam.some(t => t.id === id)).length;
          count += currentTeam.filter(t => {
            const tBonds = JSON.parse(t.bonds || '[]');
            return tBonds.includes(char.id);
          }).length;
        } catch {}
        return count;
      };
      
      // Cada vínculo vale muitos pontos para garantir que sinergias entrem no lugar de "pingados" fortes
      scoreA += getBondCount(a) * 50000;
      scoreB += getBondCount(b) * 50000;
      
      // Bônus para escola dominante (apenas se ainda não tivermos 4)
      if (currentSchoolCount < 4) {
        if (a.school === dominantSchool) scoreA += 5000;
        if (b.school === dominantSchool) scoreB += 5000;
      }
      
      return scoreB - scoreA;
    });

    if (candidates.length > 0) {
      const chosen = candidates[0];
      selectedLineup.push(chosen);
      const chosenBaseName = getBaseName(chosen.name);
      for (let i = remainingPool.length - 1; i >= 0; i--) {
        if (getBaseName(remainingPool[i].name) === chosenBaseName) {
          remainingPool.splice(i, 1);
        }
      }
      if (hasSpec(chosen)) currentSpecialtyCount++;
    }
  }

  // Falha na segurança (se não preencheu 6)
  while (selectedLineup.length < 6 && remainingPool.length > 0) {
    remainingPool.sort((a, b) => getBaseScore(b, fullOptions) - getBaseScore(a, fullOptions));
    const chosen = remainingPool[0];
    selectedLineup.push(chosen);
    const chosenBaseName = getBaseName(chosen.name);
    for (let i = remainingPool.length - 1; i >= 0; i--) {
      if (getBaseName(remainingPool[i].name) === chosenBaseName) {
        remainingPool.splice(i, 1);
      }
    }
  }

  // 5. Posicionamento para Club Contest
  const lineupWithAffinity = selectedLineup.map(char => {
    let frontAffinity = 0;
    if (FRONT_ROW_POSITIONS.includes(char.position)) frontAffinity += 10;
    if (BACK_ROW_POSITIONS.includes(char.position)) frontAffinity -= 10;
    
    const spec = (char.specialty || '').toLowerCase();
    if (spec.includes('bloqueio') || spec.includes('rápido') || spec.includes('passe')) frontAffinity += 5;
    if (spec.includes('recepção') || spec.includes('defesa') || spec.includes('saque')) frontAffinity -= 5;
    
    if (char.position === 'S' && !spec.includes('saque')) {
      frontAffinity += 15;
    }

    // Se for o MB com menor score (Robot Blocker), forçamos ele para a frente!
    if (char.position === 'MB') {
      const mbScores = selectedLineup.filter(c => c.position === 'MB').map(c => getBaseScore(c, fullOptions));
      const minScore = Math.min(...mbScores);
      if (getBaseScore(char, fullOptions) === minScore) {
        frontAffinity += 1000; // Prioridade absoluta na rede
      }
    }
    
    // Regras Específicas de Personagens (Overrides Manuais) baseados nos Guias
    // Korai Hoshiumi (SP: 5701, UR: 2605) funciona muito melhor na linha de trás
    if (char.id === 5701 || char.id === 2605) {
      frontAffinity -= 1000; // Prioridade absoluta no fundo
      console.log(`[Posicionamento] Forçando ${char.name} para o fundo. Affinity: ${frontAffinity}`);
    }
    
    console.log(`[Posicionamento] ${char.name} -> Affinity final: ${frontAffinity}`);

    return { char, frontAffinity, score: getBaseScore(char, fullOptions), isServer: spec.includes('saque') };
  });
  if (lineupWithAffinity.length === 0) {
    const createNode = (char: Character | null): PlayerNode | null => {
      if (!char) return null;
      return { character: char, level: 80, resonance: 0 };
    };
    return {
      'front-1': null, 'front-2': null, 'front-3': null,
      'back-1': null, 'back-2': null, 'back-3': null,
      'back-libero': createNode(bestLibero), 'coach': null,
      'bench-1': null, 'bench-2': null, 'bench-3': null,
      'bench-4': null, 'bench-5': null, 'bench-6': null,
      strategy: "⚠️ Não há personagens suficientes para montar o time com as configurações atuais. Se estiver usando 'Meus Personagens', adicione mais cartas à sua base."
    };
  }

  // Identificar o melhor sacador
  let bestServer = null;
  const servers = lineupWithAffinity.filter(x => x.isServer).sort((a, b) => b.score - a.score);
  if (servers.length > 0) {
    bestServer = servers[0].char;
  } else {
    bestServer = [...lineupWithAffinity].sort((a, b) => b.score - a.score)[0].char;
  }

  const remainingLineup = lineupWithAffinity.filter(x => x.char.id !== bestServer!.id);
  
  remainingLineup.sort((a, b) => {
    let aAffinity = a.frontAffinity;
    let bAffinity = b.frontAffinity;
    if (a.char.position === 'S' && !a.isServer) aAffinity += 15;
    if (b.char.position === 'S' && !b.isServer) bAffinity += 15;
    return bAffinity - aAffinity;
  });

  const front = remainingLineup.slice(0, 3).map(x => x.char);
  const back = [bestServer!, ...remainingLineup.slice(3, 5).map(x => x.char)];

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
      potentials
    };
  };

  const coach = options.allCoaches ? options.allCoaches[0] : null;

  // --- BANCO DE RESERVAS ---
  // Preencher o banco com substitutos estratégicos (Pinch Servers, Pinch Blockers/Counter)
  const bench: Character[] = [];
  const benchPool = [...remainingPool];
  benchPool.sort((a, b) => {
    let scoreA = getBaseScore(a, fullOptions);
    let scoreB = getBaseScore(b, fullOptions);
    
    // Pinch Servers e Pinch Blockers/Counter recebem bônus enorme para ir pro banco
    const specA = (a.specialty || '').toLowerCase();
    const specB = (b.specialty || '').toLowerCase();
    const targetSpec = targetSpecialtyText.toLowerCase();
    
    if (specA.includes('saque') || specA.includes(targetSpec)) scoreA += 200000;
    if (specB.includes('saque') || specB.includes(targetSpec)) scoreB += 200000;
    
    return scoreB - scoreA;
  });

  for (const char of benchPool) {
    if (bench.length >= 6) break;
    // Evitar adicionar a mesma pessoa no banco
    const baseName = getBaseName(char.name);
    if (!bench.some(b => getBaseName(b.name) === baseName)) {
      bench.push(char);
    }
  }

  return {
    'front-1': createNode(front[0] || null),
    'front-2': createNode(front[1] || null),
    'front-3': createNode(front[2] || null),
    'back-1': createNode(back[0] || null),
    'back-2': createNode(back[1] || null),
    'back-3': createNode(back[2] || null),
    'back-libero': createNode(bestLibero),
    'bench-1': createNode(bench[0] || null),
    'bench-2': createNode(bench[1] || null),
    'bench-3': createNode(bench[2] || null),
    'bench-4': createNode(bench[3] || null),
    'bench-5': createNode(bench[4] || null),
    'bench-6': createNode(bench[5] || null),
    'coach': coach,
    strategy: `Estratégia Club Contest: Time otimizado para combater a força inimiga (${targetSpecialtyText}). A IA aplicou bônus da escola ${dominantSchool} (podendo usar Robot Blocker nas vagas FLEX). O Banco de Reservas foi preenchido com Especialistas de Saque e Counters para substituições pontuais.`
  };
}
