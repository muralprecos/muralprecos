"use client";

import { useState } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 border-t bg-white/50 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1 min-h-[44px] max-h-32 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem sobre licitações..."
            className="min-h-[44px] max-h-32 resize-none pr-12 py-3"
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 bottom-1 h-8 w-8"
            disabled={isLoading}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        </div>

        <Button
          type="submit"
          size="icon"
          className="h-11 w-11 transition-all duration-200"
          disabled={!message.trim() || isLoading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

      <p className="text-xs text-muted-foreground mt-2 px-1">
        Pressione Enter para enviar, Shift + Enter para quebrar linha
      </p>
    </div>
  );
};
