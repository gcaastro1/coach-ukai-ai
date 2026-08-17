import React, { useState, useMemo } from 'react';
import { AutoBuilderOptions } from '../utils/autoBuilder';
import { getCharacters } from '../utils/dataFetcher';

interface AutoBuilderModalProps {
  isOpen: boolean;
  isGenerating?: boolean;
  onClose: () => void;
  onGenerate: (options: Omit<AutoBuilderOptions, 'savedPlayers' | 'allCharacters'>) => void;
}

const SPECIALTIES = ['Ataque Rápido', 'Bloqueio', 'Ataque Potente', 'Recepção'];

export const AutoBuilderModal: React.FC<AutoBuilderModalProps> = ({ isOpen, isGenerating, onClose, onGenerate }) => {
  const [targetSpecialty, setTargetSpecialty] = useState<string>('Bloqueio');
  const [specialtyCount, setSpecialtyCount] = useState<number>(3);
  const [onlyOwned, setOnlyOwned] = useState<boolean>(true);
  const [targetSchool, setTargetSchool] = useState<string>('');

  const allCharacters = getCharacters();
  const SCHOOLS = useMemo(() => {
    const schools = new Set(allCharacters.map(c => c.school));
    return Array.from(schools).filter(Boolean).sort();
  }, [allCharacters]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onGenerate({
      targetSpecialty,
      specialtyCount,
      onlyOwned,
      targetSchool: targetSchool || undefined
    });
    // onClose é chamado pelo pai quando a IA terminar
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 z-50 transition-opacity backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#0f0f0f] border border-gray-800 shadow-2xl z-50 rounded-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-neutral-900 border-b border-gray-800 p-5 relative">
          <h2 className="text-xl font-black text-white uppercase">Sugerir Time</h2>
          <p className="text-xs text-white/50 mt-1">Montagem automática baseada em especialidade e sinergia</p>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6">
          
          {/* Target Specialty */}
          <div>
            <label className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-2 block">
              Especialidade Foco
            </label>
            <select 
              value={targetSpecialty}
              onChange={(e) => setTargetSpecialty(e.target.value)}
              disabled={isGenerating}
              className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl p-3 outline-none focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {SPECIALTIES.map(spec => (
                <option key={spec} value={spec} className="bg-neutral-900">{spec}</option>
              ))}
            </select>
          </div>

          {/* Target School */}
          <div>
            <label className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-2 block">
              Bônus de Escola (Opcional)
            </label>
            <select 
              value={targetSchool}
              onChange={(e) => setTargetSchool(e.target.value)}
              disabled={isGenerating}
              className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl p-3 outline-none focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="" className="bg-neutral-900">Nenhuma (Focar apenas na Força)</option>
              {SCHOOLS.map(school => (
                <option key={school} value={school} className="bg-neutral-900">{school}</option>
              ))}
            </select>
          </div>

          {/* Specialty Count */}
          <div>
             <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">
                  Quantidade Desejada
                </label>
                <span className="text-sm font-bold text-blue-400">
                  {specialtyCount} Jogador(es)
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="6" 
                value={specialtyCount} 
                onChange={(e) => setSpecialtyCount(parseInt(e.target.value, 10))}
                disabled={isGenerating}
                className="w-full accent-blue-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
          </div>

          {/* Only Owned */}
          <label 
            className={`flex items-center gap-3 group ${isGenerating ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            onClick={(e) => {
              e.preventDefault();
              if (!isGenerating) setOnlyOwned(!onlyOwned);
            }}
          >
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
              onlyOwned ? 'bg-blue-600 border-blue-500' : 'bg-white/5 border-white/20 group-hover:border-white/40'
            }`}>
              {onlyOwned && (
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">
              Usar Apenas Meus Jogadores
            </span>
          </label>
          <p className="text-[10px] text-white/40 leading-relaxed">
            Se desmarcado, a ferramenta usará todo o banco de dados de jogadores simulando que estão no nível 80.
          </p>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-[#121212]">
          <button 
            onClick={handleSubmit}
            disabled={isGenerating}
            className={`w-full font-bold py-3 rounded-xl transition-colors text-sm uppercase tracking-wider flex items-center justify-center gap-2 ${
              isGenerating
                ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
                : 'bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30'
            }`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Gerando via IA...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Gerar Time Ideal (IA)
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};
