import { cn } from "@/lib/utils";
import { Bot, User, AlertCircle, Check, Clock } from "lucide-react";
export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  status?: "sending" | "sent" | "error";
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 mb-4 animate-in slide-in-from-bottom-2 duration-300",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 mt-1",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div
        className={cn("max-w-[70%] sm:max-w-[80%]", isUser ? "ml-12" : "mr-12")}
      >
        <div
          className={cn(
            "px-4 py-3 rounded-2xl shadow-sm",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-card border rounded-bl-md text-card-foreground"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>

        <div
          className={cn(
            "flex items-center gap-2 mt-1 px-1",
            isUser ? "justify-end" : "justify-start"
          )}
        >
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {isUser && message.status && (
            <div className="flex items-center">
              {message.status === "sending" && (
                <Clock className="w-3 h-3 text-muted-foreground" />
              )}
              {message.status === "sent" && (
                <Check className="w-3 h-3 text-green-500" />
              )}
              {message.status === "error" && (
                <AlertCircle className="w-3 h-3 text-destructive" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
