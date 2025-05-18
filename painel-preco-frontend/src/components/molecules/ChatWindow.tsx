"use client";

import {
  Card,
  CardBody,
  Input,
  Button,
  ScrollShadow,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { X, Maximize, Minimize, Bot, User } from "lucide-react";
import { IConversationIAHistory } from "@/interfaces/types";
import { apiClientConversationIA } from "@/hooks/apiclient";
import SkeletonAnimated from "./SkeletonAnimated";
import ReactMarkdown from "react-markdown";

interface ChatWindowProps {
  onClose: () => void;
}

enum RoleMessage {
  USER = "user",
  ASSISTANT =  "assistant",
  SYSTEM = "system"
};

export default function ChatWindow({ onClose }: ChatWindowProps) {

  const [messages, setMessages] = useState<IConversationIAHistory[]>([]);
  const [input, setInput] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const canSendMessage = () :boolean =>  {
    return input.trim() !== "";
  };

  const userMessage = (msg: IConversationIAHistory) => {
    return msg.role === RoleMessage.USER ? 'Você' :
      msg.role === RoleMessage.ASSISTANT ? 'Assistente' : 'Sistema';
  }

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
    return raw.replace(/^```(?:markdown)?\n/, '').replace(/\n```$/, '');
  }

  const scrollDown = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`fixed z-50 shadow-lg ${
        isFullScreen ? "inset-4" : "bottom-20 right-4"
      }`}
      style={!isFullScreen ? {
        width: "30rem",
        maxWidth: '92%'
      } : {}}
    >
      <Card className="h-full flex flex-col">
        {/* Barra superior */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-default-200 bg-default-100 rounded-t-large">
          <span className="font-semibold text-sm">
            MurAI de Preços
          </span>
          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onClick={toggleFullScreen}
            >
              {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              onClick={onClose}
            >
              <X size={16} />
            </Button>
          </div>
        </div>

        {/* Corpo do chat */}
        <CardBody className="flex flex-col gap-2 flex-grow" style={ !isFullScreen ? {
          minHeight: "300px",
          maxHeight: "400px",
        } : {}}>
          <ScrollShadow className="flex-grow w-full overflow-y-auto overflow-x-hidden pr-2">
            { messages.length === 0 && !loading && (
              <p className="text-sm py-2 text-default-400">
                Consulte nossa IA para auxiliar sua Cotação!
              </p>
            )}
            { messages.map((msg, idx) => (
              <div key={idx} className="text-sm py-2 border-b border-default-200">
                { msg.role === RoleMessage.ASSISTANT && (
                  <>
                    <Bot size={16} className="inline-block mr-1 text-primary" />
                    <span className="font-semibold mr-2 text-primary">{userMessage(msg)}:</span>
                    <ReactMarkdown
                      components={{
                        code({node, className, children, ...props}) {
                            return <code className={`${className} break-words whitespace-pre-wrap text-sm mb-2`} {...props}>
                              {children}
                            </code>
                          }
                      }}
                    >
                      { cleanMarkdown(msg.content) }
                    </ReactMarkdown>
                  </>
                ) }
                { msg.role === RoleMessage.USER &&  (
                  <>
                    <span className="font-semibold mr-2">{userMessage(msg)}:</span>
                    {msg.content}
                  </>
                )}
              </div>
            ))}
            { loading && (
              <SkeletonAnimated />
            )}
            <div ref={scrollRef} />
          </ScrollShadow>

          {/* Entrada de mensagem */}
          <div className="flex gap-2 mt-2">
            <Input
              ref={inputRef}
              value={input}
              onValueChange={setInput}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Digite sua mensagem..."
            />
            <Button onClick={handleSend} color="primary" isDisabled={loading || !canSendMessage()}>
              { loading ? "Analisando..." : "Enviar" }
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
