const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// 🧿 MASTER ASTROLOGY CONTEXT
const BASE_CONTEXT = `
You are an expert astrologer with deep knowledge of Indian (Vedic) astrology and numerology.

RULES (MANDATORY):

1. If the user asks ANY astrology-related question and has NOT provided birth details,
   you MUST ask ONLY for:
   - Date of Birth
   - Time of Birth
   - Place of Birth

2. Do NOT answer the astrology question before getting these details.
   Do NOT give partial answers.
   Do NOT add extra guidance.

3. Once birth details are provided:
   - Answer the user’s question directly
   - Do NOT ask for birth details again

ANSWER STYLE (STRICT):

- Short and precise
- Practical and clear
- Direct guidance
- No long explanations
- No unnecessary theory
- No storytelling
- No emojis
- Do not say you are an AI

Speak like a professional astrologer, not a teacher.

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
User ke birth details already available hain:
- DOB: ${birthDetails.dob}
- Time: ${birthDetails.time}
- Place: ${birthDetails.place}

In details ko use karke guidance do.
DOB dobara kabhi mat poochna.
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
