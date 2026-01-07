import React from 'react';
import { X } from 'lucide-react';

const ContributionModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] p-8 animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-black italic uppercase tracking-tighter">Đóng góp Wiki</h3><button type="button" onClick={onClose} className="p-2"><X /></button></div>
            <div className="space-y-4">
              <input name="title" required className="w-full p-4 bg-neutral-100 border-none rounded-2xl text-sm outline-none" placeholder="Tiêu đề bài viết/video..." />
              <input name="url" type="url" required className="w-full p-4 bg-neutral-100 border-none rounded-2xl text-sm outline-none" placeholder="Link (Youtube/Notion)..." />
              <select name="type" className="w-full p-4 bg-neutral-100 border-none rounded-2xl text-sm outline-none appearance-none"><option value="video">Video Review</option><option value="article">Bài viết chuyên sâu</option></select>
              <button type="submit" className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs mt-4">Gửi đóng góp</button>
            </div>
          </form>
        </div>
  );
};

export default ContributionModal;
