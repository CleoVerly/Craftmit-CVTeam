import { useEffect, useState } from 'react';
import { Search, Code2, MessageSquare, FileCode2 } from 'lucide-react';
import type { AIAction } from '../openrouter';

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onActionSelect: (action: AIAction) => void;
  onGenerate: () => void;
}

export function CommandPalette({ isOpen, setIsOpen, onActionSelect, onGenerate }: CommandPaletteProps) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const commands = [
    { id: 'commit', label: 'Generate Commit Message', icon: <Code2 size={18} /> },
    { id: 'review', label: 'Review Code (Bugs & Best Practices)', icon: <Search size={18} /> },
    { id: 'explain', label: 'Explain this Diff', icon: <MessageSquare size={18} /> },
    { id: 'pr', label: 'Generate PR Description', icon: <FileCode2 size={18} /> },
  ];

  const filteredCommands = commands.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (id: string) => {
    onActionSelect(id as AIAction);
    onGenerate();
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/40 backdrop-blur-sm p-4">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
      
      <div className="relative w-full max-w-2xl bg-white border-4 border-black shadow-neo-lg rounded-xl overflow-hidden flex flex-col">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b-4 border-black bg-[#E0F7FA]">
          <Search className="text-black" size={24} />
          <input
            autoFocus
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-xl font-bold placeholder-gray-500 focus:outline-none"
          />
          <div className="text-xs font-bold border-2 border-black bg-white px-2 py-1 shadow-neo-sm">
            ESC to close
          </div>
        </div>

        {/* Command List */}
        <div className="max-h-[400px] overflow-y-auto p-4 space-y-2 bg-[#F8F9FA]">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => handleSelect(cmd.id)}
                className="w-full flex items-center gap-4 px-4 py-4 bg-white border-4 border-black font-bold text-lg hover:bg-[#FFE500] hover:-translate-y-1 hover:shadow-neo active:translate-y-0 active:shadow-none transition-all text-left"
              >
                {cmd.icon}
                {cmd.label}
              </button>
            ))
          ) : (
            <div className="text-center py-10 font-bold text-gray-500 italic">
              No commands found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
