import Icon, { IconProps } from "../Icon"

const LoadingCircleIcon: React.FC<Omit<IconProps, "file"|"color"> & { color?: 'string' }> = ({
  color = 'purple',
  isCursorPointer = false,
  ...opts
}) => {
  return (
    <Icon file="icons/loading-circle.svg" isCursorPointer={isCursorPointer} classNamesArrSvg={['animate-spin -ml-1 mx-1 h-5 w-5']} classNamesArrCircle={[`stroke-${color}-200`]} classNamesArrPath={[`fill-${color}-700`]} {...opts} />
  )
}
export default LoadingCircleIcon