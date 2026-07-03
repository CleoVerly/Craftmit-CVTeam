import { Construction, Sparkles, ArrowRight } from 'lucide-react';

interface ComingSoonProps {
  onBack: () => void;
}

export function ComingSoon({ onBack }: ComingSoonProps) {
  return (
    <div className="flex-1 bg-white border-4 border-black shadow-neo-lg rounded-xl flex flex-col items-center justify-center p-8 z-10 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 text-[#FF90E8] opacity-50 animate-pulse">
        <Sparkles size={48} />
      </div>
      <div className="absolute bottom-10 right-10 text-[#00E5FF] opacity-50 animate-bounce">
        <Sparkles size={48} />
      </div>

      <div className="bg-[#FFE500] border-4 border-black p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] -rotate-2 mb-8 transition-transform hover:rotate-0">
        <Construction size={64} className="text-black mx-auto mb-4" />
        <h2 className="text-4xl font-black uppercase tracking-widest text-center text-black">
          Under Construction
        </h2>
      </div>

      <p className="text-xl font-bold text-gray-700 text-center max-w-md mb-8 leading-relaxed">
        We're currently forging new <span className="bg-[#FF90E8] text-black px-2 border-2 border-black">AI Tools</span> in our lab. 
        Something magical is coming very soon.
      </p>

      <button 
        onClick={onBack}
        className="flex items-center gap-2 bg-[#00E5FF] hover:bg-[#00FF66] border-4 border-black px-6 py-3 font-black text-lg shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
      >
        Back to Workspace <ArrowRight size={20} />
      </button>
    </div>
  );
}
