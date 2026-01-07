import React, { useState, useEffect } from 'react';
import {
  Search, Link as LinkIcon, ChevronRight, Sparkles, Award, Plus, Youtube, FileText, ExternalLink
} from 'lucide-react';
import {
  collection, doc, setDoc, onSnapshot, addDoc, serverTimestamp
} from 'firebase/firestore';
import {
  signInAnonymously, onAuthStateChanged
} from 'firebase/auth';

import { auth, db, appId } from './services/firebase';
import { SONY_CATEGORIES, BADGES } from './constants/sonyData';

import Header from './components/Header';
import Navigation from './components/Navigation';
import Leaderboard from './components/Leaderboard';
import AIModal from './components/AIModal';
import ContributionModal from './components/ContributionModal';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
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

    const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
    const unsubUser = onSnapshot(userDocRef, (snap) => {
      if (snap.exists()) {
        setUserData(snap.data());
      } else {
        const data = {
          displayName: `Fan Cứng #${user.uid.slice(0, 4)}`,
          points: 120,
          badges: ['pioneer'],
          level: 'Gold Fan'
        };
        setDoc(userDocRef, data);
        setUserData(data);
      }
    });

    const lbRef = collection(db, 'artifacts', appId, 'public', 'data', 'leaderboard');
    const unsubLb = onSnapshot(lbRef, (snap) => {
      const docs = snap.docs.map(d => d.data());
      setLeaderboard(docs.sort((a, b) => b.score - a.score).slice(0, 5));
    });

    const contribRef = collection(db, 'artifacts', appId, 'users', user.uid, 'contributions');
    const unsubContrib = onSnapshot(contribRef, (snap) => {
      setContributions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubUser(); unsubLb(); unsubContrib(); };
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
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
              <input type="text" placeholder="Tìm kiếm Bravia 9, Alpha 7C..." className="w-full bg-white border-none rounded-2xl py-4 pl-12 pr-4 shadow-md focus:ring-2 focus:ring-black transition-all outline-none" />
            </div>

            <Leaderboard players={leaderboard} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SONY_CATEGORIES.map(cat => (
                <div key={cat.id} className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
                  <div>
                    <div className={`w-14 h-14 rounded-2xl ${cat.color} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>{cat.icon}</div>
                    <h3 className="font-black text-xl uppercase tracking-tighter mb-1">{cat.name}</h3>
                    <p className="text-[11px] text-neutral-400 font-bold tracking-widest uppercase mb-6">{cat.products} SẢN PHẨM</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-50">
                    <a href={cat.notionUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
                      <LinkIcon size={14} /> Xem trên Notion
                    </a>
                    <button className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center group-hover:bg-black transition-colors"><ChevronRight size={18} /></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-zinc-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
               <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Sony AI Hub</h3>
                <p className="text-zinc-400 text-sm mb-6 max-w-xs">Tự động soạn kịch bản từ Notion của bạn.</p>
                <button onClick={() => setIsAiOpen(true)} className="bg-white text-black font-black px-6 py-3 rounded-full text-[10px] tracking-widest flex items-center gap-2 uppercase"><Sparkles size={16} /> TRẢI NGHIỆM NGAY</button>
               </div>
               <Sparkles size={180} className="absolute right-[-40px] top-[-40px] text-white/5" />
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 text-center shadow-sm border border-neutral-100">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gradient-to-tr from-zinc-800 to-zinc-950 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-2xl">{userData?.displayName?.charAt(0)}</div>
                <div className="absolute bottom-0 right-0 bg-yellow-500 text-white p-1.5 rounded-full border-4 border-white shadow-sm"><Award size={16} /></div>
              </div>
              <h2 className="text-2xl font-black">{userData?.displayName}</h2>
              <p className="text-zinc-400 font-bold text-xs uppercase tracking-[0.2em] mb-6">{userData?.level}</p>
            </div>

            <section>
              <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-4 px-2">Thành tích Fan Cứng</h3>
              <div className="flex flex-wrap gap-4">
                {BADGES.map(badge => (
                  <div key={badge.id} className={`flex flex-col items-center gap-2 ${userData?.badges?.includes(badge.id) ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                    <div className={`w-16 h-16 ${badge.color} rounded-2xl shadow-lg flex items-center justify-center text-3xl`}>{badge.icon}</div>
                    <span className="text-[9px] font-black text-center max-w-[70px] leading-tight uppercase tracking-tighter">{badge.name}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-neutral-100">
              <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="font-black text-lg italic uppercase tracking-tighter">Đóng góp của tôi</h3>
                <button onClick={() => setShowAddContribution(true)} className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"><Plus size={20} /></button>
              </div>
              <div className="space-y-4">
                {contributions.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-transparent hover:border-neutral-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.type === 'video' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        {item.type === 'video' ? <Youtube size={20} /> : <FileText size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-sm leading-tight">{item.title}</p>
                        <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest mt-1">{item.type}</p>
                      </div>
                    </div>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 text-neutral-400 hover:text-black"><ExternalLink size={18} /></a>
                  </div>
                ))}
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

      {!user && <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center text-white animate-pulse uppercase tracking-[0.3em] font-black italic">SONY WIKI LOADING...</div>}
    </div>
  );
};

export default App;
