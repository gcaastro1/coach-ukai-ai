export const guideContent = {
  danos: `
# 🧮 A Matemática do Jogo (Como Funcionam os Danos)

Para dominar o jogo e maximizar seus pontos, não basta apenas ter personagens raros (UR/SSR); você precisa entender a matemática que o jogo faz nos bastidores.

## 1. O Sistema de Multiplicadores ("10000")

Em jogos mobile, os desenvolvedores evitam usar números decimais (float) para cálculos de dano e atributos, pois eles podem causar erros de arredondamento. Em vez disso, eles usam inteiros grandes, onde **\`10000\` = \`1.0\` (ou 100%)**.

Se você usa uma habilidade ou um buff, e no código diz que o \`powerfactor\` é \`2500\`, isso significa que o jogador recebeu um buff de **+25%** naquele status. Um fator de \`15000\` significa um multiplicador brutal de **1.5x**.

> [!TIP]
> **Como tirar vantagem disso:** Sempre que ler uma skill que diga "Aumenta o poder em 30%", saiba que o jogo está pegando o seu Status Base de Força, multiplicando por \`13000\` e dividindo por \`10000\`. Foque em acumular buffs de diferentes fontes (Técnico + Passiva + Habilidade) porque eles se multiplicam!

## 2. Multiplicadores de Habilidades (Skills)

As habilidades dos jogadores escalam em níveis. Por exemplo, um multiplicador base pode ser **0.2525x (25.25%)** no nível 1. À medida que você evolui a habilidade, esse valor base é multiplicado.

## 3. Vantagem Tática (Pedra-Papel-Tesoura)

Existe uma restrição tática no código (\`tacticalrestraint_cfg\`) que dita as vantagens entre tipos de jogada. 
A ação de Cortada contra uma Recepção ou um tipo específico de bloqueio gera uma vantagem matemática. Ao ganhar ou perder esse embate, buffs ou debuffs extras são ativados no momento da colisão.
`,
  vitoria: `
# 🏐 Guia da Vitória (O Ciclo da Jogada)

O jogo funciona como um complexo **Pedra-Papel-Tesoura** misturado com **RPG de Turnos**. Cada rali testa atributos específicos em uma ordem exata. Vence quem tiver o maior número na colisão direta.

## 1. O Saque (Serve) vs Recepção (Receive)
* **O Saque:** O sacador usa seu atributo de **Saque / Força**. Um saque "Perfeito" (ou uso de Skill de Saque) aplica um multiplicador massivo (ex: 1.5x) no poder da bola.
* **A Recepção:** O Líbero ou Ponteiro usa seu atributo de **Recepção / Reflexo**. 
* **O Duelo:** Se o poder do Saque for muito superior à Recepção, o jogo gera um "Service Ace" (Ponto Direto). Se o Líbero receber, mas o Saque for muito forte, o jogo classifica o passe como "C-Pass" ou "Bad Pass" (Passe Ruim). Um passe ruim destrói a próxima etapa da sua jogada.

## 2. O Passe / Levantamento (Set)
* O Levantador não ataca a bola diretamente (na maioria das vezes), ele **multiplica o poder do seu Atacante**. O atributo chave aqui é **Técnica / Levantamento**.
* **Condições para o Sucesso:** 
    1. O Levantador precisa receber um "A-Pass" (Passe Perfeito) da Recepção.
    2. Com um Passe Perfeito, o Levantador ganha acesso às suas Skills Especiais.
    3. O Levantador testa seu atributo de Técnica contra o bloqueio adversário para "enganá-los". Se vencer, ele transfere um multiplicador de bônus para a força do Atacante.

## 3. A Cortada (Spike) vs Bloqueio (Block)
Este é o duelo final onde os pontos são decididos:
\`(Força da Cortada * Mult. Skill * Bônus do Levantador) VS (Força do Bloqueio * Mult. Skill)\`

* **Vantagem Tática:** Se você usar uma "Cortada Rápida" (Quick) contra um "Bloqueio Lento/De Leitura" (Read Block), o jogo te dá um multiplicador oculto de vantagem.
* **Dica de Ouro:** Não adianta ter um Hinata nível máximo se o seu Levantador for fraco. Um Levantador forte com um Passe Perfeito pode aplicar um multiplicador de até \`1.5x\` no seu Atacante, superando facilmente um bloqueio triplo.

## 4. A Defesa no Chão (Dig/Receive)
* Se a cortada passar pelo bloqueio (ou for amortecida por ele - *One Touch*), o poder restante da cortada colide com o atributo de **Defesa/Recepção** do jogador no fundo da quadra. Se a defesa vencer, a bola sobe perfeitamente para o contra-ataque.

---

> [!IMPORTANT]
> **Resumo do Meta:**
> 1. **A Guerra da Recepção:** O jogo é decidido no primeiro toque. Um Saque forte destrói o passe inimigo, forçando um levantamento sem bônus, deixando o atacante fraco contra o seu bloqueio.
> 2. **Buffs Cumulativos:** Técnico (+10%) + Levantador (+15%) transformam a sua força em 1.26x.
> 3. **Pedra-Papel-Tesoura:** Analise o tipo de Bloqueio do adversário (Adivinhação vs Leitura) e escolha o tipo de Cortada correto para ganhar o bônus de vantagem.
`,
  time: `
# 👥 Guia Tático: Formação e Posicionamento

## 1. Fundamentos da Formação (Lineup)

* **A Escolha do Levantador:** O levantador é a peça central da sua estratégia.
  * **Kageyama:** Focado em *Ataques Rápidos*.
  * **Oikawa:** Focado em *Ataques de Poder*.
  * **Dica Estratégica:** Se o oponente for focado em *Bloqueio*, utilizar um levantador de *Ataque Rápido* garante uma vantagem tática pesada.

* **Sinergia de Time (Bonds):** 
  * Priorize os *Bonds* de escola (ex: Karasuno), pois oferecem bônus passivos robustos.
  * Em segundo lugar, verifique os *Player Deployment Bonds* (bônus entre personagens específicos em quadra). 
  * **Regra de Ouro:** A qualidade individual e os atributos brutos de um personagem sempre superam um *bond* fraco.

* **Linha de Frente (Front Row):** 
  * Focada primariamente em **Bloqueio**. Posicione aqui os jogadores com os maiores atributos de Bloqueio. O motor do jogo sempre escolhe o personagem com o maior stat da rede para realizar a ação.

* **Linha de Traseira (Back Row):** 
  * Focada em **Recepção**. Posicione aqui os jogadores com os maiores stats de Recepção para assegurar que o primeiro toque chegue perfeito para o levantador.

## 2. Rotação e Posicionamento

O jogo movimenta a rotação dos jogadores no sentido horário sempre que a sua equipe **perde um ponto e recupera a posse** no rali seguinte.

* **O Posicionamento do Levantador:**
  * **Setter Dump (Finalização):** Se o seu levantador (Kageyama/Kenma) possui uma ultimate de ataque direto, ele **obrigatoriamente** precisa estar na linha de frente para executá-la.
  * **Saque (Server):** Se o seu levantador (Oikawa) possui uma ultimate focada em saque pesado, o ideal é alinhá-lo na posição de saque inicial.

## 3. Gestão de Substituições (Subs)

* **Substituições Pré-Saque:** Você pode configurar a substituição automática para que um sacador especialista entre apenas no turno do saque.
* **Cuidado com a Exaustão:** Você possui apenas **4 substituições** no total por partida. Usá-las muito cedo vai drenar suas opções para a reta final do jogo.
* **Gerenciamento do Líbero (Switch Libero):** 
  * O Líbero deve ser configurado para trocar de posição automaticamente com o jogador que possui o menor stat de **Recepção** em quadra (geralmente os bloqueadores centrais). NUNCA configure o Líbero para substituir suas unidades UR valiosas da linha de fundo.

---

> [!TIP]
> **Dica de Evolução de Técnicos:**
> A evolução dos técnicos de equipe custa "Match Records". Subir um técnico do Nível 1 ao 9 custa 80k. Ao desmanchá-lo nesse nível, você recebe 65k de volta (prejuízo pequeno). **Sempre evolua um técnico laranja até o Nv 9 para avaliar seus sub-atributos**. Se vier ruim, desmanche imediatamente. Só leve ao Nível 12 se os bônus vierem excelentes para sua composição!
`,
  atributos: `
# ⚡ Guia de Atributos e Potenciais

Nesta seção detalhamos as regras estruturais e matemáticas para a construção das builds de potenciais.

## 1. Dicionário de Atributos

* **Ataque Potente / Rápido:** Define o poder base dos respectivos ataques.
* **Passe (Set) / Saque (Serve):** Poder base das respectivas jogadas.
* **Percepção (Awareness):** É a **Taxa Crítica (Crit Rate)** para atributos OFENSIVOS.
* **Força (Strength):** É o **Dano Crítico (Crit Damage)** para atributos OFENSIVOS.
* **Reflexo (Reflex):** É a **Taxa Crítica (Crit Rate)** para atributos DEFENSIVOS.
* **Empenho (Spirit):** É o **Dano Crítico (Crit Damage)** para atributos DEFENSIVOS.
* **Técnica de Ataque / Defesa:** Multiplicadores diretos para TODOS os atributos de sua respectiva categoria.

## 2. Regras Globais do Sistema

* Sempre priorize Potenciais **Laranjas (Legendary)**, pois possuem atributos base maiores e até 4 sub-status.
* **Regra dos 900+:** Se o atributo base do personagem for **> 900**, busque exclusivamente sub-atributos em **Porcentagem (%)**.

### A Regra dos Slots (Main Stats)
* **Slot I:** Valor Fixo (Igual ao tema do Set)
* **Slot II:** Porcentagem (%) - **Exclusivo Ofensivo** (Força, Percepção, Passe, Saque)
* **Slot III:** Valor Fixo (Sempre Saque)
* **Slot IV:** Porcentagem (%) - **Exclusivo Defensivo** (Reflexo, Empenho, Recepção, Bloqueio)
* **Slot V:** Valor Fixo (Sempre Recepção)
* **Slot VI:** Porcentagem (%) - **Coringa** (Pode ser ataque, defesa ou Técnicas)

## 3. Builds por Posição

### A. Atacantes / Wing Spikers (WS)
* **Conjunto:** 4 peças de Ataque Potente OU Ataque Rápido.
* **Slot II:** Força % ou Tipo de Ataque do personagem %.
* **Slot IV:** Reflexo % ou Empenho %.
* **Slot VI (Anti-Diluição):** Ataque Potente % ou Técnica de Ataque %. (Use um diferente do que o seu time mais providencia em buffs passivos).

### B. Levantadores / Setters (S)
* **Conjunto:** 4 peças de Saque Preciso (se agressivo como Oikawa) OU 4 peças de Passe (foco em armação).
* **Slot II & VI:** Passe %.
* **Slot IV:** Recepção % ou Defesa %.
* **Sub-atributos (Diversificação):** Passe %, Técnica de Ataque %, Saque %, Percepção %. Evite focar em buffs que o levantador já possui no kit base.

### C. Bloqueadores / Middle Blockers (MB)
* **Conjunto:** 4 peças de Bloqueio (Defensivo) OU 4 peças de Ataque Rápido (Agressivo como Hinata).
* **Slot II:** Ataque Rápido %.
* **Slot IV:** Bloqueio % ou Reflexo %.
* **Slot VI:** Bloqueio %, Técnica de Defesa % ou Ataque Rápido %.

### D. Receptores / Líberos (Li)
* **Conjunto:** 4 peças de Recepção.
* **Slot II:** Percepção %.
* **Slot IV:** Recepção %.
* **Slot VI:** Recepção % ou Técnica de Defesa %.
`,
  clube: `
# 🏆 Disputa de Clube

> [!WARNING]
> Conteúdo ainda não preenchido.
> O texto oficial sobre as mecânicas de Disputa de Clube será adicionado aqui futuramente.
`
};
