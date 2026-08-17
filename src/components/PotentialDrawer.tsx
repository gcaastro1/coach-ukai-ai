import React, { useState } from 'react';
import { PotentialSlotID, EquippedPotential } from '../types';
import potentialsData from '../data/potentials.json';
import { potentialSlotsConfig } from '../data/potentialStats';

interface PotentialDrawerProps {
  isOpen: boolean;
  slotId: PotentialSlotID;
  equipped?: EquippedPotential;
  onClose: () => void;
  onSelect: (setId: string, mainStat: string) => void;
  onRemove: () => void;
}

export const PotentialDrawer: React.FC<PotentialDrawerProps> = ({
  isOpen,
  slotId,
  equipped,
  onClose,
  onSelect,
  onRemove
}) => {
  const [selectedSet, setSelectedSet] = useState<string>(equipped?.setId || '');
  const [selectedStat, setSelectedStat] = useState<string>(equipped?.mainStat || '');

  // Reset state when opened with a new slot
  React.useEffect(() => {
    if (isOpen) {
      setSelectedSet(equipped?.setId || '');
      setSelectedStat(equipped?.mainStat || '');
    }
  }, [isOpen, equipped]);

  if (!isOpen) return null;

  const config = potentialSlotsConfig[slotId];
  const isValid = selectedSet && selectedStat;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#0f0f0f] border border-gray-800 shadow-2xl z-[70] rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-800 bg-neutral-900 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-black text-white">Equipar Potencial - Slot {slotId}</h2>
            <p className="text-xs text-white/50 font-bold uppercase tracking-wider mt-0.5">
              Formato: {config.valueFormat}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          
          {/* Main Stat Selection */}
          <div>
            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-3">
              Atributo Principal (Obrigatório)
            </h3>
            <div className="flex flex-wrap gap-2">
              {config.possibleStats.map((stat) => (
                <button
                  key={stat}
                  onClick={() => setSelectedStat(stat)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                    selectedStat === stat
                      ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                      : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {stat}
                </button>
              ))}
            </div>
          </div>

          {/* Set Selection */}
          <div>
            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-3">
              Conjunto (Set)
            </h3>
            <div className="space-y-2">
              {potentialsData.map((pot) => (
                <div 
                  key={pot.id}
                  onClick={() => setSelectedSet(pot.id)}
                  className={`relative overflow-hidden p-3 rounded-xl border cursor-pointer transition-all group ${
                    selectedSet === pot.id
                      ? 'bg-blue-500/10 border-blue-500/30'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div 
                    className="absolute inset-2 bg-contain bg-no-repeat bg-center opacity-5 group-hover:opacity-10 transition-opacity scale-75" 
                    style={{ backgroundImage: `url('/assets/others/potentials/${pot.id.replace(/_/g, '-')}.png')` }} 
                  />
                  <div className="relative z-10 flex justify-between items-center mb-2">
                    <span className={`text-sm font-black drop-shadow-md ${selectedSet === pot.id ? 'text-blue-400' : 'text-white'}`}>
                      {pot.name}
                    </span>
                    {selectedSet === pot.id && (
                      <svg className="w-5 h-5 text-blue-400 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="relative z-10 space-y-1">
                    <p className="text-[10px] text-white/70">
                      <strong className="text-white/40">2P:</strong> {pot.effect2p}
                    </p>
                    <p className="text-[10px] text-white/70">
                      <strong className="text-white/40">4P:</strong> {pot.effect4p}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-[#121212] flex gap-3 shrink-0">
          {equipped && (
            <button 
              onClick={() => {
                onRemove();
                onClose();
              }}
              className="px-4 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 rounded-xl transition-colors font-bold text-sm"
            >
              Remover
            </button>
          )}
          <button 
            onClick={() => {
              if (isValid) {
                onSelect(selectedSet, selectedStat);
                onClose();
              }
            }}
            disabled={!isValid}
            className={`flex-1 font-bold py-3 rounded-xl transition-colors text-sm uppercase tracking-wider ${
              isValid
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                : 'bg-white/5 text-white/20 cursor-not-allowed'
            }`}
          >
            Confirmar Equipamento
          </button>
        </div>

      </div>
    </>
  );
};
