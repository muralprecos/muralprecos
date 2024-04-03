
import Icon, { IconPropsChild } from "../Icon"

const DocumentIcon: React.FC<IconPropsChild> = ({
  isCursorPointer = false,
  ...opts
}) => {
  return (
    <Icon file="icons/document-1-svgrepo-com.svg" isCursorPointer={isCursorPointer} {...opts} />
  )
}
export default DocumentIcon