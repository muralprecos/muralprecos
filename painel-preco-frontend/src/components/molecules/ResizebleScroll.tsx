'use client'

import { ScrollShadow } from "@nextui-org/react";
import { ResizebleHeight } from "../atoms/resizeble/ResizebleHeight";
import { Size, WorksOn } from "../atoms/resizeble/resizeble-use";

export interface IResizebleScroll {
  children: React.ReactNode
  discount?: number
  isLoading?: boolean
  worksOn?: WorksOn
  size?: Size
}

function ResizebleScroll({
  children,
  discount = 350,
  isLoading = false,
  worksOn = 'bigger',
  size = 'sm',
  ...opts
} : IResizebleScroll) {

  return (
    <ResizebleHeight className="w-full md:min-h-60 min-h-full" discount={discount} worksOn={worksOn} size={size}>
      <ScrollShadow className={`w-full h-full ${isLoading ? 'opacity-30': ''}`} >
        {children}
      </ScrollShadow>
    </ResizebleHeight>
  )
}

export default ResizebleScroll;