"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X, Maximize, Minimize, Bot, User, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatWindowProps {
  onClose: () => void;
}

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "system",
      content:
        "Você é um assistente especializado em cotação de preços. Ajude os usuários com questões relacionadas a preços, produtos e comparação de custos de forma útil e profissional.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const canSendMessage = (): boolean => {
    return input.trim() !== "" && !loading;
  };

  const getUserMessages = () => {
    return messages.filter((msg) => msg.role !== "system");
  };

  const handleSend = async () => {
    if (!canSendMessage()) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    try {
      const userMessageObj = { role: "user" as const, content: userMessage };
      const updatedMessages = [...messages, userMessageObj];
      setMessages(updatedMessages);
      setTimeout(() => scrollDown(), 100);

      const response = await fetch("/api/ia/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.filter((msg) => msg.role !== "system"),
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);

      setTimeout(() => scrollDown(), 100);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Desculpe, ocorreu um erro. Verifique sua conexão e tente novamente.",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };
  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  const scrollDown = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200);
  }, []);

  const visibleMessages = getUserMessages();

  return (
    <div
      className={`fixed z-50 shadow-2xl border border-border rounded-lg bg-background transition-all duration-300 ${
        isFullScreen ? "inset-4" : "bottom-20 right-4"
      }`}
      style={
        !isFullScreen
          ? {
              width: "28rem",
              maxWidth: "90vw",
              height: "32rem",
              maxHeight: "80vh",
            }
          : {}
      }
    >
      <Card className="h-full flex flex-col border-0 shadow-none">
        <div className="flex justify-between items-center px-4 py-3 border-b border-border bg-muted/30 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="font-semibold text-sm text-foreground">
                Assistente IA
              </span>
              <p className="text-xs text-muted-foreground">
                Especialista em Cotações
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullScreen}
              className="h-8 w-8 p-0 hover:bg-muted transition-colors"
            >
              {isFullScreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CardContent className="flex flex-col flex-grow p-0 overflow-hidden">
          <ScrollArea className="flex-grow px-4">
            <div className="py-4 space-y-4">
              {visibleMessages.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center h-40 text-center space-y-3">
                  <div className="p-4 bg-primary/5 rounded-full">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Olá! Sou seu assistente de IA
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Como posso ajudá-lo com suas cotações hoje?
                    </p>
                  </div>
                </div>
              )}

              {visibleMessages.map((msg, idx) => (
                <div key={idx} className="space-y-2">
                  {msg.role === "assistant" && (
                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1 max-w-[85%]">
                        <div className="bg-muted/50 rounded-lg px-4 py-3">
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown
                              components={{
                                code({ className, children, ...props }) {
                                  return (
                                    <code
                                      className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono"
                                      {...props}
                                    >
                                      {children}
                                    </code>
                                  );
                                },
                                pre({ children }) {
                                  return (
                                    <pre className="bg-muted p-3 rounded-md overflow-x-auto text-xs">
                                      {children}
                                    </pre>
                                  );
                                },
                                p({ children }) {
                                  return (
                                    <p className="text-sm leading-relaxed mb-2 last:mb-0">
                                      {children}
                                    </p>
                                  );
                                },
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {msg.role === "user" && (
                    <div className="flex gap-3 items-start justify-end">
                      <div className="max-w-[85%]">
                        <div className="bg-primary text-primary-foreground rounded-lg px-4 py-3">
                          <p className="text-sm leading-relaxed">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  )}

                  {idx < visibleMessages.length - 1 && (
                    <Separator className="my-3 opacity-50" />
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary animate-pulse" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="bg-muted/50 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={scrollRef} />
          </ScrollArea>

          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem..."
                className="flex-1"
                disabled={loading}
              />
              <Button
                onClick={handleSend}
                disabled={!canSendMessage()}
                size="icon"
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
