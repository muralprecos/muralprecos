
import { useTheme } from "next-themes";
import { IconPropsChild } from "./Icon"

const IconTheme: React.FC<IconPropsChild & { IconElement: React.FC<IconPropsChild> }> = ({
  IconElement,
  ...opts
}) => {
  const { theme, setTheme } = useTheme();

  return (
    <IconElement 
      classNamesArrCircle={theme == 'light' ? ['stroke-gray-500'] : ['stroke-gray-400']}
      classNamesArrPath={theme == 'light' ? ['stroke-gray-500'] : ['stroke-gray-400']}
      {...opts}/>
  )
}
export default IconTheme