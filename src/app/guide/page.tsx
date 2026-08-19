import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';

export default async function GuidePage() {
  const guidePath = path.join(process.cwd(), 'docs', 'POSITIONS_TATIC.md');
  const content = fs.readFileSync(guidePath, 'utf-8');

  return (
    <div className="p-8 max-w-4xl mx-auto overflow-y-auto h-full">
      <div className="bg-[#0f0f0f] border border-gray-800 rounded-2xl p-8 shadow-2xl">
        <h1 
          className="text-3xl font-black mb-8 pb-4 border-b border-white/10"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          <span className="text-white">Guia</span> <span className="text-orange-500">Tático</span>
        </h1>
        
        <div className="max-w-none text-white/80 leading-relaxed font-medium">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-3xl font-black mt-10 mb-6 text-white border-b border-white/10 pb-2" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl font-black mt-8 mb-4 text-blue-400" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-6 mb-3 text-purple-400" {...props} />,
              p: ({node, ...props}) => <p className="mb-4 text-gray-300 leading-relaxed" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-300" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-300" {...props} />,
              li: ({node, ...props}) => <li className="" {...props} />,
              strong: ({node, ...props}) => <strong className="font-black text-white" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-orange-500 pl-4 py-1 my-4 bg-orange-500/10 italic text-white/70" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
