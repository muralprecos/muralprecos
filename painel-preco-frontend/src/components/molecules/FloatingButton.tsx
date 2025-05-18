// components/FloatingButton.tsx
"use client";

import { Button } from "@nextui-org/react";
import { BotMessageSquare } from "lucide-react";

export default function FloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button isIconOnly color="primary" radius="full" size="lg" onClick={onClick}>
        <BotMessageSquare />
      </Button>
    </div>
  );
}
