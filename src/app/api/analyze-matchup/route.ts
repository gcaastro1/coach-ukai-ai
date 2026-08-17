import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { enemyTeam, savedPlayers, allCharacters, targetSchool } = await req.json();

    if (!enemyTeam || !savedPlayers) {
      return NextResponse.json({ error: 'Faltam dados do time inimigo ou dos seus jogadores salvos.' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY não configurada no servidor.' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const formatCharacter = (charData: any) => {
      const char = charData.character || charData;
      return `${char.name} (${char.rarity} - ${char.position})`;
    };

    const enemyRoster = Object.entries(enemyTeam)
      .map(([slot, charData]) => `- ${slot}: ${formatCharacter(charData)}`)
      .join('\n');

    const availableRoster = savedPlayers
      .map((p: any) => {
        const char = allCharacters.find((c: any) => c.id === p.characterId);
        if (!char) return null;
        return `- ${char.name} (${char.rarity} - ${char.position} - ${char.school}) - Nível: ${p.level}, Ressonância: ${p.resonance || 0}`;
      })
      .filter(Boolean)
      .join('\n');

    const prompt = `
Você é um especialista estrategista do jogo mobile "Haikyuu Fly High".
Sua tarefa é analisar o time inimigo e sugerir o melhor time possível (counter) utilizando APENAS os personagens disponíveis na conta do jogador.

PARÂMETROS DA BUILD:
- Bônus de Escola Foco: ${targetSchool || 'Nenhuma (Focar em Vantagem/Força pura)'}

REGRAS DE VANTAGEM DE ESTILO DE JOGO NO HAIKYUU FLY HIGH:
Lembre-se da seguinte cadeia de vantagens e fraquezas de especialidades do jogo:
Ataque Rápido > Bloqueio > Ataque Potente > Recepção > Ataque Rápido

Ou seja:
- Personagens de Ataque Rápido têm vantagem contra Bloqueio.
- Personagens de Bloqueio têm vantagem contra Ataque Potente.
- Personagens de Ataque Potente têm vantagem contra Recepção.
- Personagens de Recepção têm vantagem contra Ataque Rápido.

===================
TIME INIMIGO (Para você dar Counter):
${enemyRoster}

===================
JOGADORES DISPONÍVEIS NA SUA CONTA (Use apenas estes para formar a sugestão):
${availableRoster}

===================
INSTRUÇÕES:
1. Avalie as posições e o perfil dos jogadores do time inimigo. Tente prever o "tema" do time inimigo com base nos jogadores escolhidos e suas especialidades.
2. Forme o melhor time com os seus 7 "JOGADORES DISPONÍVEIS" (1 Levantador, 4 Atacantes/Bloqueadores, 1 Líbero).
3. Use a regra do triângulo de vantagens para combater o inimigo. Se uma "Escola Foco" foi definida, VOCÊ DEVE priorizar jogar com os personagens dessa escola para fechar o vínculo, cruzando com a regra das vantagens.
4. Justifique suas escolhas e explique como esse time proposto lida especificamente contra as ameaças do time inimigo.
5. OBRIGATÓRIO: Se uma Escola Foco foi escolhida, adicione uma seção chamada "**Sugestões de Banco:**" onde você deve sugerir jogadores disponíveis na conta que podem substituir os membros mais fracos (baixo Nível/Ressonância) do time titular que foram colocados APENAS por causa do vínculo de escola.


Retorne APENAS a sua análise final e o seu time sugerido formatados em Markdown limpo (com cabeçalhos, listas, negrito, etc.).
NÃO utilize blocos de código markdown englobando toda a resposta (ex: \`\`\`markdown). O retorno deve ser o markdown em si.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    
    return NextResponse.json({ analysis: text });

  } catch (error: any) {
    console.error('Erro na API de Análise de Matchup (Gemini):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
