const BREAKTHROUGH_LEVELS = [20, 40, 60, 70, 80];

const STAT_MAP: Record<string, { base: number, growth: number }> = {
  Serve: { base: 3, growth: 18 },
  Block: { base: 6, growth: 21 },
  Set: { base: 7, growth: 22 },
  'Quick Attack': { base: 4, growth: 19 },
  'Power Attack': { base: 5, growth: 20 },
  Save: { base: 9, growth: 24 },
  Receive: { base: 8, growth: 23 }
};

/**
 * Calcula os atributos base de um personagem com base no nível e seus dados de crescimento.
 *
 * @param level Nível alvo para o cálculo
 * @param growthTiers Array de arrays contendo os multiplicadores por tier de breakthrough
 * @param keepDecimal Se verdadeiro, retorna valores com casas decimais
 * @returns Um objeto mapeando o nome do atributo para o seu valor numérico
 */
export function calculateCharacterStats(level: number, growthTiers: any[][], keepDecimal: boolean = false): Record<string, number> {
  const resultStats: Record<string, number> = {};

  if (!growthTiers || growthTiers.length === 0) {
    return resultStats;
  }

  for (const [statName, mapping] of Object.entries(STAT_MAP)) {
    let tierIndex = 0;
    
    // Verifica se os índices existem no tier inicial
    if (!growthTiers[tierIndex] || growthTiers[tierIndex][mapping.base] === undefined || growthTiers[tierIndex][mapping.growth] === undefined) {
      resultStats[statName] = 0;
      continue;
    }

    let currentBase = growthTiers[tierIndex][mapping.base];
    let currentGrowth = growthTiers[tierIndex][mapping.growth];
    let currentStat = currentBase + currentGrowth; // Nível 1

    for (let currentLevel = 2; currentLevel <= level; currentLevel++) {
      if (BREAKTHROUGH_LEVELS.includes(currentLevel) && tierIndex + 1 < growthTiers.length) {
        tierIndex++;
        
        const newBase = growthTiers[tierIndex][mapping.base] ?? currentBase;
        const newGrowth = growthTiers[tierIndex][mapping.growth] ?? currentGrowth;
        
        currentBase = newBase;
        currentGrowth = newGrowth;
        
        // No momento do breakthrough, recalcula baseado no nível atual
        currentStat = newBase + (newGrowth * currentLevel);
      } else {
        // Para níveis normais, apenas adiciona o crescimento atual
        currentStat += currentGrowth;
      }
    }

    const finalStat = currentStat / 10000;
    resultStats[statName] = keepDecimal ? finalStat : Math.floor(finalStat);
  }

  return resultStats;
}
