export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] px-4 py-2 text-sm leading-relaxed
        ${
          isUser
            ? "bg-indigo-600 text-white rounded-2xl rounded-br-sm"
            : "bg-slate-800 text-slate-100 rounded-2xl rounded-bl-sm"
        }`}
      >
        {!isUser && (
          <div className="text-xs text-slate-400 mb-1">Ara</div>
        )}
        {message.content}
      </div>
    </div>
  );
}
