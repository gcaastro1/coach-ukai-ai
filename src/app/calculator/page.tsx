'use client';

import React, { useState, useRef } from 'react';
import { useCalculator, TimelineEvent } from '../../hooks/useCalculator';
import { CharacterSelectModal } from '../../components/CharacterSelectModal';
import { WalletDrawer } from '../../components/WalletDrawer';
import { IncomeDrawer } from '../../components/IncomeDrawer';
import { SliderInput } from '../../components/SliderInput';
import { SmartImage } from '../../components/SmartImage';
import { Character } from '../../types';

const UPCOMING_BANNERS = [
  { name: 'Kenma', date: '2026-08-19', endDate: '2026-09-02', id: 5801, type: 'NEW', event: 'Final de Período' },
  { name: 'Lev Haiba', date: '2026-08-26', endDate: '2026-09-09', id: 5802, type: 'NEW', event: 'Final de Período' },
  { name: 'Aone', date: '2026-08-26', endDate: '2026-09-09', id: 5203, type: 'RERUN', event: 'Praia Escaldante' },
  { name: 'Tanaka', date: '2026-09-02', endDate: '2026-09-16', id: 5004, type: 'NEW', event: 'Sakura' },
  { name: 'Tsukishima', date: '2026-09-09', endDate: '2026-09-23', id: 5301, type: 'RERUN', event: 'Festival de Fogos' },
  { name: 'Yamamoto', date: '2026-09-16', endDate: '2026-09-30', id: 5005, type: 'NEW', event: 'Sakura' },
  { name: 'Kuroo', date: '2026-09-23', endDate: '2026-10-07', id: 5302, type: 'RERUN', event: 'Festival de Fogos' },
  { name: 'Kageyama', date: '2026-09-30', endDate: '2026-10-14', id: 5902, type: 'NEW', event: 'Jazz' },
  { name: 'Kunimi', date: '2026-10-07', endDate: '2026-10-21', id: 5401, type: 'RERUN', event: 'Festival Esportivo' },
  { name: 'Hinata', date: '2026-10-14', endDate: '2026-10-28', id: 5901, type: 'NEW', event: 'Jazz' },
  { name: 'Koganegawa', date: '2026-10-21', endDate: '2026-11-04', id: 5402, type: 'RERUN', event: 'Festival Esportivo' },
  { name: 'Nishinoya', date: '2026-10-28', endDate: '2026-11-11', id: 5903, type: 'NEW', event: 'Jazz' },
  { name: 'Oikawa', date: '2026-11-04', endDate: '2026-11-18', id: 5501, type: 'RERUN', event: 'Festival Escolar' },
  { name: 'Aone', date: '2026-11-11', endDate: '2026-11-25', id: 5103, type: 'NEW', event: 'Depois da Aula' },
  { name: 'Iwaizumi', date: '2026-11-18', endDate: '2026-12-02', id: 5502, type: 'RERUN', event: 'Festival Escolar' },
  { name: 'Futakuchi', date: '2026-11-25', endDate: '2026-12-09', id: 5104, type: 'NEW', event: 'Depois da Aula' },
  { name: 'Ushijima', date: '2026-12-02', endDate: '2026-12-16', id: 5503, type: 'RERUN', event: 'Festival Escolar' },
  { name: 'Ushijima', date: '2026-12-09', endDate: '2026-12-23', id: 5204, type: 'NEW', event: 'Praia Escaldante' },
  { name: 'Tendo', date: '2026-12-16', endDate: '2026-12-30', id: 5601, type: 'RERUN', event: 'Férias de Inverno' },
  { name: 'Shirabu', date: '2026-12-23', endDate: '2027-01-06', id: 5205, type: 'NEW', event: 'Praia Escaldante' },
  { name: 'Atsumu', date: '2026-12-30', endDate: '2027-01-13', id: 5602, type: 'RERUN', event: 'Férias de Inverno' },
  { name: 'Hanamaki', date: '2027-01-06', endDate: '2027-01-20', id: 5206, type: 'NEW', event: 'Praia Escaldante' },
  { name: 'Osamu', date: '2027-01-13', endDate: '2027-01-27', id: 5603, type: 'RERUN', event: 'Férias de Inverno' },
  { name: 'Yaku', date: '2027-01-20', endDate: '2027-02-03', id: 5303, type: 'NEW', event: 'Festival de Fogos' },
  { name: 'Ginjima', date: '2027-01-27', endDate: '2027-02-10', id: 5504, type: 'RERUN', event: 'Limpeza' },
  { name: 'Kita', date: '2027-02-03', endDate: '2027-02-17', id: 5304, type: 'NEW', event: 'Festival de Fogos' },
  { name: 'Hoshiumi', date: '2027-02-10', endDate: '2027-02-24', id: 5701, type: 'RERUN', event: 'Esportes de Inverno' },
  { name: 'Suna', date: '2027-02-17', endDate: '2027-03-03', id: 5305, type: 'NEW', event: 'Festival de Fogos' },
  { name: 'Hirugami', date: '2027-02-24', endDate: '2027-03-10', id: 5702, type: 'RERUN', event: 'Esportes de Inverno' },
  { name: 'Terushima', date: '2027-03-03', endDate: '2027-03-17', id: 5306, type: 'NEW', event: 'Festival de Fogos' },
  { name: 'Kenma', date: '2027-03-10', endDate: '2027-03-24', id: 5801, type: 'RERUN', event: 'Final de Período' },
  { name: 'Kuroo', date: '2027-03-17', endDate: '2027-03-31', id: 6001, type: 'NEW', event: 'Bandeira da Escola' },
  { name: 'Futakuchi', date: '2027-03-24', endDate: '2027-04-08', id: 5104, type: 'RERUN', event: 'Depois da Aula' },
  { name: 'Daichi', date: '2027-03-31', endDate: '2027-04-14', id: 6002, type: 'NEW', event: 'Bandeira da Escola' },
];

export default function CalculatorPage() {
  const { wallet, income, timeline, isLoaded, currentDate, updateCurrentDate, updateWallet, updateIncome, addTimelineEvent, removeTimelineEvent, getDailyAverages, updateTimeline } = useCalculator();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = { wallet, income, timeline, currentDate };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `haikyu_planner_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.wallet) updateWallet(data.wallet);
        if (data.income) updateIncome(data.income);
        if (data.timeline) updateTimeline(data.timeline);
        if (data.currentDate) updateCurrentDate(data.currentDate);
        alert("Dados carregados com sucesso!");
      } catch (err) {
        alert("Erro ao importar: Arquivo inválido.");
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };
  
  const parseNum = (val: string) => parseInt(val.replace(/\D/g, '')) || 0;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWalletDrawerOpen, setIsWalletDrawerOpen] = useState(false);
  const [isIncomeDrawerOpen, setIsIncomeDrawerOpen] = useState(false);
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventPulls, setNewEventPulls] = useState(140);
  const [newEventCostType, setNewEventCostType] = useState<'SP' | 'MEM'>('SP');

  if (!isLoaded) return <div className="p-8 text-white">Carregando...</div>;

  // Ledger Calculation
  let runningDiamonds = wallet.diamonds + (wallet.starGems || 0);
  let runningSP = wallet.spTickets;
  let runningMEM = wallet.memTickets;
  let runningMilk = wallet.milkTickets || 0;
  let currentSpPullsToPity = wallet.spPullsToPity ?? 140;
  let currentMemPullsToPity = wallet.memPullsToPity ?? 100;
  let currentPassRegDays = wallet.passRegularDays || 0;
  let currentPassPremDays = wallet.passPremiumDays || 0;
  const passRegBonus = wallet.passRegularBonus ?? 300;
  const passPremBonus = wallet.passPremiumBonus ?? 980;
  let lastDate = currentDate ? new Date(currentDate + 'T00:00:00') : new Date();
  lastDate.setHours(0, 0, 0, 0);
  
  const calculateCashback = (pulls: number, costType: string) => {
    let cbSp = 0;
    let cbMem = 0;
    let cbMilk = 0;
    let cbCopies = 0;
    
    if (costType === 'SP') {
      if (pulls >= 10) cbSp += 2;
      if (pulls >= 20) cbMem += 5;
      if (pulls >= 50) cbSp += 5;
      if (pulls >= 80) cbMem += 10;
      if (pulls >= 160) cbMilk += 5;
      if (pulls >= 200) cbCopies += 1;
      if (pulls >= 240) cbMilk += 2;
      if (pulls >= 280) cbMilk += 3;
      if (pulls >= 320) cbMilk += 5;
      if (pulls >= 360) cbMilk += 5;
      if (pulls >= 420) cbMem += 20;
    }
    
    return { cbSp, cbMem, cbMilk, cbCopies };
  };
  
  const dailyAverages = getDailyAverages(income);

  const timelineWithBalance = timeline.map(event => {
    // Parse target date assuming local timezone to avoid UTC shift issues
    const eventDate = new Date(event.expectedDate + 'T00:00:00');
    const today = currentDate ? new Date(currentDate + 'T00:00:00') : new Date();
    today.setHours(0,0,0,0);
    
    // Days from last event (or today)
    const daysDiff = Math.max(0, Math.floor((eventDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24)));
    
    runningDiamonds += daysDiff * dailyAverages.dailyDiamonds;
    runningSP += daysDiff * dailyAverages.dailySP;
    runningMEM += daysDiff * dailyAverages.dailyMEM;
    
    // Pass Renewals and Daily Diamonds logic
    if (currentPassRegDays > 0) {
      runningDiamonds += daysDiff * 90; // 90 diamonds per day
      if (daysDiff >= currentPassRegDays) {
        const remainingDays = daysDiff - currentPassRegDays;
        const renewals = 1 + Math.floor(remainingDays / 30);
        runningDiamonds += renewals * passRegBonus;
        currentPassRegDays = 30 - (remainingDays % 30);
      } else {
        currentPassRegDays -= daysDiff;
      }
    }
    
    if (currentPassPremDays > 0) {
      runningDiamonds += daysDiff * 100; // 100 diamonds per day
      if (daysDiff >= currentPassPremDays) {
        const remainingDays = daysDiff - currentPassPremDays;
        const renewals = 1 + Math.floor(remainingDays / 30);
        runningDiamonds += renewals * passPremBonus;
        currentPassPremDays = 30 - (remainingDays % 30);
      } else {
        currentPassPremDays -= daysDiff;
      }
    }

    if (eventDate > lastDate) {
      lastDate = eventDate;
    }

    let spCopies = 0;
    let isSpSuccess = false;
    let memCopies = 0;
    let isMemSuccess = false;
    let totalCashback = { cbSp: 0, cbMem: 0, cbMilk: 0, cbCopies: 0 };
    let totalCopiesFromMilk = 0;

    // Process SP
    let spPullsAvailable = runningSP + Math.floor(runningDiamonds / 150);
    if (event.spCost > 0) {
       isSpSuccess = spPullsAvailable >= event.spCost;
       if (runningSP >= event.spCost) {
          runningSP -= event.spCost;
       } else {
          const rem = event.spCost - runningSP;
          runningSP = 0;
          runningDiamonds -= rem * 150;
       }
       const cb = calculateCashback(event.spCost, 'SP');
       totalCashback.cbSp += cb.cbSp;
       totalCashback.cbMem += cb.cbMem;
       totalCashback.cbMilk += cb.cbMilk;
       totalCashback.cbCopies += cb.cbCopies;
       
       if (event.spCost >= currentSpPullsToPity) {
           spCopies = 1;
           const pullsAfterFirstPity = event.spCost - currentSpPullsToPity;
           spCopies += Math.floor(pullsAfterFirstPity / 140);
           currentSpPullsToPity = 140 - (pullsAfterFirstPity % 140);
       } else {
           currentSpPullsToPity -= event.spCost;
       }
    } else {
       isSpSuccess = true;
    }

    // Process MEM
    let memPullsAvailable = runningMEM + Math.floor(runningDiamonds / 100);
    if (event.memCost > 0) {
       isMemSuccess = memPullsAvailable >= event.memCost;
       if (runningMEM >= event.memCost) {
          runningMEM -= event.memCost;
       } else {
          const rem = event.memCost - runningMEM;
          runningMEM = 0;
          runningDiamonds -= rem * 100;
       }
       const cb = calculateCashback(event.memCost, 'MEM');
       totalCashback.cbSp += cb.cbSp;
       totalCashback.cbMem += cb.cbMem;
       totalCashback.cbMilk += cb.cbMilk;
       totalCashback.cbCopies += cb.cbCopies;
       
       if (event.memCost >= currentMemPullsToPity) {
           memCopies = 1;
           const pullsAfterFirstPity = event.memCost - currentMemPullsToPity;
           memCopies += Math.floor(pullsAfterFirstPity / 100);
           currentMemPullsToPity = 100 - (pullsAfterFirstPity % 100);
       } else {
           currentMemPullsToPity -= event.memCost;
       }
    } else {
       isMemSuccess = true;
    }

    const isSuccess = isSpSuccess && isMemSuccess;

    runningSP += totalCashback.cbSp;
    runningMEM += totalCashback.cbMem;
    runningMilk += totalCashback.cbMilk;

    if (runningMilk >= 20) {
      totalCopiesFromMilk = Math.floor(runningMilk / 20);
      runningMilk = runningMilk % 20;
    }
    
    return { 
      ...event, 
      spCopies,
      memCopies,
      balanceDiamonds: Math.floor(runningDiamonds), 
      balanceSP: Math.floor(runningSP), 
      balanceMEM: Math.floor(runningMEM),
      balanceMilk: Math.floor(runningMilk),
      cashback: totalCashback,
      freeCopies: totalCashback.cbCopies + totalCopiesFromMilk,
      isSuccess,
      isSpSuccess,
      isMemSuccess,
      spPullsAvailable,
      memPullsAvailable,
      daysFromNow: Math.max(0, Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 3600 * 24)))
    };
  });

  const handleAddTarget = (character: Character) => {
    if (!newEventDate) {
      alert("Por favor, informe a data estimada do banner.");
      return;
    }
    
    const newEvent: TimelineEvent = {
      id: Math.random().toString(36).substring(2, 9),
      characterId: character.id,
      customName: character.name,
      expectedDate: newEventDate,
      spCost: newEventPulls,
      memCost: 0,
    };
    
    addTimelineEvent(newEvent);
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-4 sm:p-8 flex flex-col items-center justify-start min-h-0 gap-6 w-full max-w-5xl mx-auto">
      
      <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-4">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-black tracking-tight uppercase" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Gacha Planner
              </h1>
              <div className="flex gap-2">
                <button onClick={handleExport} className="bg-gray-800 hover:bg-gray-700 text-xs text-white px-3 py-1.5 rounded-lg font-bold border border-gray-700 transition-colors">
                  Salvar
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="bg-gray-800 hover:bg-gray-700 text-xs text-white px-3 py-1.5 rounded-lg font-bold border border-gray-700 transition-colors">
                  Carregar
                </button>
                <input type="file" accept=".json" ref={fileInputRef} onChange={handleImport} className="hidden" />
              </div>
            </div>
            <p className="text-gray-400 text-sm">Planeje seus recursos para os próximos banners e descubra se você terá o suficiente para o Pity.</p>
          </div>
          <div className="flex flex-col items-start sm:items-end shrink-0">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Data Atual (Simulação)</label>
            <input 
              type="date" 
              className="bg-[#1a1a1a] border border-gray-800 text-sm font-mono text-gray-300 rounded-lg px-3 py-2 focus:border-orange-500 outline-none" 
              value={currentDate} 
              onChange={(e) => updateCurrentDate(e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* HUD Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* Wallet Summary */}
        <div 
          onClick={() => setIsWalletDrawerOpen(true)}
          className="bg-[#1a1a1a] border border-gray-800 hover:border-orange-500/50 rounded-2xl p-5 cursor-pointer transition-colors group flex items-center justify-between shadow-lg"
        >
          <div>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span>💎</span> Minha Carteira
            </h2>
            <div className="flex gap-4">
              <span className="text-2xl font-black text-orange-500">{wallet.diamonds} <span className="text-xs text-orange-500/50">💎</span></span>
              <span className="text-2xl font-black text-purple-400">{wallet.spTickets} <span className="text-xs text-purple-400/50">🎟️</span></span>
              <span className="text-2xl font-black text-blue-400">{wallet.memTickets} <span className="text-xs text-blue-400/50">🎫</span></span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-800 group-hover:bg-orange-500/20 flex items-center justify-center transition-colors">
            <span className="text-gray-400 group-hover:text-orange-500">✎</span>
          </div>
        </div>

        {/* Income Summary */}
        <div 
          onClick={() => setIsIncomeDrawerOpen(true)}
          className="bg-[#1a1a1a] border border-gray-800 hover:border-orange-500/50 rounded-2xl p-5 cursor-pointer transition-colors group flex items-center justify-between shadow-lg"
        >
          <div>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span>📈</span> Minha Renda (Diária)
            </h2>
            <div className="flex gap-4">
              <span className="text-2xl font-black text-orange-500">+{Math.floor(dailyAverages.dailyDiamonds)} <span className="text-xs text-orange-500/50">💎</span></span>
              <span className="text-2xl font-black text-purple-400">+{dailyAverages.dailySP.toFixed(1)} <span className="text-xs text-purple-400/50">🎟️</span></span>
              <span className="text-2xl font-black text-blue-400">+{dailyAverages.dailyMEM.toFixed(1)} <span className="text-xs text-blue-400/50">🎫</span></span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-800 group-hover:bg-orange-500/20 flex items-center justify-center transition-colors">
            <span className="text-gray-400 group-hover:text-orange-500">✎</span>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>📅</span> Linha do Tempo (Banners)
          </h2>
        </div>

        <div className="space-y-4">
          {timelineWithBalance.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border border-dashed border-gray-700 rounded-lg">
              Nenhum banner planejado. Adicione um alvo abaixo!
            </div>
          ) : (
            timelineWithBalance.map((event, idx) => (
              <div key={event.id} className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between shadow-lg relative overflow-hidden gap-6">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${event.isSuccess ? 'bg-green-500' : 'bg-red-500'}`} />
                
                {/* Col 1: Identity */}
                <div className="flex w-full md:w-[25%] items-center gap-4 shrink-0 mt-4 md:mt-0">
                  {event.characterId && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-700 shrink-0 shadow-inner bg-[#1a1a1a]">
                       <SmartImage playerId={String(event.characterId)} type="default" alt={event.customName} className="w-full h-full object-cover object-top" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold tracking-widest text-orange-500 uppercase">{event.expectedDate.split('-').reverse().join('/')}</span>
                    </div>
                    <h3 className="text-lg font-bold truncate leading-tight">{event.customName}</h3>
                    <div className="text-[10px] text-gray-500 mt-0.5">Daqui a {event.daysFromNow} dias</div>
                  </div>
                </div>

                {/* Col 2: Sliders */}
                <div className="flex flex-col gap-4 w-full md:w-[45%] md:px-6 md:border-x border-gray-800/50 py-2 md:py-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                    <SliderInput 
                      label="Personagem"
                      value={event.spCost || 0}
                      min={0}
                      max={1260}
                      step={10}
                      accentColor="orange"
                      onChange={(val) => {
                        const newTimeline = timeline.map(t => t.id === event.id ? { ...t, spCost: val } : t);
                        updateTimeline(newTimeline);
                      }}
                      subLabel={
                        <span className="text-gray-500 text-[9px] font-bold uppercase tracking-wider">
                          Garante {event.spCopies || 0}x
                        </span>
                      }
                    />
                    <SliderInput 
                      label="Memória"
                      value={event.memCost || 0}
                      min={0}
                      max={1000}
                      step={10}
                      accentColor="blue"
                      onChange={(val) => {
                        const newTimeline = timeline.map(t => t.id === event.id ? { ...t, memCost: val } : t);
                        updateTimeline(newTimeline);
                      }}
                      subLabel={
                        <span className="text-gray-500 text-[9px] font-bold uppercase tracking-wider">
                          Garante {event.memCopies || 0}x
                        </span>
                      }
                    />
                  </div>
                </div>

                {/* Col 3: Results */}
                <div className="flex flex-col items-center md:items-end justify-center w-full md:w-[30%] shrink-0 pr-4 md:pr-10">
                  <div className="flex flex-col items-center md:items-end w-full">
                    <div className="flex gap-4 mb-2">
                       <span className={`text-[11px] font-bold ${event.isSpSuccess ? 'text-green-500' : 'text-red-500'}`}>
                         SP: {event.isSpSuccess ? '✅ OK' : `❌ ${Math.floor((event.spPullsAvailable / event.spCost) * 100)}%`}
                       </span>
                       <span className={`text-[11px] font-bold ${event.isMemSuccess ? 'text-green-500' : 'text-red-500'}`}>
                         MEM: {event.isMemSuccess ? '✅ OK' : `❌ ${Math.floor((event.memPullsAvailable / event.memCost) * 100)}%`}
                       </span>
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Saldo pós-banner</span>
                    <span className={`text-2xl font-black tracking-tight ${event.balanceDiamonds < 0 ? 'text-red-500' : 'text-orange-500'}`}>
                      💎 {Math.floor(event.balanceDiamonds)}
                    </span>
                    
                    {(event.cashback.cbSp > 0 || event.cashback.cbMem > 0 || event.cashback.cbMilk > 0 || event.freeCopies > 0) && (
                      <div className="mt-2 flex flex-col items-center md:items-end gap-1 w-full pt-2">
                        {(event.cashback.cbSp > 0 || event.cashback.cbMem > 0 || event.cashback.cbMilk > 0) && (
                          <div className="text-[9px] text-gray-400 font-medium">
                            Cashback: 
                            {event.cashback.cbSp > 0 && <span className="text-purple-400 ml-1">+{event.cashback.cbSp} SP</span>}
                            {event.cashback.cbMem > 0 && <span className="text-yellow-400 ml-1">+{event.cashback.cbMem} MEM</span>}
                            {event.cashback.cbMilk > 0 && <span className="text-blue-400 ml-1">+{event.cashback.cbMilk}🥛</span>}
                          </div>
                        )}
                        {event.freeCopies > 0 && (
                          <div className="text-[10px] font-bold text-green-400">
                            +{event.freeCopies} Cópia(s) Bônus!
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => removeTimelineEvent(event.id)}
                  className="absolute right-3 top-3 md:top-1/2 md:-translate-y-1/2 text-gray-600 hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                  title="Remover banner"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-8 border-t border-gray-800 pt-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Cronograma de Banners Oficiais</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {UPCOMING_BANNERS.filter(b => b.endDate > (currentDate || new Date().toISOString().split('T')[0])).map(banner => {
              const isPlanned = timeline.some(t => t.customName === banner.name);
              return (
                <div key={banner.name + banner.date} className={`p-3 rounded-xl flex items-center gap-3 transition-colors border ${isPlanned ? 'bg-orange-900/10 border-orange-500/30' : 'bg-[#0a0a0a] border-gray-800 hover:border-gray-700'}`}>
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#1a1a1a] shrink-0 border border-gray-700">
                    <SmartImage playerId={String(banner.id)} type="mini" alt={banner.name} className="w-full h-full object-cover object-top" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-gray-400 font-mono mb-0.5">
                      {banner.date.split('-').reverse().join('/')}
                    </div>
                    <div className={`font-bold text-sm flex items-center gap-1.5 truncate ${isPlanned ? 'text-orange-400' : 'text-white'}`}>
                      {banner.type === 'NEW' ? (
                        <span className="text-[8px] font-black bg-white text-black px-1 rounded-sm shrink-0 leading-tight py-0.5">NEW</span>
                      ) : (
                        <span className="text-[8px] font-black bg-amber-700/60 text-amber-100 px-1 rounded-sm shrink-0 leading-tight py-0.5">RERUN</span>
                      )}
                      <span className="truncate">{banner.name}</span>
                    </div>
                    {banner.event && (
                      <div className="text-[9px] text-gray-500 font-bold uppercase truncate mt-0.5 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-sm bg-gray-600"></div>
                        {banner.event}
                      </div>
                    )}
                  </div>
                  
                  {!isPlanned ? (
                    <button 
                      onClick={() => {
                        addTimelineEvent({
                          id: Math.random().toString(36).substring(2, 9),
                          characterId: banner.id,
                          customName: banner.name,
                          expectedDate: banner.date,
                          spCost: 140, // default SP pity
                          memCost: 0,
                        });
                      }}
                      className="bg-gray-800 hover:bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0"
                      title="Adicionar à Linha do Tempo"
                    >
                      +
                    </button>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-green-900/30 flex items-center justify-center shrink-0" title="Já planejado">
                      <span className="text-green-500 text-sm">✓</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <CharacterSelectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleAddTarget}
      />
      
      <WalletDrawer 
        isOpen={isWalletDrawerOpen}
        onClose={() => setIsWalletDrawerOpen(false)}
        wallet={wallet}
        onSave={updateWallet}
      />
      
      <IncomeDrawer
        isOpen={isIncomeDrawerOpen}
        onClose={() => setIsIncomeDrawerOpen(false)}
        income={income}
        onSave={updateIncome}
      />
    </div>
  );
}
