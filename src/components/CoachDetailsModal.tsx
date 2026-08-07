import React, { useState, useEffect } from 'react';
import { AllocatedCoach, SelectedAdvantage } from '../types';
import { getAdvantagesByRarity } from '../utils/advantagesFetcher';

interface CoachDetailsModalProps {
  isOpen: boolean;
  coach: AllocatedCoach | null;
  onClose: () => void;
  onSwap: () => void;
  onUpdate?: (updatedCoach: AllocatedCoach) => void;
}

const ADVANTAGE_LEVELS = [3, 6, 9, 12, 15];
const POSITIONS = ['S', 'WS', 'MB', 'OP', 'Li', 'Todas', 'Linha de Defesa', 'Linha de Ataque'];
const RARITIES = ['rare', 'epic', 'legendary', 'mythic'] as const;

export const CoachDetailsModal: React.FC<CoachDetailsModalProps> = ({ isOpen, coach, onClose, onSwap, onUpdate }) => {
  const [selectedRarity, setSelectedRarity] = useState<'Rare' | 'Epic' | 'Legendary'>('Rare');
  
  // Local state for editing advantages
  const [editingLevel, setEditingLevel] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<SelectedAdvantage> & { rarity: 'rare'|'epic'|'legendary'|'mythic' }>({
    rarity: 'rare',
    advantageId: '',
    targetPosition: 'Todas',
    value: 0
  });

  useEffect(() => {
    if (coach) {
      setSelectedRarity(coach.rarity);
    }
  }, [coach]);

  if (!isOpen || !coach) return null;

  const handleSaveAdvantage = (level: number) => {
    if (!editForm.advantageId || editForm.value === undefined) return;

    const newAdvantage: SelectedAdvantage = {
      level,
      advantageId: editForm.advantageId,
      targetPosition: editForm.targetPosition || 'Todas',
      value: Number(editForm.value),
    };

    const currentAdvantages = coach.selectedAdvantages || [];
    const updatedAdvantages = [...currentAdvantages.filter(a => a.level !== level), newAdvantage];

    if (onUpdate) {
      onUpdate({
        ...coach,
        selectedAdvantages: updatedAdvantages
      });
    }

    setEditingLevel(null);
  };

  const handleRemoveAdvantage = (level: number) => {
    const currentAdvantages = coach.selectedAdvantages || [];
    const updatedAdvantages = currentAdvantages.filter(a => a.level !== level);
    if (onUpdate) {
      onUpdate({
        ...coach,
        selectedAdvantages: updatedAdvantages
      });
    }
  };

  const getAdvantageForLevel = (level: number) => {
    return (coach.selectedAdvantages || []).find(a => a.level === level);
  };

  const advantagesList = getAdvantagesByRarity(editForm.rarity);

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 z-50 transition-opacity backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#0f0f0f] border border-gray-800 shadow-2xl z-50 rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[#1a1a1a]">
          <div>
            <h2 className="text-xl font-black text-white tracking-wide">{coach.name}</h2>
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest mt-0.5">{coach.school}</p>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          
          {/* Expert Guidance */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Expert Guidance</h3>
              
              {/* Rarity Selector */}
              <div className="flex gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                {(['Rare', 'Epic', 'Legendary'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => setSelectedRarity(r)}
                    className={`px-3 py-1 text-[10px] font-black uppercase rounded transition-colors ${
                      selectedRarity === r 
                        ? r === 'Legendary' ? 'bg-orange-500 text-white' : r === 'Epic' ? 'bg-purple-500 text-white' : 'bg-blue-600 text-white'
                        : 'text-white/40 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {r === 'Legendary' ? 'Legend' : r}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-white/90 text-sm leading-relaxed font-medium min-h-[60px]">
                {coach.expertGuidance[selectedRarity]}
              </p>
            </div>
          </div>

          {/* Level Bonuses / Positional Advantages */}
          <div>
            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-3">Vantagens de Posição (APR)</h3>
            
            <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5">
              {ADVANTAGE_LEVELS.map((lvl, idx) => {
                const isEditing = editingLevel === lvl;
                const existingAdv = getAdvantageForLevel(lvl);

                return (
                  <div key={lvl} className={`flex flex-col p-3 ${idx !== 4 ? 'border-b border-white/5' : ''}`}>
                    <div className="flex items-center">
                      <div className="w-16 shrink-0 flex items-center justify-center">
                        <span className="text-[10px] font-black text-white/40 uppercase bg-white/10 px-2 py-1 rounded">LVL {lvl}</span>
                      </div>
                      
                      {!isEditing && (
                        <div className="flex-1 pl-3 flex items-center justify-between">
                          {existingAdv ? (
                            <div className="flex flex-col">
                              <span className="text-sm text-white/90 font-bold">Posição: {existingAdv.targetPosition} | Valor: {existingAdv.value}%</span>
                              <span className="text-xs text-white/50 truncate max-w-[250px]">
                                {getAdvantagesByRarity('mythic').find(a => a.id.toString() === existingAdv.advantageId.toString())?.effect || 
                                 getAdvantagesByRarity('legendary').find(a => a.id.toString() === existingAdv.advantageId.toString())?.effect ||
                                 getAdvantagesByRarity('epic').find(a => a.id.toString() === existingAdv.advantageId.toString())?.effect ||
                                 getAdvantagesByRarity('rare').find(a => a.id.toString() === existingAdv.advantageId.toString())?.effect || 'Vantagem Selecionada'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-white/40 font-medium">Nenhuma vantagem configurada</span>
                          )}
                          
                          <div className="flex gap-2">
                            {existingAdv && (
                              <button onClick={() => handleRemoveAdvantage(lvl)} className="text-red-400 hover:text-red-300 text-xs font-bold uppercase">Remover</button>
                            )}
                            <button 
                              onClick={() => {
                                setEditingLevel(lvl);
                                setEditForm({
                                  rarity: 'rare',
                                  advantageId: existingAdv?.advantageId || '',
                                  targetPosition: existingAdv?.targetPosition || 'Todas',
                                  value: existingAdv?.value || 0
                                });
                              }} 
                              className="text-blue-400 hover:text-blue-300 text-xs font-bold uppercase"
                            >
                              {existingAdv ? 'Editar' : 'Configurar'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Formulário de Edição */}
                    {isEditing && (
                      <div className="mt-3 pl-16 pr-3 pb-2 flex flex-col gap-3">
                        <div className="flex gap-2">
                          {RARITIES.map(r => (
                            <button
                              key={r}
                              onClick={() => setEditForm(prev => ({ ...prev, rarity: r, advantageId: '' }))}
                              className={`px-2 py-1 text-[10px] font-black uppercase rounded border ${
                                editForm.rarity === r 
                                  ? r === 'mythic' ? 'bg-pink-500/20 text-pink-400 border-pink-500/50'
                                  : r === 'legendary' ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' 
                                  : r === 'epic' ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' 
                                  : 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                                  : 'border-white/10 text-white/40 hover:bg-white/5'
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>

                        <select 
                          className="bg-black/40 border border-white/10 rounded p-2 text-xs text-white outline-none focus:border-blue-500/50"
                          value={editForm.advantageId}
                          onChange={(e) => setEditForm(prev => ({ ...prev, advantageId: e.target.value }))}
                        >
                          <option value="">Selecione o Efeito da Vantagem...</option>
                          {advantagesList.map(adv => (
                            <option key={adv.id} value={adv.id}>{adv.effect}</option>
                          ))}
                        </select>

                        <div className="flex gap-3">
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold text-white/40 uppercase mb-1">Posição Alvo</label>
                            <select 
                              className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white outline-none focus:border-blue-500/50"
                              value={editForm.targetPosition}
                              onChange={(e) => setEditForm(prev => ({ ...prev, targetPosition: e.target.value }))}
                            >
                              {POSITIONS.map(pos => (
                                <option key={pos} value={pos}>{pos}</option>
                              ))}
                            </select>
                          </div>
                          <div className="w-24">
                            <label className="block text-[10px] font-bold text-white/40 uppercase mb-1">Valor (%)</label>
                            <input 
                              type="number" 
                              className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white outline-none focus:border-blue-500/50"
                              value={editForm.value || ''}
                              onChange={(e) => setEditForm(prev => ({ ...prev, value: Number(e.target.value) }))}
                              placeholder="Ex: 5.5"
                              step="0.1"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-2">
                          <button 
                            onClick={() => setEditingLevel(null)}
                            className="px-3 py-1.5 text-xs font-bold uppercase text-white/50 hover:text-white"
                          >
                            Cancelar
                          </button>
                          <button 
                            onClick={() => handleSaveAdvantage(lvl)}
                            disabled={!editForm.advantageId || editForm.value === undefined}
                            className="px-3 py-1.5 text-xs font-bold uppercase bg-blue-600 hover:bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Salvar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-800 bg-[#121212] flex gap-3">
          <button 
            onClick={onSwap}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-colors text-sm uppercase tracking-wider"
          >
            Trocar Treinador
          </button>
        </div>

      </div>
    </>
  );
};
