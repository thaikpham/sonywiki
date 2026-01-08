import React, { useState } from 'react';
import { QrCode, BrainCircuit, X } from 'lucide-react';
import { SONY_CATEGORIES } from '../constants/sonyData';

const ToolsTab = () => {
  const [activeQr, setActiveQr] = useState(null);

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

      {/* QR Code Hub */}
      <section className="space-y-4">
         <div className="flex items-center gap-2 px-2">
            <QrCode className="text-purple-600" size={20} />
            <h3 className="font-black text-lg italic uppercase tracking-tighter">QR Catalog</h3>
         </div>

         <div className="grid grid-cols-2 gap-4">
            {SONY_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveQr(cat)}
                className="bg-white p-4 rounded-[2rem] border border-neutral-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${cat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                   {cat.icon}
                </div>
                <span className="font-bold text-xs text-center">{cat.name}</span>
              </button>
            ))}
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

      {/* QR Modal Overlay */}
      {activeQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           {/* Backdrop - Added higher z-index to stay above content but below modal */}
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in z-40" onClick={() => setActiveQr(null)} />

           {/* Modal Content - Higher z-index than backdrop */}
           <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm relative animate-in zoom-in-95 z-50 pointer-events-auto">
              <button
                onClick={() => setActiveQr(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors"
              >
                <X size={16} />
              </button>

              <div className="text-center">
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${activeQr.color} mx-auto mb-4 shadow-lg`}>
                   {activeQr.icon}
                 </div>
                 <h3 className="font-black text-xl uppercase tracking-tighter mb-1">{activeQr.name}</h3>
                 <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-8">Scan for Docs</p>

                 <div className="bg-white p-4 rounded-3xl border-2 border-dashed border-neutral-200 inline-block">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(activeQr.notionUrl)}`}
                      alt="QR Code"
                      className="w-48 h-48 object-contain rounded-xl"
                    />
                 </div>

                 <p className="mt-6 text-neutral-400 text-[10px]">Chạm ra ngoài để đóng</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ToolsTab;
