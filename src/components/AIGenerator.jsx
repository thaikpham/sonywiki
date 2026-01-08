import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Copy, Check, Send, RefreshCw, User, Bot } from 'lucide-react';
import { chatWithSonyAI } from '../services/gemini';

const AIGenerator = () => {
  const [product, setProduct] = useState('');
  const [persona, setPersona] = useState('Family');
  const [tone, setTone] = useState('Friendly');
  const [language, setLanguage] = useState('Vietnamese');
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const buildInitialPrompt = () => {
    return `Act as a Senior Field Sales Trainer for Sony Electronics Vietnam.
    Your audience is busy PGs (Promotion Girls) and Promoters who need a "Cheat Sheet" to sell to a customer RIGHT NOW.

    INPUT CONTEXT:
    - Product: ${product}
    - Customer Persona: ${persona}
    - Tone: ${tone}
    - Language: ${language}

    STRICT OUTPUT RULES:
    1. NO YAPPING. No long intros. No theoretical marketing fluff.
    2. FORMAT: Use line breaks between sections. Use emojis to make it scannable.
    3. STYLE: "Thực chiến" (Battle-ready). Natural Vietnamese spoken language (if Vietnamese). Short, punchy sentences.

    REQUIRED OUTPUT STRUCTURE:

    🎯 **MỞ LỜI (HOOK):**
    [One quick question or statement to grab this specific persona's attention instantly. Mention a pain point.]

    💎 **ĐIỂM CHỐT ĐƠN (KEY SELLING POINTS):**
    - [Emoji] **Feature 1:** [Benefit in 5 words]
    - [Emoji] **Feature 2:** [Benefit in 5 words]
    - [Emoji] **Feature 3:** [Benefit in 5 words]

    🛡️ **XỬ LÝ TỪ CHỐI (OBJECTION HANDLING):**
    [One sentence to answer the most likely objection from this persona.]

    🔥 **CHỐT DEAL (CLOSING):**
    [One powerful sentence to ask for the sale/trial.]

    IMPORTANT: Output strictly in ${language}. Keep it under 150 words total.`;
  };

  const handleGenerate = async () => {
     if (!product) return;
     setIsLoading(true);

     const prompt = buildInitialPrompt();
     const initialMessages = [{ role: 'user', text: prompt, isHidden: true }];

     // Set UI to show loading state
     setMessages(initialMessages);

     const result = await chatWithSonyAI(initialMessages);

     setMessages(prev => [...prev, { role: 'model', text: result }]);
     setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const newMsg = { role: 'user', text: chatInput };
    setMessages(prev => [...prev, newMsg]);
    setChatInput('');
    setIsLoading(true);

    // Prepare history for API (remove UI-only flags if any, currently isHidden is just a flag)
    // We keep all messages in history for context.
    // Ensure we filter out any message that shouldn't be sent (none so far, but good to be safe)
    const history = [...messages, newMsg].map(m => ({ role: m.role, text: m.text }));

    const result = await chatWithSonyAI(history);

    setMessages(prev => [...prev, { role: 'model', text: result }]);
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetChat = () => {
    setMessages([]);
    setChatInput('');
    setIsLoading(false);
  };

  // If chat has started (messages exist), show chat interface. Otherwise show form.
  if (messages.length > 0) {
    return (
        <div className="flex flex-col h-[600px] bg-white rounded-[2rem] border border-neutral-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Chat Header */}
            <div className="bg-neutral-50 border-b border-neutral-100 p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-zinc-800 to-black text-white p-2 rounded-xl">
                        <Sparkles size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Sony AI Consultant</h3>
                        <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">{product} • {persona}</p>
                    </div>
                </div>
                <button
                    onClick={resetChat}
                    className="p-2 hover:bg-neutral-200 rounded-full text-neutral-400 hover:text-black transition-colors"
                    title="Tạo hội thoại mới"
                >
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-neutral-50/50">
                {messages.map((msg, index) => {
                    if (msg.isHidden) return null;
                    const isUser = msg.role === 'user';
                    return (
                        <div key={index} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                            {!isUser && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-sm flex-shrink-0 mt-1">
                                    <Bot size={14} />
                                </div>
                            )}

                            <div className={`relative group max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                                isUser
                                ? 'bg-black text-white rounded-tr-none'
                                : 'bg-white border border-neutral-100 text-neutral-700 rounded-tl-none'
                            }`}>
                                <div className="whitespace-pre-line">{msg.text}</div>

                                {!isUser && (
                                    <button
                                        onClick={() => handleCopy(msg.text)}
                                        className="absolute -bottom-8 left-0 p-1.5 bg-white border border-neutral-200 rounded-lg text-neutral-400 hover:text-black opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                        title="Copy text"
                                    >
                                        {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                                    </button>
                                )}
                            </div>

                            {isUser && (
                                <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 flex-shrink-0 mt-1">
                                    <User size={14} />
                                </div>
                            )}
                        </div>
                    );
                })}
                {isLoading && (
                    <div className="flex gap-3 justify-start animate-pulse">
                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
                            <Bot size={14} />
                        </div>
                        <div className="bg-white border border-neutral-100 rounded-2xl rounded-tl-none p-4 w-32 h-12 flex items-center gap-1">
                            <div className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                            <div className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                            <div className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-neutral-100">
                <div className="relative">
                    <textarea
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Đặt câu hỏi thêm (VD: Làm ngắn gọn hơn, Thêm so sánh giá...)"
                        className="w-full bg-neutral-50 border border-neutral-200 focus:border-black rounded-2xl py-3 pl-4 pr-12 shadow-sm outline-none transition-all resize-none text-sm min-h-[50px] max-h-[120px]"
                        rows={1}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!chatInput.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-all"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
  }

  // Original Form View
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
            {isLoading ? 'Đang khởi tạo hội thoại...' : 'Bắt đầu tư vấn'}
        </button>
    </div>
  );
};

export default AIGenerator;
