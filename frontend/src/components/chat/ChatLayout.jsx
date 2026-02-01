import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

export default function ChatLayout({ messages, isLoading, onSend }) {
  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white">
      <ChatHeader />
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput onSend={onSend} disabled={isLoading} />
    </div>
  );
}
