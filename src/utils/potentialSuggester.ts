import { Character, PotentialSlotID, EquippedPotential } from '../types';

export function suggestPotentials(character: Character): Record<PotentialSlotID, EquippedPotential> {
  const result: Partial<Record<PotentialSlotID, EquippedPotential>> = {};
  const specialty = (character.specialty || '').toLowerCase();
  
  // Helper to assign potentials
  const assign = (
    primarySet: string, 
    secondarySet: string,
    slot1: string,
    slot2: string,
    slot4: string,
    slot6: string
  ) => {
    // 4 pieces of primary, 2 pieces of secondary
    result['I'] = { setId: primarySet, mainStat: slot1 };
    result['II'] = { setId: primarySet, mainStat: slot2 };
    result['III'] = { setId: primarySet, mainStat: 'Saque' }; // Slot 3 is always Saque
    result['IV'] = { setId: primarySet, mainStat: slot4 };
    
    result['V'] = { setId: secondarySet, mainStat: 'Recepção' }; // Slot 5 is always Recepção
    result['VI'] = { setId: secondarySet, mainStat: slot6 };
  };

  switch (character.position) {
    case 'WS':
    case 'OP':
      // Atacantes (Dano Focado)
      const hasPower = specialty.includes('power') || specialty.includes('potente');
      const isQuick = specialty.includes('quick') || specialty.includes('rápido');
      const isReceiverWS = specialty.includes('receive') || specialty.includes('recepção');
      
      if (isReceiverWS) {
        // Híbrido: Especialista em Recepção
        assign(
          'supreme_receive',   // 4 peças de Recepção
          hasPower ? 'power_rise' : 'sharp_sense',
          hasPower ? 'Ataque Potente' : 'Ataque Rápido',     // I
          'Força %',           // II
          'Recepção %',        // IV (Foco defensivo na recepção)
          'Ataque Potente %'   // VI
        );
      } else if (isQuick && !hasPower) {
        assign(
          'rapid_quick_attack',
          'sharp_sense',
          'Ataque Rápido',     // I
          'Força %',           // II
          'Reflexo %',         // IV
          'Ataque Potente %'   // VI
        );
      } else {
        // Power Spiker default
        assign(
          'power_vibe',
          'power_rise',
          'Ataque Potente',    // I
          'Força %',           // II
          'Empenho %',         // IV
          'Ataque Potente %'   // VI
        );
      }
      break;

    case 'S':
      // Levantadores
      const isServer = specialty.includes('serve') || specialty.includes('saque');
      if (isServer) {
        assign(
          'precise_serve',
          'precise_set',
          'Passe',             // I
          'Passe %',           // II
          'Recepção %',        // IV
          'Passe %'            // VI
        );
      } else {
        assign(
          'precise_set',
          'setter_dump',
          'Passe',             // I
          'Passe %',           // II
          'Defesa %',          // IV
          'Passe %'            // VI
        );
      }
      break;

    case 'MB':
      // Bloqueadores
      const isReceiverMB = specialty.includes('receive') || specialty.includes('recepção');
      
      if (isReceiverMB) {
        // Híbrido MB: Especialista em Recepção (ex: Hinata Sakura)
        assign(
          'supreme_receive',   // 4 peças de Recepção
          'block_movement',
          'Bloqueio',          // I
          'Ataque Rápido %',   // II
          'Recepção %',        // IV (Foco na recepção)
          'Bloqueio %'         // VI
        );
      } else {
        assign(
          'precise_block',
          'block_movement',
          'Bloqueio',          // I
          'Ataque Rápido %',   // II (Não há defesa pura no Slot II)
          'Bloqueio %',        // IV
          'Bloqueio %'         // VI
        );
      }
      break;

    case 'Li':
      // Líberos
      assign(
        'supreme_receive',
        'assist_receive',
        'Recepção',          // I
        'Percepção %',       // II
        'Recepção %',        // IV
        'Recepção %'         // VI
      );
      break;

    default:
      // Fallback
      assign(
        'status_enhancement',
        'awareness_enhancement',
        'Ataque Potente',
        'Ataque Potente %',
        'Defesa %',
        'Técnica de Ataque %'
      );
  }

  return result as Record<PotentialSlotID, EquippedPotential>;
}
