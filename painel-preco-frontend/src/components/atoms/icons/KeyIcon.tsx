
import Icon, { IconProps } from "../Icon"

const KeyIcon: React.FC<Omit<IconProps, "file"|"color">> = ({
  classNamesArrSvg,
  classNamesArrPath,
  isCursorPointer = false,
  ...opts
}) => {
  return (
    <Icon file="icons/key-svgrepo-com.svg" isCursorPointer={isCursorPointer} classNamesArrSvg={classNamesArrSvg} classNamesArrPath={classNamesArrPath} {...opts} />
  )
}
export default KeyIcon