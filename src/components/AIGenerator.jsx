import React, { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import { generateSonyContent } from '../services/gemini';

const AIGenerator = () => {
  const [product, setProduct] = useState('');
  const [persona, setPersona] = useState('Family');
  const [tone, setTone] = useState('Friendly');
  const [language, setLanguage] = useState('Vietnamese');
  const [aiOutput, setAiOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
     if (!product) return;
     setIsLoading(true);
     const result = await generateSonyContent({ product, persona, tone, language }, 'script');
     setAiOutput(result);
     setIsLoading(false);
  };

  const handleCopy = () => {
    if (aiOutput) {
      navigator.clipboard.writeText(aiOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
        <div className="space-y-4">
            <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 pl-2">Sản phẩm</label>
            <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="VD: Bravia 9, Alpha 7 IV..."
                className="w-full bg-white border border-neutral-200 focus:border-purple-500 rounded-2xl py-4 px-4 shadow-sm outline-none transition-all"
            />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 pl-2">Khách hàng</label>
                <select
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-2xl py-4 px-4 shadow-sm outline-none appearance-none"
                >
                <option value="Gamer">Game thủ (Gamer)</option>
                <option value="Family">Gia đình (Family)</option>
                <option value="Content Creator">Sáng tạo nội dung (Creator)</option>
                <option value="Audiophile">Người yêu nhạc (Audiophile)</option>
                <option value="Photographer">Nhiếp ảnh gia (Photographer)</option>
                <option value="Home Cinema Enthusiast">Đam mê phim ảnh (Cinema)</option>
                <option value="Student">Học sinh/Sinh viên</option>
                <option value="Office Worker">Dân văn phòng (Office)</option>
                <option value="Tech Enthusiast">Yêu công nghệ (Tech)</option>
                <option value="Traveler">Du lịch (Traveler)</option>
                <option value="Sports & Fitness">Thể thao (Sports)</option>
                <option value="General Consumer">Người dùng phổ thông</option>
                </select>
            </div>
            <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 pl-2">Phong cách</label>
                <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-2xl py-4 px-4 shadow-sm outline-none appearance-none"
                >
                <option value="Friendly">Thân thiện (Friendly)</option>
                <option value="Professional">Chuyên nghiệp (Pro)</option>
                <option value="Technical">Kỹ thuật (Tech)</option>
                <option value="Enthusiastic">Hào hứng (Excited)</option>
                <option value="Empathetic">Thấu hiểu (Empathetic)</option>
                </select>
            </div>
            <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 pl-2">Ngôn ngữ</label>
                <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-2xl py-4 px-4 shadow-sm outline-none appearance-none"
                >
                <option value="Vietnamese">Tiếng Việt</option>
                <option value="English">English</option>
                </select>
            </div>
            </div>
        </div>

        <button
            onClick={handleGenerate}
            disabled={isLoading || !product}
            className="w-full bg-gradient-to-r from-zinc-900 to-black hover:from-black hover:to-zinc-900 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest disabled:opacity-50 shadow-xl shadow-neutral-900/20 transition-all active:scale-[0.98]"
        >
            {isLoading ? 'Đang soạn thảo...' : 'Tạo kịch bản tư vấn'}
        </button>

        {aiOutput && (
            <div className="relative group animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-neutral-50 border border-neutral-100 p-6 rounded-[2rem] text-sm leading-relaxed whitespace-pre-line text-neutral-700">
                {aiOutput}
            </div>
            <button
                onClick={handleCopy}
                className="absolute top-4 right-4 p-2 bg-white shadow-sm border border-neutral-100 rounded-xl hover:bg-neutral-50 transition-colors"
                title="Copy to Clipboard"
            >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-neutral-400" />}
            </button>
            </div>
        )}
    </div>
  );
};

export default AIGenerator;
