// app/tabs/page.tsx
"use client";

import { Button, Card, CardBody, Divider, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { IRetornoPesquisaItensLicitacao } from "@/interfaces/types";
import FormTitle from "@/components/atoms/FormTitle";
import FormRow from "@/components/atoms/FormRow";
import { useAppSelector, useDispatch } from "@/redux/store";
import WallpaperIcon from "@/components/atoms/icons/WallpaperIcon";
import { useTheme } from "next-themes";
import CartRemoveIcon from "@/components/atoms/icons/CartRemoveIcon";
import { clear, remove } from "@/redux/features/cart-slice";
import LoadingList from "@/components/molecules/LoadingList";
import ClipboardIcon from "@/components/atoms/icons/ClipboardIcon";
import Link from "next/link";
import ModalConfirm from "@/components/molecules/ModalConfirm";
import { postDownloadItensCotacoes } from "@/hooks/api";
import { DATE_PATTERN, convertTZptBR, datePattern } from "@/utils/dateUtils";
import { downloadFile, mountUrl } from "@/utils/requestUtils";
import { useSnackbar } from "notistack";
import { addSnackError, addSnackSuccess } from "@/utils/snackbarUtils";
import { useRouter } from "next/navigation";
import BackButton from "@/components/atoms/BackButton";
import LoadingCircleIcon from "@/components/atoms/icons/LoadingCircleIcon";
import Alert, { IAlertMessage } from "@/components/molecules/Alert";
import EmptyListText from "@/components/atoms/EmptyListText";
import ResizebleScroll from "@/components/molecules/ResizebleScroll";


export interface IPropsCartPge {
  accessToken: string | null
}

const CartPage: React.FC<IPropsCartPge> = ({
  accessToken,
  ...opts
}) => {

  const router = useRouter();
  const dispatch = useDispatch();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [doingRequest, setDoingRequest] = useState<boolean>(false);

  const {isOpen: isModalOpen, onOpen: onModalOpen, onOpenChange: onModalOpenChange} = useDisclosure();
  const [modalTitle, setModalTitle] = useState('');
  const [modalConfirmText, setModalConfirmText] = useState('');
  const [modalConfirmFn, setModalConfirmFn] = useState<()=>void>(()=>()=>{});

  const [alertMsg, setAlertMsg] = useState<IAlertMessage|null>(null);
  const { theme, setTheme } = useTheme();
  const _cartList = useAppSelector((state) => state.cartReducer.value);
  const [cart, setCart] = useState<IRetornoPesquisaItensLicitacao[]>([]);

  useEffect(() => {
    setCart(_cartList);
    setIsLoading(false);
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
    setIsLoading ? setIsLoading(true) : null;
    router.push(mountUrl({
      host: '',
      path: '/cotacao/[uuid]'.replace('[uuid]',uuid)
    }));
  }

  const generatePDF = async () => {
    if (accessToken == null) {
      addSnackError(enqueueSnackbar, 'Realize o Login novamente e repita a operação.');
      return;
    }
    try {
      setDoingRequest(true);
      const now = convertTZptBR(new Date());
      const res = await postDownloadItensCotacoes(_cartList, accessToken);
      setDoingRequest(false);
      if (res != null) {
        if (res instanceof Blob) {
          downloadFile(res, `cotacao-${datePattern(now, DATE_PATTERN.FULL)}.pdf`);
          setAlertMsg({
            message: 'Cotação gerada com sucesso e salva no seu Histórico. Baixe-a novamente a qualquer momento.',
            type: "success"
          });
          addSnackSuccess(enqueueSnackbar, 'Iniciando download da cotação!');
          clearCart();
        } else if (res.error) {
          addSnackError(enqueueSnackbar, res.error);
        }
      } else {
        addSnackError(enqueueSnackbar, 'Nenhum arquivo retornado!');
      }
    } catch (e: Error | any) {
      addSnackError(enqueueSnackbar, (e instanceof Error ? e.message: e));
    }
  }

  const openModalLimpar = () => {
    setModalTitle("Limpar Carrinho");
    setModalConfirmText("Você deseja limpar o carrinho de itens de licitações?");
    setModalConfirmFn(() => () => {clearCart()});
    onModalOpen();
  }

  const openModalRemoveItem = (item: IRetornoPesquisaItensLicitacao) => {
    setModalTitle("Remover Item do Carrinho");
    setModalConfirmText(`Você deseja remover o item ${item.descricao} do carrinho de itens de licitações?`);
    setModalConfirmFn(() => () => {onClickRemoveCart(item)});
    onModalOpen();
  }

  return (
    <section className='py-4 flex items-center justify-center flex-col w-full'>
      <div className='container'>
        <Card className="mx-1">
          <CardBody>
          <div className='container flex flex-col items-start justify-start'>
            <FormTitle title="Carrinho de Cotações">
                <Button className="force-text-transform-none" color="secondary" type="button" as={Link} href="/cotacao" >
                  Nova Cotação
                </Button>
                <BackButton/>
              </FormTitle>
            <Divider className="my-4" />
            <FormRow className='flex flex-col items-start justify-start'>
              { alertMsg != null && 
                <Alert type={alertMsg.type} message={alertMsg.message} />
              }
              { isLoading && 
                <LoadingList/>
              }
              { !hastItens() && !isLoading && 
                <EmptyListText>
                  Sem itens no carrinho... Realize cotações para adicionar itens.
                </EmptyListText>
              }
              { hastItens() && !isLoading && 
                <div className='flex flex-col w-full items-start justify-start'>
                  <ResizebleScroll isLoading={isLoading||doingRequest}>
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
                                  Quantidade: {i.quantidade} {i.unidadeFornecimento?.nome}
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
                              onPress={() => openModalRemoveItem(i) }
                            >
                              <CartRemoveIcon classNamesArrPath={['stroke-white fill-white']}></CartRemoveIcon>
                            </Button>
                          
                            <Button
                              isIconOnly
                              className="text-default-900/60"
                              radius="full"
                              color="primary"
                              variant="solid"
                              onPress={() => selectItem(i.uuid) }
                            >
                              <ClipboardIcon classNamesArrPath={theme == 'light' ? ['stroke-gray-200'] : []}></ClipboardIcon>
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  )}
                  </ResizebleScroll>
                </div>
              }
              <Divider className="my-4" />
                <FormRow className="flex flex-row items-center justify-between px-2">
                  <div className="flex flex-col gap-2">
                    <p className="text-small text-default-500">Itens no Carrinho: {cart?.length}</p>
                  </div>
                  <div className="flex gap-4">
                    <Button color="danger" onPress={openModalLimpar} isDisabled={!hastItens() || isLoading}>
                      Limpar
                    </Button>
                    <ModalConfirm 
                      title={modalTitle}
                      description={modalConfirmText}
                      backdrop="blur"
                      placement="center"
                      isOpen={isModalOpen} 
                      onOpenChange={onModalOpenChange}
                      actionYes={modalConfirmFn}
                      />
                    <Button color="primary" isDisabled={doingRequest || !hastItens() || isLoading} onPress={generatePDF}>
                      { !doingRequest ? 'Gerar PDF' : <><LoadingCircleIcon/>Gerando PDF...</>}
                    </Button>
                  </div>
                </FormRow>
            </FormRow>
          </div>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}

export default CartPage;