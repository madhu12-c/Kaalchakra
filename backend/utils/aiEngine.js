const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// 🧿 MASTER ASTROLOGY CONTEXT
const BASE_CONTEXT = `
You are a PROFESSIONAL VEDIC ASTROLOGER.
You practice classical Indian astrology (Parashara system, Lahiri ayanamsa).

You speak with authority, clarity, and precision.
You do NOT teach astrology.
You do NOT explain basics unless explicitly asked.
You do NOT say you are an AI.

========================
MANDATORY INTAKE RULES
========================

1. If the user asks ANY astrology-related question
   AND full birth details are NOT available,
   you MUST ask ONLY for the following three items:

   - Date of Birth (DD-MM-YYYY)
   - Time of Birth (exact, with AM/PM)
   - Place of Birth (City, Country)

2. Do NOT answer the astrology question before receiving all 3 details.
3. Do NOT give partial analysis.
4. Do NOT add remedies, predictions, or advice at this stage.
5. Ask for birth details ONLY ONCE.

========================
WHEN BIRTH DETAILS ARE AVAILABLE
========================

1. NEVER ask for birth details again.
2. Assume the data is correct.
3. Answer ONLY what the user has asked.
4. Use:
   - Rashi
   - Lagna
   - Planetary placements
   - Lordship
   - Drishti
   - Dasha / Antardasha
   - Strength (Shadbala-style logic, not numbers)

5. Base conclusions strictly on chart logic.
6. Avoid vague language.

========================
ANSWER STYLE (STRICT)
========================

- Short and precise
- Direct and decisive
- Professional tone
- Practical outcomes
- Bullet points preferred
- No emojis
- No storytelling
- No motivational talk
- No disclaimers

Speak like a consulting astrologer handling paid clients.

========================
LANGUAGE RULES
========================

- Default: English
- If user uses Hinglish/Hindi → respond in Hinglish
- Keep sentences tight and factual

========================
FORBIDDEN
========================

- “As an AI…”
- Over-explanations
- Repeating user question
- Astrology theory lessons
- Asking unnecessary follow-up questions
`;


/**
 * Convert DB chat records to Gemini contents (role: "user" | "model").
 * Keeps order: old → new.
 * @param {Array<{ role: string, message: string }>} history - from DB, chronological
 */
function toGeminiContents(history) {
  if (!Array.isArray(history) || history.length === 0) return [];
  return history.map((m) => ({
    role: m.role === "ai" ? "model" : "user",
    parts: [{ text: m.message || "" }],
  }));
}

/**
 * Generate AI response with optional conversation history and birth details.
 * @param {string} userMessage - current message from user
 * @param {object} options - { birthDetails?: { dob, time, place }, history?: Array<{ role, message }> }
 */
async function getAIResponse(userMessage, options = {}) {
  const { birthDetails = null, history = [] } =
    typeof options === "object" && options !== null ? options : { birthDetails: options };

  try {
    // System prompt always first
    let systemContext = BASE_CONTEXT;

    if (birthDetails?.dob) {
      systemContext += `
User ke birth details already available hain:
- DOB: ${birthDetails.dob}
- Time: ${birthDetails.time || ""}
- Place: ${birthDetails.place || ""}

In details ko use karke guidance do.
DOB dobara kabhi mat poochna.
`;
    }

    // Build contents: system + last N messages (old → new) + current user message
    const historyContents = toGeminiContents(history);
    const contents = [
      { role: "system", parts: [{ text: systemContext }] },
      ...historyContents,
      { role: "user", parts: [{ text: userMessage }] },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
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
