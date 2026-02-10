import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import VoiceMode from "./VoiceMode";

export default function ChatLayout({ messages, isLoading, onSend, responseMode, onResponseModeChange, autoStartListening }) {
  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white">
      <ChatHeader responseMode={responseMode} onResponseModeChange={onResponseModeChange} />
      {responseMode === "voice" ? (
        <VoiceMode messages={messages} onSend={onSend} />
      ) : (
        <>
          <ChatMessages messages={messages} isLoading={isLoading} />
          <ChatInput onSend={onSend} disabled={isLoading} responseMode={responseMode} autoStart={autoStartListening} />
        </>
      )}
    </div>
  );
}
