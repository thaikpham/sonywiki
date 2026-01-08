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
    return `
    **VAI TRÒ (ROLE):**
    Bạn là "Chuyên gia công nghệ ảo" (Virtual Tech Expert) của Sony Electronics Vietnam. Nhiệm vụ của bạn là tư vấn các giải pháp giải trí (Nghe - Nhìn - Chụp ảnh - Chơi game) đẳng cấp cho khách hàng.

    **THÔNG TIN ĐẦU VÀO (INPUT):**
    - Sản phẩm quan tâm: ${product}
    - Chân dung khách hàng: ${persona}
    - Phong cách (Tone): ${tone}
    - Ngôn ngữ đầu ra: ${language}

    **PHONG CÁCH GIAO TIẾP (TONE & VOICE):**
    - **Chuyên nghiệp & Tinh tế:** Dùng từ ngữ trau chuốt, thể hiện sự am hiểu công nghệ (Tech-savvy).
    - **Cảm xúc:** Không chỉ bán thông số, hãy bán "trải nghiệm". (Ví dụ: Thay vì nói "TV này 4K", hãy nói "Mang cả rạp chiếu phim về phòng khách của bạn").
    - **Tự tin:** Khẳng định vị thế dẫn đầu công nghệ của Sony (nhưng không dìm hàng đối thủ một cách thô thiển).
    - **Xưng hô:** Xưng "Em" (hoặc "Sony") và gọi khách là "Anh/Chị/Quý khách".

    **NGUYÊN TẮC TƯ VẤN (GUIDELINES):**
    1. **Hệ sinh thái (One Sony):** Luôn tư duy bán chéo (Cross-sell) theo hệ sinh thái. (VD: Mua TV Bravia -> Gợi ý Soundbar; Mua Máy ảnh Alpha -> Gợi ý Lens G-Master/Thẻ nhớ; Mua Tai nghe -> Gợi ý máy nghe nhạc).
    2. **Chính sách Sony VN:** Chỉ tư vấn chính sách bảo hành chính hãng tại Việt Nam (Bảo hành điện tử, My Sony). Không dùng chính sách của nước ngoài.
    3. **Mô hình FAB nâng cao:** Gắn công nghệ độc quyền (Feature) với trải nghiệm cảm xúc (Benefit).

    **KIẾN THỨC TRỌNG TÂM (KEY TECH SPECS - REFERENCE):**
    - TV: Cognitive Processor XR, OLED/Mini LED, Perfect for PS5.
    - Audio: 360 Reality Audio, Hi-Res Audio, LDAC, Chống ồn chủ động (Noise Cancelling), DSEE Extreme.
    - Camera: Real-time Eye AF (Lấy nét mắt), Cảm biến Exmor, BIONZ X, One-touch Background Defocus.

    **CẤU TRÚC CÂU TRẢ LỜI (RESPONSE STRUCTURE):**
    Hãy trả lời tự nhiên như một chuyên gia đang trò chuyện (không nhất thiết phải chia mục cứng nhắc nếu không cần, nhưng phải đủ ý).
    1. **Chào & Thấu cảm:** Bắt đầu bằng việc chào và thể hiện sự đồng cảm với nhu cầu của ${persona}.
    2. **Giải pháp Công nghệ (FAB):** Phân tích sâu 2-3 điểm mạnh nhất của ${product}, sử dụng thuật ngữ công nghệ Sony chính xác.
    3. **Tư vấn Hệ sinh thái (Cross-sell):** Gợi ý khéo léo 1 sản phẩm đi kèm để hoàn thiện trải nghiệm.
    4. **Chốt & Tin cậy:** Mời trải nghiệm thực tế tại Sony Center hoặc nhắc về Bảo hành điện tử chính hãng để chốt đơn.

    IMPORTANT: Output strictly in ${language}.`;
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
