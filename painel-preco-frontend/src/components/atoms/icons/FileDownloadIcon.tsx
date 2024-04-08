
import Icon, { IconPropsChild } from "../Icon"

const FileDownloadIcon: React.FC<IconPropsChild> = ({
  isCursorPointer = false,
  ...opts
}) => {
  return (
    <Icon file="icons/file-download-svgrepo-com.svg" isCursorPointer={isCursorPointer} {...opts} />
  )
}
export default FileDownloadIcon