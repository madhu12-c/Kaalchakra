import { useState } from "react";

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="p-3 border-t border-slate-800">
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          placeholder="Ask Ara about your life…"
          className="flex-1 px-4 py-2 rounded-full bg-slate-900 text-white outline-none disabled:opacity-50"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={disabled}
          className="px-4 rounded-full bg-indigo-600 disabled:opacity-50"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
    