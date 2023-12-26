
import Icon, { IconProps } from "../Icon"

const DocumentIcon: React.FC<Omit<IconProps, "file"|"color">> = ({
  classNamesArrSvg,
  classNamesArrPath,
  isCursorPointer = false,
  ...opts
}) => {
  return (
    <Icon file="icons/document-1-svgrepo-com.svg" isCursorPointer={isCursorPointer} classNamesArrSvg={classNamesArrSvg} classNamesArrPath={classNamesArrPath} {...opts} />
  )
}
export default DocumentIcon