"use client";

import Icon, { IconPropsChild } from "../Icon"

const ShieldIcon: React.FC<IconPropsChild & { isOk: boolean }> = ({
  isCursorPointer = false,
  isOk = false,
  width = 98,
  height = 98,
  ...opts
}) => {

  const file = isOk ? "icons/shield-ok-svgrepo-com.svg" : "icons/shield-error-svgrepo-com.svg";
  
  return (
    <Icon file={file} isCursorPointer={isCursorPointer} width={width} height={height} {...opts} />
  )
}
export default ShieldIcon