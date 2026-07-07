import { Save, AlertTriangle, Trash2 } from 'lucide-react';

export function SettingsPanel() {
  const handleClearLocalData = () => {
    if (confirm('Are you sure you want to clear all history and local data? This cannot be undone.')) {
      localStorage.removeItem('craftmit-history');
      alert('Local data cleared successfully.');
      window.location.reload();
    }
  };

  return (
    <div className="flex-1 bg-white border-4 border-black shadow-neo-lg rounded-xl p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-black uppercase tracking-tight mb-8 bg-[#00E5FF] border-4 border-black inline-block px-4 py-2 shadow-neo rotate-1">
          Settings
        </h2>
        
        <div className="space-y-8">
          {/* Preferences Section */}
          <div className="bg-[#F8F9FA] border-4 border-black p-6 shadow-neo-sm">
            <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
              <Save size={24} /> Preferences
            </h3>
            <div className="opacity-50 pointer-events-none space-y-4 mt-4">
              <div>
                <label className="block font-bold mb-2">Output Language</label>
                <select className="w-full border-4 border-black p-3 font-bold bg-white outline-none">
                  <option>English</option>
                  <option>Indonesian</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-2">AI Model</label>
                <select className="w-full border-4 border-black p-3 font-bold bg-white outline-none">
                  <option>Nvidia Nemotron (Free)</option>
                  <option>GPT-4o (Coming Soon)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Danger Zone Section */}
          <div className="bg-[#FFF0F0] border-4 border-black p-6 shadow-neo-sm">
            <h3 className="text-2xl font-black mb-4 flex items-center gap-2 text-[#FF4949]">
              <AlertTriangle size={24} /> Danger Zone
            </h3>
            <p className="text-gray-700 font-medium mb-4">
              Clear all your generated commit history stored in this browser.
            </p>
            <button 
              onClick={handleClearLocalData}
              className="flex items-center gap-2 bg-[#FF4949] text-white border-4 border-black font-black uppercase py-3 px-6 shadow-neo-sm hover:-translate-y-1 hover:shadow-neo active:translate-y-0 active:shadow-none transition-all"
            >
              <Trash2 size={20} /> Clear Local Data
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
