import { ReactNode, useRef } from "react";
import { ResizeHeightObserverProps, useResizeHeightObserver } from "./resizeble-use";

type ResizebleHeightProps = {
  children: ReactNode
  className?: string
} & Pick<ResizeHeightObserverProps, 'discount' | 'worksOn' | 'size'>;

export const ResizebleHeight = ({ children, discount, className, worksOn, size } : ResizebleHeightProps) => {

  const observedDiv = useRef<HTMLDivElement>(null);
  const height = useResizeHeightObserver({
    target: observedDiv,
    discount,
    worksOn,
    size
  });

  return (
    <div ref={observedDiv} className={className} style={{ maxHeight: `${height ? height+'px' : 'none'}`, overflowY: 'auto' }}>
      {children}
    </div>
  )
}