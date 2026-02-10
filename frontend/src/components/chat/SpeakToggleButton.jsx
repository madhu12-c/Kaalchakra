import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function SpeakToggleButton({ onResult, onStart, onStop, lang = "en-IN" }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice not supported in this browser");
      return;
    }

    stopListening();

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      onStart?.();
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult?.(transcript);
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
      onStop?.();
    };

    recognition.onerror = () => {
      setListening(false);
      recognitionRef.current = null;
      onStop?.();
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      recognitionRef.current = null;
    }
    setListening(false);
    onStop?.();
  };

  const toggle = () => {
    if (listening) stopListening();
    else startListening();
  };

  return (
    <motion.button
      onClick={toggle}
      animate={listening ? { scale: [1, 1.15, 1], backgroundColor: "#ef4444" } : { scale: 1, backgroundColor: "#334155" }}
      transition={{ repeat: listening ? Infinity : 0, duration: 1 }}
      className="px-4 py-2 rounded-full text-white flex items-center gap-2"
      title={listening ? "Stop listening" : "Start listening"}
    >
      <span>{listening ? "🎤 Listening…" : "🎤"}</span>
    </motion.button>
  );
}
