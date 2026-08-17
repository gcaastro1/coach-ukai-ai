export type PotentialSlotID = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';

export interface PotentialSlotConfig {
  id: PotentialSlotID;
  valueFormat: 'Fixo' | 'Porcentagem (%)';
  possibleStats: string[];
}

export const potentialSlotsConfig: Record<PotentialSlotID, PotentialSlotConfig> = {
  'I': {
    id: 'I',
    valueFormat: 'Fixo',
    possibleStats: [
      'Passe',
      'Ataque Potente',
      'Ataque Rápido',
      'Bloqueio',
      'Recepção'
    ]
  },
  'II': {
    id: 'II',
    valueFormat: 'Porcentagem (%)',
    possibleStats: [
      'Ataque Potente %',
      'Ataque Rápido %',
      'Passe %',
      'Saque %',
      'Percepção %',
      'Força %'
    ]
  },
  'III': {
    id: 'III',
    valueFormat: 'Fixo',
    possibleStats: [
      'Saque'
    ]
  },
  'IV': {
    id: 'IV',
    valueFormat: 'Porcentagem (%)',
    possibleStats: [
      'Recepção %',
      'Bloqueio %',
      'Defesa %',
      'Reflexo %',
      'Empenho %'
    ]
  },
  'V': {
    id: 'V',
    valueFormat: 'Fixo',
    possibleStats: [
      'Recepção'
    ]
  },
  'VI': {
    id: 'VI',
    valueFormat: 'Porcentagem (%)',
    possibleStats: [
      'Ataque Potente %',
      'Ataque Rápido %',
      'Passe %',
      'Saque %',
      'Bloqueio %',
      'Recepção %',
      'Defesa %',
      'Técnica de Ataque %',
      'Técnica de Defesa %'
    ]
  }
};
