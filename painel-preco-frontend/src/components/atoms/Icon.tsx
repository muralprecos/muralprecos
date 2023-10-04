
import React from 'react'
import classNames from "classnames";

import { ReactSVG } from 'react-svg'


export type IconProps = {
  file: string,
  color?: string,
  wrapper?: 'span' | 'div',
  className?: string
  isCursorPointer?: boolean
} & React.AllHTMLAttributes<HTMLElement>

const Icon: React.FC<IconProps> = ({
  file,
  color,
  className,
  wrapper = 'div',
  isCursorPointer = true
}) => {
  if (wrapper == 'span') {
    return  <span className={classNames({
                    'cursor-pointer': isCursorPointer
                  })}>
              <ReactSVG src={file} wrapper={wrapper} className={className} />
            </span>
  } else {
    return  <div className={classNames({
                    'cursor-pointer': isCursorPointer
                  })}>
              <ReactSVG src={file} wrapper={wrapper} className={className} />
            </div>
  }
}


export default Icon