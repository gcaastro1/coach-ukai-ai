import React, { useState } from 'react';
import { Character } from '../types';

interface CharacterSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (character: Character) => void;
}

export const CharacterSelectModal: React.FC<CharacterSelectModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [characters, setCharacters] = useState<Character[]>([]);

  React.useEffect(() => {
    if (isOpen && characters.length === 0) {
      import('../utils/dataFetcher').then((module) => {
        setCharacters(module.getCharacters());
      });
    }
  }, [isOpen, characters.length]);

  if (!isOpen) return null;

  const filteredCharacters = characters.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.school && c.school.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl w-full max-w-2xl flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">Selecionar Personagem Alvo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-800">
          <input 
            type="text" 
            placeholder="Buscar por nome ou escola..."
            className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredCharacters.map(char => (
              <div 
                key={char.id} 
                className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-3 cursor-pointer hover:border-orange-500 hover:bg-[#3a3a3a] transition-all flex flex-col items-center gap-2"
                onClick={() => onSelect(char)}
              >
                <div className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                  char.rarity === 'UR' ? 'bg-red-900/50 text-red-400' :
                  char.rarity === 'SP' ? 'bg-purple-900/50 text-purple-400' :
                  char.rarity === 'SSR' ? 'bg-yellow-900/50 text-yellow-400' :
                  'bg-blue-900/50 text-blue-400'
                }`}>
                  {char.rarity}
                </div>
                <div className="text-center font-semibold text-sm line-clamp-2">
                  {char.name}
                </div>
                <div className="text-xs text-gray-400">
                  {char.school}
                </div>
              </div>
            ))}
          </div>
          {filteredCharacters.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              Nenhum personagem encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
