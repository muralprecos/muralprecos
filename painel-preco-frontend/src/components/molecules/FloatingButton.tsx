"use client";

import { BotMessageSquare } from "lucide-react";
import { Button } from "../ui/button";

export default function FloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <Button
        className="shadow-lg rounded-full"
        color="primary"
        size="icon"
        onClick={onClick}
      >
        <BotMessageSquare />
      </Button>
    </div>
  );
}
