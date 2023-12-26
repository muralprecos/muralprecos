
import React, { Fragment } from 'react'
import classNames from "classnames";

import { ReactSVG } from 'react-svg'


export type IconProps = {
  file: string,
  color?: string,
  wrapper?: 'span' | 'div'
  className?: string
  classNamesArrSvg?: string[]
  classNamesArrPath?: string[]
  isCursorPointer?: boolean
  width?: number
  height?: number
} & React.AllHTMLAttributes<HTMLElement>

const Icon: React.FC<IconProps> = ({
  file,
  color,
  className,
  width = 24,
  height = 24,
  classNamesArrSvg,
  classNamesArrPath,
  wrapper = 'div',
  isCursorPointer = true
}) => {

  const strClassNameSvg = classNamesArrSvg?.length ? classNamesArrSvg.join(' ') : '';
  const strClassNamePaths = classNamesArrPath?.length ? classNamesArrPath.join(' ') : '';

  const content = (
    <Fragment>
      <ReactSVG src={file} wrapper={wrapper} className={className} beforeInjection={(svg) => {
          svg.setAttribute('width', width.toString());
          svg.setAttribute('height', height.toString());

          if (strClassNameSvg != '') {
            strClassNameSvg.split(' ').forEach((s) => {
              svg.classList.add(s);
            })
          }

          if (strClassNamePaths != '') {
            const paths = svg.querySelectorAll('path');
            const circles = svg.querySelectorAll('circle');
            strClassNamePaths.split(' ').forEach((s) => {
              paths.forEach(path => {
                path.classList.add(s);
              })
              circles.forEach(path => {
                path.classList.add(s);
              })
            })
          }
        }} />
    </Fragment>
  );

  return  wrapper == 'span' ? 
            <span className={classNames({
                'cursor-pointer': isCursorPointer
              })}>
              { content }
            </span> :
            <div className={classNames({
                'cursor-pointer': isCursorPointer
              })}>
              { content }
            </div>
}


export default Icon