import { useEffect, useState } from "react";
import ChatLayout from "../components/chat/ChatLayout";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // fetch history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/chat/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error();

        const data = await res.json();

        setMessages(
          Array.isArray(data)
            ? data.map((m) => ({
                role: m.role,
                content: m.message,
              }))
            : []
        );
      } catch {
        setMessages([]);
      }
    };

    fetchHistory();
  }, [token]);

  // send message
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = { role: "user", content: text };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: data?.ai?.message || "Ara is silent for a moment.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatLayout
      messages={messages}
      isLoading={loading}
      onSend={sendMessage}
    />
  );
};

export default Chat;
