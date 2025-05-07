"use client";

import { IHistoricoCotacao } from "@/interfaces/types"
import { Button, Card, CardBody } from "@nextui-org/react";
import { useTheme } from "next-themes";
import ClipboardIcon from "../atoms/icons/ClipboardIcon";
import { useState } from "react";
import FileDownloadIcon from "../atoms/icons/FileDownloadIcon";
import { catchErrorFromFetch } from "@/utils/requestUtils";
import { useSnackbar } from "notistack";
import { downloadPDF } from "@/utils/fileUtils";
import { useRouter } from "next/navigation";
import LoadingCircleIcon from "../atoms/icons/LoadingCircleIcon";
import { apiClientGetItemHistorico } from "@/hooks/apiclient";

interface IProps {
  item: IHistoricoCotacao
}

const ItemHistoricoCotacao: React.FC<IProps> = ({
  item
}) => {

  const i = item;
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const selectItem = async (uuid : string) => {
    if (!!uuid && !isLoading) {
      const fetchData = async () => {
        setIsLoading(true);
        const req: IHistoricoCotacao|null = await apiClientGetItemHistorico([{ val: uuid, param: 'uuid' }]);
        setIsLoading(false);
        if (!!req) {
          downloadPDF(req.nomeArquivo, req.arquivo);
        }
      }
      fetchData().catch(e => {
        catchErrorFromFetch(e, enqueueSnackbar, 'arquivo da cotação');
      });
    }
  }

  return (
          <div className="flex-1 w-full flex-wrap md:flex-nowrap gap-4 py-2">
            <Card className="bg-default-100/50 flex flex-row mx-4" shadow="sm">
              <CardBody className="flex-row items-center justify-between">

                <div className="flex gap-6 md:gap-4 items-center justify-center basis-1/12">
                  <div className="relative col-span-6 md:col-span-4">
                    <ClipboardIcon height={48} width={48}
                      classNamesArrPath={theme == 'light' ? ['stroke-gray-500'] : ['stroke-gray-400']}
                      ></ClipboardIcon>
                  </div>
                </div>

                <div className="flex flex-col basis-11/12">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-0">
                      <h3 className="font-semibold text-foreground/90">{i.nome}</h3>
                      <p className="text-small mt-1 text-foreground/80">
                        Cotação realizada em: {i.criadoEm}
                      </p>
                      <p className="text-small mt-1 text-foreground/80">
                        Código de Validação: <Button type="button" variant="ghost" color="primary" onPress={() => router.push(`/cotacao/validacao/${i.hashValidacao}`) }>{i.hashValidacao}</Button>
                      </p>
                    </div>
                  </div>
                </div>

                
                <Button
                  isIconOnly
                  className="text-gray-200 flex flex-row gap-3"
                  radius="full" 
                  color="primary"
                  variant="solid"
                  isDisabled={isLoading}
                  onPress={() => selectItem(i.uuid) }
                >
                  { isLoading ? 
                  <LoadingCircleIcon/> 
                  :
                  <FileDownloadIcon classNamesArrPath={['stroke-gray-200']}></FileDownloadIcon>
                  }
                </Button>

              </CardBody>
            </Card>
          </div>
  )
}

export default ItemHistoricoCotacao;