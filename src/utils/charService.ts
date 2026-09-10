import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { constants } from 'fs';

export interface Modelo {
  id: string;
  content?: string;
  [key: string]: any;
}

/**
 * Lê todos os arquivos .md e .json do diretório docs/chars/
 * e retorna um array de personagens mapeados para a interface Modelo.
 */
export async function getAllCharacters(): Promise<Modelo[]> {
  const charsDirectory = path.join(process.cwd(), 'docs', 'chars');
  
  try {
    await fs.access(charsDirectory, constants.R_OK);
  } catch {
    return [];
  }

  const fileNames = await fs.readdir(charsDirectory);
  
  const allCharactersDataPromises = fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.json'))
    .map(async (fileName) => {
      // Remove a extensão do arquivo para gerar o id
      const id = fileName.replace(/\.(md|json)$/, '');
      const fullPath = path.join(charsDirectory, fileName);
      const fileContents = await fs.readFile(fullPath, 'utf8');

      if (fileName.endsWith('.md')) {
        // Usa gray-matter para extrair o frontmatter
        const matterResult = matter(fileContents);
        
        const modelo: Modelo = {
          id,
          ...matterResult.data,
          content: matterResult.content,
        };
        return modelo;
      } else {
        // Para arquivos JSON
        try {
          const jsonContent = JSON.parse(fileContents);
          const modelo: Modelo = {
            id,
            ...jsonContent,
          };
          return modelo;
        } catch (error) {
          console.error(`Erro ao fazer parse do JSON no arquivo ${fileName}:`, error);
          return { id }; // Retorna apenas o ID em caso de erro
        }
      }
    });

  const allCharactersData = await Promise.all(allCharactersDataPromises);
  return allCharactersData;
}
