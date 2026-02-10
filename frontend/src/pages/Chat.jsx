import { useEffect, useState } from "react";
import ChatLayout from "../components/chat/ChatLayout";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [responseMode, setResponseMode] = useState(() => {
    return localStorage.getItem("responseMode") || "text";
  });
  const [autoStartListening, setAutoStartListening] = useState(false);

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

      // Show welcome message once per session and optionally trigger auto-listen
      const welcomeShown = sessionStorage.getItem("welcomeShown");
      if (!welcomeShown) {
        const welcome = "Welcome. You can ask your question now.";
        setMessages((prev) => [...prev, { role: "ai", content: welcome }]);
        sessionStorage.setItem("welcomeShown", "true");
        if ((localStorage.getItem("responseMode") || responseMode) === "voice") {
          // inform ChatLayout/ChatInput to start listening
          setAutoStartListening(true);
        }
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
      responseMode={responseMode}
      onResponseModeChange={(mode) => {
        setResponseMode(mode);
        localStorage.setItem("responseMode", mode);
      }}
      autoStartListening={autoStartListening}
    />
  );
};

export default Chat;
