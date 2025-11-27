"use client";

import { useEffect, useState } from "react";
import { IRetornoPesquisaItensLicitacao, type ICart } from "@/interfaces/types";
import { clear, remove } from "@/store/features/cart-slice";
import ModalConfirm from "@/components/molecules/ModalConfirm";
import { DATE_PATTERN, convertTZptBR, datePattern } from "@/utils/dateUtils";
import { downloadFile, mountUrl } from "@/utils/requestUtils";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import LoadingCircleIcon from "@/components/atoms/LoadingCircleIcon";
import EmptyListText from "@/components/atoms/EmptyListText";
import { getUserCartBySession, getUsernameBySession } from "@/utils/cartUtils";
import { Session } from "next-auth";
import { apiClientPostGerarPDFCotacao } from "@/hooks/apiclient";
import { useAppSelector } from "@/store/store";
import { useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ItemListLicitacao from "@/components/molecules/ItemListLicitacao";
import { Button } from "@/components/ui/button";
import { FileDown, ShoppingCart, Trash2 } from "lucide-react";
import { AlertMessage, type IAlertMessage } from "@/components/molecules/Alert";
import LoadingList from "@/components/molecules/LoadingList";
import FormTitle from "@/components/atoms/FormTitle";
import { notify } from "@/components/molecules/NotifyToast";

export interface IPropsCartPge {
  session: Session | null;
}
export default function ViewCart({ session }: IPropsCartPge) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState(true);
  const [doingRequest, setDoingRequest] = useState(false);

  // Controle do modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalConfirmText, setModalConfirmText] = useState("");
  const [modalConfirmFn, setModalConfirmFn] = useState<() => void>(
    () => () => {}
  );

  const [alertMsg, setAlertMsg] = useState<IAlertMessage | null>(null);
  const _cartList = useAppSelector((state) => state.cartReducer);
  const [cart, setCart] = useState<IRetornoPesquisaItensLicitacao[]>([]);

  useEffect(() => {
    setCart(getUserCartBySession(_cartList as ICart, session));
    setIsLoading(false);
  }, [_cartList, session]);

  const hastItens = () => cart?.length > 0;

  const onClickRemoveCart = (item: IRetornoPesquisaItensLicitacao) => {
    dispatch(
      remove({
        item,
        user: getUsernameBySession(session),
      })
    );
  };

  const clearCart = () => {
    dispatch(clear(getUsernameBySession(session)));
  };

  const generatePDF = async () => {
    try {
      setDoingRequest(true);
      const now = convertTZptBR(new Date());
      const res = await apiClientPostGerarPDFCotacao(cart);
      setDoingRequest(false);

      if (res instanceof Blob) {
        downloadFile(res, `cotacao-${datePattern(now, DATE_PATTERN.FULL)}.pdf`);
        setAlertMsg({
          message:
            "Cotação gerada com sucesso e salva no seu histórico. Baixe-a novamente a qualquer momento.",
          type: "success",
        });
        notify("success", "Iniciando download da cotação!");
        clearCart();
      } else {
        notify("error", "Não foi possível gerar o arquivo da cotação");
      }
    } catch (e: any) {
      setDoingRequest(false);
      notify("error", e?.message || "Erro ao gerar PDF.");
    }
  };

  const openModalLimpar = () => {
    setModalTitle("Limpar Carrinho");
    setModalConfirmText(
      "Você deseja limpar o carrinho de itens de licitações?"
    );
    setModalConfirmFn(() => clearCart);
    setIsModalOpen(true);
  };

  const openModalRemoveItem = (item: IRetornoPesquisaItensLicitacao) => {
    setModalTitle("Remover Item do Carrinho");
    setModalConfirmText(
      `Você deseja remover o item ${item.descricao} do carrinho?`
    );
    setModalConfirmFn(() => () => onClickRemoveCart(item));
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <Card className="min-h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle>
            <FormTitle
              icon={<ShoppingCart className="h-5 w-5" />}
              title="Carrinho de Cotações"
              description="Gerencie seus itens selecionados"
              uppercase={false}
              newQuoteButton={true}
            />
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-between">
          {/* Conteúdo principal */}
          <div className="flex-1">
            {alertMsg && (
              <AlertMessage type={alertMsg.type} message={alertMsg.message} />
            )}
            {isLoading && <LoadingList />}

            {!hastItens() && !isLoading && (
              <div className="flex flex-1 flex-col gap-2 items-center justify-center text-center ">
                <EmptyListText>
                  Sem itens no carrinho... Realize cotações para adicionar
                  itens.
                </EmptyListText>
              </div>
            )}

            {hastItens() && !isLoading && (
              <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/40 scrollbar-track-transparent">
                {cart.map((item) => (
                  <ItemListLicitacao
                    key={item.uuid}
                    item={item}
                    mode="cart"
                    onRemoveFromCart={openModalRemoveItem}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Rodapé com botões */}
          <div className="mt-6">
            <Separator className="my-4" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Itens no Carrinho: {cart?.length}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={openModalLimpar}
                  disabled={!hastItens() || isLoading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpar Carrinho
                </Button>

                <ModalConfirm
                  title={modalTitle}
                  description={modalConfirmText}
                  open={isModalOpen}
                  onOpenChange={setIsModalOpen}
                  actionYes={modalConfirmFn}
                />

                <Button
                  variant="default"
                  onClick={generatePDF}
                  disabled={doingRequest || !hastItens() || isLoading}
                >
                  <FileDown className="h-4 w-4" />
                  {!doingRequest ? (
                    "Gerar PDF da Cotação"
                  ) : (
                    <>
                      <LoadingCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                      Gerando PDF...
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
