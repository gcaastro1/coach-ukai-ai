import { useState, useEffect } from 'react';
import { UserCharacter } from '../types';

const STORAGE_KEY = 'haikyu_builder_account_players';

export function useAccount() {
  const [savedPlayers, setSavedPlayers] = useState<Record<number, UserCharacter>>({});

  const loadFromStorage = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSavedPlayers(parsed);
        } catch (e) {
          console.error("Failed to parse saved players from local storage", e);
        }
      } else {
        setSavedPlayers({});
      }
    }
  };

  // Load from local storage on mount and listen to changes
  useEffect(() => {
    loadFromStorage();
    
    const handleStorageUpdate = () => {
      loadFromStorage();
    };

    window.addEventListener('haikyu_account_update', handleStorageUpdate);
    return () => {
      window.removeEventListener('haikyu_account_update', handleStorageUpdate);
    };
  }, []);

  const savePlayer = (player: UserCharacter) => {
    const updated = {
      ...savedPlayers,
      [player.characterId]: player
    };
    setSavedPlayers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('haikyu_account_update'));
    }
  };

  const removePlayer = (characterId: number) => {
    const updated = { ...savedPlayers };
    delete updated[characterId];
    setSavedPlayers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('haikyu_account_update'));
    }
  };

  const isPlayerSaved = (characterId: number) => {
    return savedPlayers[characterId] !== undefined;
  };

  return {
    savedPlayers,
    savePlayer,
    removePlayer,
    isPlayerSaved
  };
}
