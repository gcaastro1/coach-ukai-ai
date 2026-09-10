import React, { useState, useEffect } from 'react';
import { IncomeConfig } from '../hooks/useCalculator';

interface IncomeConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  income: IncomeConfig;
  onSave: (newIncome: IncomeConfig) => void;
}

export const IncomeConfigModal: React.FC<IncomeConfigModalProps> = ({ isOpen, onClose, income, onSave }) => {
  const [localConfig, setLocalConfig] = useState<IncomeConfig>(income);

  useEffect(() => {
    setLocalConfig(income);
  }, [income, isOpen]);

  if (!isOpen) return null;

  const handleChange = (section: keyof IncomeConfig, field: string, value: number) => {
    setLocalConfig(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: isNaN(value) ? 0 : value
      }
    }));
  };

  const SectionGroup = ({ title, section, labels }: { title: string, section: keyof IncomeConfig, labels: Record<string, string> }) => (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
      <h3 className="text-sm font-bold text-orange-500 uppercase mb-3 border-b border-gray-800 pb-2">{title}</h3>
      <div className="grid grid-cols-1 gap-2">
        {Object.entries(labels).map(([key, label]) => (
          <div key={key} className="flex justify-between items-center text-sm">
            <span className="text-gray-300">{label}</span>
            <input 
              type="number" 
              className="w-20 bg-[#0a0a0a] border border-gray-700 rounded px-2 py-1 text-white text-right outline-none focus:border-orange-500"
              value={(localConfig[section] as any)[key]}
              onChange={(e) => handleChange(section, key, parseFloat(e.target.value))}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-gray-800 flex justify-between font-bold text-sm text-gray-400">
        <span>Subtotal</span>
        <span>
          {Object.keys(labels).reduce((sum, key) => sum + ((localConfig[section] as any)[key] || 0), 0)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl w-full max-w-6xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#111]">
          <h2 className="text-xl font-bold">Configuração Detalhada de Renda</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="space-y-4">
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
                <h3 className="text-sm font-bold text-orange-500 uppercase mb-3 border-b border-gray-800 pb-2">DIAMANTES - EXERCÍCIO (Ciclo de 20h)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Diamantes por ciclo</span>
                    <input type="number" className="w-20 bg-[#0a0a0a] border border-gray-700 rounded px-2 py-1 text-white text-right" value={localConfig.exercise.diamondsPerCycle} onChange={e => handleChange('exercise', 'diamondsPerCycle', parseFloat(e.target.value))} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Ciclos por dia</span>
                    <input type="number" className="w-20 bg-[#0a0a0a] border border-gray-700 rounded px-2 py-1 text-white text-right" value={localConfig.exercise.cyclesPerDay} onChange={e => handleChange('exercise', 'cyclesPerDay', parseFloat(e.target.value))} />
                  </div>
                  <div className="pt-2 border-t border-gray-800 flex justify-between font-bold text-gray-400">
                    <span>por dia</span>
                    <span>{localConfig.exercise.diamondsPerCycle * localConfig.exercise.cyclesPerDay}</span>
                  </div>
                </div>
              </div>

              <SectionGroup title="INGRESSOS SP - MENSAIS (x dias / 30.44)" section="spMonthly" labels={{
                eventsWithoutCharacter: 'Eventos sem personagens',
                challengeShop: 'Loja Desafio',
                extra: 'Extra'
              }} />
            </div>

            <div className="space-y-4">
              <SectionGroup title="DIAMANTES - DIARIAMENTE (x dias)" section="daily" labels={{
                peakRankings: 'Classificações diárias de pico',
                trainingProgram: 'Programa de Treinamento',
                dailyComfortPack: 'Pacote de conforto diário',
                quiz: 'Quiz',
                peakDailyChallenge: 'Desafio Diário de Pico',
                dailyMission: 'Missão Diária',
                extra: 'Extra'
              }} />

              <SectionGroup title="MEMÓRIA - SEMANAL (x dias / 7)" section="memWeekly" labels={{
                specializedRehearsal: 'Ensaio especializado',
                jarOrderObjectives: 'Objetivos da Ordem do Jar...',
                weeklyMission: 'Missão Semanal',
                tripleMatchup: 'Confronto Triplo',
                extra: 'Extra'
              }} />
            </div>

            <div className="space-y-4">
              <SectionGroup title="DIAMANTES - SEMANAL (x dias / 7)" section="weekly" labels={{
                specializedRehearsal: 'Ensaio especializado',
                clubBonus: 'Bônus do Clube',
                jarOrderObjectives: 'Objetivos da Ordem do Jar...',
                tripleMatchup: 'Confronto Triplo',
                instagram: 'Instagram',
                weeklyMission: 'Missão Semanal',
                weekendBonus: 'Bônus de fim de semana',
                casualGames: 'Jogos casuais',
                extra: 'Extra'
              }} />

              <SectionGroup title="MEMÓRIA - QUINZENAL (x dias / 14)" section="memBiweekly" labels={{
                characterEventShop: 'Loja de Eventos de Persona...',
                eventFinalRank: 'Classificação final do event...',
                characterChainsPack: 'Pacote de Correntes de Per...',
                checkInBonus: 'Bônus de check-in',
                extra: 'Extra'
              }} />
            </div>

            <div className="space-y-4">
              <SectionGroup title="DIAMANTES - QUINZENAL (x dias / 14)" section="biweekly" labels={{
                matchSequence2v2: 'Sequência de partidas 2x2',
                matchSequence3v3: 'Sequência de partidas 3x3',
                checkInBonus: 'Bônus de check-in',
                characterEvent: 'Evento de Personagem',
                extra: 'Extra'
              }} />

              <SectionGroup title="DIAMANTES - MENSAL (x dias / 30.44)" section="monthly" labels={{
                tripleMatchupFinalRank: 'Classificação final do Triple...',
                rankIncrease: 'Aumento de classificação n...',
                highSeasonRank: 'Classificação da alta tempo...',
                maintenance: 'Manutenção',
                extra: 'Extra'
              }} />
              
              <SectionGroup title="INGRESSOS SP - QUINZENAL (x dias / 14)" section="spBiweekly" labels={{
                eventCheckIn: 'Check-in para evento com...',
                characterEventShop: 'Loja de Eventos de Persona...',
                bonusTrainingShop: 'Loja de Treinamento Bônus',
                extra: 'Extra'
              }} />

              <SectionGroup title="MEMÓRIA - MENSAL (x dias / 30.44)" section="memMonthly" labels={{
                maxRank: 'Classificação máxima',
                rankIncrease: 'Aumento de classificação n...',
                tripleMatchupFinalRank: 'Classificação final do Triple...',
                matchSequence: 'Sequência de partidas',
                challengeShop: 'Loja Desafio',
                eventsWithoutCharacter: 'Eventos sem personagens',
                extra: 'Extra'
              }} />
            </div>

          </div>
        </div>

        <div className="p-4 border-t border-gray-800 bg-[#111] flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-2 rounded-lg text-white font-bold hover:bg-white/10 transition-colors">
            Cancelar
          </button>
          <button 
            onClick={() => {
              onSave(localConfig);
              onClose();
            }} 
            className="px-6 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg text-white font-bold transition-colors"
          >
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
};
