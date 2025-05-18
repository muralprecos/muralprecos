// components/FloatingButton.tsx
"use client";

import { Button } from "@nextui-org/react";
import { BotMessageSquare } from "lucide-react";

export default function FloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <Button className="shadow-lg" isIconOnly color="primary" radius="full" size="lg" onClick={onClick}>
        <BotMessageSquare />
      </Button>
    </div>
  );
}
