import { useEffect, useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]); // ✅ always array
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // 🔹 Fetch chat history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/chat/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load history");

        const data = await res.json();

        // ✅ ensure valid messages only
        const safeMessages = Array.isArray(data)
          ? data.filter(
              (msg) => msg && msg.role && msg.message
            )
          : [];

        setMessages(safeMessages);
      } catch (err) {
        console.error("History error:", err.message);
        setMessages([]); // never undefined
      }
    };

    fetchHistory();
  }, [token]);

  // 🔹 Send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      message: input,
    };

    // optimistic UI
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage.message }),
      });

      if (!res.ok) throw new Error("Chat request failed");

      const data = await res.json();

      // backend returns { user, ai }
      if (data?.ai?.message) {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            message: data.ai.message,
          },
        ]);
      } else {
        // fallback AI message
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            message: "Ara is silent for a moment. Please try again.",
          },
        ]);
      }
    } catch (err) {
      console.error("Send error:", err.message);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          message: "Something went wrong. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="p-4 bg-black text-white text-center font-semibold">
        Kaalchakra – Astrology Chat
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages
          .filter((msg) => msg && msg.role && msg.message)
          .map((msg, index) => (
            <div
              key={index}
              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                msg.role === "user"
                  ? "ml-auto bg-blue-500 text-white"
                  : "mr-auto bg-white text-gray-800"
              }`}
            >
              {msg.message}
            </div>
          ))}

        {loading && (
          <div className="mr-auto bg-white text-gray-500 px-4 py-2 rounded-lg text-sm">
            Ara is thinking…
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 flex gap-2 border-t bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask Ara about your destiny..."
          className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 py-2 rounded text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
