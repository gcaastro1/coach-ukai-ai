import { useState, useEffect } from 'react';

export interface Wallet {
  diamonds: number;
  spTickets: number;
  memTickets: number;
  milkTickets: number;
  spPullsToPity: number;
  memPullsToPity: number;
  starGems: number;
  passRegularDays: number;
  passPremiumDays: number;
  passRegularBonus: number;
  passPremiumBonus: number;
}

export interface IncomeConfig {
  exercise: {
    diamondsPerCycle: number;
    cyclesPerDay: number;
  };
  daily: {
    peakRankings: number;
    trainingProgram: number;
    dailyComfortPack: number;
    quiz: number;
    peakDailyChallenge: number;
    dailyMission: number;
    extra: number;
  };
  weekly: {
    specializedRehearsal: number;
    clubBonus: number;
    jarOrderObjectives: number;
    tripleMatchup: number;
    instagram: number;
    weeklyMission: number;
    weekendBonus: number;
    casualGames: number;
    extra: number;
  };
  biweekly: {
    matchSequence2v2: number;
    matchSequence3v3: number;
    checkInBonus: number;
    characterEvent: number;
    extra: number;
  };
  monthly: {
    tripleMatchupFinalRank: number;
    rankIncrease: number;
    highSeasonRank: number;
    maintenance: number;
    extra: number;
  };
  spBiweekly: {
    eventCheckIn: number;
    characterEventShop: number;
    bonusTrainingShop: number;
    extra: number;
  };
  spMonthly: {
    eventsWithoutCharacter: number;
    challengeShop: number;
    extra: number;
  };
  memWeekly: {
    specializedRehearsal: number;
    jarOrderObjectives: number;
    weeklyMission: number;
    tripleMatchup: number;
    extra: number;
  };
  memBiweekly: {
    characterEventShop: number;
    eventFinalRank: number;
    characterChainsPack: number;
    checkInBonus: number;
    extra: number;
  };
  memMonthly: {
    maxRank: number;
    rankIncrease: number;
    tripleMatchupFinalRank: number;
    matchSequence: number;
    challengeShop: number;
    eventsWithoutCharacter: number;
    extra: number;
  };
}

export interface TimelineEvent {
  id: string;
  characterId: number | null;
  customName?: string;
  expectedDate: string;
  spCost: number;
  memCost: number;
}

const STORAGE_KEY_WALLET = 'haikyu_builder_calc_wallet';
const STORAGE_KEY_INCOME = 'haikyu_builder_calc_income_v2'; // changed key to avoid conflict with old simple config
const STORAGE_KEY_TIMELINE = 'haikyu_builder_calc_timeline';

export const defaultIncomeConfig: IncomeConfig = {
  exercise: { diamondsPerCycle: 75, cyclesPerDay: 1 },
  daily: {
    peakRankings: 30, trainingProgram: 85, dailyComfortPack: 10,
    quiz: 10, peakDailyChallenge: 15, dailyMission: 60, extra: 0
  },
  weekly: {
    specializedRehearsal: 520, clubBonus: 50, jarOrderObjectives: 50,
    tripleMatchup: 60, instagram: 88, weeklyMission: 100, weekendBonus: 120,
    casualGames: 150, extra: 0
  },
  biweekly: {
    matchSequence2v2: 960, matchSequence3v3: 720, checkInBonus: 50,
    characterEvent: 775, extra: 0
  },
  monthly: {
    tripleMatchupFinalRank: 100, rankIncrease: 280, highSeasonRank: 350,
    maintenance: 300, extra: 0
  },
  spBiweekly: {
    eventCheckIn: 5, characterEventShop: 5, bonusTrainingShop: 2.5, extra: 1
  },
  spMonthly: {
    eventsWithoutCharacter: 5, challengeShop: 5, extra: 0
  },
  memWeekly: {
    specializedRehearsal: 5, jarOrderObjectives: 1, weeklyMission: 1,
    tripleMatchup: 1, extra: 0
  },
  memBiweekly: {
    characterEventShop: 5, eventFinalRank: 2, characterChainsPack: 1,
    checkInBonus: 1, extra: 0
  },
  memMonthly: {
    maxRank: 12, rankIncrease: 7, tripleMatchupFinalRank: 3,
    matchSequence: 5, challengeShop: 5, eventsWithoutCharacter: 5, extra: 0
  }
};

const defaultWallet: Wallet = { 
  diamonds: 0, 
  spTickets: 0, 
  memTickets: 0, 
  milkTickets: 0, 
  spPullsToPity: 140, 
  memPullsToPity: 100,
  starGems: 0,
  passRegularDays: 0,
  passPremiumDays: 0,
  passRegularBonus: 300,
  passPremiumBonus: 980
};

export function useCalculator() {
  const [wallet, setWallet] = useState<Wallet>(defaultWallet);
  const [income, setIncome] = useState<IncomeConfig>(defaultIncomeConfig);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedWallet = localStorage.getItem(STORAGE_KEY_WALLET);
      const storedIncome = localStorage.getItem(STORAGE_KEY_INCOME);
      const storedTimeline = localStorage.getItem(STORAGE_KEY_TIMELINE);
      const storedCurrentDate = localStorage.getItem('haikyu_current_date');

      if (storedWallet) setWallet(JSON.parse(storedWallet));
      if (storedIncome) setIncome(JSON.parse(storedIncome));
      if (storedTimeline) {
        const parsedTimeline = JSON.parse(storedTimeline);
        const migratedTimeline = parsedTimeline.map((e: any) => {
          if (e.costType !== undefined) {
            return {
              ...e,
              spCost: e.costType === 'SP' ? e.pullsNeeded : 0,
              memCost: e.costType === 'MEM' ? e.pullsNeeded : 0,
              costType: undefined,
              pullsNeeded: undefined
            };
          }
          return e;
        });
        setTimeline(migratedTimeline);
      }
      if (storedCurrentDate) setCurrentDate(storedCurrentDate);
      else setCurrentDate(new Date().toISOString().split('T')[0]);
      
      setIsLoaded(true);
    }
  }, []);

  const updateWallet = (newWallet: Wallet) => {
    setWallet(newWallet);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_WALLET, JSON.stringify(newWallet));
    }
  };

  const updateIncome = (newIncome: IncomeConfig) => {
    setIncome(newIncome);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_INCOME, JSON.stringify(newIncome));
    }
  };

  const updateTimeline = (newTimeline: TimelineEvent[]) => {
    const sorted = [...newTimeline].sort((a, b) => new Date(a.expectedDate).getTime() - new Date(b.expectedDate).getTime());
    setTimeline(sorted);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_TIMELINE, JSON.stringify(sorted));
    }
  };

  const updateCurrentDate = (newDate: string) => {
    setCurrentDate(newDate);
    if (typeof window !== 'undefined') {
      localStorage.setItem('haikyu_current_date', newDate);
    }
  };

  const addTimelineEvent = (event: TimelineEvent) => {
    updateTimeline([...timeline, event]);
  };

  const removeTimelineEvent = (id: string) => {
    updateTimeline(timeline.filter(e => e.id !== id));
  };

  // Helper to calculate daily average
  const getDailyAverages = (cfg: IncomeConfig) => {
    const sumObj = (obj: Record<string, number>) => Object.values(obj).reduce((a, b) => a + b, 0);
    
    const dailyDiamonds = 
      (cfg.exercise.diamondsPerCycle * cfg.exercise.cyclesPerDay) +
      sumObj(cfg.daily) +
      (sumObj(cfg.weekly) / 7) +
      (sumObj(cfg.biweekly) / 14) +
      (sumObj(cfg.monthly) / 30.44);

    const dailySP = 
      (sumObj(cfg.spBiweekly) / 14) +
      (sumObj(cfg.spMonthly) / 30.44);

    const dailyMEM = 
      (sumObj(cfg.memWeekly) / 7) +
      (sumObj(cfg.memBiweekly) / 14) +
      (sumObj(cfg.memMonthly) / 30.44);

    return { dailyDiamonds, dailySP, dailyMEM };
  };

  return {
    wallet,
    income,
    timeline,
    isLoaded,
    currentDate,
    updateWallet,
    updateIncome,
    updateTimeline,
    updateCurrentDate,
    addTimelineEvent,
    removeTimelineEvent,
    getDailyAverages
  };
}
