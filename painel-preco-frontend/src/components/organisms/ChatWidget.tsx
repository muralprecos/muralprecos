"use client";

import { useState } from "react";
import FloatingButton from "../molecules/FloatingButton";
import ChatWindow from "../molecules/ChatWindow";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Espaço extra só em mobile */}
      <div className="h-20 sm:h-0" />

      <FloatingButton
        onClick={() => (isOpen ? setIsOpen(false) : setIsOpen(true))}
      />
      {/* Overlay escuro */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 block sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
    </>
  );
}
