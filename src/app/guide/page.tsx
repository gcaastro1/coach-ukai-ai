'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { guideContent } from '@/data/guideContent';
import { 
  BookOpen, 
  Calculator, 
  Users, 
  Crosshair, 
  Zap,
  Trophy
} from 'lucide-react';

type SectionKey = keyof typeof guideContent;

const SECTIONS: { key: SectionKey; title: string; icon: React.ReactNode }[] = [
  { key: 'danos', title: 'Mecânicas de Dano', icon: <Calculator className="w-5 h-5" /> },
  { key: 'vitoria', title: 'O Ciclo da Jogada', icon: <Crosshair className="w-5 h-5" /> },
  { key: 'time', title: 'Formação de Time', icon: <Users className="w-5 h-5" /> },
  { key: 'atributos', title: 'Guia de Atributos', icon: <Zap className="w-5 h-5" /> },
  { key: 'clube', title: 'Disputa de Clube', icon: <Trophy className="w-5 h-5" /> },
];

export default function GuidePage() {
  const [activeSection, setActiveSection] = useState<SectionKey>('danos');

  return (
    <div className="flex h-full w-full overflow-hidden">
      
      {/* Sidebar de Navegação */}
      <div className="w-72 border-r border-gray-800 bg-[#0f0f0f]/80 p-6 flex flex-col gap-4 overflow-y-auto hidden md:flex shrink-0">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Guia <span className="text-orange-500">Tático</span>
          </h2>
        </div>

        <nav className="flex flex-col gap-2">
          {SECTIONS.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${
                activeSection === section.key
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white border border-transparent'
              }`}
            >
              {section.icon}
              <span>{section.title}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo Principal (Markdown) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0a0a0a]">
        
        {/* Dropdown Mobile */}
        <div className="md:hidden mb-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Guia <span className="text-orange-500">Tático</span>
            </h2>
          </div>
          <select 
            className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2.5"
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value as SectionKey)}
          >
            {SECTIONS.map(s => (
              <option key={s.key} value={s.key}>{s.title}</option>
            ))}
          </select>
        </div>

        <div className="max-w-4xl mx-auto bg-[#141414] border border-gray-800 rounded-2xl p-6 md:p-10 shadow-2xl">
          <div className="max-w-none text-white/80 leading-relaxed font-medium">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl md:text-4xl font-black mt-2 mb-8 text-white border-b border-white/10 pb-4 tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl md:text-3xl font-black mt-12 mb-6 text-orange-400 tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-8 mb-4 text-blue-400" {...props} />,
                p: ({node, ...props}) => <p className="mb-5 text-gray-300 leading-relaxed text-[15px]" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-300" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-300" {...props} />,
                li: ({node, ...props}) => <li className="pl-2" {...props} />,
                strong: ({node, ...props}) => <strong className="font-black text-white" {...props} />,
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-[6px] border-orange-500 pl-4 md:pl-6 py-2 my-6 bg-orange-500/5 italic text-white/90 rounded-r-lg" {...props} />
                ),
                code: ({node, inline, ...props}: any) => 
                  inline ? (
                    <code className="bg-gray-800 text-orange-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                  ) : (
                    <code className="block bg-gray-900 text-gray-300 p-4 rounded-xl text-sm font-mono my-4 overflow-x-auto border border-gray-800" {...props} />
                  )
              }}
            >
              {guideContent[activeSection]}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
