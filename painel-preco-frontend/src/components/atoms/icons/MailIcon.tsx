
import Icon, { IconPropsChild } from "../Icon"

const MailIcon: React.FC<IconPropsChild> = ({
  isCursorPointer = false,
  ...opts
}) => {
  return (
    <Icon file="icons/letter-svgrepo-com.svg" isCursorPointer={isCursorPointer} {...opts} />
  )
}
export default MailIcon