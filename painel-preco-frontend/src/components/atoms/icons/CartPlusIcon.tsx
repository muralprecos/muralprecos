
import Icon, { IconPropsChild } from "../Icon"

const CartPlusIcon: React.FC<IconPropsChild> = ({
  isCursorPointer = false,
  ...opts
}) => {
  return (
    <Icon file="icons/cart-plus-svgrepo-com.svg" isCursorPointer={isCursorPointer} {...opts} />
  )
}
export default CartPlusIcon