export default function ChatHeader({ responseMode, onResponseModeChange }) {
  return (
    <div className="h-14 px-4 flex items-center justify-between border-b border-slate-800">
      <div>
        <div className="font-semibold">🔮 Ara</div>
        <div className="text-xs text-slate-400">
          Ancient Astrologer • Online
        </div>
      </div>
      <button
        onClick={() => onResponseModeChange(responseMode === "text" ? "voice" : "text")}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
        style={{
          backgroundColor: responseMode === "voice" ? "#4f46e5" : "#1e293b",
          border: responseMode === "voice" ? "1px solid #6366f1" : "1px solid #475569",
        }}
        title={responseMode === "voice" ? "Voice mode enabled" : "Voice mode disabled"}
      >
        <span>{responseMode === "voice" ? "🔊" : "🔕"}</span>
        <span className="text-sm font-medium">{responseMode === "voice" ? "Voice" : "Text"}</span>
      </button>
    </div>
  );
}
