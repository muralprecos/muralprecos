"use client";

import { IRetornoPesquisaItensLicitacao } from "@/interfaces/types"
import { Button, Card, CardBody } from "@nextui-org/react";
import WallpaperIcon from "../atoms/icons/WallpaperIcon";
import { useTheme } from "next-themes";
import CartButton from "../molecules/CartButton";
import ClipboardIcon from "../atoms/icons/ClipboardIcon";
import { mountUrl } from "@/utils/requestUtils";
import { formatCurrency, parseCurrency, calcUnityValueByQuantity } from "@/utils/formatCurrency";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

interface IProps {
  item: IRetornoPesquisaItensLicitacao
  setIsLoading: Dispatch<SetStateAction<boolean>>
}

const ItemListLicitacao: React.FC<IProps> = ({
  item,
  setIsLoading
}) => {
  const i = item;
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const selectItem = async (uuid : string) => {
    setIsLoading ? setIsLoading(true) : null;
    router.push(mountUrl({
      host: '',
      path: '/cotacao/[uuid]'.replace('[uuid]',uuid)
    }));
  }

  return (
          <div className="flex-1 w-full flex-wrap md:flex-nowrap gap-4 py-2">
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
                        Quantidade: {i.quantidade} | Unidade: {i.unidadeFornecimento?.nome}
                      </p>
                      <h1 className="text-small font-medium">Valor: {i.valor} | Valor da Unidade: {formatCurrency(calcUnityValueByQuantity(parseCurrency(i.valor), i.quantidade))}</h1>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row gap-3 basis-1/12 items-start justify-start">
                  <CartButton itemRetornoLicitacao={i} isCompact={true} />
                  <Button
                    isIconOnly
                    className="text-default-900/60"
                    radius="full"
                    color="secondary"
                    variant="solid"
                    onPress={() => selectItem(i.uuid) }
                  >
                    <ClipboardIcon></ClipboardIcon>
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
  )
}

export default ItemListLicitacao;