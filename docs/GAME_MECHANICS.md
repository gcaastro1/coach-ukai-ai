# Haikyu!! Fly High - Game Mechanics & Business Logic

## 1. Visão Geral
Este documento atua como a fonte da verdade para as regras de negócio, mecânicas de escalação e cálculos matemáticos do jogo *Haikyu!! Fly High*. O sistema a ser desenvolvido é um "Team Builder" com recomendação de IA que utiliza estas regras para calcular a sinergia e sugerir a melhor formação possível.

## 2. Glossário de Domínio
*   **Character (Personagem):** A entidade base do jogo. Possui status imutáveis no nível 1 e tags de filtro (Escola, Posição, Raridade).
*   **Court Position (Posição na Quadra):** As posições oficiais do vôlei permitidas no jogo: `S` (Levantador), `WS` (Ponteiro), `MB` (Bloqueador Central), `OP` (Oposto) e `Li` (Líbero).
*   **Rarity (Raridade):** O grau do personagem ou memória, classificado como: `N`, `R`, `SR`, `SSR`, `UR`, `SP`.
*   **Bonds (Vínculos):** Sinergia passiva. Um array de `IDs` atrelado a um personagem. Se os personagens correspondentes a esses IDs estiverem em quadra simultaneamente, o bônus de vínculo é ativado.
*   **Memory (Memória/Potencial):** Cartas de equipamento que concedem atributos extras. Os multiplicadores ("parameters") escalonam dependendo do nível da carta.
*   **Awakening (Despertar):** O nível de cópias repetidas que o usuário possui de um personagem. Afeta diretamente o multiplicador do Vínculo.
*   **User Box:** O inventário atual do jogador (quais personagens ele tem, em qual nível, com qual memória equipada).

## 3. Regras de Validação de Time (Escalação)
Para que uma formação seja considerada válida pelo sistema, ela DEVE respeitar obrigatoriamente as seguintes restrições de quadra:
*   O time titular precisa ter exatamente 6 personagens escalados.
*   É obrigatório ter pelo menos 1 jogador na posição `S` (Levantador).
*   É permitido no máximo 1 jogador na posição `Li` (Líbero).
*   Não é permitido escalar duas versões exatas do mesmo personagem em quadra simultaneamente (ex: dois "Shoyo Hinata", mesmo que de raridades diferentes). A validação deve ocorrer pelo nome base.

## 4. Estrutura do Banco de Dados Estático (Game Database)
Os dados estáticos estão localizados em `/src/data/`. A tipagem TS deve seguir este padrão:

### Character Model
*   `id`: number (Chave primária)
*   `name`: string
*   `position`: 'S' | 'WS' | 'MB' | 'OP' | 'Li'
*   `rarity`: 'N' | 'R' | 'SR' | 'SSR' | 'UR' | 'SP'
*   `school`: string
*   `specialty`: string
*   `bonds`: number[] | null (Array contendo os IDs dos personagens que ativam a sinergia)

### Memory Model
*   `id`: number
*   `name`: string
*   `position`: 'S' | 'WS' | 'MB' | 'OP' | 'Li'
*   `rarity`: 'N' | 'R' | 'SR' | 'SSR' | 'UR' | 'SP'
*   `parameters`: string[] (Uma representação em string de arrays escalonados. O código precisará fazer o parse para recuperar o multiplicador correto com base no nível atual da memória).

## 5. Lógica Matemática e Nomenclatura (O `Modelo`)
O procedimento central responsável por receber os 6 jogadores, calcular os multiplicadores e retornar a pontuação do time DEVE ser nomeado estritamente como **`Modelo`** (e não `ModeloComposição`, `TeamScore`, etc.). 

A cascata matemática do `Modelo` deve ser resolvida nesta ordem exata:
1.  **Base Layer:** Calcular os status brutos baseados no nível atual do personagem.
2.  **Memory Layer:** Ler o nível da Memória equipada pelo usuário, resgatar o índice correto dentro do array de `parameters` do JSON estático, e aplicar o buff percentual/fixo sobre os status da Base Layer.
3.  **Bonds Layer (Sinergia):** Varrer a array de 6 jogadores escalados. Cruzar os `bonds` (IDs) para verificar ativações. O multiplicador final aplicado dependerá do nível de Awakening (Despertar) do personagem que gerou o vínculo.
4.  **Output:** Retornar o Score Numérico final do time para o Front-End.