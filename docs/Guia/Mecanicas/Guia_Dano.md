# Guia de Mecânicas: Como Funciona o Dano em Haikyu!! Fly High

Este documento foi estruturado para ser facilmente processado por IA (LLMs e parsers) e contém a modelagem matemática e lógica de atributos do jogo *Haikyu!! Fly High*, com base em testes empíricos do Red Panda e Annakyu.

## 1. A Fórmula Base de Dano / Poder de Ação

A fórmula principal para calcular o poder numérico final de uma ação (ofensiva ou defensiva) é:

**Poder da Ação = 2 × (Multiplicador da Habilidade) × (Status Total do Atributo) × (Multiplicador de Técnica)**

*Nota sobre a constante:* O multiplicador `2` inicial é uma constante confirmada empiricamente em testes que alinha os cálculos aos resultados do jogo (apresentando taxa de precisão de ~99,99%).

### 1.1. Multiplicador da Habilidade (Skill)
- Quando o personagem utiliza uma habilidade ativa (ex.: habilidade de saque listada como "260% do atributo"), o multiplicador utilizado na fórmula é o percentual em decimal (neste caso, `2.6`).
- Para ações normais ou ataques sem ativação de skill, o multiplicador assumido é `1` (100%).

### 1.2. Status Total do Atributo
O "Status Total" é uma acumulação de múltiplos fatores, e não apenas o número primário visível na tela do personagem. O cálculo é ordenado da seguinte forma:
1. **Status Base:** (Número exibido em preto no menu de atributos).
2. **Modificadores Fixos e Percentuais:** (Número verde). Bônus percentuais provenientes de potenciais e memórias são calculados **apenas sobre o Status Base**, e depois somados aos valores fixos (flats).
3. **Bônus de Torcedores:** Valor somado diretamente ao montante.
4. **Vínculos de Posicionamento:** Somado caso existam vínculos entre posições.
5. **Vínculos e Ressonâncias:** Bônus passivos (ex.: Ressonância Nível 1 concede +10% em todos os atributos).
6. **Vantagem de Especialidade:** Adiciona-se +30% caso o jogador possua vantagem direta sobre o oponente naquele atributo.
7. **Condicionais de Partida:** Habilidades que aumentam status após o consumo de stacks ou ações de aliados ativam *durante* a partida e alteram o Status Total no exato momento do turno.

### 1.3. Multiplicador de Técnica
Para o cálculo, é necessário converter a taxa bônus da técnica correspondente em um multiplicador (ex.: +15% de técnica = `1.15`).
- **Ações Ofensivas** (Saque, Cortada) escalam com *Técnica de Ataque*.
- **Ações Defensivas** (Recepção, Bloqueio, Levantamento) escalam com *Técnica de Defesa*.

---

## 2. A Mecânica de Acerto Crítico

Diferente do poder flat, o sistema de acertos críticos divide-se entre ações de ataque e de fundo de quadra.

**Conversão de Atributos:**
- **Ofensiva:** `Percepção` controla a Taxa de Crítico; `Força` controla o Dano Crítico.
- **Defensiva:** `Reflexo` controla a Taxa de Crítico; `Empenho` controla o Dano Crítico.

**Cálculo do Multiplicador Crítico:**
Existe um bônus oculto nativo de +50% (1.5x) para danos críticos.
- A fórmula do multiplicador crítico é: `150% + (Atributo de Força/Empenho %)`
- *Exemplo Prático:* Se a Força adicional do jogador é de 5,44%, o multiplicador ao critar será `155,44%` (fator `1.5544`).

**Cálculo Final do Turno Crítico:**
`Poder da Ação Final = (Poder da Ação Base) × (Multiplicador Crítico)`

---

## 3. Qualidade da Ação (Perfeita, Normal, Ruim)

A diferença direta entre o número do seu atributo e o atributo do adversário dita qual será a **Qualidade da Ação**.

- **Regra de Ouro da Qualidade:** A classificação de uma jogada como "Ruim", "Normal" ou "Perfeita" **NÃO ALTERA** o multiplicador ou valor numérico final do seu dano/poder. Uma cortada "Ruim" gera o mesmo número matemático que uma "Perfeita" se os status e bônus forem os mesmos.
- **Efeito de Sucessão (Cascata):** A qualidade impacta a chance de pontuar dadas as ações encadeadas. Uma qualidade afeta a probabilidade de sucesso da próxima.
  - Recepção Ruim ➔ Aumenta drasticamente a chance de Levantamento Ruim ➔ Cortada Ruim.
  - O inverso também ocorre para ações Perfeitas.
- **Peso Estratégico:** Priorizar apenas atacantes (Força/Cortada) e deixar a recepção da equipe frágil resulta na perda de rodadas, pois o "efeito cascata" fará suas ações caírem de rendimento e permitirá que o oponente bloqueie ou defenda mesmo um poder numérico alto.