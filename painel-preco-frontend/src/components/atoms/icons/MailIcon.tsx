
import Icon, { IconProps } from "../Icon"

const MailIcon: React.FC<Omit<IconProps, "file"|"color">> = ({
  classNamesArrSvg,
  classNamesArrPath,
  isCursorPointer = false,
  ...opts
}) => {
  return (
    <Icon file="icons/letter-svgrepo-com.svg" isCursorPointer={isCursorPointer} classNamesArrSvg={classNamesArrSvg} classNamesArrPath={classNamesArrPath} {...opts} />
  )
}
export default MailIcon