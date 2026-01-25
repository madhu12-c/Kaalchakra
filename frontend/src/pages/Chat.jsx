import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
    fetchHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchHistory = async () => {
    const res = await fetch("http://localhost:5000/api/chat/history", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMessages(data);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const res = await fetch("http://localhost:5000/api/chat/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, data.user, data.ai]);
    setText("");
  };

  return (
    <div className="h-screen flex flex-col bg-[#05070d] text-white">
      {/* Header */}
      <div className="p-4 border-b border-white/10 text-center font-semibold">
        Ara 🪐 — Cosmic Guide
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
              m.role === "user"
                ? "ml-auto bg-blue-600"
                : "mr-auto bg-[#1c2336]"
            }`}
          >
            {m.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="p-3 border-t border-white/10 flex gap-2"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask the cosmos..."
          className="flex-1 bg-[#0f1424] rounded-full px-4 py-2 outline-none"
        />
        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
          Send
        </button>
      </form>
    </div>
  );
}
