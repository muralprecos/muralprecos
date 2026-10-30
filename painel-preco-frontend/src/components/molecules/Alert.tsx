"use client";

import { useEffect, useState, useCallback } from "react";
import { useAnimate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface IAlertMessage {
  message: string;
  type?: "warning" | "danger" | "success" | "default";
  className?: string;
}

const menuVariants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};

export function AlertMessage({
  message,
  type = "default",
  className = "",
}: IAlertMessage) {
  const [scopeAnimate, animate] = useAnimate();
  const [isHidden, setIsHidden] = useState(true);

  const hide = useCallback(async () => {
    await animate(scopeAnimate.current, menuVariants.closed, {
      duration: 0.25,
    });
    setIsHidden(true);
  }, [animate, scopeAnimate]);

  const show = useCallback(() => {
    setIsHidden(false);
    animate(scopeAnimate.current, menuVariants.open, { duration: 0.25 });
  }, [animate, scopeAnimate]);

  useEffect(() => {
    if (message) {
      show();
    } else {
      hide();
    }
  }, [message, show, hide]);

  return (
    <div ref={scopeAnimate} className="w-full flex">
      {!isHidden && (
        <Alert className={`flex justify-between items-center ${className}`}>
          <AlertDescription>{message}</AlertDescription>
          <Button variant="ghost" onClick={hide}>
            X
          </Button>
        </Alert>
      )}
    </div>
  );
}
