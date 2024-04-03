
import Icon, { IconPropsChild } from "../Icon"

const EyeIcon: React.FC<IconPropsChild> = ({
  isCursorPointer = false,
  ...opts
}) => {
  return (
    <Icon file="icons/eye-svgrepo-com.svg" isCursorPointer={isCursorPointer} {...opts} />
  )
}
export default EyeIcon