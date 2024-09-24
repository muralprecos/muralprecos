
import Icon, { IconPropsChild } from "../Icon"

const DoubleAltArrowUpIcon: React.FC<IconPropsChild> = ({
  isCursorPointer = false,
  ...opts
}) => {
  return (
    <Icon file="icons/double-alt-arrow-up.svg" isCursorPointer={isCursorPointer} {...opts} />
  )
}
export default DoubleAltArrowUpIcon;