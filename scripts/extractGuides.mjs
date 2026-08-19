import fs from 'fs';
import path from 'path';
import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("ERRO: GEMINI_API_KEY não encontrada no arquivo .env.local.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
// Usando gemini-3.5-flash pois o 2.5-flash-lite foi desativado pelo Google
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Ler o arquivo de lista de URLs
const listaPath = path.join(process.cwd(), 'docs', 'chars', 'lista.txt');
const listaContent = fs.readFileSync(listaPath, 'utf8');

// Ler o json de guides existente
const guidesPath = path.join(process.cwd(), 'src', 'data', 'guides.json');
let guidesData = {};
if (fs.existsSync(guidesPath)) {
    guidesData = JSON.parse(fs.readFileSync(guidesPath, 'utf8'));
}

// Nós precisamos de um mapeamento de Nome -> ID para salvar no guides.json
// Lendo arquivos de detalhes dos personagens para extrair o ID e o Nome.
const charDetailsPath = path.join(process.cwd(), 'src', 'data', 'characters-details');
const charFiles = fs.readdirSync(charDetailsPath);
const charMap = {}; 

for (const file of charFiles) {
    if (file.endsWith('.json')) {
        const id = file.replace('.json', '');
        const data = JSON.parse(fs.readFileSync(path.join(charDetailsPath, file), 'utf8'));
        const charData = data.character || data;
        let ptBrName = charData.name;
        if (charData.rarity) {
            ptBrName += ` ${charData.rarity}`;
        }
        charMap[id] = ptBrName;
    }
}

// Extrair URLs do texto
const lines = listaContent.split('\n');
const targets = [];

for (const line of lines) {
    const trimmed = line.trim();
    const match = trimmed.match(/^(.*?):\s+(https?:\/\/.*)$/);
    if (match) {
        targets.push({
            name: match[1].trim(),
            url: match[2].trim()
        });
    }
}

// O Prompt para a inteligência artificial
const PROMPT_TEMPLATE = `
Você é um especialista no jogo Haikyuu Fly High. Abaixo está a transcrição (legendas) de um vídeo guia sobre o personagem {NOME}.
Sua tarefa é analisar o vídeo e extrair as informações solicitadas no formato JSON exato abaixo.

Transcrição do Vídeo:
"""
{TRANSCRIPT}
"""

Responda SOMENTE com o JSON abaixo preenchido, sem formatação markdown (sem \`\`\`json). Extraia as informações de forma concisa e direta.

{
  "builds": [
    {
      "name": "Nome da melhor opção de set de 4 peças (ex: Vibração de Potência)",
      "set4": "Nome do set de 4 peças recomendado",
      "set2": "Nome do set de 2 peças (ou vazio se flexível)",
      "logic": "Explicação curta do porquê usar este set."
    }
  ],
  "mainStats": {
    "II": "Atributo recomendado para a peça II (ex: Força ou Ataque Rápido)",
    "IV": "Atributo recomendado para a peça IV",
    "VI": "Atributo recomendado para a peça VI"
  },
  "tips": "## 3. Sub-Atributos Ideais (Sub-stats)\\n1. Atributo 1\\n2. Atributo 2\\n\\n## 4. Cartões de Memória\\n* **Nome da Memória**\\n  * *Lógica:* Por que usar essa memória.",
  "howToPlay": "Explique em detalhes como usar o personagem e como ele funciona (baseado no vídeo)."
}
`;

function findCharIdByName(searchName) {
    const normalizedSearch = searchName.toLowerCase().replace(/ \s+/g, ' ').replace(/[()]/g, '');
    const searchWords = normalizedSearch.split(' ');
    
    // Tentar encontrar uma correspondência
    for (const [id, name] of Object.entries(charMap)) {
        const normalizedName = name.toLowerCase().replace(/ \s+/g, ' ').replace(/[()]/g, '');
        const nameWords = normalizedName.split(' ');
        
        // Verifica se todas as palavras da busca estão no nome do arquivo, ou se o primeiro nome e raridade batem
        let matchCount = 0;
        for (const word of searchWords) {
            if (nameWords.includes(word)) matchCount++;
        }
        
        if (matchCount === searchWords.length || (searchWords[0] && nameWords.includes(searchWords[0]) && (searchName.includes('SP') === name.includes('SP')) && (searchName.includes('UR') === name.includes('UR')))) {
            return id; 
        }
    }
    return null;
}

const missingTranscripts = [];

async function processVideo(target, retries = 3, useFallback = false) {
    console.log(`Processando ${target.name}...`);
    try {
        const transcriptArr = await YoutubeTranscript.fetchTranscript(target.url);
        const transcriptText = transcriptArr.map(t => t.text).join(' ');
        
        const prompt = PROMPT_TEMPLATE.replace('{NOME}', target.name).replace('{TRANSCRIPT}', transcriptText);
        
        const currentModel = useFallback ? fallbackModel : model;
        const result = await currentModel.generateContent(prompt);
        const responseText = result.response.text().trim().replace(/^```json/, '').replace(/```$/, '');
        
        const parsedGuide = JSON.parse(responseText);
        return parsedGuide;
    } catch (err) {
        if (err.message.includes('Transcript is disabled')) {
            console.error(`🚨 Transcript desabilitado para ${target.name}. Adicionando à lista de pendências manuais.`);
            missingTranscripts.push(`${target.name} - ${target.url}`);
            return null;
        }

        if (err.message.includes('429') || err.message.includes('Quota') || err.message.includes('503')) {
            if (!useFallback) {
                console.log(`[Rate Limit / 503] Tentando com o modelo fallback (gemini-2.5-flash-lite) para ${target.name}...`);
                return processVideo(target, retries, true);
            }

            if (retries > 0) {
                console.log(`[Rate Limit / 503] Cota/Demanda excedida até no fallback ao processar ${target.name}. Aguardando 10 segundos antes de tentar novamente...`);
                await new Promise(r => setTimeout(r, 10000));
                return processVideo(target, retries - 1, false);
            }
        }
        console.error(`Erro ao processar ${target.name}: `, err.message);
        return null;
    }
}

async function run() {
    console.log(`Encontrados ${targets.length} vídeos para processar.`);
    
    for (const target of targets) {
        let charId = findCharIdByName(target.name);
        
        if (!charId) {
            console.log(`[Aviso] Não foi possível achar o ID exato para ${target.name}. O guia será salvo usando o nome.`);
            charId = target.name; // Fallback
        }

        // Pular se já tem o guia com "howToPlay"
        if (guidesData[charId] && guidesData[charId].howToPlay) {
            console.log(`[Pulo] Guia para ${target.name} (ID: ${charId}) já existe e possui "howToPlay". Pulando...`);
            continue;
        }

        const guide = await processVideo(target);
        if (guide) {
            // Mesclar dados ou atualizar tudo
            guidesData[charId] = guide;
            fs.writeFileSync(guidesPath, JSON.stringify(guidesData, null, 2), 'utf8');
            console.log(`Salvo guia para ${target.name} (ID: ${charId})`);
        }
        
        // Espera de 15 segundos entre vídeos para evitar 429
        await new Promise(r => setTimeout(r, 15000));
    }
    
    if (missingTranscripts.length > 0) {
        const missingPath = path.join(process.cwd(), 'docs', 'chars', 'sem_transcricao.txt');
        fs.writeFileSync(missingPath, missingTranscripts.join('\n'), 'utf8');
        console.log(`\n🚨 Os seguintes vídeos estão sem transcrição e foram salvos em ${missingPath}:`);
        missingTranscripts.forEach(v => console.log(`- ${v}`));
    }
    
    console.log("Concluído!");
}

run();
