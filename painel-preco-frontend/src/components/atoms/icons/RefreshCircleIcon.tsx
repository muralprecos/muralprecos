
import Icon, { IconPropsChild } from "../Icon"

const RefreshCircleIcon: React.FC<IconPropsChild> = ({
  isCursorPointer = false,
  ...opts
}) => {
  return (
    <Icon file="icons/refresh-circle-svgrepo-com.svg" isCursorPointer={isCursorPointer} {...opts} />
  )
}
export default RefreshCircleIcon