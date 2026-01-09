"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface IProp {
  title: string;
  description: string;
  actionYes: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export function ModalConfirm({
  title,
  description,
  actionYes,
  open,
  onOpenChange,
  className = "w-full",
}: IProp) {
  const handleConfirm = () => {
    actionYes();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
