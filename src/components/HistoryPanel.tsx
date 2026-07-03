import { useState } from 'react';
import type { AIAction } from '../openrouter';
import { History, Eye, Clock, Trash2, AlertTriangle, X } from 'lucide-react';

export interface HistoryItem {
  id: string;
  timestamp: number;
  action: AIAction;
  diffInput: string;
  result: string;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  onView: (item: HistoryItem) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

export function HistoryPanel({ history, onView, onRemoveItem, onClearAll }: HistoryPanelProps) {
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<string | 'all' | null>(null);

  const confirmDelete = () => {
    if (deleteConfirmTarget === 'all') {
      onClearAll();
    } else if (deleteConfirmTarget) {
      onRemoveItem(deleteConfirmTarget);
    }
    setDeleteConfirmTarget(null);
  };

  if (history.length === 0) {
    return (
      <div className="flex-1 bg-white border-4 border-black shadow-neo-lg rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 z-10 relative">
        <History size={48} className="text-gray-300 mb-4" />
        <h3 className="text-2xl font-black uppercase tracking-tight text-gray-400">No History Yet</h3>
        <p className="text-gray-500 mt-2 font-medium">Your generated AI suggestions will appear here.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white border-4 border-black shadow-neo-lg rounded-xl flex flex-col z-10 relative overflow-hidden">
      <div className="bg-[#FFE500] border-b-4 border-black px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History size={24} className="text-black" />
          <h2 className="text-xl font-black uppercase tracking-widest">Local History</h2>
          <span className="text-xs font-bold border-2 border-black bg-white px-2 py-1 shadow-neo-sm hidden sm:inline-block">
            Saved in Browser
          </span>
        </div>
        <button
          onClick={() => setDeleteConfirmTarget('all')}
          className="flex items-center gap-2 bg-[#FF4949] text-white border-2 border-black px-3 py-1.5 font-bold text-sm shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <Trash2 size={16} /> <span className="hidden sm:inline">Clear All</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8F9FA]">
        {history.map((item) => (
          <div key={item.id} className="bg-white border-4 border-black p-4 shadow-neo-sm hover:-translate-y-1 hover:shadow-neo transition-all flex flex-col gap-3">
            <div className="flex justify-between items-center border-b-2 border-dashed border-gray-300 pb-2">
              <div className="flex items-center gap-2">
                <span className="bg-[#FF90E8] text-black text-xs font-black px-2 py-1 uppercase border-2 border-black">
                  {item.action}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-gray-500">
                  <Clock size={12} />
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setDeleteConfirmTarget(item.id)}
                  className="flex items-center justify-center bg-[#FF4949] text-white hover:bg-[#FF0000] border-2 border-black w-8 h-8 font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
                <button 
                  onClick={() => onView(item)}
                  className="flex items-center gap-2 bg-[#00E5FF] hover:bg-[#00FF66] border-2 border-black px-3 py-1 font-bold text-sm shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                >
                  <Eye size={16} /> View
                </button>
              </div>
            </div>
            <div className="font-mono text-sm text-gray-600 line-clamp-2">
              {item.result}
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {deleteConfirmTarget && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="bg-white border-4 border-black p-6 shadow-neo-lg max-w-sm w-full mx-4 flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b-4 border-black pb-4">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <AlertTriangle className="text-[#FF4949]" size={24} />
                Delete History
              </h3>
              <button onClick={() => setDeleteConfirmTarget(null)} className="hover:bg-gray-200 p-1 rounded-sm transition-colors">
                <X size={20} />
              </button>
            </div>
            <p className="font-medium text-gray-700">
              {deleteConfirmTarget === 'all' 
                ? 'Are you sure you want to clear all your history? This action cannot be undone.' 
                : 'Are you sure you want to delete this item?'}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setDeleteConfirmTarget(null)}
                className="bg-white border-2 border-black px-4 py-2 font-bold shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="bg-[#FF4949] text-white border-2 border-black px-4 py-2 font-bold shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
