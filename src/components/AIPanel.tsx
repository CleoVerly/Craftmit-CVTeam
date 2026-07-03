import { Check, Copy, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { AIAction } from '../openrouter';

interface AIPanelProps {
  isLoading: boolean;
  error: string;
  result: string;
  action: AIAction;
  setAction: (action: AIAction) => void;
  onGenerate: () => void;
  isOverLimit: boolean;
}

export function AIPanel({ isLoading, error, result, action, setAction, onGenerate, isOverLimit }: AIPanelProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const tabs: { id: AIAction; label: string }[] = [
    { id: 'commit', label: 'Commit' },
    { id: 'review', label: 'Review' },
    { id: 'explain', label: 'Explain' },
    { id: 'pr', label: 'PR' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white border-4 border-black shadow-neo-lg rounded-xl overflow-hidden transition-all h-[800px] md:h-auto">
      
      {/* AI Panel Header / Tabs */}
      <div className="bg-[#FF90E8] border-b-4 border-black p-4 flex gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setAction(t.id)}
            className={`px-4 py-2 font-black uppercase text-sm border-2 border-black whitespace-nowrap transition-all ${
              action === t.id 
                ? 'bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' 
                : 'bg-transparent hover:bg-white/50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Result Area */}
      <div className="flex-1 relative bg-[#F8F9FA] p-6 overflow-y-auto">
        {error && (
          <div className="mb-4 bg-[#FF4949] text-white border-4 border-black p-4 font-bold shadow-neo-sm animate-bounce">
            ⚠️ {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col h-full items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#FF90E8] border-t-transparent rounded-full animate-spin"></div>
            <div className="font-black text-2xl animate-pulse text-gray-800 tracking-tight">
              AI Thinking...
            </div>
            <div className="text-gray-500 font-medium italic space-y-1 text-center">
              <div>analyzing diff</div>
              <div>understanding context</div>
              <div>generating response</div>
            </div>
          </div>
        ) : result ? (
          <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed font-sans prose-headings:font-black prose-a:text-[#00E5FF] prose-a:font-bold [&_:not(pre)>code]:font-bold [&_:not(pre)>code]:bg-gray-200 [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:rounded-sm prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-table:border-collapse prose-th:border-2 prose-th:border-black prose-th:bg-[#FFE500] prose-td:border-2 prose-td:border-black">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {result}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400 font-bold italic text-center px-4">
            AI Suggestions will appear here...
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="bg-white border-t-4 border-black p-4 flex justify-between items-center gap-4">
        <div className="flex gap-2">
          {result && !isLoading && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-[#00FF66] border-2 border-black px-4 py-2 font-bold shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              {isCopied ? <Check size={18} /> : <Copy size={18} />}
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          )}
          {result && !isLoading && (
            <button
              onClick={onGenerate}
              className="flex items-center gap-2 bg-white border-2 border-black px-4 py-2 font-bold shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <RefreshCcw size={18} />
              Retry
            </button>
          )}
        </div>

        <button
          onClick={onGenerate}
          disabled={isLoading || isOverLimit}
          className="flex-1 max-w-[200px] flex items-center justify-center gap-2 bg-[#00E5FF] hover:bg-[#FFE500] disabled:bg-gray-300 text-black border-4 border-black font-black uppercase py-3 px-6 shadow-neo-sm transition-all hover:-translate-y-1 hover:shadow-neo active:translate-y-0 active:shadow-none disabled:active:translate-y-0 disabled:active:shadow-neo-sm disabled:cursor-not-allowed"
        >
          {isLoading ? 'Wait...' : 'Generate!'}
        </button>
      </div>
    </div>
  );
}
