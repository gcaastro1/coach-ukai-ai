import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { targetSpecialty, specialtyCount, onlyOwned, savedPlayers, allCharacters, targetSchool } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY não configurada no servidor.' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', generationConfig: { responseMimeType: "application/json" } });

    // Determinar o pool de personagens
    let pool = allCharacters;
    if (onlyOwned) {
      const savedIds = new Set(savedPlayers.map((p: any) => p.characterId));
      pool = pool.filter((c: any) => savedIds.has(c.id));
    }

    // Carregar detalhes dos personagens do pool
    const detailsDir = path.join(process.cwd(), 'src', 'data', 'characters-details');
    const enrichedPool = pool.map((char: any) => {
      try {
        const detailPath = path.join(detailsDir, `${char.id}.json`);
        if (fs.existsSync(detailPath)) {
          const detailData = JSON.parse(fs.readFileSync(detailPath, 'utf8'));
          return { ...char, skills: detailData.skills, bonds: detailData.bonds };
        }
      } catch (e) {}
      return char;
    });

    // Remover dados muito pesados para poupar tokens (ex: parâmetros numéricos complexos) mantendo nomes e descrições
    // Remover dados muito pesados para poupar tokens (ex: parâmetros numéricos complexos) mantendo nomes e descrições
    const simplifiedPool = enrichedPool.map((c: any) => {
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
      const resBuff = getResonanceBuff(c.rarity);
      const maxRes = ['R', 'N'].includes(c.rarity?.toUpperCase()) ? 3 : 5;

      return {
        id: c.id,
        name: c.name,
        position: c.position,
        specialty: c.specialty,
        bonds: c.bonds ? c.bonds.map((b: any) => b.name) : [],
        skills: c.skills ? c.skills.map((s: any) => ({ name: s.name, description: s.description })) : [],
        resonanceBonus: `+${resBuff} nos Atributos Básicos nas Ressonâncias 1, 3 e 5 (Até Res ${maxRes}). As passivas de Res 2 e 4 (se existirem) estão nas últimas skills com name null.`
      };
    });

    const prompt = `
Você é o assistente técnico do jogo Haikyu!! Fly High.
Sua missão é montar o melhor time de 6 jogadores titulares e 1 Líbero baseado no meta e sinergias.

PARÂMETROS DA BUILD:
- Especialidade Foco: ${targetSpecialty}
- Quantidade Mínima de personagens com essa especialidade no time titular: ${specialtyCount}
- Bônus de Escola Foco: ${targetSchool || 'Nenhuma (Focar em Força pura)'}
- Usar apenas personagens da conta do usuário? ${onlyOwned ? 'Sim' : 'Não'}

Se "Não" (usando todos do jogo), assuma que todos estão no Nível 80 e com TODAS as Ressonâncias (Passivas) ativadas. Se "Sim", também monte o melhor time possível com o pool fornecido.

Se uma "Escola Foco" for definida, você DEVE priorizar colocar personagens dessa escola no time titular para ativar os bônus de vínculo de escola.
Entretanto, na sua análise (strategy), adicione OBRIGATORIAMENTE uma seção "**Sugestões de Banco:**" onde você sugere outros personagens disponíveis na conta que poderiam substituir os personagens que você colocou *apenas* para fechar o vínculo de escola, mas que possuem atributos/força muito mais fracos (Nível/Ressonância baixos).

POOL DE JOGADORES DISPONÍVEIS:
${JSON.stringify(simplifiedPool, null, 2)}

REGRAS DE ESCALAÇÃO:
1. "front-1", "front-2" e "front-3" (Rede): Priorize Bloqueadores (MB) e Levantadores (S). Se for colocar Atacante, prefira os de Ataque Rápido. O "front-1" costuma ser o sacador principal se possível.
2. "back-1", "back-2" e "back-3" (Fundo): Priorize Atacantes (WS/OP) e especialistas em Recepção/Defesa.
3. "back-libero": OBRIGATORIAMENTE um personagem com position "Li". (Caso não haja Li no pool, deixe null).
4. Evite colocar duas versões do MESMO personagem no time titular (ex: Hinata SSR e Hinata UR).

OBJETIVO:
Retorne UM objeto JSON estrito com a seguinte tipagem exata:
{
  "lineup": {
    "front-1": 1234, // ID do personagem
    "front-2": 1234,
    "front-3": 1234,
    "back-1": 1234,
    "back-2": 1234,
    "back-3": 1234,
    "back-libero": 1234 // ou null
  },
  "strategy": "Explicação detalhada (2 parágrafos) do porquê esse time tem sinergia, quais habilidades e ressonâncias (passivas) conversam entre si, e como esse time atinge o foco desejado."
}
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json\n?|```\n?/g, '').trim();
    const aiResponse = JSON.parse(text);

    // Reconstruir o objeto de resposta esperado pelo front-end
    const createNode = (id: number | null) => {
      if (!id) return null;
      const char = allCharacters.find((c: any) => c.id === id);
      if (!char) return null;
      
      let level = 80;
      let resonance = 5; // Simula ressonância max
      let potentials = {};
      
      if (onlyOwned) {
        const saved = savedPlayers.find((p: any) => p.characterId === id);
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

    const finalTeam = {
      'front-1': createNode(aiResponse.lineup['front-1']),
      'front-2': createNode(aiResponse.lineup['front-2']),
      'front-3': createNode(aiResponse.lineup['front-3']),
      'back-1': createNode(aiResponse.lineup['back-1']),
      'back-2': createNode(aiResponse.lineup['back-2']),
      'back-3': createNode(aiResponse.lineup['back-3']),
      'back-libero': createNode(aiResponse.lineup['back-libero']),
      'coach': null,
      'bench-1': null, 'bench-2': null, 'bench-3': null, 'bench-4': null, 'bench-5': null, 'bench-6': null,
      strategy: aiResponse.strategy // Anexamos a estratégia no objeto final
    };

    return NextResponse.json(finalTeam);

  } catch (error: any) {
    console.error('Erro na API de Construção de Time (Gemini):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
