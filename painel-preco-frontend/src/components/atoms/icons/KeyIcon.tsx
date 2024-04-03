
import Icon, { IconPropsChild } from "../Icon"

const KeyIcon: React.FC<IconPropsChild> = ({
  isCursorPointer = false,
  ...opts
}) => {
  return (
    <Icon file="icons/key-svgrepo-com.svg" isCursorPointer={isCursorPointer} {...opts} />
  )
}
export default KeyIcon