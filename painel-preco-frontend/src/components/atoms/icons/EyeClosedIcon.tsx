
import Icon, { IconPropsChild } from "../Icon"

const EyeClosedIcon: React.FC<IconPropsChild> = ({
  isCursorPointer = false,
  ...opts
}) => {
  return (
    <Icon file="icons/eye-closed-svgrepo-com.svg" isCursorPointer={isCursorPointer} {...opts} />
  )
}
export default EyeClosedIcon