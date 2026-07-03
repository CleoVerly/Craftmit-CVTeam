import { MAX_CHARS } from '../openrouter';

interface EditorProps {
  diffInput: string;
  setDiffInput: (val: string) => void;
  isOverLimit: boolean;
}

export function Editor({ diffInput, setDiffInput, isOverLimit }: EditorProps) {
  return (
    <div className="flex-1 bg-white border-4 border-black shadow-neo-lg rounded-xl overflow-hidden flex flex-col relative transition-all">
      {/* Editor Header */}
      <div className="bg-[#E0F7FA] border-b-4 border-black px-4 py-3 flex items-center gap-3">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF4949] border-2 border-black"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFE500] border-2 border-black"></div>
          <div className="w-3 h-3 rounded-full bg-[#00FF66] border-2 border-black"></div>
        </div>
        <div className="text-sm font-bold bg-white border-2 border-black px-3 py-1 -skew-x-6 shadow-neo-sm">
          git_diff.txt
        </div>
      </div>
      
      {/* Editor Body */}
      <div className="flex-1 relative bg-[#F8F9FA]">
        {/* Line numbers mock */}
        <div className="absolute left-0 top-0 bottom-0 w-12 border-r-2 border-black bg-white flex flex-col items-center py-4 text-gray-400 font-mono text-sm select-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="mb-1">{i + 1}</div>
          ))}
        </div>

        <textarea
          value={diffInput}
          onChange={(e) => setDiffInput(e.target.value)}
          className={`absolute inset-0 w-full h-full pl-16 p-4 pb-12 bg-transparent focus:outline-none focus:bg-[#E0F7FA]/30 font-mono text-sm resize-none transition-colors ${
            isOverLimit ? '!bg-[#FFF0F0] text-[#FF4949]' : ''
          }`}
          placeholder="Paste the output of 'git diff' here..."
          spellCheck={false}
        />
        
        {/* Character Count */}
        <div className={`absolute bottom-3 right-4 font-bold text-sm bg-white border-2 border-black px-2 py-1 shadow-neo-sm transition-colors ${
          isOverLimit ? 'text-[#FF4949] border-[#FF4949] animate-pulse' : 'text-gray-800'
        }`}>
          {diffInput.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
