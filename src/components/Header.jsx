import React from 'react';

const Header = ({ userData }) => (
  <header className="sticky top-0 z-40 bg-black text-white px-6 py-4 flex items-center justify-between shadow-xl">
    <div className="flex items-center gap-3">
      <span className="text-2xl font-black tracking-tighter italic">SONY</span>
      <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase hidden sm:block">Wiki</span>
    </div>
    {userData && (
      <div className="flex items-center gap-3 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
        <div className="text-right">
          <p className="text-[10px] font-bold leading-none text-white uppercase tracking-tighter">{userData.displayName}</p>
        </div>
        <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full flex items-center justify-center font-bold text-xs">
          {userData.displayName?.charAt(0)}
        </div>
      </div>
    )}
  </header>
);

export default Header;
