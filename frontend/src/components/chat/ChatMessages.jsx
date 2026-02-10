import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { speak } from "../../utils/speak";

export default function ChatMessages({ messages, isLoading }) {
  const bottomRef = useRef(null);
  const lastSpokenRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    // 🔊 Speak last AI message
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage?.role === "ai" &&
      lastMessage.content !== lastSpokenRef.current
    ) {
      speak(lastMessage.content);
      lastSpokenRef.current = lastMessage.content;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
      {messages.map((msg, i) => (
        <MessageBubble key={i} message={msg} />
      ))}

      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
