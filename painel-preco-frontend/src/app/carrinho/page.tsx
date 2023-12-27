// app/tabs/page.tsx
"use client";

import { Button, Card, CardBody, Divider, ScrollShadow, Skeleton } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { IRetornoPesquisaItensLicitacao } from "@/interfaces/types";
import FormTitle from "@/components/atoms/FormTitle";
import FormRow from "@/components/atoms/FormRow";
import { useAppSelector, useDispatch } from "@/redux/store";
import WallpaperIcon from "@/components/atoms/icons/WallpaperIcon";
import { useTheme } from "next-themes";
import CartRemoveIcon from "@/components/atoms/icons/CartRemoveIcon";
import { clear, remove } from "@/redux/features/cart-slice";

export interface IPropsCartPge {
}

const CartPage: React.FC<IPropsCartPge> = ({
  ...opts
}) => {

  const dispatch = useDispatch();

  const { theme, setTheme } = useTheme()
  const _cartList = useAppSelector((state) => state.cartReducer.value);
  const [cart, setCart] = useState<IRetornoPesquisaItensLicitacao[]>([]);

  const isLoading = false;

  useEffect(() => {
    setCart(_cartList);
  }, [_cartList]);

  const hastItens = () => {
    return cart != null && cart.length > 0;
  }

  const onClickRemoveCart = (item: IRetornoPesquisaItensLicitacao) => {
    dispatch(remove(item));
  }

  const clearCart = () => {
    dispatch(clear());
  }

  const selectItem = async (uuid : string) => {
    //TODO
  }

  return (
    <section className='py-4 flex items-center justify-center flex-col w-full'>
      <div className='container'>
        <Card>
          <CardBody>
          <div className='container flex flex-col items-start justify-start'>
            <FormTitle className='text-lg font-bold uppercase text-primary'>Carrinho de Cotações</FormTitle>
            <Divider className="my-4" />
            <FormRow className='flex flex-col items-start justify-start'>
              { isLoading && 
                <div className="max-w-[300px] w-full flex items-center gap-3">
                  <div className="w-full flex flex-col gap-2">
                    <Skeleton className="h-3 w-4/5 rounded-lg"/>
                    <Skeleton className="h-3 w-3/5 rounded-lg"/>
                    <Skeleton className="h-3 w-5/5 rounded-lg"/>
                    <Skeleton className="h-3 w-4/5 rounded-lg"/>
                  </div>
                </div>
              }
              { !hastItens() && !isLoading && 
                <div className='flex flex-col w-full items-start justify-start'>
                  <p>Sem resultados de buscas... Realize uma cotação rápida.</p>
                </div>
              }
              { hastItens() && !isLoading && 
                <div className='flex flex-col w-full items-start justify-start'>
                  <ScrollShadow className="h-[400px] w-full">
                  { cart?.map(i =>
                    <div key={i.uuid} className="flex-1 w-full flex-wrap md:flex-nowrap gap-4 py-2">
                      <Card className="bg-default-100/50 flex flex-row mx-4" shadow="sm">
                        <CardBody className="flex-row items-center justify-between">

                          <div className="flex gap-6 md:gap-4 items-center justify-center basis-1/12">
                            <div className="relative col-span-6 md:col-span-4">
                              <WallpaperIcon height={48} width={48}
                                classNamesArrPath={theme == 'light' ? ['stroke-gray-500'] : ['stroke-gray-400']}
                                ></WallpaperIcon>
                            </div>
                          </div>

                          <div className="flex flex-col basis-10/12">
                            <div className="flex justify-between items-start">
                              <div className="flex flex-col gap-0">
                                <h3 className="font-semibold text-foreground/90">{i.descricao}</h3>
                                <p className="text-small mt-1 text-foreground/80">
                                  Quantidade: {i.quantidade} {i.unidadeFornecimento.nome}
                                </p>
                                <p className="text-small mt-1 text-foreground/80">
                                  Data Compra: {i.licitacao.dataResultadoCompra}
                                </p>
                                <h1 className="text-small font-medium">Valor: {i.valor}</h1>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-row gap-3 basis-1/12 items-start justify-start">
                            <Button
                              isIconOnly
                              className="text-default-900/60"
                              radius="full"
                              color="danger"
                              variant="solid"
                              onPress={() => onClickRemoveCart(i) }
                            >
                              <CartRemoveIcon classNamesArrPath={['stroke-white fill-white']}></CartRemoveIcon>
                            </Button>
                          
                            {/* <Button
                              isIconOnly
                              className="text-default-900/60"
                              radius="full"
                              color="primary"
                              variant="solid"
                              onPress={() => selectItem(i.uuid) }
                            >
                              <ClipboardIcon classNamesArrPath={theme == 'light' ? ['stroke-gray-200'] : []}></ClipboardIcon>
                            </Button> */}
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  )}
                  </ScrollShadow>
                  <Divider className="my-4" />
                  <FormRow className="flex flex-row items-center justify-between px-2">
                    <div className="flex flex-col gap-2">
                      <p className="text-small text-default-500">Itens no Carrinho: {cart?.length}</p>
                    </div>
                    <div className="flex gap-4">
                      <Button color="danger" onClick={() => clearCart()}>
                        Limpar
                      </Button>
                      <Button color="primary" type="submit">
                        Pesquisar
                      </Button>
                    </div>
                  </FormRow>
                </div>
              }
            </FormRow>
          </div>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}

export default CartPage;