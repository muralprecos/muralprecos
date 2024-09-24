'use client'

import { useEffect, useState } from 'react'

import { Button } from '@nextui-org/react'
import { useAppSelector, useDispatch } from '@/redux/store'
import { IRetornoPesquisaItensLicitacao } from '@/interfaces/types'
import { add, remove } from '@/redux/features/cart-slice'
import CartPlusIcon from '../atoms/icons/CartPlusIcon'
import CartRemoveIcon from '../atoms/icons/CartRemoveIcon'
import { useSession } from 'next-auth/react'
import { getUserCart, getUserCartBySession, getUsernameBySession } from '@/utils/cartUtils'

type CartButtonProps = {
  itemRetornoLicitacao?: IRetornoPesquisaItensLicitacao | null
  isCompact?: boolean
}

const CartButton: React.FC<CartButtonProps> = ({
  itemRetornoLicitacao,
  isCompact = false
}) => {
  const [mounted, setMounted] = useState(false);

  const session = useSession();
  const dispatch = useDispatch();

  const _cartList = useAppSelector((state) => state.cartReducer);
  const [cart, setCart] = useState<IRetornoPesquisaItensLicitacao[]>([]);

  
  useEffect(() => {
    setCart(getUserCart(_cartList, getUsername()));
  }, [_cartList]);

  
  useEffect(() => {
    setMounted(true)
  }, []);

  const getUsername = () => {
    return session.data?.userInfo?.preferred_username
  }

  const isOnCar = (item: IRetornoPesquisaItensLicitacao) => {
    return cart.filter((el) => el.uuid == item.uuid).length > 0;
  }

  const onClickAddCart = (item: IRetornoPesquisaItensLicitacao) => {
    dispatch(add({
      item,
      user: getUsername()
    }));
  }

  const onClickRemoveCart = (item: IRetornoPesquisaItensLicitacao) => {
    dispatch(remove({
      item,
      user: getUsername()
    }));
  }

  if (!mounted || !itemRetornoLicitacao) return null;

  if (!session || session.status != 'authenticated' || getUsername() == null) {
    return <p>Autentique-se novamente</p>;
  }

  return (
    <div className="flex-1">
      { !isOnCar(itemRetornoLicitacao) ? 
        <Button
          className={`${isCompact ? '': 'w-full'}`}
          color="primary"
          variant="solid"
          radius={isCompact ? 'full' : 'sm'}
          isIconOnly={isCompact}
          onPress={() => onClickAddCart(itemRetornoLicitacao) }
        >
          <CartPlusIcon classNamesArrPath={['stroke-white fill-white']}></CartPlusIcon>
          { !isCompact && 
            <span>Adicionar ao Carrinho</span>
          }
        </Button>
      : 
        <Button
          className={`text-default-900/90  ${isCompact ? '': 'w-full'}`}
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