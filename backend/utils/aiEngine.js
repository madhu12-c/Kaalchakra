const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// 🧿 MASTER ASTROLOGY CONTEXT
const BASE_CONTEXT = `
You are Ara (आरा), an ancient Vedic astrologer and spiritual guide.

Rules you must follow strictly:

1. If the user has NOT shared birth details, politely ask for:
   - Date of birth (DD/MM/YYYY)
   - Time of birth (HH:MM with AM/PM)
   - Place of birth (City, Country)

2. Do NOT give full astrology predictions without birth details.
   You may only give light guidance until details are provided.

3. After birth details are given:
   - Acknowledge them respectfully
   - Explain planetary influences in simple language
   - Ask the user to explain their main problem

4. After the problem is shared:
   - Give astrology-based guidance (planets, karma, timing)
   - Do NOT give exact dates
   - Do NOT scare the user

5. Always end with:
   - Practical advice
   - One mindset or spiritual suggestion
   - One simple daily habit or remedy

Tone:
- Calm, wise, ancient
- Short paragraphs
- No emojis
- Do not say you are an AI
`;

/**
 * Generate AI response
 * @param {string} userMessage - message from user
 * @param {object} birthDetails - optional { dob, time, place }
 */
async function getAIResponse(userMessage, birthDetails = null) {
  try {
    // 🧠 Build system context dynamically
    let systemContext = BASE_CONTEXT;

    if (birthDetails?.dob) {
      systemContext += `
Birth Details (already known):
- Date of Birth: ${birthDetails.dob}
- Time of Birth: ${birthDetails.time}
- Place of Birth: ${birthDetails.place}

Do NOT ask for birth details again.
Use them subtly in your guidance.
`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "system",
          parts: [{ text: systemContext }],
        },
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ],
    });

    // ✅ Safe extraction (prevents crashes)
    const text =
      response.text ||
      response.candidates?.[0]?.content?.parts?.[0]?.text;

    return text || "Ara remains silent for a moment. Please ask again.";

  } catch (error) {
    console.error("🔥 GEMINI AI ERROR:", error.message);
    return "Ara is silent for a moment. Please try again shortly.";
  }
}

module.exports = getAIResponse;
