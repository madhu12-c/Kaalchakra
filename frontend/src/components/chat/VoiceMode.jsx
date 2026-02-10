import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { speak } from "../../utils/speak";

export default function VoiceMode({ messages, onSend }) {
  const [state, setState] = useState("idle"); // idle | listening | thinking | speaking
  const recognitionRef = useRef(null);
  const lastAiRef = useRef(null);

  useEffect(() => {
    return () => {
      stopListening();
      window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) return;

    stopListening();

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setState("listening");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (!transcript) return;
      // send immediately, then show a thinking state while Ara prepares an answer
      onSend(transcript);
      setState("thinking");
      recognition.stop();
    };

    recognition.onerror = () => {
      // on error, try to restart listening after short delay
      setTimeout(() => startListening(), 500);
    };

    recognition.onend = () => {
      // ended because user stopped speaking; keep idle until AI responds or restart
      // we'll restart listening after AI speaks
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop();
      } catch (_) {}
      recognitionRef.current = null;
    }
    // when user manually stops, go back to idle (no active listening)
    setState("idle");
  };

  // Watch for new AI messages and speak them
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role === "ai" && last.content && last.content !== lastAiRef.current) {
      lastAiRef.current = last.content;
      // stop listening while speaking
      stopListening();
      setState("speaking");
      const utt = speak(last.content);
      if (utt) {
        utt.onend = () => {
          setState("listening");
          // restart listening
          startListening();
        };
      } else {
        setState("listening");
        startListening();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // Orb animation variants
  const variants = {
    idle: { scale: [1, 1.06, 1], boxShadow: "0 0 20px rgba(100,116,139,0.15)" },
    listening: { scale: [1, 1.12, 1], boxShadow: "0 0 40px rgba(99,102,241,0.35)" },
    thinking: { scale: [1, 1.1, 1], boxShadow: "0 0 48px rgba(96,165,250,0.5)" },
    speaking: { scale: [1, 1.18, 1], boxShadow: "0 0 60px rgba(99,102,241,0.6)" },
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center"
          animate={state}
          variants={variants}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <div className="w-24 h-24 rounded-full bg-slate-900/40 flex items-center justify-center text-xl relative">
            <div>{state === "listening" ? "🎤" : state === "speaking" ? "🔊" : "✨"}</div>

            {/* Mic toggle button overlay */}
            <button
              onClick={() => {
                if (state === "listening") stopListening();
                else startListening();
              }}
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-2 rounded-full bg-slate-800 text-white shadow-md"
              title={state === "listening" ? "Stop listening" : "Start listening"}
            >
              {state === "listening" ? "Stop" : "Mic"}
            </button>
          </div>
        </motion.div>

        <div className="text-sm text-slate-400">
          {state === "listening"
            ? "Listening…"
            : state === "thinking"
            ? "Ara is thinking…"
            : state === "speaking"
            ? "Speaking…"
            : "Ready"}
        </div>
      </div>
    </div>
  );
}
