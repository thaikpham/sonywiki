export const generateSonyContent = async (inputData, type) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!apiKey) {
    console.error("Gemini API Key is missing");
    return "Lỗi: Chưa cấu hình Gemini API Key.";
  }

  let prompt = '';

  if (type === 'script') {
    const { product, persona, tone } = inputData;
    prompt = `Act as a professional Sony Sales Trainer. Create a sales script for product: "${product}".
    Target Audience: ${persona}.
    Tone: ${tone}.
    Structure:
    1. Hook (Attention Grabber)
    2. Features translated to Real-world Benefits
    3. Closing (Call to Action)

    Keep it concise and impactful.`;
  } else {
    // Legacy support or other types
    prompt = `Tạo 3 câu hỏi trắc nghiệm cực khó về sản phẩm: "${inputData}".`;
  }

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
