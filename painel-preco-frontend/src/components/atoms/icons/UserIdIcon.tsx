
import Icon, { IconProps } from "../Icon"

const UserIdIcon: React.FC<Omit<IconProps, "file"|"color">> = ({
  classNamesArrSvg,
  classNamesArrPath,
  isCursorPointer = false,
  ...opts
}) => {
  return (
    <Icon file="icons/user-id-svgrepo-com.svg" isCursorPointer={isCursorPointer} classNamesArrSvg={classNamesArrSvg} classNamesArrPath={classNamesArrPath} {...opts} />
  )
}
export default UserIdIcon