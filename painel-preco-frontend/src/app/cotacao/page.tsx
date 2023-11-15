import { getFormasCompra, getListEsferas, getListModalidadesCompra, getListPeriodosCompra, getListPorteFornecedor, getListSituacoesLicitacao } from "@/hooks/api";
import { reqDataListToSelect } from "@/utils/convertData";
import PageClient from "./pageClient";
import { IEsfera, IFormaCompra, IModalidadeCompra, IObjetoAPI, IPeriodoCompra, IPorteFornecedor, ISituacaoLicitacao } from "@/interfaces/types";

export default async function Home() {
  

  const dataPorteFornecedores = getListPorteFornecedor({});
  const dataEsferas = getListEsferas({});
  const dataFormasCompra = getFormasCompra({});
  const dataModalidadesCompra = getListModalidadesCompra({});
  const dataPeriodosCompra = getListPeriodosCompra({});
  const dataSituacoesLicitacao = getListSituacoesLicitacao({});
  
  const resReq = await Promise.allSettled([dataPorteFornecedores, dataEsferas, dataFormasCompra, dataModalidadesCompra, dataPeriodosCompra, dataSituacoesLicitacao]);
  const [settledPorteFornecedores, settledEsferas, settledFormasCompra, settledModalidadesCompra, settledPeriodosCompra, settledSituacoesLicitacao] = resReq;

  function instanceOfIFormaCompra(object: any): object is IFormaCompra {
    return 'member' in object;
  }

  function getSettledValue<T extends IObjetoAPI>(req: PromiseSettledResult<T[]>) {
    if (req.status === "rejected") {
      //TODO: tratamento de erro para enviar ao frontend
      return [];
    }
    return req.status === "fulfilled" ? req.value : []
  }

  const porteFornecedores : IPorteFornecedor[] = getSettledValue<IPorteFornecedor>(settledPorteFornecedores),
      esferas : IEsfera[] = getSettledValue<IEsfera>(settledEsferas),
      formasCompra : IFormaCompra[] = getSettledValue<IFormaCompra>(settledFormasCompra),
      modalidadesCompra : IModalidadeCompra[] = getSettledValue<IModalidadeCompra>(settledModalidadesCompra),
      periodosCompra : IPeriodoCompra[] = getSettledValue<IPeriodoCompra>(settledPeriodosCompra),
      situacoesLicitacao : ISituacaoLicitacao[] = getSettledValue<ISituacaoLicitacao>(settledSituacoesLicitacao);

  return (
    <PageClient
        empresaPorte={reqDataListToSelect<IPorteFornecedor>(porteFornecedores)}
        esferas={reqDataListToSelect<IEsfera>(esferas)}
        compraFormas={reqDataListToSelect<IFormaCompra>(formasCompra)}
        compraModalidades={reqDataListToSelect<IModalidadeCompra>(modalidadesCompra)}
        compraPeriodos={reqDataListToSelect<IPeriodoCompra>(periodosCompra, 'nome')}
        situacoesLicitacoes={reqDataListToSelect<ISituacaoLicitacao>(situacoesLicitacao)}
      />
  )
}