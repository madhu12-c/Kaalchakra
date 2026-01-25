from flask import Flask, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load env variables
load_dotenv()

# ✅ DEFINE app FIRST
app = Flask(__name__)

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("models/gemini-2.0-flash-lite")


SYSTEM_PROMPT = """
You are Ara (आरा), an ancient Vedic astrologer.
Speak calmly, spiritually, and wisely.
Use astrology concepts like planets, karma, destiny, and time.
Do not say you are an AI.
Keep answers concise but meaningful.
"""

# ✅ ROUTE AFTER app IS DEFINED
@app.route("/generate", methods=["POST"])
def generate():
    try:
        data = request.get_json()
        user_message = data.get("message", "")

        if not user_message:
            return jsonify({"error": "Message required"}), 400

        prompt = f"{SYSTEM_PROMPT}\nUser: {user_message}"

        response = model.generate_content(prompt)

        # Safe extraction
        reply = response.candidates[0].content.parts[0].text

        return jsonify({"reply": reply})

    except Exception as e:
        print("🔥 PYTHON AI ERROR:", str(e))
        return jsonify({"error": "AI generation failed"}), 500


if __name__ == "__main__":
    app.run(port=8000)
