'use client'

import { Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useAnimate } from "framer-motion";

export interface IAlertMessage {
  message: string
  type: 'warning' | 'danger' | 'success' | 'default'
}

function Alert({
  message,
  type = 'default',
  ...opts
} : IAlertMessage) {

  const [scopeAnimate, animate] = useAnimate();
  const [isHide, setIsHide] = useState<boolean>(true);
  const menuVariants = {
    open: {
      opacity: 1,
      // maxHeight: 100
    },
    closed: {
      opacity: 0,
      // maxHeight: 0
    },
  }

  useEffect(() => {
    if (message) {
      show();
    } else {
      hide();
    }
  }, [message]);

  const hide = async () => {
    await animate(scopeAnimate.current, menuVariants.closed, { duration: 0.25 });
    setIsHide(true);
  }

  const show = () => {
    setIsHide(false);
    animate(scopeAnimate.current, menuVariants.open, { duration: 0.25 });
  }

  return (
    <div ref={scopeAnimate} className="w-full box-content flex">
    { !isHide &&
      <div className={`w-full flex items-center justify-between gap-3 bg-${type} text-${type}-foreground py-2 px-4 rounded my-2 mx-4`}>
        {message}
        <Button variant="light" className={`text-${type}-foreground`} isIconOnly={true} onPress={hide}>X</Button>
      </div>
    }
    </div>
  )
}

export default Alert;