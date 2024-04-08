
import Icon, { IconPropsChild } from "../Icon"

const ClipboardIcon: React.FC<IconPropsChild> = ({
  isCursorPointer = false,
  ...opts
}) => {
  return (
    <Icon file="icons/clipboard-list-svgrepo-com.svg" isCursorPointer={isCursorPointer} {...opts} />
  )
}
export default ClipboardIcon