import React from 'react';

interface CoachGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoachGuideModal: React.FC<CoachGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 z-[60] transition-opacity backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0f0f0f] border border-gray-800 shadow-2xl z-[60] rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[#1a1a1a]">
          <div>
            <h2 className="text-xl font-black text-white tracking-wide">Guia de Técnicos</h2>
            <p className="text-white/50 text-xs font-bold tracking-widest mt-0.5">ESTRATÉGIA DE GERENCIAMENTO</p>
          </div>
          <button 
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 text-sm text-white/80">
          
          <p className="leading-relaxed">
            Este guia detalha a estratégia matemática exata para evoluir Técnicos Laranjas (Lendários) de forma sustentável, evitando o desperdício de "Match Records".
          </p>

          <section>
            <h3 className="text-blue-400 font-bold uppercase tracking-wider mb-2">1. A Matemática do Custo vs. Retorno</h3>
            <p className="mb-2">A evolução dos técnicos depende de rolar sub-atributos aleatórios (RNG) gastando Match Records. O segredo da estratégia é a mecânica de desmanche, onde o jogo devolve cerca de 80% do valor investido.</p>
            <ul className="list-disc pl-5 space-y-2 text-white/70">
              <li><strong className="text-white">Custo Nível 9:</strong> Subir do Nv 1 ao 9 custa <strong className="text-red-400">80k</strong>. Desmanchando, você recebe 65.6k. Prejuízo real: só <strong>14.4k</strong>.</li>
              <li><strong className="text-white">Custo Nível 12:</strong> Subir do Nv 1 ao 12 custa <strong className="text-red-400">143k</strong>. Desmanchando, você recebe 116k. Prejuízo real: <strong>27k</strong>.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-blue-400 font-bold uppercase tracking-wider mb-2">2. A Renda Diária</h3>
            <p className="mb-2">Jogando a Competição Diária (Nível 14), sua renda é:</p>
            <ul className="list-disc pl-5 space-y-1 text-white/70">
              <li><strong>~50k Match Records</strong></li>
              <li><strong>~2.5 Técnicos Laranjas</strong> por dia.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-orange-400 font-bold uppercase tracking-wider mb-2">3. O Ponto de Equilíbrio</h3>
            <p className="mb-2">Ganhando 50k/dia e rolando 2.5 técnicos, o limite matemático é gastar/perder no máximo <strong>20k Match Records por técnico rolado</strong>.</p>
            <ul className="list-disc pl-5 space-y-2 text-white/70">
              <li>Subir todos até o Nível 12 (prejuízo de 27k) <span className="text-red-400">causará falência</span>.</li>
              <li>Parar todos no Nível 9 (prejuízo de 14.4k) fará sobrar dinheiro, mas perde o potencial máximo.</li>
            </ul>
          </section>

          <section className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
            <h3 className="text-blue-400 font-black uppercase tracking-wider mb-3">4. A Estratégia Híbrida Ótima</h3>
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <strong className="text-white">Teste do Nível 9:</strong> Assim que pegar um técnico lendário do seu interesse, evolua-o <strong>sempre</strong> até o Nível 9.
              </li>
              <li>
                <strong className="text-white">Avaliação dos 3 Status:</strong> No Nível 9, analise os bônus recebidos.
                <ul className="list-disc pl-5 mt-2 space-y-2 text-white/70">
                  <li><strong className="text-red-400">Descarte (Lixo):</strong> Se os bônus não combinarem com a função ou vierem baixos, <strong>desmanche-o imediatamente no Nível 9</strong>. O custo de 14.4k é coberto pela renda diária.</li>
                  <li><strong className="text-yellow-400">Investimento (Ouro):</strong> Se dropar bônus avermelhados altos ou vitais para sua comp, assuma o risco e <strong>evolua-o até o Nível 12</strong>.</li>
                </ul>
              </li>
            </ol>
          </section>

          <section className="bg-white/5 border border-white/10 p-4 rounded-xl">
            <h3 className="text-white/60 font-bold uppercase tracking-wider mb-2 text-xs">Dica Extra de Gerenciamento</h3>
            <p className="text-white/70">
              Não desmanche imediatamente Técnicos Laranjas Nível 1 que fogem da sua meta atual (ex: técnico de Bloqueio quando seu foco é Ataque). Deixe-os no inventário no Nível 1, sem investir Match Records. Isso preserva recursos para investir pesado nos técnicos que realmente importam.
            </p>
          </section>

        </div>

      </div>
    </>
  );
};
