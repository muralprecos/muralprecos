"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState } from "react";
import { X, Maximize, Minimize, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { apiClientConversationIA } from "@/hooks/apiclient";

interface IConversationIAHistory {
  role: string;
  content: string;
}

interface ChatWindowProps {
  onClose: () => void;
}

enum RoleMessage {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<IConversationIAHistory[]>([]);
  const [input, setInput] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const canSendMessage = (): boolean => {
    return input.trim() !== "";
  };

  const userMessage = (msg: IConversationIAHistory) => {
    return msg.role === RoleMessage.USER
      ? "Você"
      : msg.role === RoleMessage.ASSISTANT
      ? "Assistente"
      : "Sistema";
  };

  const handleSend = async () => {
    if (!canSendMessage()) return;
    setLoading(true);

    try {
      messages.push({ role: RoleMessage.USER, content: input });
      setMessages(messages);
      setInput("");
      setTimeout(() => {
        scrollDown();
      }, 500);

      const response = await apiClientConversationIA(messages);
      const resposta = response.data;

      messages.push({ role: RoleMessage.ASSISTANT, content: resposta });
      setMessages(messages);

      setTimeout(() => {
        scrollDown();
      }, 500);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

    // Foca no campo após envio
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  const cleanMarkdown = (raw: string): string => {
    return raw.replace(/^```(?:markdown)?\n/, "").replace(/\n```$/, "");
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

  return (
    <div
      className={`fixed z-50 shadow-2xl border border-border rounded-lg bg-background ${
        isFullScreen ? "inset-4" : "bottom-20 right-4"
      }`}
      style={
        !isFullScreen
          ? {
              width: "30rem",
              maxWidth: "92%",
            }
          : {}
      }
    >
      <Card className="h-full flex flex-col border-0 shadow-none">
        {/* Barra superior */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-border bg-muted/50 rounded-t-lg">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm text-foreground">
              MurAI de Preços
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullScreen}
              className="h-8 w-8 p-0 hover:bg-muted"
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
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Corpo do chat */}
        <CardContent
          className="flex flex-col gap-0 flex-grow p-0"
          style={
            !isFullScreen
              ? {
                  minHeight: "300px",
                  maxHeight: "400px",
                }
              : {}
          }
        >
          <ScrollArea
            className="flex-grow w-full px-4"
            style={{ height: isFullScreen ? "calc(100vh - 200px)" : "350px" }}
          >
            <div className="py-4 space-y-4">
              {messages.length === 0 && !loading && (
                <div className="flex items-center justify-center h-32">
                  <p className="text-sm text-muted-foreground text-center">
                    Consulte nossa IA para auxiliar sua Cotação!
                  </p>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={idx} className="space-y-2">
                  {msg.role === RoleMessage.ASSISTANT && (
                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-primary">
                            {userMessage(msg)}
                          </span>
                        </div>
                        <div className="prose prose-sm max-w-none text-foreground">
                          <ReactMarkdown
                            components={{
                              code({ className, children, ...props }) {
                                return (
                                  <code
                                    className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono break-words"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              },
                              pre({ children }) {
                                return (
                                  <pre className="bg-muted p-3 rounded-md overflow-x-auto text-sm">
                                    {children}
                                  </pre>
                                );
                              },
                              p({ children }) {
                                return (
                                  <p className="text-sm leading-relaxed">
                                    {children}
                                  </p>
                                );
                              },
                            }}
                          >
                            {cleanMarkdown(msg.content)}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}

                  {msg.role === RoleMessage.USER && (
                    <div className="flex gap-3 items-start justify-end">
                      <div className="max-w-[80%]">
                        <div className="text-primary bg-foreground/10 rounded-lg px-4 py-2">
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  )}

                  {idx < messages.length - 1 && <Separator className="my-4" />}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary animate-pulse" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-primary">
                        Assistente
                      </span>
                    </div>
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
              )}
            </div>
            <div ref={scrollRef} />
          </ScrollArea>

          {/* Entrada de mensagem */}
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
                disabled={loading || !canSendMessage()}
                className="px-6"
              >
                {loading ? "Analisando..." : "Enviar"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
