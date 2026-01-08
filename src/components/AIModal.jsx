import React from 'react';
import { Sparkles, X } from 'lucide-react';
import AIGenerator from './AIGenerator';

const AIModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center pointer-events-none">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={onClose} />

        {/* Modal Content */}
        <div className="w-full sm:max-w-md bg-white/90 backdrop-blur-xl sm:rounded-[2.5rem] rounded-t-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] pointer-events-auto animate-in slide-in-from-bottom-10 duration-500">

          <header className="p-6 flex justify-between items-center border-b border-neutral-100 bg-white/50">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-lg text-white shadow-lg shadow-purple-500/20">
                <Sparkles size={18} />
              </div>
              <div>
                <span className="font-black uppercase tracking-tighter text-sm block">Sony AI Assistant</span>
                <span className="text-[10px] text-neutral-500 font-bold tracking-[0.2em] uppercase">Sales Generator</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors"><X size={20} /></button>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AIGenerator />
          </div>
        </div>
    </div>
  );
};
export default AIModal;
