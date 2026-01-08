import React from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';
import AIGenerator from './AIGenerator';

const ToolsTab = () => {
  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] p-8 text-center shadow-sm border border-neutral-100 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Công cụ hỗ trợ</h2>
          <p className="text-neutral-400 font-bold text-[10px] uppercase tracking-[0.2em]">Sales Tools</p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full pointer-events-none" />
      </div>

      {/* AI Assistant Section */}
      <section className="space-y-4">
         <div className="flex items-center gap-2 px-2">
            <Sparkles className="text-purple-600" size={20} />
            <h3 className="font-black text-lg italic uppercase tracking-tighter">AI Assistant</h3>
         </div>

         <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm">
             <AIGenerator />
         </div>
      </section>

      {/* Trivia Placeholder */}
      <section className="space-y-4">
         <div className="flex items-center gap-2 px-2">
            <BrainCircuit className="text-blue-600" size={20} />
            <h3 className="font-black text-lg italic uppercase tracking-tighter">Daily Quiz</h3>
         </div>

         <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-lg">
            <div className="relative z-10">
               <h4 className="font-black text-xl mb-2">Thử thách kiến thức</h4>
               <p className="text-blue-100 text-xs mb-6 max-w-[200px]">Trả lời 5 câu hỏi về dòng Bravia 9 mới nhất để nhận huy hiệu.</p>
               <button className="bg-white text-blue-700 font-black px-6 py-3 rounded-full text-[10px] tracking-widest uppercase hover:bg-blue-50 transition-colors">
                  Bắt đầu ngay
               </button>
            </div>
            <BrainCircuit size={100} className="absolute -right-4 -bottom-4 text-white/10 rotate-12" />
         </div>
      </section>
    </div>
  );
};

export default ToolsTab;
