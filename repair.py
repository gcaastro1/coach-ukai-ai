import os
import re

with open('src/components/PlayerDetailsModal.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add imports at the top
imports = """import guidesData from '../data/guides.json';
import memoriesData from '../data/memories.json';
import { getMemoryDescriptionById } from '../utils/dataFetcher';
"""
code = code.replace("interface PlayerDetailsModalProps", imports + "interface PlayerDetailsModalProps")

# 2. Replace state and add parseMarkdownTips
state_regex = re.compile(r"const \[activeTab, setActiveTab\] = useState.*?;\s*([\s\S]*?)const { isPlayerSaved, savePlayer, removePlayer } = useAccount\(\);", re.MULTILINE)

new_state = """const [activeTab, setActiveTab] = useState<'guide' | 'info' | 'skills' | 'resonance' | 'bonus'>('guide');
  const [characterDetails, setCharacterDetails] = useState<any>(null);
  const [activePotentialSlot, setActivePotentialSlot] = useState<PotentialSlotID | null>(null);
  const [isMemoryDrawerOpen, setIsMemoryDrawerOpen] = useState(false);
  const [showMemoryEffect, setShowMemoryEffect] = useState(false);
  const [selectedBuildIndex, setSelectedBuildIndex] = useState(0);

  const characterGuide = guidesData.find(g => g.id === playerNode?.character.id);
  const builds = characterGuide?.builds || [];
  const currentBuild = builds[selectedBuildIndex];

  const parseMarkdownTips = (text: string, characterPosition: string) => {
    if (!text) return '';
    const lines = text.split('\\n');
    const processedLines: string[] = [];
    
    for (let line of lines) {
      line = line.replace(/\\[cite:.*?\\]/g, '');
      line = line.replace(/^\\*\\*\\*(.*?)\\*\\*\\*$/g, '$1');
      line = line.trim();
      if (!line) continue;

      if (line.match(/\\*\\s+\\*\\*Composição/i) || line.match(/## Composição/i)) {
        processedLines.push(`<h4 class="text-sm font-black text-white/50 mt-8 mb-4 uppercase tracking-[0.2em] border-b border-white/10 pb-2 flex items-center gap-2"><svg class="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>Composição de Equipe</h4>`);
        continue;
      }

      const memoryMatch = line.match(/\\*\\s+\\*\\*Memória:\\s+(.*?)\\*\\*/i);
      if (memoryMatch) {
        const memoryName = memoryMatch[1].trim();
        const memory = memoriesData.find((m: any) => m.name === memoryName);
        
        if (memory && memory.position !== 'All' && memory.position !== characterPosition) {
          continue;
        }
        
        if (memory) {
          const rarityColors = {
            'UR': 'border-red-500/50 from-red-500/10 to-transparent shadow-red-500/20',
            'SSR': 'border-yellow-500/50 from-yellow-500/10 to-transparent shadow-yellow-500/20',
            'SR': 'border-purple-500/50 from-purple-500/10 to-transparent shadow-purple-500/20',
            'R': 'border-blue-500/50 from-blue-500/10 to-transparent shadow-blue-500/20',
            'N': 'border-gray-500/50 from-gray-500/10 to-transparent shadow-gray-500/20',
          };
          const colorClass = rarityColors[memory.rarity as keyof typeof rarityColors] || 'border-white/10';
          
          processedLines.push(`
            <div class="flex flex-col sm:flex-row gap-4 p-4 mt-4 bg-gradient-to-br ${colorClass} border rounded-2xl relative overflow-hidden group shadow-lg">
              <div class="absolute inset-0 bg-black/60 z-0"></div>
              <div class="w-20 h-20 shrink-0 rounded-xl border-2 border-black/50 overflow-hidden relative z-10 shadow-2xl group-hover:scale-105 transition-transform">
                <img src="/assets/memories/${memory.id}.png" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 relative z-10">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-[10px] font-black uppercase bg-black/80 px-2 py-0.5 rounded text-white/90 shadow-sm">${memory.rarity}</span>
                  <span class="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">${memory.position}</span>
                </div>
                <h5 class="text-base font-black text-orange-400 leading-tight mb-2 tracking-tight">${memory.name}</h5>
                <div class="text-sm text-white/70 leading-relaxed font-medium description-block"></div>
              </div>
            </div>
          `);
        } else {
          processedLines.push(`<li class="mt-4 font-black text-orange-400 text-sm tracking-wide uppercase">${memoryName}</li>`);
        }
        continue;
      }
      
      const logicMatch = line.match(/^\\*\\s+\\*Lógica:\\*(.*)$/);
      if (logicMatch) {
         const logicText = logicMatch[1].trim();
         if (processedLines.length > 0 && processedLines[processedLines.length - 1].includes('description-block')) {
           processedLines[processedLines.length - 1] = processedLines[processedLines.length - 1].replace(
             '<div class="text-sm text-white/70 leading-relaxed font-medium description-block"></div>',
             `<div class="text-sm text-white/70 leading-relaxed font-medium description-block border-t border-white/5 pt-2 mt-2">${logicText}</div>`
           );
         } else {
           processedLines.push(`<p class="text-sm text-white/50 pl-4 border-l-2 border-orange-500/30 mt-2 font-medium italic">${logicText}</p>`);
         }
         continue;
      }

      if (line.startsWith('* ')) {
        processedLines.push(`<li class="text-sm text-white/80 mb-2 flex items-start gap-3"><span class="text-orange-500 mt-0.5 shrink-0">✦</span><span class="leading-relaxed">${line.substring(2)}</span></li>`);
      } else {
        processedLines.push(`<p class="mb-3 text-sm text-white/80 leading-relaxed">${line}</p>`);
      }
    }

    return processedLines.join('\\n');
  };

  const { isPlayerSaved, savePlayer, removePlayer } = useAccount();"""

code = state_regex.sub(new_state.replace('\\', '\\\\'), code, count=1)

# 3. Remove handlers
handlers_regex = re.compile(r"const handleAnalyzeBuild = async \(\) => \{[\s\S]*?const handleSuggestPotentials = async \(\) => \{[\s\S]*?setIsSuggesting\(false\);\n    \}\n  \};", re.MULTILINE)
code = handlers_regex.sub('', code, count=1)

# 4. Update modal container and header
modal_container_regex = re.compile(r'<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-\[#0f0f0f\] border border-gray-800 shadow-2xl z-50 rounded-2xl overflow-hidden flex flex-col max-h-\[90vh\]">[\s\S]*?<div className="relative h-32 shrink-0 bg-neutral-900 border-b border-gray-800 flex items-center p-5 overflow-hidden">', re.MULTILINE)
new_modal_container = """<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-[#0a0a0a] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] z-50 rounded-3xl overflow-hidden flex flex-col max-h-[95vh] ring-1 ring-white/5">
        
        {/* Header */}
        <div className={`relative h-40 shrink-0 border-b border-white/10 flex items-center p-8 overflow-hidden ${
          character.rarity === 'UR' ? 'bg-gradient-to-br from-red-950/80 via-black to-black' : 
          character.rarity === 'SSR' ? 'bg-gradient-to-br from-yellow-950/80 via-black to-black' : 
          'bg-gradient-to-br from-purple-950/80 via-black to-black'
        }`}>"""
code = modal_container_regex.sub(new_modal_container.replace('\\', '\\\\'), code, count=1)

# 5. Update tabs
tabs_regex = re.compile(r'{\/\* Tabs \*\/}\s*<div className="flex border-b border-gray-800 bg-\[#121212\] shrink-0">[\s\S]*?<div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-white\/10">', re.MULTILINE)
new_tabs = """{/* Tabs */}
        <div className="flex border-b border-white/5 bg-[#0a0a0a] shrink-0 px-4">
          <button 
            onClick={() => setActiveTab('guide')}
            className={`px-6 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 flex items-center gap-2 ${activeTab === 'guide' ? 'border-purple-500 text-purple-400 bg-purple-500/5' : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Guia
          </button>
          <button 
            onClick={() => setActiveTab('info')}
            className={`px-6 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'info' ? 'border-orange-500 text-orange-400 bg-orange-500/5' : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            Atributos
          </button>
          <button 
            onClick={() => setActiveTab('skills')}
            className={`px-6 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'skills' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            Habilidades
          </button>
          <button 
            onClick={() => setActiveTab('resonance')}
            className={`px-6 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'resonance' ? 'border-green-500 text-green-400 bg-green-500/5' : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            Ressonância
          </button>
          <button 
            onClick={() => setActiveTab('bonus')}
            className={`px-6 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'bonus' ? 'border-red-500 text-red-400 bg-red-500/5' : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            Bônus
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-white/10">"""
code = tabs_regex.sub(new_tabs.replace('\\', '\\\\'), code, count=1)

with open('src/components/PlayerDetailsModal.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Python repair 1 completed")
