'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

import { Button } from '@nextui-org/react'
import { useAppSelector, useDispatch } from '@/redux/store'
import { IRetornoPesquisaItensLicitacao } from '@/interfaces/types'
import { add, remove } from '@/redux/features/cart-slice'
import CartPlusIcon from '../atoms/icons/CartPlusIcon'
import CartRemoveIcon from '../atoms/icons/CartRemoveIcon'

type CartButtonProps = {
  itemRetornoLicitacao?: IRetornoPesquisaItensLicitacao | null
  isCompact?: boolean
}

const CartButton: React.FC<CartButtonProps> = ({
  itemRetornoLicitacao,
  isCompact = false
}) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const dispatch = useDispatch();
  const _cartList = useAppSelector((state) => state.cartReducer.value);

  const [cart, setCart] = useState<IRetornoPesquisaItensLicitacao[]>([]);

  useEffect(() => {
    setCart(_cartList);
  }, [_cartList]);

  
  useEffect(() => {
    setMounted(true)
  }, [])

  const isOnCar = (item: IRetornoPesquisaItensLicitacao) => {
    return cart.filter((el) => el.uuid == item.uuid).length > 0;
  }

  const onClickAddCart = (item: IRetornoPesquisaItensLicitacao) => {
    dispatch(add(item));
  }

  const onClickRemoveCart = (item: IRetornoPesquisaItensLicitacao) => {
    dispatch(remove(item));
  }

  if (!mounted || !itemRetornoLicitacao) return null;

  return (
    <div className="flex-1">
      { !isOnCar(itemRetornoLicitacao) ? 
        <Button
          className="w-full"
          color="primary"
          variant="solid"
          radius={isCompact ? 'full' : 'sm'}
          isIconOnly={isCompact}
          onPress={() => onClickAddCart(itemRetornoLicitacao) }
        >
          <CartPlusIcon classNamesArrPath={theme == 'light' ? ['stroke-white fill-white'] : []}></CartPlusIcon>
          { !isCompact && 
            <span>Adicionar ao Carrinho</span>
          }
        </Button>
      : 
        <Button
          className="text-default-900/90  w-full"
          color="danger"
          variant="solid"
          radius={isCompact ? 'full' : 'sm'}
          isIconOnly={isCompact}
          onPress={() => onClickRemoveCart(itemRetornoLicitacao) }
        >
          <CartRemoveIcon classNamesArrPath={['stroke-white fill-white']}></CartRemoveIcon>
          { !isCompact && 
            <span className="text-white">Remover do Carrinho</span>
          }
        </Button>
      }
    </div>
  )
}

export default CartButton;