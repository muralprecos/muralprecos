import FormRow from "@/components/atoms/FormRow";
import ShieldIcon from "@/components/atoms/icons/ShieldIcon";
import { getValidateCotacao } from "@/hooks/api";
import { Card, CardBody, Divider } from "@nextui-org/react";
import DownloadButton from "./downloadButton";
import { IResValidacaoCotacao, IValidaCotacao } from "@/interfaces/types";


const naoValidado = (uuid: string) : IResValidacaoCotacao => {
  return {
    isok: false,
    uuid: uuid,
    message: 'Cotação INVÁLIDA'
  }
}

export default async function ValidaItens({ itens }: { itens: string[] }) {
  
  const validacoes : IResValidacaoCotacao[] = await Promise.all(
    itens.map(async (item) => {
      try {
        const res = await getValidateCotacao(item);
        if (res != null && 'hashValidacao' in res) {
          const validateCotacao = res as IValidaCotacao;
          return {
            isok: true,
            uuid: item,
            validacao: validateCotacao,
            message: 'Cotação VÁLIDA'
          };
        } else {
          return naoValidado(item);
        }
      } catch (error) {
        return naoValidado(item);
      }
    })
  );

  const getClassname = (val : IResValidacaoCotacao) => {
    return val.isok ? 'from-lime-400 to-lime-500' : 'from-red-400 to-red-500';
  }

  return (
    <FormRow className="flex flex-row justify-center">
      {validacoes.map((val) => (
        <Card
          isBlurred
          className={`flex-1 bg-gradient-to-r opacity-85 hover:opacity-100 transition-all force-transition-all max-w-[600px] ${getClassname(val)}`}
          shadow="sm"
          key={val.uuid}
        >
          <CardBody className="flex-col justify-around">
            <FormRow className="flex flex-col items-center justify-center" gap={1}>
              <span className="font-bold">{val.uuid}</span>
            </FormRow>
            <Divider/>
            <FormRow className="flex flex-col justify-center">
              <div className="flex items-center justify-center">
                <ShieldIcon isOk={val.isok} className=""/>
              </div>
              <div className="flex flex-row items-center justify-center gap-2 text-black">
                { val.validacao ? 
                  <DownloadButton file={val.validacao.arquivo} filename={val.validacao.nomeArquivo} variant="shadow">
                    Baixar Cópia - {val.message}
                  </DownloadButton> : 
                  <span className="font-bold">{val.message}</span>  
                }
              </div>
            </FormRow>
            {
              val.validacao && (
                <>
                  <Divider/>
                  <FormRow className="flex flex-col items-start justify-center" gap={1}>
                    <span><label className="font-bold mr-2">Criado em:</label>{val.validacao.criadoEm}</span>
                    <span><label className="font-bold mr-2">Arquivo:</label>{val.validacao.nomeArquivo}</span>
                    <span><label className="font-bold mr-2">Descrição:</label>{val.validacao.nome}</span>
                  </FormRow>
                </>
              )
            }
          </CardBody>
        </Card>
      ))}
    </FormRow>
  )
}