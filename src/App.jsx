import React, { useState, useEffect } from 'react';
import {
  ChevronRight, Sparkles, Plus, Youtube, FileText, ExternalLink
} from 'lucide-react';
import {
  collection, doc, setDoc, onSnapshot, addDoc, serverTimestamp
} from 'firebase/firestore';
import {
  signInAnonymously, onAuthStateChanged
} from 'firebase/auth';

import { auth, db, appId } from './services/firebase';
import { SONY_CATEGORIES } from './constants/sonyData';

import AIModal from './components/AIModal';
import ContributionModal from './components/ContributionModal';

const App = () => {
  const [user, setUser] = useState(null);

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [showAddContribution, setShowAddContribution] = useState(false);
  const [showLogo, setShowLogo] = useState(true);

  // Auth Initialization
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Auth failed", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Firestore Listeners
  useEffect(() => {
    if (!user) return;

    // User Profile Listener (kept for data consistency if needed, but UI doesn't use it)
    const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
    const unsubUser = onSnapshot(userDocRef, (snap) => {
      if (!snap.exists()) {
        const data = {
          displayName: `User #${user.uid.slice(0, 4)}`,
          role: 'Promoter'
        };
        setDoc(userDocRef, data);
      }
    });

    return () => { unsubUser(); };
  }, [user]);

  // Scroll Listener for Logo
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowLogo(false);
      } else {
        setShowLogo(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddContribution = async (e) => {
    if (!user) return;
    const formData = new FormData(e.target);
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'contributions'), {
      title: formData.get('title'),
      url: formData.get('url'),
      type: formData.get('type'),
      timestamp: serverTimestamp()
    });
    setShowAddContribution(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-24 font-sans antialiased">
      {/* Minimal Header with Sony Logo */}
      <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center py-4 transition-transform duration-300 ${showLogo ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="bg-black text-white px-4 py-2 rounded shadow-lg font-black tracking-tighter italic text-lg">
          SONY
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-4 md:p-8 pt-20">
          <div className="space-y-8 animate-in fade-in duration-500">

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {SONY_CATEGORIES.map(cat => (
                <div
                  key={cat.id}
                  className={`relative p-6 rounded-[2rem] border overflow-hidden transition-all group hover:scale-[1.01] ${
                    cat.backgroundImage ? 'border-transparent text-white shadow-xl' : 'bg-white border-neutral-100 shadow-sm hover:shadow-lg'
                  }`}
                  style={cat.backgroundImage ? {
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(/${cat.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  } : {}}
                >
                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-12 shadow-sm ${
                      cat.backgroundImage ? 'bg-white/20 backdrop-blur-md text-white' : `${cat.color} text-white`
                    }`}>
                      {cat.icon}
                    </div>
                    
                    <h3 className="font-black text-2xl uppercase tracking-tighter mb-1">{cat.name}</h3>
                    <p className={`text-[10px] font-bold tracking-widest uppercase mb-6 ${
                      cat.backgroundImage ? 'text-white/80' : 'text-neutral-400'
                    }`}>Tài liệu & Thông số</p>
                  </div>

                  <div className={`relative z-10 pt-4 border-t ${
                    cat.backgroundImage ? 'border-white/20' : 'border-neutral-50'
                  }`}>
                    <a href={cat.notionUrl} target="_blank" rel="noopener noreferrer" className={`w-full py-3 rounded-full flex items-center justify-center gap-2 transition-all ${
                      cat.backgroundImage ? 'bg-white text-black hover:bg-neutral-100' : 'bg-neutral-900 text-white hover:bg-black'
                    }`}>
                      <span className="text-[10px] font-black uppercase tracking-widest">Truy cập Wiki</span>
                      <ChevronRight size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Assistant Banner */}
            <div className="bg-gradient-to-br from-zinc-900 to-black rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl group cursor-pointer" onClick={() => setIsAiOpen(true)}>
               <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm">
                    <Sparkles size={20} className="text-blue-300" />
                  </div>
                  <h3 className="text-xl font-bold">Trợ lý ảo AI</h3>
                </div>
                <p className="text-zinc-400 text-sm mb-6 max-w-md leading-relaxed">
                  Cần tìm thông số kỹ thuật nhanh hoặc soạn kịch bản tư vấn? Hỏi ngay trợ lý AI của Sony.
                </p>
                <button className="bg-white text-black font-black px-6 py-3 rounded-full text-[10px] tracking-widest flex items-center gap-2 uppercase hover:bg-neutral-200 transition-colors">
                  Bắt đầu chat
                </button>
               </div>
               {/* Decorative Background */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none" />
               <Sparkles size={120} className="absolute -right-6 -bottom-6 text-white/5 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
            </div>
          </div>
      </main>

      <AIModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      <ContributionModal
        isOpen={showAddContribution}
        onClose={() => setShowAddContribution(false)}
        onSubmit={handleAddContribution}
      />

    </div>
  );
};

export default App;
