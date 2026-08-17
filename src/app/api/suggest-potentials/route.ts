import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { character } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY não configurada no servidor.' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', generationConfig: { responseMimeType: "application/json" } });

    // Ler detalhes do personagem
    let characterDetails = null;
    try {
      const detailsPath = path.join(process.cwd(), 'src', 'data', 'characters-details', `${character.id}.json`);
      if (fs.existsSync(detailsPath)) {
        characterDetails = JSON.parse(fs.readFileSync(detailsPath, 'utf8'));
      }
    } catch (e) {
      console.warn('Detalhes do personagem não encontrados para', character.id);
    }

    // Ler os guias para servir de contexto
    const potentialGuidePath = path.join(process.cwd(), 'docs', 'POTENTIAL_GUIDE.md');
    const potentialGuide = fs.readFileSync(potentialGuidePath, 'utf8');

    // Calcular Bônus de Ressonância (Atributos brutos para Res 1, 3, 5)
    const getResonanceBuff = (rarity: string) => {
      switch (rarity?.toUpperCase()) {
        case 'SP': case 'UR': return '13%';
        case 'SSR': return '10%';
        case 'SR': return '6%';
        case 'R': return '4%';
        case 'N': return '2%';
        default: return '10%';
      }
    };
    const resBuff = getResonanceBuff(character.rarity);
    const maxRes = ['R', 'N'].includes(character.rarity?.toUpperCase()) ? 3 : 5;

    const prompt = `
Você é um assistente de "theorycrafting" do jogo Haikyu!! Fly High.
O usuário quer a melhor recomendação de potenciais (equipamentos) para o seguinte personagem:

NOME: ${character.name}
POSIÇÃO: ${character.position}
ESPECIALIDADE: ${character.specialty || 'N/A'}
RARIDADE: ${character.rarity}

DETALHES DO KIT E PASSIVAS (As duas últimas habilidades de "nome" null costumam ser as Passivas de Ressonância 2 e 4):
${JSON.stringify(characterDetails?.skills || [], null, 2)}

INFORMAÇÃO ADICIONAL DE RESSONÂNCIA:
Além das passivas de Res 2 e 4 listadas acima, o personagem ganha +${resBuff} nos Atributos Básicos nas Ressonâncias 1, 3 e 5 (Ele pode chegar até a Ressonância ${maxRes}).


AQUI ESTÁ O GUIA DE POTENCIAIS DO JOGO COM AS REGRAS E META ATUAL:
${potentialGuide}

OBJETIVO:
Gere a melhor build de potenciais baseada no kit de habilidades dele e no Guia.
ATENÇÃO REDOBRADA À ESPECIALIDADE: Se a especialidade do personagem for "Ataque Rápido", use apenas sets/atributos de Ataque Rápido (ex: rapid_quick_attack). Nunca coloque Ataque Potente em quem bate Rápido, e vice-versa!
A build deve conter 6 slots (I, II, III, IV, V, VI).
Para cada slot, forneça o \`setId\` (nome interno do set em inglês) e o \`mainStat\` exato, respeitando ESTRITAMENTE as seguintes opções por slot:

OPÇÕES VÁLIDAS DE ATRIBUTO PRINCIPAL (mainStat):
Slot I: 'Passe', 'Ataque Potente', 'Ataque Rápido', 'Bloqueio', 'Recepção'
Slot II: 'Ataque Potente %', 'Ataque Rápido %', 'Passe %', 'Saque %', 'Percepção %', 'Força %'
Slot III: 'Saque'
Slot IV: 'Recepção %', 'Bloqueio %', 'Defesa %', 'Reflexo %', 'Empenho %'
Slot V: 'Recepção'
Slot VI: 'Ataque Potente %', 'Ataque Rápido %', 'Passe %', 'Saque %', 'Bloqueio %', 'Recepção %', 'Defesa %', 'Técnica de Ataque %', 'Técnica de Defesa %'

Não use nenhum atributo principal que não esteja listado para o respectivo slot.

REGRAS DE CONJUNTOS DE POTENCIAIS (SETS):
Você NÃO DEVE colocar 6 peças iguais de um único set (o bônus máximo é de 4 peças, colocar 6 é desperdício).
A composição dos 6 slots deve seguir obrigatoriamente um destes padrões:
1. Um conjunto de 4 peças (para ativar o bônus de 4P) + Um conjunto de 2 peças de outro tipo (para ativar o bônus de 2P).
OU
2. Três conjuntos DIFERENTES de 2 peças cada (para ativar três bônus de 2P).
Certifique-se de que a contagem final de setIds obedeça a isso (ex: 4 'power_vibe' e 2 'sharp_sense').

SETS COMUNS EM INGLÊS:
Ataque Potente: 'power_vibe', 'power_rise'
Ataque Rápido: 'rapid_quick_attack', 'sharp_sense'
Bloqueio: 'precise_block', 'block_movement'
Recepção: 'supreme_receive', 'assist_receive'
Saque: 'precise_serve'
Passe: 'precise_set', 'setter_dump'

IMPORTANTE: Você PRECISA retornar UM objeto JSON estrito com a seguinte tipagem:
{
  "potentials": {
    "I": { "setId": "string", "mainStat": "string" },
    "II": { "setId": "string", "mainStat": "string" },
    "III": { "setId": "string", "mainStat": "string" },
    "IV": { "setId": "string", "mainStat": "string" },
    "V": { "setId": "string", "mainStat": "string" },
    "VI": { "setId": "string", "mainStat": "string" }
  },
  "reasoning": "Texto fluido explicando a escolha dos sets principais e dos status nos Slots II, IV e VI, baseado no kit do personagem.",
  "subStatsDescription": "Uma descrição fluida (1-2 parágrafos) justificando os sub-atributos ideais. Use o Dicionário de Atributos do Guia para explicar o motivo exato. (ex: 'Sugerimos Percepção porque aumenta a chance crítica do seu ataque rápido')."
}

Use os ids de sets exatamente como listados.
Seja técnico, analítico e foque 100% em otimização para o Haikyuu Fly High.
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json\n?|```\n?/g, '').trim();
    
    return NextResponse.json(JSON.parse(text));

  } catch (error: any) {
    console.error('Erro na API de Potenciais (Gemini):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
