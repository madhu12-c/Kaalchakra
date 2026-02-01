import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const toggleListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice not supported in this browser");
      return;
    }

    // STOP
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    // START
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="p-3 border-t border-slate-800">
      <div className="flex gap-2 items-center">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          placeholder="Ask Ara about your life…"
          className="flex-1 px-4 py-2 rounded-full bg-slate-900 text-white outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        {/* Mic Button */}
        <motion.button
          onClick={toggleListening}
          animate={
            listening
              ? { scale: [1, 1.15, 1], backgroundColor: "#ef4444" }
              : { scale: 1, backgroundColor: "#334155" }
          }
          transition={{ repeat: listening ? Infinity : 0, duration: 1 }}
          className="px-4 py-2 rounded-full text-white"
          title={listening ? "Stop listening" : "Start listening"}
        >
          🎤
        </motion.button>

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={disabled}
          className="px-4 py-2 rounded-full bg-indigo-600 disabled:opacity-50"
        >
          ➤
        </button>
      </div>

      {/* Listening indicator */}
      {listening && (
        <div className="text-xs text-red-400 mt-2 ml-4">
          Listening… tap mic to stop
        </div>
      )}
    </div>
  );
}
