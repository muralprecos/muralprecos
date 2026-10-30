"use client";

import { useState } from "react";
import FloatingButton from "../molecules/FloatingButton";
import ChatWindow from "../chat/ChatWindow";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <FloatingButton
        onClick={() => (isOpen ? setIsOpen(false) : setIsOpen(true))}
      />
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
