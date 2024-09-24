
import Icon, { IconPropsChild } from "../Icon"

const DoubleAltArrowDownIcon: React.FC<IconPropsChild> = ({
  isCursorPointer = false,
  ...opts
}) => {
  return (
    <Icon file="icons/double-alt-arrow-down.svg" isCursorPointer={isCursorPointer} {...opts} />
  )
}
export default DoubleAltArrowDownIcon;