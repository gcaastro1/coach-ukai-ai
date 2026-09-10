import React, { useState, useEffect } from 'react';
import { WalletData } from '../hooks/useCalculator';

interface WalletDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletData;
  onSave: (newWallet: WalletData) => void;
}

export const WalletDrawer: React.FC<WalletDrawerProps> = ({ isOpen, onClose, wallet, onSave }) => {
  const [localWallet, setLocalWallet] = useState<WalletData>(wallet);

  useEffect(() => {
    setLocalWallet(wallet);
  }, [wallet, isOpen]);

  const handleChange = (field: keyof WalletData, value: number) => {
    setLocalWallet(prev => ({ ...prev, [field]: isNaN(value) ? 0 : value }));
  };

  const parseNum = (val: string) => parseInt(val.replace(/\D/g, '')) || 0;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0a0a0a] border-l border-gray-800 z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#111]">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>💎</span> Minha Carteira
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
            <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Moedas Principais</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Diamantes Atuais</label>
                <input 
                  type="text" inputMode="numeric"
                  className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-orange-500 font-mono"
                  value={localWallet.diamonds}
                  onChange={e => handleChange('diamonds', parseNum(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Gemas Estelares</label>
                <input 
                  type="text" inputMode="numeric"
                  className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-orange-500 font-mono"
                  value={localWallet.starGems || 0}
                  onChange={e => handleChange('starGems', parseNum(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
            <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Tickets de Gacha</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Tickets SP</label>
                <input 
                  type="text" inputMode="numeric"
                  className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500 font-mono"
                  value={localWallet.spTickets}
                  onChange={e => handleChange('spTickets', parseNum(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Tickets Memória</label>
                <input 
                  type="text" inputMode="numeric"
                  className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 font-mono"
                  value={localWallet.memTickets}
                  onChange={e => handleChange('memTickets', parseNum(e.target.value))}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-400 mb-1">Bilhetes de Leite</label>
                <input 
                  type="text" inputMode="numeric"
                  className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-300 font-mono"
                  value={localWallet.milkTickets || 0}
                  onChange={e => handleChange('milkTickets', parseNum(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
            <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Contador de Pity (Faltam p/ Garantido)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Personagem (SP)</label>
                <input 
                  type="text" inputMode="numeric"
                  className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-orange-500 font-mono"
                  value={localWallet.spPullsToPity ?? 140}
                  onChange={e => handleChange('spPullsToPity', parseNum(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Memória</label>
                <input 
                  type="text" inputMode="numeric"
                  className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-orange-500 font-mono"
                  value={localWallet.memPullsToPity ?? 100}
                  onChange={e => handleChange('memPullsToPity', parseNum(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
            <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Passes Mensais (Dias Restantes)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Passe Reg. (Dias)</label>
                <input 
                  type="text" inputMode="numeric"
                  className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-green-500 font-mono"
                  value={localWallet.passRegularDays || 0}
                  onChange={e => handleChange('passRegularDays', parseNum(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Passe Prem. (Dias)</label>
                <input 
                  type="text" inputMode="numeric"
                  className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-green-500 font-mono"
                  value={localWallet.passPremiumDays || 0}
                  onChange={e => handleChange('passPremiumDays', parseNum(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Bônus Passe Reg.</label>
                <input 
                  type="text" inputMode="numeric"
                  className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-green-500 font-mono"
                  value={localWallet.passRegularBonus ?? 300}
                  onChange={e => handleChange('passRegularBonus', parseNum(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Bônus Passe Prem.</label>
                <input 
                  type="text" inputMode="numeric"
                  className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-green-500 font-mono"
                  value={localWallet.passPremiumBonus ?? 980}
                  onChange={e => handleChange('passPremiumBonus', parseNum(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-800 bg-[#111]">
          <button 
            onClick={() => {
              onSave(localWallet);
              onClose();
            }}
            className="w-full py-3 bg-orange-600 hover:bg-orange-500 rounded-xl text-white font-bold tracking-wide transition-colors shadow-lg"
          >
            Salvar Carteira
          </button>
        </div>

      </div>
    </>
  );
};
