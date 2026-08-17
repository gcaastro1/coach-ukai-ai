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
const POSITIONS = ['S', 'WS', 'MB', 'OP', 'Li'];
const RARITIES = ['rare', 'epic', 'legendary', 'mythic'] as const;
const PLACEHOLDER_REGEX = /X%?\s*\([^)]+\)/g;

const positionColors: Record<string, string> = {
  S: 'bg-green-500/20 text-green-400 border-green-500/30',
  WS: 'bg-red-500/20 text-red-400 border-red-500/30',
  MB: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  OP: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Li: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

import { CoachGuideModal } from './CoachGuideModal';

export const CoachDetailsModal: React.FC<CoachDetailsModalProps> = ({ isOpen, coach, onClose, onSwap, onUpdate }) => {
  const [selectedRarity, setSelectedRarity] = useState<'Rare' | 'Epic' | 'Legendary'>('Rare');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  
  // Local state for editing advantages
  const [editingLevel, setEditingLevel] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<SelectedAdvantage> & { rarity: 'rare'|'epic'|'legendary'|'mythic', values: number[] }>({
    rarity: 'rare',
    advantageId: '',
    targetPosition: 'WS',
    values: []
  });

  useEffect(() => {
    if (coach) {
      setSelectedRarity(coach.rarity);
    }
  }, [coach]);

  if (!isOpen || !coach) return null;

  const renderEffectText = (effect: string, values: number[]) => {
    const parts = effect.split(PLACEHOLDER_REGEX);
    const placeholders = effect.match(PLACEHOLDER_REGEX) || [];
    
    return (
      <span className="text-xs text-white/70">
        {parts.map((part, idx) => {
          const placeholder = placeholders[idx];
          const hasValue = values[idx] !== undefined && !isNaN(values[idx]);
          const valueStr = hasValue ? values[idx].toString() + (placeholder?.includes('%') ? '%' : '') : placeholder;
          return (
            <React.Fragment key={idx}>
              {part}
              {placeholder && (
                <span className={hasValue ? "text-blue-400 font-bold" : "text-white/40"}>
                  {valueStr}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </span>
    );
  };

  const handleSaveAdvantage = (level: number) => {
    if (!editForm.advantageId) return;

    const newAdvantage: SelectedAdvantage = {
      level,
      advantageId: editForm.advantageId,
      targetPosition: editForm.targetPosition || 'WS',
      values: editForm.values || [],
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
  const selectedAdvantageObj = advantagesList.find(a => a.id.toString() === editForm.advantageId?.toString());
  const editPlaceholders = selectedAdvantageObj ? (selectedAdvantageObj.effect.match(PLACEHOLDER_REGEX) || []) : [];

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 z-50 transition-opacity backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0f0f0f] border border-gray-800 shadow-2xl z-50 rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[#1a1a1a] shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-white tracking-wide">{coach.name}</h2>
              <button 
                onClick={() => setIsGuideOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg transition-colors text-[10px] font-bold uppercase tracking-wider"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Guia de Otimização
              </button>
            </div>
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
              <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Expert Guidance (Passiva)</h3>
              
              {/* Rarity Selector */}
              <div className="flex gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                {(['Rare', 'Epic', 'Legendary'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      setSelectedRarity(r);
                      if (onUpdate && coach) {
                        onUpdate({ ...coach, rarity: r });
                      }
                    }}
                    className={`px-3 py-1 text-[10px] font-black uppercase rounded transition-colors ${
                      selectedRarity === r 
                        ? r === 'Legendary' ? 'bg-orange-500 text-white' : r === 'Epic' ? 'bg-purple-500 text-white' : 'bg-blue-600 text-white'
                        : 'text-white/40 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {r === 'Legendary' ? 'Lendário' : r === 'Epic' ? 'Épico' : 'Raro'}
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
                
                let displayAdvantage = null;
                if (existingAdv) {
                  const allLists = ['mythic', 'legendary', 'epic', 'rare'].map(r => getAdvantagesByRarity(r as any)).flat();
                  displayAdvantage = allLists.find(a => a.id.toString() === existingAdv.advantageId.toString());
                }

                return (
                  <div key={lvl} className={`flex flex-col p-3 ${idx !== 4 ? 'border-b border-white/5' : ''}`}>
                    <div className="flex items-center">
                      <div className="w-16 shrink-0 flex items-center justify-center">
                        <span className="text-[10px] font-black text-white/40 uppercase bg-white/10 px-2 py-1 rounded">LVL {lvl}</span>
                      </div>
                      
                      {!isEditing && (
                        <div className="flex-1 pl-3 flex items-center justify-between">
                          {existingAdv && displayAdvantage ? (
                            <div className="flex flex-col gap-1 pr-4">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] px-2 py-0.5 rounded font-black border ${positionColors[existingAdv.targetPosition]}`}>
                                  {existingAdv.targetPosition}
                                </span>
                              </div>
                              <div className="leading-tight">
                                {renderEffectText(displayAdvantage.effect, existingAdv.values || [])}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-white/40 font-medium">Nenhuma vantagem configurada</span>
                          )}
                          
                          <div className="flex gap-2 shrink-0">
                            {existingAdv && (
                              <button onClick={() => handleRemoveAdvantage(lvl)} className="text-red-400 hover:text-red-300 text-xs font-bold uppercase">Remover</button>
                            )}
                            <button 
                              onClick={() => {
                                setEditingLevel(lvl);
                                setEditForm({
                                  rarity: 'rare',
                                  advantageId: existingAdv?.advantageId || '',
                                  targetPosition: existingAdv?.targetPosition || 'WS',
                                  values: existingAdv?.values || []
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
                      <div className="mt-3 pl-16 pr-3 pb-2 flex flex-col gap-4">
                        <div className="flex gap-2">
                          {RARITIES.map(r => {
                            const displayRarity = r === 'rare' ? 'Raro' : r === 'epic' ? 'Épico' : r === 'legendary' ? 'Lendário' : 'Mítico';
                            return (
                            <button
                              key={r}
                              onClick={() => setEditForm(prev => ({ ...prev, rarity: r, advantageId: '', values: [] }))}
                              className={`px-3 py-1.5 text-[10px] font-black uppercase rounded border ${
                                editForm.rarity === r 
                                  ? r === 'mythic' ? 'bg-pink-500/20 text-pink-400 border-pink-500/50'
                                  : r === 'legendary' ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' 
                                  : r === 'epic' ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' 
                                  : 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                                  : 'border-white/10 text-white/40 hover:bg-white/5'
                              }`}
                            >
                              {displayRarity}
                            </button>
                          )})}
                        </div>

                        <select 
                          className="bg-black/40 border border-white/10 rounded p-3 text-sm text-white outline-none focus:border-blue-500/50"
                          value={editForm.advantageId}
                          onChange={(e) => setEditForm(prev => ({ ...prev, advantageId: e.target.value, values: [] }))}
                        >
                          <option value="">Selecione o Efeito da Vantagem...</option>
                          {advantagesList.map(adv => (
                            <option key={adv.id} value={adv.id}>{adv.effect}</option>
                          ))}
                        </select>

                        {editForm.advantageId && (
                          <div className="flex flex-col gap-3 p-4 bg-black/20 rounded-lg border border-white/5">
                            <div className="flex gap-2 mb-2">
                              {POSITIONS.map(pos => (
                                <button
                                  key={pos}
                                  onClick={() => setEditForm(prev => ({ ...prev, targetPosition: pos }))}
                                  className={`px-3 py-1.5 text-xs font-black rounded border transition-colors ${
                                    editForm.targetPosition === pos 
                                      ? positionColors[pos]
                                      : 'bg-black/40 text-white/40 border-white/10 hover:border-white/20'
                                  }`}
                                >
                                  {pos}
                                </button>
                              ))}
                            </div>

                            <div className="flex flex-wrap gap-4">
                              {editPlaceholders.map((ph, idx) => (
                                <div key={idx} className="flex-1 min-w-[120px]">
                                  <label className="block text-[10px] font-bold text-white/60 uppercase mb-1">{ph}</label>
                                  <input 
                                    type="number" 
                                    className="w-full bg-black/40 border border-white/10 rounded p-2 text-sm text-white outline-none focus:border-blue-500/50"
                                    value={editForm.values?.[idx] !== undefined ? editForm.values[idx] : ''}
                                    onChange={(e) => {
                                      const newVals = [...(editForm.values || [])];
                                      newVals[idx] = parseFloat(e.target.value);
                                      setEditForm(prev => ({ ...prev, values: newVals }));
                                    }}
                                    placeholder="Ex: 5.5"
                                    step="0.1"
                                  />
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-2 bg-white/5 p-3 rounded border border-white/5 text-sm">
                              <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Pré-visualização</span>
                              {renderEffectText(selectedAdvantageObj?.effect || '', editForm.values || [])}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end gap-2 mt-2">
                          <button 
                            onClick={() => setEditingLevel(null)}
                            className="px-4 py-2 text-xs font-bold uppercase text-white/50 hover:text-white transition-colors"
                          >
                            Cancelar
                          </button>
                          <button 
                            onClick={() => handleSaveAdvantage(lvl)}
                            disabled={!editForm.advantageId || editPlaceholders.some((_, i) => editForm.values?.[i] === undefined || isNaN(editForm.values[i]))}
                            className="px-6 py-2 text-xs font-bold uppercase bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
      <CoachGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </>
  );
};
