import { Terminal, Command, GitBranch } from 'lucide-react';

export function HowToUse() {
  const steps = [
    {
      icon: <Terminal size={24} className="text-[#00E5FF]" />,
      title: '1. Get Your Git Diff',
      desc: 'In your terminal, navigate to your project and run `git diff` (or `git diff --staged` if you have already added files). Copy the entire output.'
    },
    {
      icon: <GitBranch size={24} className="text-[#FF90E8]" />,
      title: '2. Paste and Generate',
      desc: 'Paste the copied diff into the input area on the left. Click the "Generate" button on the right to let AI create a professional commit message.'
    },
    {
      icon: <Command size={24} className="text-[#FFE500]" />,
      title: '3. Use Command Palette',
      desc: 'Press Ctrl+K (or Cmd+K on Mac) anywhere in the app to quickly switch between generating Commits, PR descriptions, Code Reviews, or Explanations.'
    }
  ];

  return (
    <div className="flex-1 bg-white border-4 border-black shadow-neo-lg rounded-xl p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-black uppercase tracking-tight mb-8 bg-[#FF90E8] border-4 border-black inline-block px-4 py-2 shadow-neo -rotate-1">
          How To Use Craftmit
        </h2>
        
        <div className="space-y-6">
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-6 items-start bg-[#F8F9FA] border-4 border-black p-6 shadow-neo-sm hover:-translate-y-1 hover:shadow-neo transition-all">
              <div className="p-4 bg-white border-4 border-black shadow-neo-sm">
                {step.icon}
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2">{step.title}</h3>
                <p className="text-gray-700 text-lg font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
