
import Icon, { IconPropsChild } from "../Icon"

const CartRemoveIcon: React.FC<IconPropsChild> = ({
  isCursorPointer = false,
  ...opts
}) => {
  return (
    <Icon file="icons/cart-cross-svgrepo-com.svg" isCursorPointer={isCursorPointer} {...opts} />
  )
}
export default CartRemoveIcon