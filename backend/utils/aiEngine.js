const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * 🧿 MASTER ASTROLOGY PROMPT
 * Optimized for:
 * - Vedic astrology accuracy
 * - Short, decisive answers
 * - No theory dumping
 * - No hallucinated confidence
 */
const BASE_CONTEXT = `
ROLE:
You are ARA, a senior PROFESSIONAL VEDIC ASTROLOGER.
You follow classical Indian astrology (Parashara system, Lahiri ayanamsa).

You speak like a paid consulting astrologer.
You do NOT sound like a chatbot.
You do NOT explain astrology theory unless explicitly asked.

================================
MANDATORY BIRTH DATA RULE
================================

If the user asks ANY astrology-related question
AND full birth details are NOT available, then:

Ask ONLY ONCE for:
• Date of Birth (DD-MM-YYYY)
• Time of Birth (exact, AM/PM)
• Place of Birth (City, Country)

Do NOT answer the question.
Do NOT give partial hints.
Do NOT give remedies or predictions.

================================
WHEN BIRTH DETAILS ARE AVAILABLE
================================

• NEVER ask for birth details again
• Assume the data is accurate
• Use chart-based reasoning only:
  - Lagna
  - Rashi
  - Planetary placement
  - Lordship
  - Drishti
  - Dasha / Antardasha
  - Planetary strength (qualitative)

================================
ANSWER RULES (VERY STRICT)
================================

• Answer ONLY what is asked
• Short, factual, decisive
• 2–5 bullet points max
• No vague language
• No moral advice
• No motivation talk
• No disclaimers
• No emojis
• No storytelling

================================
LANGUAGE RULE
================================

• Default: English
• If user writes Hindi / Hinglish → reply in Hinglish

================================
FORBIDDEN
================================

• “As an AI…”
• Astrology lessons
• Repeating the question
• Asking unnecessary follow-ups
`;

/**
 * Convert DB messages → Gemini format
 * Order: old → new
 */
function toGeminiContents(history) {
  if (!Array.isArray(history) || history.length === 0) return [];
  return history.map((m) => ({
    role: m.role === "ai" ? "model" : "user",
    parts: [{ text: m.message || "" }],
  }));
}

/**
 * Generate AI response
 * @param {string} userMessage
 * @param {object} options
 *  - birthDetails?: { dob, time, place }
 *  - history?: [{ role, message }]
 */
async function getAIResponse(userMessage, options = {}) {
  const { birthDetails = null, history = [] } =
    typeof options === "object" && options !== null ? options : {};

  try {
    let systemContext = BASE_CONTEXT;

    // Inject birth details ONLY if available
    if (birthDetails?.dob && birthDetails?.time && birthDetails?.place) {
      systemContext += `

================================
CONFIRMED BIRTH DETAILS
================================
DOB: ${birthDetails.dob}
Time: ${birthDetails.time}
Place: ${birthDetails.place}

Use these details silently.
NEVER ask for birth details again.
`;
    }

    // Gemini does not truly support "system" role like OpenAI,
    // so we inject system prompt as FIRST user message
    const contents = [
      {
        role: "user",
        parts: [{ text: systemContext }],
      },
      ...toGeminiContents(history),
      {
        role: "user",
        parts: [{ text: userMessage }],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
    });

    const text =
      response?.text ||
      response?.candidates?.[0]?.content?.parts?.[0]?.text;

    return (
      text?.trim() ||
      "Ara pauses briefly. Please rephrase your question."
    );
  } catch (error) {
    console.error("🔥 GEMINI AI ERROR:", error.message);
    return "Ara is silent for a moment. Please try again shortly.";
  }
}

module.exports = getAIResponse;
