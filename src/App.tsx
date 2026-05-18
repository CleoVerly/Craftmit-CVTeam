import { useState } from 'react';
import { generateCommitMessage } from './openrouter';

function App() {
  const [diffInput, setDiffInput] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState<'input' | 'output'>('input');

  const handleGenerateCommit = async () => {
    if (!diffInput.trim()) {
      setError('Please paste your git diff content first!');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setCommitMessage('');
    setActiveView('output'); 
    
    try {
      const generatedMessage = await generateCommitMessage(diffInput);
      setCommitMessage(generatedMessage);
    } catch (e: any) {
      setError(e.message || 'Failed to generate commit message. Please try again.');
      setActiveView('input');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleView = () => {
    setActiveView((prev) => (prev === 'input' ? 'output' : 'input'));
  };

  return (
    <div className="min-h-screen bg-[#FFF4E0] text-black flex flex-col items-center p-6 sm:p-10 font-sans selection:bg-[#FF90E8]">
      <div className="w-full max-w-3xl">
        
        {/* Header Section */}
        <div className="mb-10 text-center space-y-4">
          <h1 className="text-5xl font-black uppercase tracking-tight bg-[#FF90E8] border-4 border-black inline-block px-6 py-3 shadow-[8px_8px_0px_rgba(0,0,0,1)] -rotate-1">
            Diff to Commit
          </h1>
          <p className="text-xl font-bold text-gray-800 mt-4">
            Paste your <code className="bg-[#FFE500] px-2 py-1 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">git diff</code> below and get magic! ✨
          </p>
        </div>

        {/* Main Container */}
        <div className="flex flex-col bg-white border-4 border-black rounded-xl p-6 shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all">
          
          {/* Container Header with Swap Button */}
          <div className="flex justify-between items-center mb-4 border-b-4 border-black pb-4">
            <label className="text-2xl font-bold uppercase tracking-wider flex items-center gap-3">
              {activeView === 'input' ? (
                <>
                  <span className="bg-[#00E5FF] w-6 h-6 border-2 border-black inline-block rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)]"></span>
                  Input
                </>
              ) : (
                <>
                  <span className="bg-[#FFE500] w-6 h-6 border-2 border-black inline-block rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)]"></span>
                  Output Area
                </>
              )}
            </label>

            {/* Swap Button */}
            <button
              onClick={toggleView}
              title="Swap View"
              className="group bg-[#00FF66] p-2 border-4 border-black rounded-full shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-[#FF90E8] active:translate-y-0.5 active:shadow-[0px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="28" 
                height="28" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="black" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={`transition-transform duration-300 ${activeView === 'output' ? 'rotate-180' : ''}`}
              >
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              </svg>
            </button>
          </div>

          {/* Conditional Content (Input or Output) */}
          <div className="h-96 relative">
            {activeView === 'input' ? (
              <textarea
                value={diffInput}
                onChange={(e) => setDiffInput(e.target.value)}
                className="w-full h-full p-4 bg-[#F8F9FA] border-2 border-black rounded-lg focus:outline-none focus:bg-[#E0F7FA] font-mono text-sm resize-none transition-colors"
                placeholder="Paste the output of 'git diff' here..."
              />
            ) : (
              <div
                className="w-full h-full p-4 bg-[#F8F9FA] border-2 border-black rounded-lg font-mono text-sm whitespace-pre-wrap overflow-auto"
              >
                {isLoading ? (
                  <div className="flex h-full items-center justify-center font-bold text-2xl animate-pulse text-[#FF90E8] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    Generating Magic...
                  </div>
                ) : commitMessage ? (
                  commitMessage
                ) : (
                  <span className="text-gray-400 font-bold italic">Your commit message will appear here...</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-[#FF4949] text-white border-4 border-black p-4 font-bold text-lg shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center gap-3 animate-bounce">
             ⚠️ {error}
          </div>
        )}

        {/* Action Button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleGenerateCommit}
            disabled={isLoading}
            className="group relative bg-[#00E5FF] hover:bg-[#FFE500] disabled:bg-gray-300 text-black border-4 border-black font-black text-3xl uppercase py-4 px-16 shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all duration-150 active:translate-y-1.5 active:shadow-[0px_0px_0px_rgba(0,0,0,1)] disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[8px_8px_0px_rgba(0,0,0,1)] disabled:cursor-not-allowed"
          >
            {isLoading ? 'Wait...' : 'Generate!'}
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default App;