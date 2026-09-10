import React, { useState, useEffect } from 'react';
import { IncomeConfig } from '../hooks/useCalculator';

interface IncomeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  income: IncomeConfig;
  onSave: (newIncome: IncomeConfig) => void;
}

type TabType = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'exercise';

export const IncomeDrawer: React.FC<IncomeDrawerProps> = ({ isOpen, onClose, income, onSave }) => {
  const [localConfig, setLocalConfig] = useState<IncomeConfig>(income);
  const [activeTab, setActiveTab] = useState<TabType>('daily');

  useEffect(() => {
    setLocalConfig(income);
  }, [income, isOpen]);

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
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 mb-4">
      <h3 className="text-sm font-bold text-orange-500 uppercase mb-3 border-b border-gray-800 pb-2">{title}</h3>
      <div className="grid grid-cols-1 gap-3">
        {Object.entries(labels).map(([key, label]) => (
          <div key={key} className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center text-sm">
            <span className="text-gray-300">{label}</span>
            <input 
              type="number" 
              className="w-full sm:w-24 bg-[#0a0a0a] border border-gray-700 rounded-lg px-3 py-1.5 text-white text-right outline-none focus:border-orange-500 font-mono transition-colors"
              value={(localConfig[section] as any)[key]}
              onChange={(e) => handleChange(section, key, parseFloat(e.target.value))}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center font-bold text-sm text-gray-400">
        <span>Subtotal</span>
        <span className="text-orange-400 font-mono bg-orange-900/20 px-2 py-0.5 rounded">
          {Object.keys(labels).reduce((sum, key) => sum + ((localConfig[section] as any)[key] || 0), 0)}
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-[#0a0a0a] border-l border-gray-800 z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#111]">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>📈</span> Minha Renda
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Tabs Sidebar */}
          <div className="w-32 sm:w-48 bg-[#111] border-r border-gray-800 flex flex-col p-2 gap-1 overflow-y-auto">
            <button 
              onClick={() => setActiveTab('daily')}
              className={`text-left px-3 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'daily' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
            >
              Diário
            </button>
            <button 
              onClick={() => setActiveTab('weekly')}
              className={`text-left px-3 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'weekly' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
            >
              Semanal
            </button>
            <button 
              onClick={() => setActiveTab('biweekly')}
              className={`text-left px-3 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'biweekly' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
            >
              Quinzenal
            </button>
            <button 
              onClick={() => setActiveTab('monthly')}
              className={`text-left px-3 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'monthly' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
            >
              Mensal
            </button>
            <button 
              onClick={() => setActiveTab('exercise')}
              className={`text-left px-3 py-3 rounded-lg text-sm font-bold transition-colors mt-auto border border-gray-700 ${activeTab === 'exercise' ? 'bg-purple-600 text-white border-purple-500' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
            >
              Exercício (20h)
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-[#0a0a0a]">
            
            {activeTab === 'exercise' && (
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
                <h3 className="text-sm font-bold text-orange-500 uppercase mb-3 border-b border-gray-800 pb-2">DIAMANTES - EXERCÍCIO (Ciclo de 20h)</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center">
                    <span className="text-gray-300">Diamantes por ciclo</span>
                    <input type="number" className="w-full sm:w-24 bg-[#0a0a0a] border border-gray-700 rounded-lg px-3 py-1.5 text-white text-right font-mono outline-none focus:border-orange-500" value={localConfig.exercise.diamondsPerCycle} onChange={e => handleChange('exercise', 'diamondsPerCycle', parseFloat(e.target.value))} />
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center">
                    <span className="text-gray-300">Ciclos por dia</span>
                    <input type="number" className="w-full sm:w-24 bg-[#0a0a0a] border border-gray-700 rounded-lg px-3 py-1.5 text-white text-right font-mono outline-none focus:border-orange-500" value={localConfig.exercise.cyclesPerDay} onChange={e => handleChange('exercise', 'cyclesPerDay', parseFloat(e.target.value))} />
                  </div>
                  <div className="pt-3 border-t border-gray-800 flex justify-between items-center font-bold text-gray-400">
                    <span>Média por dia</span>
                    <span className="text-orange-400 font-mono bg-orange-900/20 px-2 py-0.5 rounded">
                      {localConfig.exercise.diamondsPerCycle * localConfig.exercise.cyclesPerDay}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'daily' && (
              <SectionGroup title="DIAMANTES - DIARIAMENTE (x dias)" section="daily" labels={{
                peakRankings: 'Classificações diárias de pico',
                trainingProgram: 'Programa de Treinamento',
                dailyComfortPack: 'Pacote de conforto diário',
                quiz: 'Quiz',
                peakDailyChallenge: 'Desafio Diário de Pico',
                dailyMission: 'Missão Diária',
                extra: 'Extra'
              }} />
            )}

            {activeTab === 'weekly' && (
              <>
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
                <SectionGroup title="MEMÓRIA - SEMANAL (x dias / 7)" section="memWeekly" labels={{
                  specializedRehearsal: 'Ensaio especializado',
                  jarOrderObjectives: 'Objetivos da Ordem do Jar...',
                  weeklyMission: 'Missão Semanal',
                  tripleMatchup: 'Confronto Triplo',
                  extra: 'Extra'
                }} />
              </>
            )}

            {activeTab === 'biweekly' && (
              <>
                <SectionGroup title="DIAMANTES - QUINZENAL (x dias / 14)" section="biweekly" labels={{
                  matchSequence2v2: 'Sequência de partidas 2x2',
                  matchSequence3v3: 'Sequência de partidas 3x3',
                  checkInBonus: 'Bônus de check-in',
                  characterEvent: 'Evento de Personagem',
                  extra: 'Extra'
                }} />
                <SectionGroup title="INGRESSOS SP - QUINZENAL (x dias / 14)" section="spBiweekly" labels={{
                  eventCheckIn: 'Check-in para evento com...',
                  characterEventShop: 'Loja de Eventos de Persona...',
                  bonusTrainingShop: 'Loja de Treinamento Bônus',
                  extra: 'Extra'
                }} />
                <SectionGroup title="MEMÓRIA - QUINZENAL (x dias / 14)" section="memBiweekly" labels={{
                  characterEventShop: 'Loja de Eventos de Persona...',
                  eventFinalRank: 'Classificação final do event...',
                  characterChainsPack: 'Pacote de Correntes de Per...',
                  checkInBonus: 'Bônus de check-in',
                  extra: 'Extra'
                }} />
              </>
            )}

            {activeTab === 'monthly' && (
              <>
                <SectionGroup title="DIAMANTES - MENSAL (x dias / 30.44)" section="monthly" labels={{
                  tripleMatchupFinalRank: 'Classificação final do Triple...',
                  rankIncrease: 'Aumento de classificação n...',
                  highSeasonRank: 'Classificação da alta tempo...',
                  maintenance: 'Manutenção',
                  extra: 'Extra'
                }} />
                <SectionGroup title="INGRESSOS SP - MENSAIS (x dias / 30.44)" section="spMonthly" labels={{
                  eventsWithoutCharacter: 'Eventos sem personagens',
                  challengeShop: 'Loja Desafio',
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
              </>
            )}

          </div>
        </div>

        <div className="p-6 border-t border-gray-800 bg-[#111]">
          <button 
            onClick={() => {
              onSave(localConfig);
              onClose();
            }} 
            className="w-full py-3 bg-orange-600 hover:bg-orange-500 rounded-xl text-white font-bold tracking-wide transition-colors shadow-lg"
          >
            Salvar Renda
          </button>
        </div>
      </div>
    </>
  );
};
