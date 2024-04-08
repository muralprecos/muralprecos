
import Icon, { IconPropsChild } from "../Icon"

const UserIdIcon: React.FC<IconPropsChild> = ({
  isCursorPointer = false,
  ...opts
}) => {
  return (
    <Icon file="icons/user-id-svgrepo-com.svg" isCursorPointer={isCursorPointer} {...opts} />
  )
}
export default UserIdIcon