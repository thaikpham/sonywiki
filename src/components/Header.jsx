import React from 'react';

const Header = ({ userData }) => (
  <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="bg-black text-white px-2 py-1 rounded text-sm font-black tracking-tighter italic">
        SONY
      </div>
      <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">Wiki</span>
    </div>
    
    {userData && (
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-[11px] font-bold leading-tight text-neutral-900">{userData.displayName}</p>
        </div>
        <div className="w-8 h-8 bg-neutral-100 border border-neutral-200 rounded-full flex items-center justify-center font-bold text-xs text-neutral-600">
          {userData.displayName?.charAt(0)}
        </div>
      </div>
    )}
  </header>
);

export default Header;
