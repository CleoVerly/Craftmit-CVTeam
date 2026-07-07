import { Code2, History, MessageSquare, Settings, HelpCircle } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'generate', label: 'Generate', icon: <Code2 size={20} /> },
    { id: 'history', label: 'History', icon: <History size={20} /> },
    { id: 'tools', label: 'AI Tools', icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="w-64 bg-white border-r-4 border-black h-screen p-6 flex flex-col justify-between shrink-0 hidden md:flex z-10">
      <div>
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black uppercase tracking-tight bg-[#FF90E8] border-4 border-black inline-block px-4 py-2 shadow-neo -rotate-2">
            Craftmit
          </h1>
        </div>
        <nav className="space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 border-4 border-black font-bold text-lg transition-all ${
                activeTab === item.id
                  ? 'bg-[#FFE500] shadow-neo'
                  : 'bg-white hover:bg-[#F8F9FA] hover:-translate-y-1 hover:shadow-neo active:translate-y-0 active:shadow-none'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="space-y-3">
        <button 
          onClick={() => setActiveTab('howto')}
          className={`w-full flex items-center gap-3 px-4 py-3 border-4 border-black font-bold text-lg hover:-translate-y-1 hover:shadow-neo active:translate-y-0 active:shadow-none transition-all ${
            activeTab === 'howto' ? 'bg-[#FFE500] shadow-neo' : 'bg-[#FF90E8]'
          }`}
        >
          <HelpCircle size={20} />
          How to Use
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 border-4 border-black font-bold text-lg hover:-translate-y-1 hover:shadow-neo active:translate-y-0 active:shadow-none transition-all ${
            activeTab === 'settings' ? 'bg-[#FFE500] shadow-neo' : 'bg-[#00E5FF]'
          }`}
        >
          <Settings size={20} />
          Settings
        </button>
      </div>
    </div>
  );
}
