
import Icon, { IconPropsChild } from "../Icon"

const CartIcon: React.FC<IconPropsChild> = ({
  isCursorPointer = false,
  ...opts
}) => {
  return (
    <Icon file="icons/cart-large-svgrepo-com.svg" isCursorPointer={isCursorPointer} {...opts} />
  )
}
export default CartIcon