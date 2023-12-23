
import Icon, { IconProps } from "../Icon"

const EyeIcon: React.FC<Omit<IconProps, "file"|"color">> = ({
  classNamesArrSvg,
  classNamesArrPath,
  wrapper = 'div',
  isCursorPointer = true
}) => {
  return (
    <Icon file="icons/eye-svgrepo-com.svg" isCursorPointer={false} classNamesArrSvg={classNamesArrSvg} classNamesArrPath={classNamesArrPath} />
  )
}
export default EyeIcon