import { j as e, r as s, t as r } from "./index-BkbHpcr-.js";
import { I as R, m as A, a as C } from "./index-Fqg-IL3_.js";
import { e as S, r as w } from "./renderHighlighted-B0NVcO5Q.js";
import { a as y } from "./applyValues-CkBtKagZ.js";
import { S as Q } from "./ScrollToTopButton-D_XC9fyx.js";
const L = ({ coach: o, coachImage: c, setDisplayed: X, coaches: t, language: u, parameters: k, id: d }) => e.jsx("div", {
    className: "coach-card-wrapper no-select",
    style: z[o?.school],
    onClick: () => X({
        ...t[u],
        parameters: k,
        id: d
    }),
    children: e.jsx("img", {
        className: "coach-image",
        src: c,
        alt: o?.name,
        draggable: "false"
    })
})
    , z = {
        Karasuno: {
            backgroundColor: "rgba(255, 165, 0, 0.4)",
            background: "linear-gradient(33deg,rgba(242, 125, 22, 1) 0%, rgba(184, 167, 116, 1) 34%, rgba(161, 79, 43, 1) 100%)"
        },
        "Aoba Johsai": {
            backgroundColor: "rgba(165,249,241, 0.4)",
            backgroundImage: "linear-gradient(34deg,rgba(32, 105, 101, 0.6) 0%, rgba(29, 231, 253, 0.6) 68%, rgba(165, 249, 241, 0.6) 100%)"
        },
        Nekoma: {
            backgroundColor: "rgba(255, 0, 0, 0.4)",
            backgroundImage: "linear-gradient(34deg,rgba(255, 0, 0, 0.6) 0%, rgba(237, 35, 102, 0.6) 37%, rgba(50, 30, 53, 0.6) 100%)"
        },
        "Date Kogyo": {
            backgroundColor: "rgba(48, 68, 68, 0.4)",
            backgroundImage: "linear-gradient(34deg,rgba(48, 68, 68, 0.6) 0%, rgba(29, 139, 161, 0.6) 65%, rgba(0, 212, 255, 0.6) 100%)"
        },
        Shiratorizawa: {
            backgroundColor: "rgba(136, 0, 91, 0.4)",
            backgroundImage: "linear-gradient(33deg,rgba(49, 12, 92, 0.6) 0%, rgba(169, 0, 247, 0.6) 80%, rgba(50, 88, 168, 0.6) 100%)"
        },
        Fukurodani: {
            backgroundColor: "rgba(208, 176, 79, 0.4)",
            backgroundImage: "linear-gradient(33deg,rgba(230, 230, 53, 0.6) 0%, rgba(168, 153, 39, 0.6) 34%, rgba(125, 100, 25, 0.6) 100%)"
        },
        Inarizaki: {
            backgroundColor: "rgba(87, 80, 74, 0.4)",
            backgroundImage: "linear-gradient(33deg,rgba(87, 80, 74, 1) 0%, rgba(10, 10, 9, 1) 0%, rgba(115, 108, 103, 0.6) 100%)"
        }
    }
    , B = [{
        label: "【教练】",
        text: "教练的能力以蓝色、紫色、橙色3种颜色划分。教练加入队伍指导时，队伍的各项数值将得到提升，教练的品质越高，提升的幅度越大。每个队伍仅能加入1名教练。"
    }, {
        label: "【教练属性】",
        text: "每位教练携带6种基础属性，分别为：传球、发球、接球、拦网、救球、扣球。扣球属性分为快攻和强攻。"
    }, {
        label: "【教练效果】",
        text: "每名教练包含1项专业指导，专业指导可为队伍提供特殊效果。"
    }, {
        label: "【教练升级】",
        text: "使用实战纪录可以进行教练升级，满级为15级。教练升级至3、6、9、12、15级时，可随机获得1条位置优势。位置优势有球员位置限制，当上场队伍中球员的位置和位置优势的位置相同时，可激活此条位置优势效果。每名教练相同位置的位置优势最多可同时出现2条。"
    }, {
        label: "【位置优势】",
        text: `位置优势分为蓝色、紫色、橙色、红色4种品质，不同能力的教练可随机到的位置优势品质会不同，相同的位置优势效果，可能会随机出的数值加成不同。
① 教练能力为蓝色时：70%蓝色、30%紫色品质位置优势；
② 教练能力为紫色时：40%蓝色、50%紫色、10%橙色品质位置优势；
③ 教练能力为橙色时：30%蓝色、40%紫色、25%橙色、5%红色品质位置优势；`
    }]
    , W = [{
        label: "[Coach]",
        text: "Coaches are categorized by Rare, Epic, and Legendary rarities. When a Coach joins a team for guidance, the team's Stats will be enhanced. The higher the Coach's Rarity, the greater the enhancement. Each team can only have 1 Coach."
    }, {
        label: "[Coach Stats]",
        text: "Each Coach possesses 6 basic Stats: Set, Serve, Receive, Block, Save, and Spike. Spike Stats are divided into Quick ATK and Power ATK."
    }, {
        label: "[Coach Effects]",
        text: "Each Coach includes 1 Expert Guidance that provides special effects for the team."
    }, {
        label: "[Coach Upgrade]",
        text: "Use Match Records to upgrade Coaches. Level Max is Level 15. When a Coach upgrades to Level 3, 6, 9, 12, or 15, they can randomly obtain 1 Positional Advantage. Positional Advantages have Player position restrictions. When the position of players on the court matches the position of the Positional Advantage, this Positional Advantage effect can be Activated. Each Coach can have a maximum of 2 Positional Advantages for the same position simultaneously."
    }, {
        label: "[Positional Advantage]",
        text: `Positional Advantages are divided into 4 Rarity types: Rare, Epic, Legendary, and Mythic. Coaches with different abilities can randomly obtain Positional Advantages of different rarities. The same Positional Advantage effect may have different randomly generated stat bonuses.
① When Coach ability is Rare: 70% Rare, 30% Epic Rarity Positional Advantages;
② When Coach ability is Epic: 40% Rare, 50% Epic, 10% Legendary Rarity Positional Advantages;
③ When Coach ability is Legendary: 30% Rare, 40% Epic, 25% Legendary, 5% Mythic Rarity Positional Advantages`
    }, {
        text: `Due to the randomness of the position and stat rolls, it is very hard to get a good coach.
Ex: Block advantages for positions other than MB, especially Liberos who can't block`
    }]
    , K = [{
        label: "[โค้ช]",
        text: "โค้ชแบ่งเป็น 3 ระดับ ได้แก่ Rare, Epic และ Legendary เมื่อโค้ชเข้าร่วมทีมเพื่อให้คำแนะนำ ค่าสมรรถภาพของทีมจะเพิ่มขึ้น โดยจะยิ่งเพิ่มมากขึ้นอีกตามระดับของโค้ช แต่ละทีมสามารถมีโค้ชได้เพียง 1 คนเท่านั้น"
    }, {
        label: "[สมรรถภาพโค้ช]",
        text: "โค้ชแต่ละคนมีสมรรถภาพพื้นฐาน 6 ประเภท: ส่ง, เสิร์ฟ, รับ, บล็อก, เซฟ และตบ ค่าตบแบ่งเป็นบุกเร็วและตบแรง"
    }, {
        label: "[เอฟเฟกต์โค้ช]",
        text: "โค้ชแต่ละคนมีคำแนะนำที่เชี่ยวชาญ 1 อย่างที่ให้เอฟเฟกต์พิเศษแก่ทีม"
    }, {
        label: "[อัปเกรดโค้ช]",
        text: "ใช้บันทึกการแข่งเพื่ออัปเกรดโค้ช โดยเลเวลสูงสุดคือเลเวล 15 และจะสุ่มได้รับความได้เปรียบตำแหน่ง 1 อย่างเมื่ออัปเกรดโค้ชถึงเลเวล 3, 6, 9, 12 หรือ 15 ซึ่งความได้เปรียบตำแหน่งจะจำกัดตำแหน่งผู้เล่น เมื่อตำแหน่งของผู้เล่นในสนามตรงกับเงื่อนไขของความได้เปรียบตำแหน่ง จะสามารถเปิดใช้เอฟเฟกต์ความได้เปรียบตำแหน่งได้ โค้ชแต่ละคนสามารถมีความได้เปรียบตำแหน่งสำหรับตำแหน่งเดียวกันได้สูงสุด 2 รายการพร้อมกัน"
    }, {
        label: "[ความได้เปรียบตำแหน่ง]",
        text: `แบ่งเป็น 4 ระดับ ได้แก่ Rare, Epic, Legendary และ Mythic โค้ชที่มีความสามารถต่างกันจะได้รับความได้เปรียบตำแหน่งที่แตกต่างกันแบบสุ่ม เอฟเฟกต์ของความได้เปรียบตำแหน่งที่ตำแหน่งเดียวกันอาจสุ่มให้โบนัสสมรรถภาพที่แตกต่างกัน
① เมื่อความสามารถโค้ชเป็น Rare: จะมีโอกาสสุ่มความได้เปรียบตำแหน่ง Rare 70%, Epic 30%
② เมื่อความสามารถโค้ชเป็น Epic: จะมีโอกาสสุ่มความได้เปรียบตำแหน่ง Rare 40%, Epic 50%, Legendary 10%
③ เมื่อความสามารถโค้ชเป็น Legendary: จะมีโอกาสสุ่มความได้เปรียบตำแหน่ง Rare 30%, Epic 40%, Legendary 25%, Mythic 5%`
    }]
    , N = [{
        label: "[Entraîneur]",
        text: "les entraîneurs sont classés par rareté : rare, épique et légendaire. Déployer un entraîneur à une équipe améliore les statistiques de l'équipe. Plus la rareté de l'entraîneur est élevée, plus l'amélioration est importante. Chaque équipe ne peut avoir qu'1 entraîneur."
    }, {
        label: "[Statistiques de l'entraîneur]",
        text: "chaque entraîneur possède 6 statistiques de base : passe, service, réception, contre, sauvetage et smash. Les statistiques de smash sont divisées en ATQ rapide et ATQ puissante."
    }, {
        label: "[Effets de l'entraîneur]",
        text: "chaque entraîneur inclut 1 encadrement expert qui fournit des effets spéciaux pour l'équipe."
    }, {
        label: "[Amélioration de l'entraîneur]",
        text: "utilisez les rapports de match pour améliorer les entraîneurs. Le niveau maximum est le niveau 15. Quand un entraîneur passe au niveau 3, 6, 9, 12 ou 15, il peut obtenir aléatoirement 1 avantage positionnel. Ces derniers ont des restrictions de position de joueur. Quand la position des joueurs sur le terrain correspond à la position de l'avantage positionnel, cet effet s'active. Chaque entraîneur peut avoir un maximum de 2 avantages positionnels pour la même position simultanément."
    }, {
        label: "[Avantage positionnel]",
        text: `les avantages positionnels sont divisés en 4 types de rareté : rare, épique, légendaire et mythique. Les entraîneurs avec différentes capacités peuvent obtenir aléatoirement des avantages positionnels de différentes raretés. Le même effet d'avantage positionnel peut avoir différents bonus de statistiques générés aléatoirement.
① Quand la capacité d'entraîneur est rare : 70 % d'avantages positionnels rares, 30 % épiques ;
② Quand la capacité d'entraîneur est épique : 40 % rares, 50 % épiques, 10 % d'avantages positionnels légendaires ;
③ Quand la capacité d'entraîneur est légendaire : 30 % rares, 40 % épiques, 25 % légendaires, 5 % d'avantages positionnels mythiques ;`
    }]
    , D = [{
        label: "[Entrenador]",
        text: "Los entrenadores se categorizan por las siguientes rarezas: raro, épico y legendario. Cuando un entrenador se une a un equipo para dar orientación, las estadísticas del equipo se mejorarán. Cuanto mayor sea la rareza del entrenador, mayor será la mejora. Cada equipo solo puede tener 1 entrenador."
    }, {
        label: "[Estadísticas del entrenador]",
        text: "Cada entrenador posee 6 atributos básicos: Colocación, Saque, Recepción, Bloqueo, Defensa y Remate. Los atributos de Remate se dividen en ATQ rápido y ATQ poderoso."
    }, {
        label: "[Efectos del entrenador]",
        text: "Cada entrenador incluye 1 orientación experta que proporciona efectos especiales para el equipo."
    }, {
        label: "[Mejora del entrenador]",
        text: "Usa registros de partidos para mejorar entrenadores. El nivel máximo es el nivel 15. Cuando un entrenador mejora al nivel 3, 6, 9, 12 o 15, puede obtener aleatoriamente 1 ventaja posicional. Las ventajas posicionales tienen restricciones de posición de jugador. Cuando la posición de los jugadores en la cancha coincide con la posición de la ventaja posicional, este efecto de ventaja posicional puede activarse. Cada entrenador puede tener un máximo de 2 ventajas posicionales para la misma posición simultáneamente."
    }, {
        label: "[Ventaja posicional]",
        text: `Las ventajas posicionales se dividen en 4 tipos de rareza: raro, épico, legendario y mítico. Los entrenadores con diferentes habilidades pueden obtener aleatoriamente ventajas posicionales de diferentes rarezas. El mismo efecto de ventaja posicional puede tener diferentes bonificaciones de estadísticas generadas aleatoriamente.
① Cuando la habilidad del entrenador es rara: 70% de ventajas posicionales de rareza rara, 30% épica;
② Cuando la habilidad del entrenador es épica: 40% rara, 50% épica, 10% de ventajas posicionales de rareza legendaria;
③ Cuando la habilidad del entrenador es legendaria: 30% rara, 40% épica, 25% legendaria, 5% de ventajas posicionales de rareza mítica;`
    }]
    , I = [{
        label: "[Treinador]",
        text: "os treinadores são categorizados pelas raridades Raro, Épico e Lendário. Posicionar um treinador em uma equipe aprimora os atributos da equipe. Quanto maior a raridade do treinador, maior o incremento. Cada equipe pode ter apenas 1 treinador."
    }, {
        label: "[Atributos do treinador]",
        text: "cada treinador tem 6 atributos básicos: Levantamento, Saque, Recepção, Bloqueio, DEF e ATQ. Os atributos de ATQ são divididos em ATQ Rápido e ATQ Potente."
    }, {
        label: "[Efeitos do treinador]",
        text: "cada treinador inclui 1 Orientação Especializada que fornece efeitos especiais para a equipe."
    }, {
        label: "[APR do treinadores]",
        text: "use os registros de partida para melhorar os treinadores até o Nv. 15. Quando um treinador sobre para o Nv. 3, 6, 9, 12 ou 15, ele pode obter aleatoriamente 1 vantagem de posição. As vantagens de posição poderão apresentar restrições conforme a posição do jogador. Quando a posição de um jogador em quadra corresponde à posição da vantagem de posição, seu efeito será ativado. Cada treinador pode ter no máximo 2 vantagens de posição para a mesma posição."
    }, {
        label: "[Vantagem de posição]",
        text: `As vantagens de posição são divididas em 4 tipos de Raridade: Raro, Épico, Lendário e Mítico. Treinadores com diferentes habilidades podem obter aleatoriamente vantagens de posição de diferentes raridades. O mesmo efeito de vantagem de posição pode acabar gerando diferentes bônus de atributos.
① Para uma habilidade de treinador Rara: vantagens de posição 70% Raras e 30% Épicas;
② Para uma habilidade do treinador Épica: vantagens de posição 40% Raras, 50% Épicas e 10% Lendárias;
③ Para uma habilidade do treinador Lendária: vantagens de posição 30% Raras, 40% Épicas, 25% Lendárias e 5% Míticas.`
    }]
    , M = [{
        label: "[Trainer]",
        text: "Trainer-Fähigkeiten werden in drei Seltenheiten unterteilt: Selten, Episch und Legendär. kategorisiert. Wenn du einen Trainer für ein Team einsetzt, werden die Werte des Teams verbessert. Je seltener der Trainer ist, desto größer ist der Boost. Jedes Team kann nur einen Trainer haben."
    }, {
        label: "[Trainer-Werte]",
        text: "Jeder Trainer besitzt 6 Grundwerte: Zuspielen, Aufschlagen, Annehmen, Blocken, Retten und Schmettern. Schmettern-Werte sind in Schnell-ANG und Kraft-ANG unterteilt."
    }, {
        label: "[Trainer-Effekte]",
        text: "Jeder Trainer besitzt 1 Expertenanleitung, die Spezialeffekte für das Team bietet."
    }, {
        label: "[Trainer-Aufwertung]",
        text: "Verwende Match-Aufzeichnungen, um Trainer aufzuwerten. Max. Level ist Level 15. Wenn ein Trainer Level 3, 6, 9, 12 oder 15 erreicht, kann er einen zufälligen Positionsvorteil erhalten. Positionsvorteile haben Spieler-Positionsbeschränkungen. Wenn die Position der Spieler auf dem Spielfeld mit der Position des Positionsvorteils übereinstimmt, wird dieser Positionsvorteil-Effekt aktiviert. Jeder Trainer kann bis zu 2 Positionsvorteile pro Position haben."
    }, {
        label: "[Positionsvorteil]",
        text: `Positionsvorteile sind in 4 Seltenheiten unterteilt: Selten, Episch, Legendär und Mythisch. Trainer mit unterschiedlichen Fähigkeiten können zufällig Positionsvorteile verschiedener Seltenheiten erhalten. Derselbe Positionsvorteil-Effekt kann verschiedene zufällig generierte Wertboni haben.
① Wenn Trainer-Fähigkeit „Selten“ ist: seltene Positionsvorteile – 70 %, epische Positionsvorteile – 30 %;
② Wenn Trainer-Fähigkeit „Episch“ ist: seltene Positionsvorteile – 40 %, epische Positionsvorteile (Episch) – 50 %, legendäre Positionsvorteile – 10 %;
③ Wenn Trainer-Fähigkeit „Legendär“ ist: seltene Positionsvorteile – 30 %, epische Positionsvorteile – 40 %, legendäre Positionsvorteile – 25 %, mythische Positionsvorteile – 5 %.`
    }]
    , F = {
        cn: B,
        en: W,
        th: K,
        fr: N,
        es: D,
        pt: I,
        in: [{
            label: "[Pelatih]",
            text: "Pelatih dikategorikan berdasarkan tingkat kelangkaan Rare, Epic, dan Legendary. Ketika Pelatih bergabung dengan tim untuk memberikan bimbingan, Stat tim akan meningkat. Makin tinggi tingkat kelangkaan Pelatih, makin besar peningkatannya. Setiap tim hanya bisa memiliki 1 Pelatih."
        }, {
            label: "[Stat Pelatih]",
            text: "Setiap Pelatih memiliki 6 Stat dasar: Set, Serve, Receive, Block, Cover, dan Spike. Stat Spike dibagi menjadi Quick Attack dan Power Attack."
        }, {
            label: "[Efek Pelatih]",
            text: "Setiap Pelatih memiliki 1 Panduan Pakar yang memberikan efek khusus untuk tim."
        }, {
            label: "[Peningkatan Pelatih]",
            text: "Gunakan Catatan Pertandingan untuk meningkatkan Pelatih. Level Maks adalah Level 15. Ketika Pelatih meningkat ke Level 3, 6, 9, 12, atau 15, mereka dapat memperoleh secara acak 1 Keunggulan Posisi. Keunggulan Posisi memiliki batasan posisi pemain. Ketika posisi para pemain di lapangan sesuai dengan posisi dalam Keunggulan Posisi, efek Keunggulan Posisi ini dapat diaktifkan. Setiap Pelatih dapat memiliki maksimal 2 Keunggulan Posisi sekaligus untuk posisi yang sama."
        }, {
            label: "[Keunggulan Posisi]",
            text: `Keunggulan Posisi dibagi menjadi 4 jenis Tingkat Kelangkaan: Rare, Epic, Legendary, dan Mythic. Pelatih dengan kemampuan berbeda dapat memperoleh secara acak Keunggulan Posisi dengan tingkat kelangkaan berbeda. Efek Keunggulan Posisi yang sama dapat memiliki bonus stat yang berbeda, yang dihasilkan secara acak.
① Ketika kemampuan Pelatih adalah Rare: Keunggulan Posisi Tingkat Kelangkaan 70% Rare, 30% Epic;
② Ketika kemampuan Pelatih adalah Epic: Keunggulan Posisi Tingkat Kelangkaan 40% Rare, 50% Epic, 10% Legendary;
③ Ketika kemampuan Pelatih adalah Legendary: Keunggulan Posisi Tingkat Kelangkaan 30% Rare, 40% Epic, 25% Legendary, 5% Mythic;`
        }],
        de: M
    }
    , U = [{
        id: 1001,
        effect: {
            cn: "强攻/快攻属性增加35",
            en: "Increases Power Attack/Quick Attack stat by 35",
            th: "เพิ่มค่าตบแรง/บุกเร็วขึ้น 35 หน่วย",
            fr: "Augmente la stat d'attaque puissante/rapide de 35",
            es: "Aumenta el atributo Ataque rápido/poderoso en 35",
            pt: "Aumenta o atributo Ataque Potente/Rápido em 35",
            in: "Stat Power/Quick Attack akan meningkat sebesar 35",
            de: "Erhöht den Kraft-/Schnellangriff-Wert um 35"
        }
    }, {
        id: "1002",
        effect: {
            cn: "接球属性增加35",
            en: "Increases Receive stat by 35",
            th: "เพิ่มค่ารับขึ้น 35",
            fr: "Augmente la stat de réception de 35",
            es: "Aumenta el atributo Recepción en 35",
            pt: "Aumenta o atributo Recepção em 35",
            in: "Stat Receive akan meningkat sebesar 35",
            de: "Erhöht den Annahmewert um 35"
        }
    }, {
        id: "1003",
        effect: {
            cn: "发球属性增加35",
            en: "Increases Serve stat by 35",
            th: "เพิ่มค่าเสิร์ฟ 35 หน่วย",
            fr: "Augmente la stat de service de 35",
            es: "Aumenta el atributo Saque en 35",
            pt: "Aumenta o atributo Saque em 35",
            in: "Stat Serve akan meningkat sebesar 35",
            de: "Erhöht den Aufschlag-Wert um 35"
        }
    }, {
        id: "1004",
        effect: {
            cn: "传球属性增加35",
            en: "Increases Set stat by 35",
            th: "เพิ่มค่าส่ง 35 หน่วย",
            fr: "Augmente la stat de passe de 35",
            es: "Aumenta el atributo Colocación en 35",
            pt: "Aumenta o atributo Levantamento em 35",
            in: "Stat Set akan meningkat sebesar 35",
            de: "Erhöht den Zuspiel-Wert um 35"
        }
    }, {
        id: "1005",
        effect: {
            cn: "拦网属性增加35",
            en: "Increases Block stat by 35",
            th: "เพิ่มค่าบล็อกขึ้น 35",
            fr: "Augmente la stat de contre de 35",
            es: "Aumenta el atributo Bloqueo en 35",
            pt: "Aumenta o atributo Bloqueio em 35",
            in: "Stat Block akan meningkat sebesar 35",
            de: "Erhöht den Blockwert um 35"
        }
    }, {
        id: "1006",
        effect: {
            cn: "救球属性增加35",
            en: "Increases Save stat by 35",
            th: "เพิ่มค่าเซฟ 35 หน่วย",
            fr: "Augmente la stat de sauvetage de 35",
            es: "Aumenta el atributo Recuperación en 35",
            pt: "Aumenta o atributo Defesa em 35",
            in: "Stat Cover akan meningkat sebesar 35",
            de: "Erhöht den Retten-Wert um 35"
        }
    }]
    , O = [{
        id: 2001,
        effect: {
            cn: "强攻/快攻属性增加X% (3-6%)",
            en: "Increases Power Attack/Quick Attack stat by X% (3-6%)",
            th: "เพิ่มค่าตบแรง/บุกเร็วขึ้น X% (3-6%)",
            fr: "Augmente les stats d'attaque puissante/rapide de X% (3-6%)",
            es: "Aumenta el atributo Ataque rápido/poderoso en un X% (3-6%)",
            pt: "Aumenta o atributo Ataque Potente/Rápido em X% (3-6%)",
            in: "Stat Power/stat Quick Attack akan meningkat sebesar X% (3-6%)",
            de: "Erhöht den Kraftangriff-/Schnellangriff-Wert um X% (3-6%)"
        }
    }, {
        id: 2002,
        effect: {
            cn: "接球属性增加X% (3-6%)",
            en: "Increases Receive stat by X% (3-6%)",
            th: "เพิ่มค่ารับขึ้น X% (3-6%)",
            fr: "Augmente la stat de réception de X% (3-6%)",
            es: "Aumenta el atributo Recepción en un X% (3-6%)",
            pt: "Aumenta o atributo Recepção em X% (3-6%)",
            in: "Stat Receive akan meningkat sebesar X% (3-6%)",
            de: "Erhöht den Annahme-Wert um X% (3-6%)"
        }
    }, {
        id: 2003,
        effect: {
            cn: "发球属性增加X% (3-6%)",
            en: "Increases Serve stat by X% (3-6%)",
            th: "เพิ่มค่าเสิร์ฟขึ้น X% (3-6%)",
            fr: "Augmente la stat de service de X% (3-6%)",
            es: "Aumenta el atributo Saque en un X% (3-6%)",
            pt: "Aumenta o atributo Saque em X% (3-6%)",
            in: "Stat Serve akan meningkat sebesar X% (3-6%)",
            de: "Erhöht Aufschlag-Wert um X% (3-6%)"
        }
    }, {
        id: 2004,
        effect: {
            cn: "传球属性增加X% (3-6%)",
            en: "Increases Set stat by X% (3-6%)",
            th: "เพิ่มค่าส่งขึ้น X% (3-6%)",
            fr: "Augmente la stat de passe de X% (3-6%)",
            es: "Aumenta el atributo Pase en un X% (3-6%)",
            pt: "Aumenta o atributo Passe em X% (3-6%)",
            in: "Stat Set akan meningkat sebesar X% (3-6%)",
            de: "Erhöht den Zuspiel-Wert um X% (3-6%)"
        }
    }, {
        id: 2005,
        effect: {
            cn: "拦网属性增加X% (3-6%)",
            en: "Increases Block stat by X% (3-6%)",
            th: "เพิ่มค่าบล็อกขึ้น X% (3-6%)",
            fr: "Augmente la stat de contre de X% (3-6%)",
            es: "Aumenta el atributo Bloqueo en un X% (3-6%)",
            pt: "Aumenta o atributo Bloqueio em X% (3-6%)",
            in: "Stat Block akan meningkat sebesar X% (3-6%)",
            de: "Erhöht Blocken-Wert um X% (3-6%)"
        }
    }, {
        id: 2006,
        effect: {
            cn: "救球属性增加X% (3-6%)",
            en: "Increases Save stat by X% (3-6%)",
            th: "เพิ่มค่าเซฟ X% (3-6%) หน่วย",
            fr: "Augmente la stat de sauvetage de X% (3-6%)",
            es: "Aumenta el atributo Recuperación en un X% (3-6%)",
            pt: "Aumenta o atributo Defesa em X% (3-6%)",
            in: "Stat Cover akan meningkat sebesar X% (3-6%)",
            de: "Erhöht den Retten-Wert um X% (3-6%)"
        }
    }]
    , V = [{
        id: 3001,
        effect: {
            cn: "进攻技巧增加X% (3-10%)",
            en: "Increases Attack Technique by X% (3-10%)",
            th: "เพิ่มเทคนิคบุกขึ้น X% (3-10%)",
            fr: "Augmente la technique offensive de X% (3-10%)",
            es: "Aumenta la Técnica ofensiva en un X% (3-10%)",
            pt: "Aumenta a Técnica de Ataque em X% (3-10%)",
            in: "Teknik Serangan akan meningkat sebesar X% (3-10%)",
            de: "Erhöht die Angriffstechnik um X% (3-10%)"
        }
    }, {
        id: 3002,
        effect: {
            cn: "球过网时，强攻/快攻属性增加X% (3-10%)，最多4层，持续1个回合",
            en: "When the ball crosses the net, increases Power/Quick ATK stat by X% (3-10%), up to 4 stacks, lasting 1 rally",
            th: "เมื่อลูกข้ามเน็ต จะเพิ่มค่าตบแรง/บุกเร็วขึ้น X% (3-10%) สูงสุด 4 สแต็ก เป็นเวลา 1 รอบ",
            fr: "Quand le ballon traverse le filet, augmente la statistique d'ATQ puissante/rapide de X% (3-10%), jusqu'à 4 cumuls, durant 1 manches",
            es: "Cuando el balón cruza la red, aumenta el atributo ATQ poderoso/ATQ rápido en un X% (3-10%). Se acumula hasta 4 veces. Dura 1 rondas",
            pt: "Quando a bola cruza a rede, aumenta o atributo de ATQ Potente/Rápido em X% (3-10%), até 4 acúmulos, por 1 rodadas",
            in: "Saat bola melewati net, meningkatkan stat Power/Quick Attack sebesar X% (3-10%), hingga 4 tumpuk, berlangsung 1 babak",
            de: "Erhöht, wenn der Ball das Netz überquert den Kraft-/Schnellangriff-Wert um X% (3-10%) (bis zu 4 Stapel, 1 Runden)"
        }
    }, {
        id: 3003,
        effect: {
            cn: "体力高于90点时，扣球的威力增加，增加值为强攻/快攻属性的X% (15-50%)",
            en: "When stamina is above 90 points, increases Spike power by X% (15-50% in increments of 5) of Power/Quick ATK stat",
            th: "เมื่อพลังกายมากกว่า 90 หน่วย จะเพิ่มพลังตบขึ้น X% (15-50%) ของค่าตบแรง/บุกเร็ว",
            fr: "Quand l'endurance est supérieure à 90 points, augmente la puissance de smash de X% (15-50%) de la statistique dATQ puissante/rapide",
            es: "Cuando la resistencia está por encima de 90 puntos, aumenta el poder de Remate en un valor equivalente al X% (15-50%) del atributo ATQ poderoso/ATQ rápido",
            pt: "Quando o Vigor estiver acima de 90 pontos, aumenta a potência da Cortada em X% (15-50%) dos atributos de ATQ Potente/Rápido",
            in: "Saat stamina di atas 90 poin, meningkatkan power Spike sebesar X% (15-50%) stat Power/Quick Attack",
            de: "Erhöht, wenn die Ausdauer über 90 Punkte liegt, die Schmettern-Kraft um X% (15-50%) des Kraft-/Schnellangriff-Werts"
        }
    }, {
        id: 3004,
        effect: {
            cn: "我方比分落后时，基础属性增加X% (3-10%)",
            en: "When your side is behind, increases Basic Stats by X% (3-10%)",
            th: "เมื่อฝ่ายเราคะแนนตามหลัง จะเพิ่มสมรรถภาพพื้นฐานขึ้น X% (3-10%)",
            fr: "Quand votre équipe est menée, augmente les statistiques de base de X% (3-10%)",
            es: "Cuando tu equipo esté perdiendo, aumenta los atributos básicos en un X% (3-10%)",
            pt: "Quando o seu lado estiver perdendo, aumenta os atributos básicos em X% (3-10%)",
            in: "Saat kubumu tertinggal, meningkatkan Stat Dasar sebesar X% (3-10%)",
            de: "Erhöht, wenn deine Seite im Rückstand ist, die Grundwerte um X% (3-10%)"
        }
    }, {
        id: 3005,
        effect: {
            cn: "接球或传球时，基础属性增加X% (3-10%)，持续2次过网",
            en: "When performing a Receive or Set, increases Basic Stats by X% (3-10%), lasting for 2 net crossings",
            th: "เมื่อรับหรือส่งลูก จะเพิ่มสมรรถภาพพื้นฐานขึ้น X% (3-10%) เป็นเวลา 2 เทิร์น",
            fr: "Lors d'une réception ou d'une passe, augmente les statistiques de base de X% (3-10%), durant 2 échanges au filet",
            es: "Cuando se ejecuta una recepción o una colocación, los atributos básicos aumentan en un X% (3-10%) durante 2 cruces de red",
            pt: "Ao realizar uma Recepção ou Passe, aumenta os atributos básicos em X% (3-10%), com duração de 2 cruzamentos de rede",
            in: "Saat melakukan Receive atau Set, meningkatkan Stat Dasar sebesar X% (3-10%), berlangsung selama 2 permainan lewat net",
            de: "Erhöht beim Ausführen von Annahmen oder Zuspielen die Grundwerte um X% (3-10%), dauert 2 Netzüberquerungen"
        }
    }, {
        id: 3006,
        effect: {
            cn: "接球时，我方下次扣球球员的进攻技巧增加X% (3-10%)",
            en: "When performing a Receive, increases your side's next spiking player's ATK Technique by X% (3-10%)",
            th: "เมื่อรับลูก จะเพิ่มเทคนิคบุกของผู้เล่นในทีมที่จะตบครั้งถัดไปขึ้น X% (3-10%)",
            fr: "Lors d'une réception, augmente la technique offensive du prochain joueur attaquant de votre équipe de X% (3-10%)",
            es: "Cuando se ejecuta una recepción, aumenta la Técnica ATQ del siguiente rematador de tu equipo en un X% (3-10%)",
            pt: "Ao realizar uma Recepção, aumenta a técnica de ATQ do próximo atacante do seu time em X% (3-10%)",
            in: "Saat melakukan Receive, meningkatkan Teknik Serangan pemain spike berikutnya di kubumu sebesar X% (3-10%)",
            de: "Erhöht beim Ausführen von Annehmen die Angriffstechnik des nächsten angreifenden Spielers deiner Seite um X% (3-10%)"
        }
    }, {
        id: 3007,
        effect: {
            cn: "释放绝技时，回复X (3-10)点体力",
            en: "When casting Ultimate skills, recovers X (3-10) Stamina",
            th: "เมื่อใช้สกิลไม้ตาย จะฟื้นฟูพลังกาย X (3-10) หน่วย",
            fr: "Lors de l'utilisation de compétences d'ultime, récupère X (3-10) d'endurance",
            es: "Al usar habilidades definitivas, recupera X (3-10) de resistencia",
            pt: "Ao usar habilidades Supremas, recupera X (3-10) de Vigor",
            in: "Saat menggunakan skill Ultimate, memulihkan X (3-10) Stamina",
            de: "Erholt beim Einsetzen von Ultima-Skills X (3-10) Ausdauer"
        }
    }, {
        id: 3008,
        effect: {
            cn: "传球时，我方下次扣球球员的进攻技巧增加X% (3-10%)",
            en: "When performing a Set, increases your side's next spiking player's ATK Technique by X% (3-10%)",
            th: "เมื่อส่งลูก จะเพิ่มเทคนิคบุกของผู้เล่นในทีมที่จะตบครั้งถัดไปขึ้น X% (3-10%)",
            fr: "Lors d'une passe, augmente la technique offensive du prochain joueur attaquant de votre équipe de X% (3-10%)",
            es: "Cuando se ejecuta un pase, aumenta la Técnica ATQ del siguiente rematador de tu equipo en un X% (3-10%)",
            pt: "Ao realizar um Passe, aumenta a técnica de ATQ do próximo atacante do seu time em X% (3-10%)",
            in: "Saat melakukan Set, meningkatkan Teknik Serangan pemain spike berikutnya di kubumu sebesar X% (3-10%)",
            de: "Erhöht beim Ausführen von Zuspielen die Angriffstechnik des nächsten angreifenden Spielers deiner Seite um X% (3-10%)"
        }
    }, {
        id: 3009,
        effect: {
            cn: "拦网结果为BAD时，我方后排球员接球的威力增加，增加值为接球属性的 X% (15-50%)，持续2次过网",
            en: "When the Block result is BAD, increases your side's back row players' Receive power by X% (15-50% in increments of 5) of their Receive stat, lasting for 2 net crossings",
            th: "เมื่อบล็อกติด BAD จะเพิ่มพลังรับของผู้เล่นแถวหลังในทีมขึ้น X% (15-50%) ของค่ารับของพวกเขา เป็นเวลา 2 เทิร์น",
            fr: "Quand le résultat du contre est MAUVAIS, augmente la puissance de réception des joueurs arrière de votre équipe de X% (15-50%) de leur statistique de réception, durant 2 échanges au filet",
            es: "Cuando el resultado del bloqueo es MALO, aumenta el poder de recepción de los jugadores de la fila trasera de tu equipo en un valor equivalente al X% (15-50%) de su atributo Recepción durante 2 cruces de red",
            pt: "Quando o resultado do Bloqueio for RUIM, aumenta a potência da Recepção dos jogadores da linha de defesa do seu time em X% (15-50%) do atributo de suas Recepções, com duração de 2 cruzamentos de rede",
            in: "Saat hasil Block BURUK, meningkatkan power Receive para pemain baris belakang kubumu sebesar X% (15-50%) stat Receive mereka, berlangsung selama 2 permainan lewat net",
            de: "Erhöht, wenn das Blocken-Ergebnis BAD ist, die Annahme-Kraft der Spieler der hinteren Reihe deiner Seite um X% (15-50%) ihres Annahme-Werts für 2 Netzüberquerungen"
        }
    }, {
        id: 3010,
        effect: {
            cn: "拦网时，防守技巧增加X% (4-18%)，持续2次过网",
            en: "When performing a Block, DEF Technique increases by X% (4-18% in increments of 2), lasting for 2 net crossings",
            th: "เพิ่มเทคนิคตั้งรับขึ้น X% (4-18%) เมื่อบล็อกเป็นเวลา 2 เทิร์น",
            fr: "Lors d'un contre, augmente la technique défensive de X% (4-18%) , durant 2 échanges au filet",
            es: "Cuando se ejecuta un bloqueo, aumenta la Técnica DEF en un X% (4-18%) durante 2 cruces de red",
            pt: "Ao realizar um Bloqueio, aumenta a técnica de DEF em X% (4-18%), com duração de 2 cruzamentos de rede",
            in: "Saat melakukan Block, meningkatkan Teknik Defense sebesar X% (4-18%), berlangsung selama 2 permainan lewat net",
            de: "Erhöht beim Blocken die Abwehrtechnik um X% (4-18%), hält 2 Netzüberquerungen an"
        }
    }]
    , G = JSON.parse(`[{"id":4001,"effect":{"cn":"进攻技巧增加X% (4-11%)；扣球或二次进攻得分时，回复X (6-13)点体力","en":"Increases ATK Technique by X% (4-11%); when scoring with Spike or Setter Dump, recovers X (6-13) Stamina","th":"เพิ่มเทคนิคบุกขึ้น X% (4-11%) เมื่อทำแต้มด้วยการตบหรือบุกจังหวะสอง และฟื้นฟูพลังกาย X (6-13) หน่วย","fr":"Augmente la technique offensive de X% (4-11%) ; lors d'un point marqué avec un smash ou un Dump du passeur, récupère X (6-13) d'endurance","es":"Aumenta la Técnica ATQ en un X% (4-11%); al marcar con remate o finta de colocador, recupera X (6-13) de resistencia","pt":"Aumenta a técnica de ATQ em X% (4-11%); ao marcar com Cortada ou Largada do Levantador, recupera X (6-13) de Vigor","in":"Meningkatkan Teknik Serangan sebesar X% (4-11%); saat mencetak poin dengan Spike atau Setter Dump, memulihkan X (6-13) Stamina","de":"Erhöht die Angriffstechnik um X% (4-11%); erholt beim Punkten mit Schmettern oder Zuspieler-Finte X (6-13) Ausdauer"}},{"id":4002,"effect":{"cn":"球过网时，强攻/快攻属性增加X% (4-11%)，最多5层，持续2个回合","en":"When the ball crosses the net, increases Power/Quick ATK stat by X% (4-11%), up to 5 stacks, lasting for 2 rallies","th":"เมื่อลูกข้ามเน็ต จะเพิ่มค่าตบแรง/บุกเร็วขึ้น X% (4-11%) สูงสุด 5 สแต็ก เป็นเวลา 2 รอบ","fr":"Quand le ballon traverse le filet, augmente la statistique d'ATQ puissante/rapide de X% (4-11%), jusqu'à 5 cumuls, durant 2 manches","es":"Cuando el balón cruza la red, aumenta el atributo ATQ poderoso/ATQ rápido en un X% (4-11%). Se acumula hasta 5 veces. Dura 2 rondas","pt":"Quando a bola cruza a rede, aumenta o atributo de ATQ Potente/Rápido em X% (4-11%), até 5 acúmulos, por 2 rodadas","in":"Saat bola melewati net, meningkatkan stat Power/Quick Attack sebesar X% (4-11%), hingga 5 tumpuk, berlangsung 2 babak","de":"Erhöht, wenn der Ball das Netz überquert den Kraft-/Schnellangriff-Wert um X% (4-11%) (bis zu 5 Stapel, 2 Runden)"}},{"id":4003,"effect":{"cn":"体力高于50点时，扣球的威力增加，增加值为强攻/快攻属性的X% (20-55%)","en":"When stamina is above 50 points, increases Spike power by X% (20-55% in increments of 5) of Power/Quick ATK stat","th":"เมื่อพลังกายมากกว่า 50 หน่วย จะเพิ่มพลังตบขึ้น X% (20-55%) ของค่าตบแรง/บุกเร็ว","fr":"Quand l'endurance est supérieure à 50 points, augmente la puissance de smash de X% (20-55%) de la statistique dATQ puissante/rapide","es":"Cuando la resistencia está por encima de 50 puntos, aumenta el poder de Remate en un valor equivalente al X% (20-55%) del atributo ATQ poderoso/ATQ rápido","pt":"Quando o Vigor estiver acima de 50 pontos, aumenta a potência da Cortada em X% (20-55%) dos atributos de ATQ Potente/Rápido","in":"Saat stamina di atas 50 poin, meningkatkan power Spike sebesar X% (20-55%) stat Power/Quick Attack","de":"Erhöht, wenn die Ausdauer über 50 Punkte liegt, die Schmettern-Kraft um X% (20-55%) des Kraft-/Schnellangriff-Werts"}},{"id":4004,"effect":{"cn":"基础属性增加X% (4-11%)；我方比分落后时，基础属性额外增加X% (4-11%)","en":"Increases Basic Stats by X% (4-11%); when your side is behind, additionally increases Basic Stats by X% (4-11%)","th":"เพิ่มสมรรถภาพพื้นฐานขึ้น X% (4-11%) และจะเพิ่มสมรรถภาพพื้นฐานขึ้นอีก X% (4-11%) เมื่อฝ่ายเรามีคะแนนตามหลัง","fr":"Augmente les statistiques de base de X% (4-11%) ; quand votre équipe est menée, augmente en plus les statistiques de base de X% (4-11%)","es":"Aumenta los atributos básicos en un X% (4-11%); cuando tu equipo esté perdiendo, aumenta los atributos básicos en un X% (4-11%) más","pt":"Aumenta os atributos básicos em X% (4-11%); quando o seu time estiver perdendo, aumenta os atributos básicos em mais X% (4-11%)","in":"Meningkatkan Stat Dasar sebesar X% (4-11%); saat kubumu tertinggal, meningkatkan juga Stat Dasar sebesar X% (4-11%)","de":"Erhöht die Grundwerte um X% (4-11%); Erhöht, wenn deine Seite im Rückstand liegt, zusätzlich die Grundwerte um X% (4-11%)"}},{"id":4005,"effect":{"cn":"接球或传球时，基础属性增加X% (4-11%)，持续4次过网，我方团队士气增加X (3-6)点","en":"When performing a Receive or Set, increases Basic Stats by X% (4-11%), lasting for 4 net crossings, and increases your Team Morale by X (3-6)","th":"เมื่อรับหรือส่งลูก จะเพิ่มสมรรถภาพพื้นฐานขึ้น X% (4-11%) เป็นเวลา 4 เทิร์น และเพิ่มกำลังใจของทีมขึ้น X (3-6) หน่วย","fr":"Lors d'une réception ou d'une passe, augmente les statistiques de base de X% (4-11%), durant 4 échanges au filet, et augmente le moral d'équipe de X (3-6)","es":"Cuando se ejecuta una recepción o un pase, los atributos básicos aumentan en un X% (4-11%) durante 4 cruces de red y la moral de tu equipo aumenta en X (3-6)","pt":"Ao realizar uma Recepção ou Passe, aumenta os atributos básicos em X% (4-11%), com duração de 4 cruzamentos de rede, e aumenta o Moral do Time em X (3-6)","in":"Saat melakukan Receive atau Set, meningkatkan Stat Dasar sebesar X% (4-11%), berlangsung selama 4 permainan lewat net, dan meningkatkan Moral Tim kubumu sebesar X (3-6)","de":"Erhöht beim Ausführen von Annahmen oder Zuspielen die Grundwerte um X% (4-11%), hält 4 Netzüberquerungen an und erhöht deine Teammoral um X (3-6)"}},{"id":4006,"effect":{"cn":"接球时，我方下次扣球球员的进攻技巧增加X% (4-11%)，力量增加X% (4-11%)","en":"When performing a Receive, increases your side's next spiking player's ATK Technique by X% (4-11%) and Strength by X% (4-11%)","th":"เมื่อรับลูก จะเพิ่มเทคนิคบุก X% (4-11%) และเพิ่มความแข็งแกร่ง X% (4-11%) ให้ผู้เล่นในทีมที่จะตบครั้งถัดไป","fr":"Lors d'une réception, augmente la technique offensive du prochain joueur attaquant de votre équipe de X% (4-11%) et la force de X% (4-11%)","es":"Cuando se ejecuta una recepción, aumenta la Técnica ATQ del siguiente rematador de tu equipo en un X% (4-11%) y la Fuerza en un X% (4-11%)","pt":"Ao realizar uma Recepção, aumenta a técnica de ATQ do próximo atacante do seu time em X% (4-11%) e a Força em X% (4-11%)","in":"Saat melakukan Receive, meningkatkan Teknik Serangan pemain spike berikutnya di kubumu sebesar X% (4-11%) dan Kekuatan sebesar X% (4-11%)","de":"Erhöht beim Ausführen von Annahmen die Angriffstechnik des nächsten angreifenden Spielers deiner Seite um X% (4-11%) und die Stärke um X% (4-11%)"}},{"id":4007,"effect":{"cn":"释放技能时，回复X (4-11)点体力","en":"When casting skills, recovers X (4-11) Stamina","th":"เมื่อใช้สกิล จะฟื้นฟูพลังกาย X (4-11) หน่วย","fr":"Lors de l'utilisation de compétences, récupère X (4-11) d'endurance","es":"Al usar habilidades, recupera X (4-11) de resistencia","pt":"Ao usar habilidades, recupera X (4-11) de Vigor","in":"Saat menggunakan skill, memulihkan X (4-11) Stamina","de":"Erholt beim Einsetzen von Skills X (4-11) Ausdauer"}},{"id":4008,"effect":{"cn":"传球时，我方下次扣球球员的进攻技巧增加X% (4-11%) ，强攻/快攻属性增加X% (4-11%) ","en":"When performing a Set, increases your side's next spiking player's ATK Technique by X% (4-11%) and Power/Quick ATK stat by X% (4-11%)","th":"เมื่อส่งลูก จะเพิ่มเทคนิคบุก X% (4-11%)  และค่าตบแรง/บุกเร็ว X% (4-11%)  ให้ผู้เล่นในทีมที่จะตบครั้งถัดไป","fr":"Lors d'une passe, augmente la technique offensive du prochain joueur attaquant de votre équipe de X% (4-11%)  et la statistique dATQ puissante/rapide de X% (4-11%) ","es":"Cuando se ejecuta un pase, aumenta la Técnica ATQ del siguiente rematador de tu equipo en un X% (4-11%)  y su atributo ATQ rápido/poderoso en un X% (4-11%) ","pt":"Ao realizar um Passe, aumenta a técnica de ATQ do próximo atacante do seu time em X% (4-11%)  e o atributo de ATQ Potente/Rápido em X% (4-11%) ","in":"Saat melakukan Set, meningkatkan Teknik Serangan pemain spike berikutnya di kubumu sebesar X% (4-11%)  dan stat Power/Quick Attack sebesar X% (4-11%) ","de":"Erhöht beim Ausführen von Zuspielen die Angriffstechnik des nächsten angreifenden Spielers deiner Seite um X% (4-11%)  und den Kraft-/Schnellangriff-Wert um X% (4-11%) "}},{"id":4009,"effect":{"cn":"拦网结果为BAD时，我方后排球员接球的威力增加，增加值为接球属性的 X% (20-55%)，持续4次过网","en":"When the Block result is BAD, increases your side's back row players' Receive power by X% (20-55% in increments of 5) of their Receive stat, lasting for 4 net crossings","th":"เมื่อบล็อกติด BAD จะเพิ่มพลังรับของผู้เล่นแถวหลังในทีมขึ้น X% (20-55%) ของค่ารับของพวกเขา เป็นเวลา 4 เทิร์น","fr":"Quand le résultat du contre est MAUVAIS, augmente la puissance de réception des joueurs arrière de votre équipe de X% (20-55%) de leur statistique de réception, durant 4 échanges au filet","es":"Cuando el resultado del bloqueo es MALO, aumenta el poder de recepción de los jugadores de la fila trasera de tu equipo en un valor equivalente al X% (20-55%) de su atributo Recepción durante 4 cruces de red","pt":"Quando o resultado do Bloqueio for RUIM, aumenta a potência da Recepção dos jogadores da linha de defesa do seu time em X% (20-55%) do atributo de suas Recepções, com duração de 4 cruzamentos de rede","in":"Saat hasil Block BURUK, meningkatkan power Receive para pemain baris belakang kubumu sebesar X% (20-55%) stat Receive mereka, berlangsung selama 4 permainan lewat net","de":"Erhöht, wenn das Blocken-Ergebnis BAD ist, die Annahme-Kraft der Spieler der hinteren Reihe deiner Seite um X% (20-55%) ihres Annahme-Werts für 4 Netzüberquerungen"}},{"id":4010,"effect":{"cn":"拦网时，防守技巧增加X% (6-20%)，持续2次过网；拦网结果为PERFECT时，清除自身所有DeBuff","en":"When performing a Block, DEF Technique increases by X% (6-20% in increments of 2), lasting for 2 net crossings; when Block result is PERFECT, removes all debuffs from self","th":"เมื่อบล็อก จะเพิ่มเทคนิคตั้งรับขึ้น X% (6-20%) เป็นเวลา 2 เทิร์น เมื่อบล็อกติด PERFECT จะลบดีบัฟทั้งหมดให้ตัวเอง","fr":"Lors d'un contre, augmente la technique défensive de X% (6-20%), durant 2 échanges au filet ; quand le résultat du contre est PARFAIT, supprime tous les malus de soi-même","es":"Cuando se ejecuta un bloqueo, aumenta la Técnica DEF en un X% (6-20%) durante 2 cruces de red; cuando el resultado del bloqueo es PERFECTO, elimina todas las penalizaciones de sí mismo","pt":"Ao realizar um Bloqueio, aumenta a técnica de DEF em X% (6-20%), com duração de 2 cruzamentos de rede; quando o resultado do Bloqueio for PERFEITO, remove todas as penalidades de si mesmo","in":"Saat melakukan Block, meningkatkan Teknik Defense sebesar X% (6-20%), berlangsung selama 2 permainan lewat net; saat hasil Block SEMPURNA, menghilangkan semua debuff dari diri sendiri","de":"Erhöht beim Ausführen von Blocken die Abwehrtechnik um X% (6-20%), hält 2 Netzüberquerungen an; Entfernt, wenn das Blocken-Ergebnis PERFECT ist, alle Debuffs von sich selbst"}}]`)
    , l = {
        rare: U,
        epic: O,
        legendary: V,
        mythic: G
    }
    , ee = ({ coachImages: o, supporters: c, width: X, language: t }) => {
        const u = s.useRef(!1)
            , { coaches: k } = c
            , [d, q] = s.useState(!1)
            , [i, m] = s.useState({})
            , [p, T] = s.useState(S(y(i?.parameters, i?.effect)))
            , [h, g] = s.useState(0);
        s.useEffect(() => {
            i.name || g(0),
                T(S(y(i?.parameters, i?.effect)))
        }
            , [i]),
            s.useEffect(() => {
                if (i?.id) {
                    const a = c.coaches.find(v => v.id === i.id)
                        , { parameters: n, id: f } = a;
                    m({
                        ...a.coach[t],
                        parameters: n,
                        id: f
                    })
                }
            }
                , [t]);
        const P = a => {
            u.current || (u.current = !0,
                a.deltaY > 0 && h < p.length - 1 ? g(n => n + 1) : a.deltaY < 0 && h > 0 && g(n => n - 1),
                setTimeout(() => {
                    u.current = !1
                }
                    , 100))
        }
            , b = a => a ? a.replace(/X%/g, '<span class="highlight-x">X%</span>').replace(/X/g, '<span class="highlight-x">X</span>').replace(/\(([^)]+)\)/g, '(<span class="highlight-max">$1</span>)') : ""
            , j = a => a.split(`
`).map((n, f, v) => e.jsxs(s.Fragment, {
                children: [n, f < v.length - 1 && e.jsx("br", {})]
            }, f))
            , E = Object.keys(x).map(a => ({
                level: a,
                basicStat: x[a],
                booksNeeded: _[a]
            }));
        return e.jsxs("div", {
            className: "page-container details-page coach-page",
            children: [i?.name && e.jsx("div", {
                className: "overlay",
                onClick: () => m({}),
                onWheel: P,
                children: e.jsxs("div", {
                    className: "info-container coach-wrapper",
                    onClick: a => a.stopPropagation(),
                    role: "dialog",
                    "aria-modal": "true",
                    children: [e.jsxs("div", {
                        className: "info-wrapper",
                        children: [e.jsxs("h1", {
                            children: [i.name, " (", i.school, ")"]
                        }), e.jsxs("div", {
                            className: "coach-description",
                            children: [e.jsx("img", {
                                className: "coach-img",
                                src: o?.[i.id],
                                draggable: "false"
                            }), e.jsx("div", {
                                className: "modal-content",
                                children: p.length && w(p[h])
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "coach-index page-index no-select",
                        children: [e.jsx(R, {
                            onClick: () => m({})
                        }), p.map((a, n) => e.jsx("button", {
                            className: `
                                        coach-level 
                                        page-dot ${n === h ? "active-filter" : ""} 
                                        ${n === 0 ? "rare" : n === 1 ? "epic" : n === 2 ? "legend" : ""}
                                    `,
                            onClick: () => g(n),
                            style: {
                                fontSize: "15px"
                            },
                            children: n === 0 ? "Rare" : n === 1 ? "Epic" : "Legend"
                        }, n))]
                    })]
                })
            }), e.jsxs("div", {
                className: "coach-overview",
                children: [e.jsxs("h2", {
                    onClick: () => q(!d),
                    style: {
                        marginBottom: 0
                    },
                    children: [r?.coachOverview?.[t], e.jsx(A.span, {
                        animate: {
                            rotate: d ? -180 : 0
                        },
                        transition: {
                            duration: .3
                        },
                        children: e.jsx(C, {})
                    })]
                }), e.jsx(A.div, {
                    initial: {
                        opacity: 0,
                        maxHeight: 0
                    },
                    animate: {
                        opacity: d ? 1 : 0,
                        maxHeight: d ? 2e3 : 0
                    },
                    transition: {
                        duration: .5,
                        ease: "easeInOut"
                    },
                    style: {
                        overflow: "hidden"
                    },
                    layout: !0,
                    children: e.jsxs(e.Fragment, {
                        children: [F[t].map((a, n) => e.jsxs("p", {
                            children: [n + 1 === 6 ? "Note" : n + 1 + ". ", e.jsx("b", {
                                children: a.label
                            }), ": ", j(a.text)]
                        }, n)), e.jsx("div", {
                            className: "table-container",
                            children: e.jsxs("table", {
                                className: "styled-table",
                                border: "1",
                                children: [e.jsx("thead", {
                                    children: e.jsxs("tr", {
                                        children: [e.jsx("th", {
                                            children: r?.level?.[t]
                                        }), e.jsx("th", {
                                            children: r?.basicStat?.[t]
                                        }), e.jsx("th", {
                                            children: r?.matchRecords?.[t]
                                        })]
                                    })
                                }), e.jsx("tbody", {
                                    children: E.map(a => e.jsxs("tr", {
                                        children: [e.jsx("td", {
                                            children: a.level
                                        }), e.jsx("td", {
                                            children: a.basicStat
                                        }), e.jsx("td", {
                                            children: a.booksNeeded
                                        })]
                                    }, a.level))
                                })]
                            })
                        })]
                    })
                })]
            }), e.jsx("div", {
                className: "coach-page-wrapper",
                children: o && k.map(a => e.jsx(L, {
                    coach: a?.coach?.en,
                    coachImage: o?.[a.id],
                    setDisplayed: m,
                    language: t,
                    coaches: a?.coach,
                    parameters: a?.parameters,
                    id: a?.id
                }, a?.id))
            }), e.jsx("div", {
                className: "positional-advantage",
                children: l && e.jsxs(e.Fragment, {
                    children: [e.jsxs("div", {
                        className: "mythic-advantages",
                        children: [e.jsx("h3", {
                            children: r?.mythicAdvantages?.[t]
                        }), e.jsx("div", {
                            className: "advantage-grid",
                            children: l?.mythic?.map((a, n) => e.jsx("div", {
                                className: "advantage-card",
                                children: e.jsx("p", {
                                    dangerouslySetInnerHTML: {
                                        __html: b(a?.effect?.[t])
                                    }
                                })
                            }, n))
                        })]
                    }), e.jsxs("div", {
                        className: "legendary-advantages",
                        children: [e.jsx("h3", {
                            children: r?.legendaryAdvantages?.[t]
                        }), e.jsx("div", {
                            className: "advantage-grid",
                            children: l?.legendary?.map((a, n) => e.jsx("div", {
                                className: "advantage-card",
                                children: e.jsx("p", {
                                    dangerouslySetInnerHTML: {
                                        __html: b(a?.effect?.[t])
                                    }
                                })
                            }, n))
                        })]
                    }), e.jsxs("div", {
                        className: "epic-advantages",
                        children: [e.jsx("h3", {
                            children: r?.epicAdvantages?.[t]
                        }), e.jsx("div", {
                            className: "advantage-grid",
                            children: l?.epic?.map((a, n) => e.jsx("div", {
                                className: "advantage-card",
                                children: e.jsx("p", {
                                    dangerouslySetInnerHTML: {
                                        __html: b(a?.effect?.[t])
                                    }
                                })
                            }, n))
                        })]
                    }), e.jsxs("div", {
                        className: "rare-advantages",
                        children: [e.jsx("h3", {
                            children: r?.rareAdvantages?.[t]
                        }), e.jsx("div", {
                            className: "advantage-grid",
                            children: l?.rare?.map((a, n) => e.jsx("div", {
                                className: "advantage-card",
                                children: e.jsx("p", {
                                    dangerouslySetInnerHTML: {
                                        __html: b(a?.effect?.[t])
                                    }
                                })
                            }, n))
                        })]
                    })]
                })
            }), e.jsx(Q, {})]
        })
    }
    , x = {
        1: 42,
        2: 54,
        3: 66,
        4: 78,
        5: 90,
        6: 102,
        7: 114,
        8: 126,
        9: 138,
        10: 150,
        11: 162,
        12: 174,
        13: 186,
        14: 198,
        15: 210
    }
    , _ = {
        1: 0,
        2: 3e3,
        3: 5e3,
        4: 7e3,
        5: 9e3,
        6: 11e3,
        7: 13e3,
        8: 15e3,
        9: 17e3,
        10: 19e3,
        11: 21e3,
        12: 23e3,
        13: 25e3,
        14: 27e3,
        15: 29e3
    };
export { ee as default };


