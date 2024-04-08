
import Icon, { IconPropsChild } from "../Icon"

const WallpaperIcon: React.FC<IconPropsChild> = ({
  isCursorPointer = false,
  ...opts
}) => {
  return (
    <Icon file="icons/wallpaper-svgrepo-com.svg" isCursorPointer={isCursorPointer} {...opts} />
  )
}
export default WallpaperIcon