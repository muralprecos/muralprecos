"use client";

import type { ChatState, Message } from "@/components/chat/message-bubble";
import { useState, useCallback, useRef, useEffect } from "react";

export const useChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, scrollToBottom]);

  const addMessage = useCallback((message: Omit<Message, "id">) => {
    const newMessage: Message = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    return newMessage.id;
  }, []);

  const updateMessageStatus = useCallback(
    (messageId: string, status: Message["status"]) => {
      setState((prev) => ({
        ...prev,
        messages: prev.messages.map((msg) =>
          msg.id === messageId ? { ...msg, status } : msg
        ),
      }));
    },
    []
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userMessageId = addMessage({
        content: content.trim(),
        role: "user",
        timestamp: new Date(),
        status: "sent",
      });

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const assistantMessage = await simulateOpenAIResponse(content);

        addMessage({
          content: assistantMessage,
          role: "assistant",
          timestamp: new Date(),
          status: "sent",
        });
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: "Erro ao enviar mensagem. Tente novamente.",
        }));
        updateMessageStatus(userMessageId, "error");
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [addMessage, updateMessageStatus]
  );

  const clearChat = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearChat,
    messagesEndRef,
  };
};

const simulateOpenAIResponse = async (userMessage: string): Promise<string> => {
  const responses = [
    "Entendi sua solicitação sobre licitações. Como posso ajudá-lo especificamente com esse processo?",
    "Para questões relacionadas a licitações, é importante considerar todos os aspectos legais e regulamentares. Posso orientá-lo sobre os próximos passos.",
    "Com base na sua pergunta, sugiro que analisemos os critérios de habilitação e os documentos necessários para sua participação no processo licitatório.",
    "Vou ajudá-lo com essa questão sobre licitações. É fundamental seguir todos os procedimentos estabelecidos pela legislação vigente.",
    "Para melhor atendê-lo neste processo licitatório, preciso entender melhor sua situação específica. Pode me fornecer mais detalhes?",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};
