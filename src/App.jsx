import React, { useState, useEffect } from 'react';
import {
  Search, ChevronRight, Sparkles, Plus, Youtube, FileText, ExternalLink
} from 'lucide-react';
import {
  collection, doc, setDoc, onSnapshot, addDoc, serverTimestamp
} from 'firebase/firestore';
import {
  signInAnonymously, onAuthStateChanged
} from 'firebase/auth';

import { auth, db, appId } from './services/firebase';
import { SONY_CATEGORIES } from './constants/sonyData';

import Header from './components/Header';
import Navigation from './components/Navigation';
import AIModal from './components/AIModal';
import ContributionModal from './components/ContributionModal';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [contributions, setContributions] = useState([]);

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [showAddContribution, setShowAddContribution] = useState(false);

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

    // User Profile Listener
    const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
    const unsubUser = onSnapshot(userDocRef, (snap) => {
      if (snap.exists()) {
        setUserData(snap.data());
      } else {
        const data = {
          displayName: `User #${user.uid.slice(0, 4)}`,
          role: 'Promoter'
        };
        setDoc(userDocRef, data);
        setUserData(data);
      }
    });

    // Contributions/Saved Docs Listener
    const contribRef = collection(db, 'artifacts', appId, 'users', user.uid, 'contributions');
    const unsubContrib = onSnapshot(contribRef, (snap) => {
      setContributions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubUser(); unsubContrib(); };
  }, [user]);

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
      <Header userData={userData} />

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        {activeTab === 'home' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Search Section */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-black transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Tra cứu sản phẩm (VD: Bravia 9, Alpha 7C II...)" 
                className="w-full bg-white border border-transparent focus:border-neutral-200 rounded-2xl py-4 pl-12 pr-4 shadow-sm hover:shadow-md focus:shadow-lg focus:ring-0 transition-all outline-none text-base" 
              />
            </div>

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
        )}

        {activeTab === 'profile' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 text-center shadow-sm border border-neutral-100">
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 bg-gradient-to-tr from-neutral-800 to-black rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg">
                  {userData?.displayName?.charAt(0)}
                </div>
              </div>
              <h2 className="text-xl font-black">{userData?.displayName}</h2>
              <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.2em]">{userData?.role || 'Sony Member'}</p>
            </div>

            <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-neutral-100 min-h-[300px]">
              <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="font-black text-lg italic uppercase tracking-tighter">Tài liệu đã lưu</h3>
                <button 
                  onClick={() => setShowAddContribution(true)} 
                  className="w-10 h-10 bg-neutral-50 hover:bg-neutral-100 text-black border border-neutral-200 rounded-full flex items-center justify-center transition-colors"
                  title="Thêm tài liệu"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="space-y-3">
                {contributions.length > 0 ? contributions.map(item => (
                  <div key={item.id} className="group flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-transparent hover:border-neutral-200 hover:bg-white hover:shadow-sm transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        item.type === 'video' ? 'bg-red-50 text-red-600 group-hover:bg-red-100' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                      }`}>
                        {item.type === 'video' ? <Youtube size={20} /> : <FileText size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-sm leading-tight text-neutral-800">{item.title}</p>
                        <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest mt-1">{item.type}</p>
                      </div>
                    </div>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 text-neutral-300 hover:text-black transition-colors">
                      <ExternalLink size={18} />
                    </a>
                  </div>
                )) : (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-3 text-neutral-300">
                      <FileText size={24} />
                    </div>
                    <p className="text-neutral-400 text-sm">Chưa lưu tài liệu nào.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

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
