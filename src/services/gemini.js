export const generateSonyContent = async (inputData, type) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!apiKey) {
    console.error("Gemini API Key is missing");
    return "Lỗi: Chưa cấu hình Gemini API Key.";
  }

  let prompt = '';

  if (type === 'script') {
    const { product, persona, tone, language = 'Vietnamese' } = inputData;
    prompt = `Act as a Senior Product Manager and Sales Expert at Sony Electronics Vietnam. Your goal is to create a highly persuasive sales script to increase conversion rates for the Vietnamese market.

    Product: ${product}
    Target Audience (Persona): ${persona}
    Tone: ${tone}
    Output Language: ${language}

    Instructions:
    1. Deep Understanding: Analyze the product's USP (Unique Selling Points) relevant to the Vietnamese market and the specific needs/pain points of the ${persona}.
    2. Structure:
       - Hook: A compelling opening that grabs attention immediately, addressing a specific local insight or common situation in Vietnam.
       - Value Proposition: Translate technical specs into tangible lifestyle benefits specific to the persona. Use emotional triggers.
       - Objection Handling: Briefly address a common hesitation this persona might have.
       - Closing: A strong, clear Call to Action (CTA) that encourages a purchase or store visit.
    3. Style: Use natural, engaging language. If Vietnamese, use appropriate terminology (e.g., 'chốt đơn', 'siêu phẩm', but keep it professional if the tone requires). Avoid overly robotic translations.
    4. Format: Use clear sections with emojis where appropriate to make it readable.
    5. IMPORTANT: The output must be strictly in ${language}.`;
  } else {
    // Legacy support or other types
    prompt = `Tạo 3 câu hỏi trắc nghiệm cực khó về sản phẩm: "${inputData}".`;
  }

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `Status: ${res.status}`;
      throw new Error(errorMessage);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi từ AI.";
  } catch (e) {
    console.error(e);
    // Clean up the error message for display
    return "AI Error: " + e.message;
  }
};

export const chatWithSonyAI = async (history) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!apiKey) {
    console.error("Gemini API Key is missing");
    return "Lỗi: Chưa cấu hình Gemini API Key.";
  }

  // Transform history to Gemini format
  const contents = history.map(msg => ({
    role: msg.role === 'admin' ? 'user' : msg.role,
    parts: [{ text: msg.text }]
  }));

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `Status: ${res.status}`;
      throw new Error(errorMessage);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi từ AI.";
  } catch (e) {
    console.error(e);
    return "AI Error: " + e.message;
  }
};
