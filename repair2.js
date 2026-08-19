const fs = require('fs');

function repair2() {
  let code = fs.readFileSync('src/components/PlayerDetailsModal.tsx', 'utf8');

  // 1. Remove AI buttons from Potentials header
  const aiButtonsRegex = /<div className="flex items-center gap-2">\s*<button[\s\S]*?<\/button>\s*<\/div>/m;
  code = code.replace(aiButtonsRegex, '');

  // 2. Remove AI reasoning UI
  const aiReasoningUIRegex = /{\(aiReasoning \|\| aiAnalysis\) && \([\s\S]*?\}\)/m;
  code = code.replace(aiReasoningUIRegex, '');

  // 3. Inject Guide Tab content
  const guideContent = `{activeTab === 'guide' && (
            <div className="space-y-8 animate-fadeIn">
              {characterGuide && characterGuide.builds && characterGuide.builds.length > 0 ? (
                <>
                  <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-xl font-black text-white mb-1 tracking-tight">Guia de Build</h3>
                      <p className="text-sm text-white/50 font-medium">Recomendações e estratégias</p>
                    </div>
                    {builds.length > 1 && (
                      <div className="flex gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5">
                        {builds.map((build: any, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedBuildIndex(idx)}
                            className={\`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all \${selectedBuildIndex === idx ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'text-white/40 hover:bg-white/5 hover:text-white'}\`}
                          >
                            Build {idx + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {currentBuild && (
                    <div className="space-y-8">
                      {/* SubStats Recommendation */}
                      {currentBuild.subStats && (
                        <div className="bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20 rounded-2xl p-6 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg className="w-24 h-24 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          </div>
                          <h4 className="text-sm font-black text-green-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Sub-Atributos Recomendados
                          </h4>
                          <p className="text-sm text-green-100/80 leading-relaxed font-medium max-w-2xl">
                            {currentBuild.subStats}
                          </p>
                        </div>
                      )}

                      {/* Recommended Potentials */}
                      {currentBuild.potentials && currentBuild.potentials.length > 0 && (
                        <div>
                          <h4 className="text-sm font-black text-white/50 mb-4 uppercase tracking-[0.2em] border-b border-white/10 pb-2 flex items-center gap-2">
                            <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                            Potenciais Sugeridos
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {currentBuild.potentials.map((potSlot: any, idx: number) => {
                              const potIdInfo = potentialsData.find(p => p.id === potSlot.id);
                              if (!potIdInfo) return null;
                              return (
                                <div key={idx} className="bg-[#121212] border border-white/5 rounded-xl p-3 flex items-center gap-3 relative overflow-hidden group hover:border-orange-500/30 transition-colors shadow-md">
                                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                  <div className="w-10 h-10 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                    <img src={\`/assets/others/potentials/\${potSlot.id.replace(/_/g, '-')}.png\`} className="w-full h-full object-contain" />
                                  </div>
                                  <div>
                                    <span className="text-[9px] font-black uppercase text-white/30 block mb-0.5">Slot {potSlot.slot}</span>
                                    <p className="text-xs font-bold text-white/90 leading-tight">{potIdInfo.name}</p>
                                    <p className="text-[10px] font-bold text-orange-400 mt-0.5">{potSlot.mainStat}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* General Tips & Teambuilding */}
                      {currentBuild.tips && (
                        <div>
                          <div 
                            className="prose prose-invert max-w-none guide-content prose-p:text-sm prose-p:text-white/70 prose-p:leading-relaxed prose-li:text-sm prose-li:text-white/70"
                            dangerouslySetInnerHTML={{ 
                              __html: parseMarkdownTips(currentBuild.tips, character.position) 
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white/5 rounded-3xl border border-white/5">
                  <svg className="w-16 h-16 text-white/10 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Nenhum guia disponível</p>
                  <p className="text-xs text-white/30 mt-2 max-w-xs mx-auto">Em breve adicionaremos recomendações de build para este personagem.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'info' && (`;
  
  code = code.replace("{activeTab === 'info' && (", guideContent);

  fs.writeFileSync('src/components/PlayerDetailsModal.tsx', code);
  console.log('Script 2 completed successfully');
}

repair2();
