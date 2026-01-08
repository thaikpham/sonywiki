import React from 'react';
import { BookOpen, User, Briefcase } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-neutral-100 flex justify-center gap-12 items-center py-4 px-2 z-40">
    {[
      { id: 'home', label: 'Sản phẩm', icon: <BookOpen size={22} /> },
      { id: 'tools', label: 'Công cụ', icon: <Briefcase size={22} /> },
      { id: 'profile', label: 'Của tôi', icon: <User size={22} /> },
    ].map((item) => (
      <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-1 transition-all w-16 ${activeTab === item.id ? 'text-black' : 'text-neutral-400'}`}>
        {item.icon}
        <span className={`text-[9px] font-black uppercase tracking-widest ${activeTab === item.id ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>{item.label}</span>
      </button>
    ))}
  </nav>
);

export default Navigation;
