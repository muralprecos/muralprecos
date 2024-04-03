
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
  classNamesArrCircle?: string[]
  isCursorPointer?: boolean
  width?: number
  height?: number
} & React.AllHTMLAttributes<HTMLElement>

export type IconPropsChild = Omit<IconProps, "file"|"color">;

const Icon: React.FC<IconProps> = ({
  file,
  color,
  className,
  width = 24,
  height = 24,
  classNamesArrSvg,
  classNamesArrPath,
  classNamesArrCircle,
  wrapper = 'div',
  isCursorPointer = true,
  ...opts
}) => {

  const strClassNameSvg = classNamesArrSvg?.length ? classNamesArrSvg.join(' ') : '';
  const strClassNamePaths = classNamesArrPath?.length ? classNamesArrPath.join(' ') : '';
  const strClassNameCircle = classNamesArrCircle?.length ? classNamesArrCircle.join(' ') : '';

  const content = (
    <Fragment>
      <ReactSVG src={`/${file}`} wrapper={wrapper} className={className} beforeInjection={(svg) => {
          svg.setAttribute('width', width.toString());
          svg.setAttribute('height', height.toString());

          if (strClassNameSvg != '') {
            strClassNameSvg.split(' ').forEach((s) => {
              svg.classList.add(s);
            })
          }

          if (strClassNamePaths != '') {
            svg.querySelectorAll('path').forEach(path => {
              strClassNamePaths.split(' ').forEach((s) => {
                path.classList.add(s);
              });
            });
          }

          if (strClassNameCircle != '') {
            svg.querySelectorAll('circle').forEach(circ => {
              strClassNameCircle.split(' ').forEach((s) => {
                circ.classList.add(s);
              });
            });
          }
        }}
        useRequestCache={true} />
    </Fragment>
  );

  return  wrapper == 'span' ? 
            <span className={classNames({
                'cursor-pointer': isCursorPointer
              })} {...opts}>
              { content }
            </span> :
            <div className={classNames({
                'cursor-pointer': isCursorPointer
              })} {...opts}>
              { content }
            </div>
}


export default Icon