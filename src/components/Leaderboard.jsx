import React from 'react';
import { Trophy } from 'lucide-react';

const Leaderboard = ({ players }) => (
  <section className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
    <div className="flex justify-between items-end mb-6">
      <div>
        <h2 className="text-xl font-black flex items-center gap-2">
          <Trophy className="text-yellow-500" size={24} /> BẢNG XẾP HẠNG TUẦN
        </h2>
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Reset sau 3 ngày</p>
      </div>
    </div>
    <div className="space-y-3">
      {players.length > 0 ? players.map((player, i) => (
        <div key={i} className={`flex items-center justify-between p-3 rounded-2xl ${i === 0 ? 'bg-yellow-50 border border-yellow-100' : 'bg-neutral-50'}`}>
          <div className="flex items-center gap-4">
            <span className={`w-6 text-center font-black ${i === 0 ? 'text-yellow-600' : 'text-neutral-400'}`}>{i + 1}</span>
            <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm overflow-hidden">{player.name?.charAt(0)}</div>
            <div>
              <p className="font-bold text-sm">{player.name}</p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-tighter">{player.role || 'Fan Cứng'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-black text-sm">{player.score.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-neutral-400 uppercase">Điểm</p>
          </div>
        </div>
      )) : <div className="text-center py-6 text-neutral-400 italic text-sm">Đang đồng bộ...</div>}
    </div>
  </section>
);

export default Leaderboard;
