import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { enemyTeam, mode, school, savedPlayers } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY não configurada no servidor.' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', generationConfig: { responseMimeType: "application/json" } });

    // Carregar todos os personagens e treinadores do sistema
    const charactersPath = path.join(process.cwd(), 'src', 'data', 'characters.json');
    const coachesPath = path.join(process.cwd(), 'src', 'data', 'coaches.json');
    const allCharacters = JSON.parse(fs.readFileSync(charactersPath, 'utf8'));
    const allCoaches = JSON.parse(fs.readFileSync(coachesPath, 'utf8'));

    // Determinar o pool de personagens do usuário
    let pool = allCharacters;
    const onlyOwned = mode === 'saved';
    if (onlyOwned && savedPlayers) {
      const savedIds = new Set(Object.values(savedPlayers).map((p: any) => p.characterId));
      pool = pool.filter((c: any) => savedIds.has(c.id));
    }

    // Simplificar os dados dos inimigos
    const simplifiedEnemy = Object.values(enemyTeam).map((en: any) => ({
      name: en.character.name,
      position: en.character.position,
      specialty: en.character.specialty
    }));

    // Simplificar o pool para poupar tokens
    const simplifiedPool = pool.map((c: any) => ({
      id: c.id,
      name: c.name,
      position: c.position,
      specialty: c.specialty,
      bonds: c.bonds ? c.bonds.map((b: any) => b.name) : []
    }));

    const prompt = `
Você é o treinador especialista do jogo Haikyu!! Fly High.
O usuário quer montar o melhor time de 6 jogadores titulares e 1 banco (reservas) para DERROTAR o time inimigo atual.

TIME INIMIGO:
${JSON.stringify(simplifiedEnemy, null, 2)}

SISTEMA DE VANTAGENS (Pedra-Papel-Tesoura):
- Ataque Rápido GANHA DE Bloqueio
- Bloqueio GANHA DE Ataque Potente
- Ataque Potente GANHA DE Recepção
- Recepção GANHA DE Ataque Rápido

PARÂMETROS DA BUILD:
- Bônus de Escola Foco: ${school !== 'none' ? school : 'Nenhuma (Focar nas Vantagens)'}
- Usar apenas personagens da conta do usuário? ${onlyOwned ? 'Sim' : 'Não'}

POOL DE JOGADORES DISPONÍVEIS DO USUÁRIO:
${JSON.stringify(simplifiedPool, null, 2)}

TREINADORES DISPONÍVEIS:
${JSON.stringify(allCoaches.map((c: any) => ({ id: c.id, name: c.name, buffDesc: c.buffDescription })), null, 2)}

REGRAS DE ESCALAÇÃO:
1. "Titulares": Devem ser OBRIGATORIAMENTE 7 jogadores. Um deles deve ser obrigatoriamente um Levantador (Position: S) e um deve ser Líbero (Position: Li). Os Bloqueadores Centrais (MB) NUNCA podem jogar no fundo, devem estar na rede.
2. "Banco e Opções": Selecione 6 jogadores do pool que funcionem como alternativas viáveis. Se você usou Bônus de Escola e precisou colocar jogadores mais fracos para fechar o bônus, os substitutos devem ser do banco.
3. Se você escolher uma escola (ex: Aoba Johsai), tente colocar jogadores dessa escola no time para fechar vínculos.

OBJETIVO:
Retorne UM objeto JSON estrito com a seguinte tipagem:
{
  "starters": [
    {
      "characterId": 1234, // O ID do personagem
      "name": "Hinata Shoyo", // Nome do personagem
      "position": "MB", // Posição que ele vai jogar (S, MB, WS, OP, Li)
      "reasoning": "Por que ele está nesta posição e qual a vantagem dele contra os jogadores do time inimigo."
    } // ... exatamente 7 objetos (6 quadra + 1 Li)
  ],
  "bench": [
    {
      "characterId": 1234,
      "name": "Kageyama",
      "reasoning": "Opção para o caso de..."
    } // ... de 3 a 6 opções de banco
  ],
  "coach": {
    "coachId": 1234,
    "name": "Nome do Treinador",
    "reasoning": "Por que este treinador..."
  },
  "generalStrategy": "Explique a estratégia geral do time contra o time inimigo."
}
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json\n?|```\n?/g, '').trim();
    const aiResponse = JSON.parse(text);

    return NextResponse.json(aiResponse);

  } catch (error: any) {
    console.error('Erro na API de Counter Team (Gemini):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
