import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { playerNode } = await req.json();

    if (!playerNode || !playerNode.character) {
      return NextResponse.json({ error: 'Faltam dados da build.' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY não configurada no servidor.' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Load POTENTIAL_GUIDE for context
    const guidePath = path.join(process.cwd(), 'docs', 'POTENTIAL_GUIDE.md');
    let potentialGuide = '';
    if (fs.existsSync(guidePath)) {
      potentialGuide = fs.readFileSync(guidePath, 'utf8');
    }

    // Load potentials.json to translate IDs to Names
    const potentialsPath = path.join(process.cwd(), 'src', 'data', 'potentials.json');
    let potentialsData: any[] = [];
    if (fs.existsSync(potentialsPath)) {
      potentialsData = JSON.parse(fs.readFileSync(potentialsPath, 'utf8'));
    }

    const { character, potentials, bonusStats, memory, level, resonance } = playerNode;

    const getPotentialName = (setId: string) => {
      const pot = potentialsData.find(p => p.id === setId);
      return pot ? pot.name : setId;
    };

    const prompt = `
Você é um especialista analista de min-maxing do jogo mobile "Haikyuu Fly High".
Sua tarefa é analisar a build manual que um jogador montou para um personagem.

DADOS DA BUILD DO JOGADOR:
Personagem: ${character.name} (Raridade: ${character.rarity}, Posição: ${character.position})
Nível: ${level}
Ressonância: ${resonance}

MEMÓRIA EQUIPADA:
${memory ? `- ${memory.data.name} (Nível: ${memory.level} de 5)` : 'Nenhuma'}
*Nota sobre Memórias: As memórias no jogo vão do nível 1 ao nível 5 no máximo. O ganho de níveis não é trivial, pois requer "tirar" duplicatas da mesma memória no gacha. Não sugira levianamente "colocar no nível máximo" sem considerar essa restrição.*

POTENCIAIS EQUIPADOS:
Slot I: ${potentials?.['I'] ? `${getPotentialName(potentials['I'].setId)} (${potentials['I'].mainStat})` : 'Vazio'}
Slot II: ${potentials?.['II'] ? `${getPotentialName(potentials['II'].setId)} (${potentials['II'].mainStat})` : 'Vazio'}
Slot III: ${potentials?.['III'] ? `${getPotentialName(potentials['III'].setId)} (${potentials['III'].mainStat})` : 'Vazio'}
Slot IV: ${potentials?.['IV'] ? `${getPotentialName(potentials['IV'].setId)} (${potentials['IV'].mainStat})` : 'Vazio'}
Slot V: ${potentials?.['V'] ? `${getPotentialName(potentials['V'].setId)} (${potentials['V'].mainStat})` : 'Vazio'}
Slot VI: ${potentials?.['VI'] ? `${getPotentialName(potentials['VI'].setId)} (${potentials['VI'].mainStat})` : 'Vazio'}

BÔNUS DE ATRIBUTOS EXTRAS DO JOGADOR:
${bonusStats ? Object.entries(bonusStats).map(([k, v]) => `- ${k}: ${v}`).join('\n') : 'Nenhum'}

---

GUIA DE POTENCIAIS E META DO JOGO (USE PARA EMBASAR SUA ANÁLISE):
${potentialGuide}

---

INSTRUÇÕES PARA ANÁLISE:
1. Avalie as escolhas de Potenciais (Sets e Main Stats) baseando-se na função do personagem e nas regras do Guia. Refira-se aos conjuntos pelos seus nomes em português.
2. Avalie se os atributos bônus inseridos conversam com a build ou se o jogador está desperdiçando recursos em atributos errados.
3. Se a Memória estiver equipada, avalie se ela sinergiza com o personagem e compreenda o poder dela baseado no seu nível atual (1 a 5).
4. Forneça um feedback direto sobre como toda a build do personagem está e o que precisa ser melhorado nele para maximizá-lo **sem precisar desbloquear novas ressonâncias** (apenas ajustando Memória, Potenciais e status base).

Retorne APENAS o texto da análise formatado em markdown. Não utilize blocos de código (ex: \`\`\`markdown).
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    
    return NextResponse.json({ analysis: text });

  } catch (error: any) {
    console.error('Erro na API de Análise de Build (Gemini):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
