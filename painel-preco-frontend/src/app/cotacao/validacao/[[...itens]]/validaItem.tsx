import FormRow from "@/components/atoms/FormRow";
import ShieldIcon from "@/components/atoms/icons/ShieldIcon";
import { getValidateCotacao } from "@/hooks/api";
import { Card, CardBody } from "@nextui-org/react";
import DownloadButton from "./downloadButton";

type IValidacaoCotacao = {
  uuid: string
  isok: boolean
  message: string
  file?: Blob
}

const naoValidado = (uuid: string) : IValidacaoCotacao => {
  return {
    isok: false,
    uuid: uuid,
    message: 'Cotação INVÁLIDA'
  }
}

export default async function ValidaItens({ itens, accessToken }: { itens: string[], accessToken: string }) {
  
  const validacoes : IValidacaoCotacao[] = await Promise.all(
    itens.map(async (item) => {
      try {
        const validateCotacao = await getValidateCotacao(item, accessToken);
        if (validateCotacao != null && validateCotacao instanceof Blob) {
          return {
            isok: true,
            uuid: item,
            file: validateCotacao,
            message: 'Cotação VÁLIDA'
          };
        } else {
          return naoValidado(item);
        }
      } catch (error) {
        console.error(error)
        return naoValidado(item);
      }
    })
  );

  const getClassname = (val : IValidacaoCotacao) => {
    return val.isok ? 'from-lime-400 to-lime-500' : 'from-red-400 to-red-500';
  }

  return (
    <FormRow className="flex flex-row justify-center">
      {validacoes.map((val) => (
        <Card
          isBlurred
          className={`flex-1 bg-gradient-to-r opacity-80 hover:opacity-100 transition-all force-transition-all max-w-[600px] ${getClassname(val)}`}
          shadow="sm"
          key={val.uuid}
        >
          <CardBody className="flex-row justify-around">
            <div className="flex items-center justify-end">
              <ShieldIcon isOk={val.isok} className=""/>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 text-black">
              <span>Código de Validação:</span>
              <span>{val.uuid}</span>
              { val.file ? <DownloadButton item={val.uuid} accessToken={accessToken} text={`Baixar - ${val.message}`} variant="shadow" /> : <span className="font-bold">{val.message}</span>  }
            </div>
          </CardBody>
        </Card>
      ))}
    </FormRow>
  )
}