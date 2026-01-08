import React, { useState } from 'react';
import { Sparkles, X, Copy, Check } from 'lucide-react';
import { generateSonyContent } from '../services/gemini';

const AIModal = ({ isOpen, onClose }) => {
  const [product, setProduct] = useState('');
  const [persona, setPersona] = useState('Family');
  const [tone, setTone] = useState('Friendly');
  const [aiOutput, setAiOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
     if (!product) return;
     setIsLoading(true);
     const result = await generateSonyContent({ product, persona, tone }, 'script');
     setAiOutput(result);
     setIsLoading(false);
  };

  const handleCopy = () => {
    if (aiOutput) {
      navigator.clipboard.writeText(aiOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 pl-2">Sản phẩm</label>
                <input
                  type="text"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="VD: Bravia 9, Alpha 7 IV..."
                  className="w-full bg-white border border-neutral-200 focus:border-purple-500 rounded-2xl py-4 px-4 shadow-sm outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 pl-2">Khách hàng</label>
                  <select
                    value={persona}
                    onChange={(e) => setPersona(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-2xl py-4 px-4 shadow-sm outline-none appearance-none"
                  >
                    <option value="Gamer">Gamer</option>
                    <option value="Family">Family</option>
                    <option value="Vlogger">Vlogger</option>
                    <option value="Audiophile">Audiophile</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 pl-2">Phong cách</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-2xl py-4 px-4 shadow-sm outline-none appearance-none"
                  >
                    <option value="Friendly">Friendly</option>
                    <option value="Professional">Professional</option>
                    <option value="Technical">Technical</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || !product}
              className="w-full bg-gradient-to-r from-zinc-900 to-black hover:from-black hover:to-zinc-900 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest disabled:opacity-50 shadow-xl shadow-neutral-900/20 transition-all active:scale-[0.98]"
            >
              {isLoading ? 'Đang soạn thảo...' : 'Tạo kịch bản tư vấn'}
            </button>

            {aiOutput && (
              <div className="relative group animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-neutral-50 border border-neutral-100 p-6 rounded-[2rem] text-sm leading-relaxed whitespace-pre-line text-neutral-700">
                  {aiOutput}
                </div>
                <button
                  onClick={handleCopy}
                  className="absolute top-4 right-4 p-2 bg-white shadow-sm border border-neutral-100 rounded-xl hover:bg-neutral-50 transition-colors"
                  title="Copy to Clipboard"
                >
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-neutral-400" />}
                </button>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};
export default AIModal;
