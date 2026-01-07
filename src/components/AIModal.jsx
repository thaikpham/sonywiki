import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { generateSonyContent } from '../services/gemini';

const AIModal = ({ isOpen, onClose }) => {
  const [aiInput, setAiInput] = useState('');
  const [aiOutput, setAiOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (type) => {
     if (!aiInput) return;
     setIsLoading(true);
     const result = await generateSonyContent(aiInput, type);
     setAiOutput(result);
     setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
        <div className="fixed inset-0 z-[70] flex flex-col bg-white animate-in slide-in-from-right">
          <header className="p-4 flex justify-between items-center border-b">
            <div className="flex items-center gap-2"><Sparkles className="text-purple-600" /><span className="font-bold uppercase tracking-widest text-xs">SONY AI Assistant</span></div>
            <button onClick={onClose} className="p-2"><X /></button>
          </header>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <textarea value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="Nhập thông số..." className="w-full h-32 p-4 bg-neutral-50 border-none rounded-2xl text-sm outline-none" />
            <button onClick={() => handleGenerate('script')} disabled={isLoading} className="w-full bg-black text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest disabled:opacity-50">Soạn Sales Talk</button>
            {aiOutput && <div className="bg-neutral-900 text-white p-6 rounded-3xl text-sm leading-relaxed whitespace-pre-line">{aiOutput}</div>}
          </div>
        </div>
  );
};
export default AIModal;
