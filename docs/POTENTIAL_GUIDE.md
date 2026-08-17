# Guia Definitivo de Potenciais

Este documento contém as regras estruturais e matemáticas para a recomendação de builds.

---

## 1. Dicionário de Atributos (Status) e Seus Efeitos
Com base no meta do jogo, aqui está a explicação exata de como cada atributo funciona:

### Atributos Base (Lado Esquerdo)
- **Ataque Potente (Power Attack) / Ataque Rápido (Quick Attack):** Define o poder base dos respectivos ataques.
- **Passe (Set):** Poder base de levantamento.
- **Saque (Serve):** Poder base do saque.
- **Recepção (Receive) / Bloqueio (Block) / Defesa (Save):** Poder base das ações defensivas correspondentes.

### Atributos Avançados (Lado Direito)
- **Percepção (Awareness):** É a **Taxa Crítica (Crit Rate)** para atributos OFENSIVOS (Ataque Rápido, Ataque Potente, Passe e Saque).
- **Força (Strength):** É o **Dano Crítico (Crit Damage)** para atributos OFENSIVOS.
- **Reflexo (Reflex):** É a **Taxa Crítica (Crit Rate)** para atributos DEFENSIVOS (Recepção, Bloqueio, Defesa).
- **Empenho (Spirit):** É o **Dano Crítico (Crit Damage)** para atributos DEFENSIVOS.
- **Técnica de Ataque (Attack Technique):** Multiplicador direto para TODOS os atributos ofensivos.
- **Técnica de Defesa (Defense Technique):** Multiplicador direto para TODOS os atributos defensivos.

---

## 2. Regras Globais do Sistema

- **Raridade Alvo:** Sempre recomendar peças de raridade Laranja (Legendary). Tem atributos base maiores e até 4 sub-status.
- **Sub-atributos (Regra dos 900+):** Se o atributo base do personagem (sem equipamentos) for **> 900**, o sistema deve priorizar exclusivamente sub-atributos em **Porcentagem (%)**.
- **Regras Fixas de Slots (Main Stats):**
  - **Slot I:** Valor Fixo (Sempre igual ao tema do Set. Ex: Set de Bloqueio = Bloqueio Fixo)
  - **Slot II:** Porcentagem (%) - **Exclusivo para Status Ofensivos** (Força, Percepção, Tipos de Ataque, Passe, Saque)
  - **Slot III:** Valor Fixo (Sempre Saque)
  - **Slot IV:** Porcentagem (%) - **Exclusivo para Status Defensivos** (Reflexo, Empenho, Recepção, Defesa, Bloqueio)
  - **Slot V:** Valor Fixo (Sempre Recepção)
  - **Slot VI:** Porcentagem (%) - **Coringa** (Pode ser qualquer status ofensivo ou defensivo, além de Técnicas)

---

## 3. Lógica de Atributos Principais (Main Stats) por Posição

O sistema deve mapear a classe do personagem para sugerir os status corretos nos Slots chave (II, IV e VI).

### A. Atacantes / Wing Spikers (WS) / Dano Focado
*Personagens focados em pontuar (Ataque Potente ou Ataque Rápido).*

*   **Conjunto (Sets):** 
    *   4 peças de [Ataque Potente] OU 4 peças de [Ataque Rápido] (dependendo do kit do atacante).
*   **Slot II:** Força % (Power Attack %) ou [Tipo de Ataque do personagem] %.
*   **Slot IV:** Reflexo % ou Empenho %.
*   **Slot VI (Regra de Ouro/Anti-Diluição):** **Ataque Potente %** ou **Técnica de Ataque %** (dependendo do tipo principal).
    *   *Lógica:* Como o meta atual envolve suportes que bufam "Técnica de Ataque", usar "Ataque Potente %" no Slot VI impede a diluição dos multiplicadores de dano...
*   **Sub-atributos ideais:** [Tipo de Ataque] %, Força %, Técnica de Ataque %.

### B. Levantadores / Setters (S)
*Personagens responsáveis pela distribuição e, dependendo do kit, pressão no saque.*

*   **Conjunto (Sets):**
    *   **Condição A (Tem Saque Agressivo - ex: Oikawa, Atsumu, Kageyama):** 4 peças de [Saque Preciso] (aumenta Técnica de Ataque no saque).
    *   **Condição B (Foco em Passe Puro - ex: Akaashi):** 4 peças de [Passe] (aumenta poder do passe).
*   **Slot II:** Passe %.
*   **Slot IV:** Recepção % ou Defesa %.
*   **Slot VI:** Passe %.
*   **Sub-atributos ideais (Regra da Diversificação):** Passe %, Técnica de Ataque %, Saque % (se aplicável), Percepção %. 
    *   *Nota no Sistema:* O algoritmo não deve focar apenas em uma fonte de buff que o levantador já possui (ex: se o Oikawa já ganha Força/Dano Crítico no kit, deve-se buscar atributos diferentes como Técnica de Ataque nos sub-status para não diluir o valor).

### C. Bloqueadores / Middle Blockers (MB)
*Focados na defesa de rede e cortes rápidos de oportunidade.*

*   **Conjunto (Sets):** 
    *   **Padrão (Defensivo):** 4 peças de [Bloqueio].
    *   **Agressivos/Foco em Corte (ex: Hinata):** 4 peças de [Ataque Rápido] + 2 peças de [Recepção] ou [Bloqueio].
*   **Slot II:** Ataque Rápido %.
*   **Slot IV:** Bloqueio % ou Reflexo %.
*   **Slot VI:** Bloqueio %, Técnica de Defesa % ou Ataque Rápido % (se for focado em dano).
*   **Sub-atributos ideais:** Bloqueio %, Reflexo, Empenho, Ataque Rápido %.

### D. Receptores / Líberos (Li)
*A base da defesa no fundo de quadra.*

*   **Conjunto (Sets):** 4 peças de [Recepção].
*   **Slot II:** Percepção %.
*   **Slot IV:** Recepção %.
*   **Slot VI:** Recepção % ou Técnica de Defesa %.
*   **Sub-atributos ideais:** Recepção %, Defesa %, Reflexo, Empenho.

---

## 4. Break-points de Cálculo de Dano (Módulo Avançado para o Builder)

Para usuários buscando min-maxing de atacantes (Decisão de Slot II e VI), o sistema pode fazer a seguinte verificação caso o usuário insira os buffs do time atual:

1. **Se o time fornece > 20% Técnica de Ataque OU > 170% de Força (em quadra):**
   * *Ação:* Usar Força % no Slot II.
2. **Se o atacante JÁ USA Ataque Potente % no Slot VI E o time fornece > 75% Técnica de Ataque OU > 210% de Força:**
   * *Ação:* Equipar Força % no Slot II.
3. **Se o atacante JÁ USA Ataque Potente % no Slot VI E o time fornece < 210% de Força:**
   * *Ação:* Equipar Força % no Slot II.