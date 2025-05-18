// components/ChatWidget.tsx
"use client";

import { useState } from "react";
import FloatingButton from "../molecules/FloatingButton";
import ChatWindow from "../molecules/ChatWindow";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <FloatingButton onClick={() => isOpen ? setIsOpen(false) : setIsOpen(true)} />
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
    </>
  );
}
