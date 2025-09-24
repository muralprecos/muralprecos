import { useChat } from "@/hooks/use-chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ChatHeader } from "./chat-header";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-Indicator";
import { EmptyState } from "./empty-state";
import { ChatInput } from "./chat-input";

export const ChatContainer = () => {
  const { messages, isLoading, error, sendMessage, clearChat, messagesEndRef } =
    useChat();

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gradient-to-br from-blue-50 via-background to-green-50 dark:from-slate-900 dark:via-background dark:to-slate-800">
      <ChatHeader onClearChat={clearChat} />

      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 px-4">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="py-4 space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {isLoading && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {error && (
          <div className="px-4 pb-2">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};
