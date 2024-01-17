
import Icon, { IconProps } from "../Icon"

const WallpaperIcon: React.FC<Omit<IconProps, "file"|"color">> = ({
  classNamesArrSvg,
  classNamesArrPath,
  isCursorPointer = false,
  ...opts
}) => {
  return (
    <Icon file="icons/wallpaper-svgrepo-com.svg" isCursorPointer={isCursorPointer} classNamesArrSvg={classNamesArrSvg} classNamesArrPath={classNamesArrPath} {...opts} />
  )
}
export default WallpaperIcon