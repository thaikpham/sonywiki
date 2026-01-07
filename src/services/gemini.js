export const generateSonyContent = async (input, type) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!apiKey) {
    console.error("Gemini API Key is missing");
    return "Lỗi: Chưa cấu hình Gemini API Key.";
  }

  const prompt = type === 'script'
    ? `Dựa trên sản phẩm: "${input}", soạn kịch bản Sales Talk truyền cảm hứng.`
    : `Tạo 3 câu hỏi trắc nghiệm cực khó về sản phẩm: "${input}".`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!res.ok) {
        throw new Error(`Gemini API Error: ${res.status}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi từ AI.";
  } catch (e) {
    console.error(e);
    return "Lỗi AI: " + e.message;
  }
};
