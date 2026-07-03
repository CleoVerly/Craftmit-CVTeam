import { useState } from 'react';
import { MAX_CHARS, askAI, type AIAction } from './openrouter';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { AIPanel } from './components/AIPanel';
import { CommandPalette } from './components/CommandPalette';
import { HistoryPanel, type HistoryItem } from './components/HistoryPanel';
import { ComingSoon } from './components/ComingSoon';
import { Menu } from 'lucide-react';

function App() {
  const [diffInput, setDiffInput] = useState('');
  const [results, setResults] = useState<Record<AIAction, string>>({
    commit: '',
    review: '',
    explain: '',
    pr: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeAction, setActiveAction] = useState<AIAction>('commit');
  const [activeTab, setActiveTab] = useState('generate');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // History State
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('craftmit-history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const isOverLimit = diffInput.length > MAX_CHARS;

  const handleGenerate = async () => {
    if (!diffInput.trim()) {
      setError('Please paste your git diff content first!');
      return;
    }
    if (isOverLimit) {
      setError(`Your diff exceeds the maximum limit of ${MAX_CHARS.toLocaleString()} characters.`);
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const generatedMessage = await askAI(diffInput, activeAction);
      
      setResults(prev => ({ ...prev, [activeAction]: generatedMessage }));
      
      // Save to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        action: activeAction,
        diffInput,
        result: generatedMessage
      };
      
      setHistory(prev => {
        const next = [newItem, ...prev].slice(0, 50); // Keep last 50
        try {
          localStorage.setItem('craftmit-history', JSON.stringify(next));
        } catch {
          // Ignore quota exceeded errors silently for now
        }
        return next;
      });
      
    } catch (e: any) {
      setError(e.message || 'Failed to generate response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewHistory = (item: HistoryItem) => {
    setDiffInput(item.diffInput);
    setActiveAction(item.action);
    setResults(prev => ({ ...prev, [item.action]: item.result }));
    setActiveTab('generate');
  };

  const handleRemoveHistoryItem = (id: string) => {
    setHistory(prev => {
      const next = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem('craftmit-history', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('craftmit-history');
    } catch {}
  };

  return (
    <div className="min-h-screen bg-grid bg-[#FFF4E0] text-black font-sans selection:bg-[#FF90E8] flex overflow-hidden">
      {/* Background Noise Layer */}
      <div className="absolute inset-0 bg-noise pointer-events-none z-0"></div>
      
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden z-10">
        
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b-4 border-black p-4 flex justify-between items-center z-20">
          <h1 className="text-xl font-black uppercase tracking-tight bg-[#FF90E8] border-2 border-black inline-block px-2 py-1 shadow-neo-sm -rotate-2">
            Craftmit
          </h1>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 border-2 border-black bg-[#FFE500] shadow-neo-sm active:translate-y-0.5 active:shadow-none"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Top Navbar / Header area */}
        <div className="hidden md:flex justify-between items-center p-6 pb-2 z-20">
          <h2 className="text-2xl font-black uppercase tracking-widest bg-white border-4 border-black px-4 py-2 shadow-neo">
            {activeTab === 'history' ? 'History' : activeTab === 'tools' ? 'AI Tools' : 'Workspace'}
          </h2>
          <button 
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-3 bg-white border-4 border-black px-4 py-2 font-bold shadow-neo hover:bg-[#F8F9FA] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all"
          >
            <span className="text-gray-500 text-sm border-2 border-black px-2 py-0.5 rounded bg-gray-100">Ctrl+K</span>
            Command Palette
          </button>
        </div>

        {/* Workspace Content */}
        <div className="flex-1 flex flex-col md:flex-row gap-6 p-6 overflow-auto">
          {activeTab === 'tools' ? (
            <ComingSoon onBack={() => setActiveTab('generate')} />
          ) : activeTab === 'history' ? (
            <HistoryPanel 
              history={history} 
              onView={handleViewHistory} 
              onRemoveItem={handleRemoveHistoryItem}
              onClearAll={handleClearHistory}
            />
          ) : (
            <>
              {/* Left Column: Editor */}
              <Editor 
                diffInput={diffInput} 
                setDiffInput={setDiffInput} 
                isOverLimit={isOverLimit} 
              />
              
              {/* Right Column: AI Panel */}
              <AIPanel 
                isLoading={isLoading}
                error={error}
                result={results[activeAction]}
                action={activeAction}
                setAction={setActiveAction}
                onGenerate={handleGenerate}
                isOverLimit={isOverLimit}
              />
            </>
          )}
        </div>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        setIsOpen={setIsCommandPaletteOpen}
        onActionSelect={setActiveAction}
        onGenerate={handleGenerate}
      />
    </div>
  );
}

export default App;