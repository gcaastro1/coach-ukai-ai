# 🏐 Guia de Atributos do Jogo

Este documento lista todos os atributos base dos jogadores encontrados nos arquivos do jogo (especificamente mapeados no `attribute_cfg.json` e `language_cfg.json`), e explica como eles afetam a mecânica e o desempenho em quadra.

Os atributos são divididos em duas categorias principais: **Atributos de Habilidade (Fundamentos)** e **Atributos Físicos/Mentais**.

---

## 🎯 Atributos de Habilidade (Fundamentos)
Estes são os atributos primários que determinam o poder direto de uma ação na quadra. Eles são multiplicados pelos fatores físicos e pelas habilidades passivas na hora de calcular a pontuação de uma jogada.

1. **Saque (发球 - ID 5 / 205)**
   - **Para que serve:** Define a potência e a precisão do saque. Um saque alto reduz a chance de uma recepção perfeita do adversário, podendo resultar em um *Service Ace* ou em um passe quebrado (diminuindo as opções de ataque do inimigo).

2. **Recepção (接球 - ID 4 / 204)**
   - **Para que serve:** A capacidade do jogador de receber saques e ataques fortes. Uma recepção alta garante que a bola chegue perfeitamente na mão do levantador, ativando multiplicadores bônus para o próximo ataque.

3. **Passe (传球 - ID 2 / 202)**
   - **Para que serve:** Exclusivo e fundamental para os Levantadores (Setters). Define a qualidade do passe entregue ao atacante. Passes perfeitos aumentam drasticamente a força do atacante.

4. **Ataque Potente (强攻 - ID 1 / 201)**
   - **Para que serve:** É a força bruta do ataque. Usado geralmente nas pontas. Se sobrepõe à defesa e ao bloqueio adversário usando multiplicadores altos de poder.

5. **Ataque Rápido (快攻 - ID 0 / 200)**
   - **Para que serve:** É a habilidade de executar ataques em velocidade (geralmente pelo meio). Tem mais chances de enganar ou passar por cima de bloqueadores não preparados.

6. **Bloqueio (拦网 - ID 3 / 203)**
   - **Para que serve:** A defesa na rede. Um bloqueio alto pode parar um ataque completamente, amortecer a bola para facilitar a recepção, ou aplicar pressão psicológica no atacante.

7. **Defesa (救球 - ID 6 / 206)**
   - **Para que serve:** A habilidade do líbero e dos defensores de não deixar a bola cair. Salva ataques rápidos e bolas largadas, mantendo a bola em jogo mesmo sob pressão.

---

## 🏃 Atributos Físicos e Mentais (Sub-status)
Esses atributos agem como multiplicadores ou precursores das ações principais listadas acima.

8. **Força (力量 - ID 10)**
   - **Para que serve:** Multiplicador direto para saques fortes e ataques potentes. Ajuda a "quebrar" o bloqueio adversário.

9. **Técnica de Ataque (进攻技巧 - ID 11)**
   - **Para que serve:** Aumenta a chance de sucesso ao fazer jogadas como largadinhas ou usar a parede do bloqueio ao próprio favor (*Block Out*).

10. **Técnica de Defesa (防守技巧 - ID 14)**
    - **Para que serve:** Aumenta a proficiência do líbero e defensores, garantindo uma zona de cobertura maior ao tentar receber ataques e fazer defesas.

11. **Reflexo (反应 - ID 12)**
    - **Para que serve:** Atributo vital para defender ataques rápidos e melhorar a velocidade de armação do bloqueio. Define quem age primeiro em situações de bate-rebate na rede.

12. **Percepção (意识 - ID 9)**
    - **Para que serve:** Ajuda na leitura de jogo. Levantadores com alta percepção enganam os bloqueadores com mais facilidade, e bloqueadores com alta percepção preveem melhor para onde o passe vai.

13. **Vigor (体力 - ID 8)**
    - **Para que serve:** A energia do jogador. Conforme a partida avança (especialmente em sets finais), jogadores com baixo vigor perdem rendimento, reduzindo seus multiplicadores gerais.

14. **Empenho (士气 / 精神 - ID 7 / 13)**
    - **Para que serve:** Representa a motivação e momento do jogador na partida. Um alto empenho permite ativar as habilidades supremas ou passivas de foco com mais frequência e potência.

---
*Nota técnica: Durante a gameplay, os IDs 0 a 6 atuam na fórmula direta da rolagem de dados da jogada ("Rock-Paper-Scissors"), enquanto os IDs 7 a 14 multiplicam os fatores de bônus definidos no `propertypowerfactor_cfg.json`.*
