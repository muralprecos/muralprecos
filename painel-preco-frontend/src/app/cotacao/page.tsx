import { getFormasCompra, getListAnos, getListEsferas, getListEstados, getListModalidadesCompra, getListPeriodosCompra, getListPorteFornecedor, getListSituacoesLicitacao } from "@/hooks/api";
import { reqDataListToSelect } from "@/utils/convertData";
import PageClient from "./pageClient";
import { IAnoCompra, IEsfera, IFormaCompra, IModalidadeCompra, IPeriodoCompra, IPorteFornecedor, IReturnRequestAPI, ISituacaoLicitacao, IUnidadeFederativa } from "@/interfaces/types";
import logger from "../../../services/logger";

export default async function Home() {
  

  const dataPorteFornecedores = getListPorteFornecedor({});
  const dataEsferas = getListEsferas({});
  const dataFormasCompra = getFormasCompra({});
  const dataModalidadesCompra = getListModalidadesCompra({});
  const dataPeriodosCompra = getListPeriodosCompra({});
  const dataSituacoesLicitacao = getListSituacoesLicitacao({});
  const dataUnidadesFederativas = getListEstados({});
  const dataAnosCompras = getListAnos({});
  
  const resReq = await Promise.allSettled([dataPorteFornecedores, dataEsferas, dataFormasCompra, dataModalidadesCompra, dataPeriodosCompra, dataSituacoesLicitacao, dataUnidadesFederativas, dataAnosCompras]);
  const [settledPorteFornecedores, settledEsferas, settledFormasCompra, settledModalidadesCompra, settledPeriodosCompra, settledSituacoesLicitacao, settledUnidadesFederativas, settledAnosCompras] = resReq;

  function getSettledValue<T>(req: PromiseSettledResult<T[]>) {
    if (req.status === "rejected" || (req.status === "fulfilled" && req.value == undefined) ) {
      //TODO: tratamento de erro para enviar ao frontend
      return [];
    }
    return req.status === "fulfilled" ? req.value : []
  }

  function getSettledValuePageable<T>(req: PromiseSettledResult<IReturnRequestAPI<T>>) {
    if (req.status === "rejected" || (req.status === "fulfilled" && req.value == undefined) ) {
      //TODO: tratamento de erro para enviar ao frontend
      return [];
    }
    return req.status === "fulfilled" ? req.value.content : []
  }

  const porteFornecedores : IPorteFornecedor[] = getSettledValue<IPorteFornecedor>(settledPorteFornecedores),
      esferas : IEsfera[] = getSettledValue<IEsfera>(settledEsferas),
      formasCompra : IFormaCompra[] = getSettledValue<IFormaCompra>(settledFormasCompra),
      modalidadesCompra : IModalidadeCompra[] = getSettledValue<IModalidadeCompra>(settledModalidadesCompra),
      periodosCompra : IPeriodoCompra[] = getSettledValue<IPeriodoCompra>(settledPeriodosCompra),
      situacoesLicitacao : ISituacaoLicitacao[] = getSettledValue<ISituacaoLicitacao>(settledSituacoesLicitacao),
      unidadesFederativas : IUnidadeFederativa[] = getSettledValue<IUnidadeFederativa>(settledUnidadesFederativas),
      anosCompras : IAnoCompra[] = getSettledValuePageable<IAnoCompra>(settledAnosCompras)
      ;

  return (
    <PageClient
        empresaPorte={reqDataListToSelect<IPorteFornecedor>(porteFornecedores, 'nome', 'uuid')}
        esferas={reqDataListToSelect<IEsfera>(esferas, 'nome', 'uuid')}
        compraFormas={reqDataListToSelect<IFormaCompra>(formasCompra, 'nome', 'uuid')}
        compraModalidades={reqDataListToSelect<IModalidadeCompra>(modalidadesCompra, 'nome', 'uuid')}
        compraPeriodos={reqDataListToSelect<IPeriodoCompra>(periodosCompra, 'nome', 'uuid')}
        situacoesLicitacoes={reqDataListToSelect<ISituacaoLicitacao>(situacoesLicitacao, 'nome', 'uuid')}
        unidadesFederativas={reqDataListToSelect<IUnidadeFederativa>(unidadesFederativas, 'nome', 'uuid')}
        anosCompras={reqDataListToSelect<IAnoCompra>(anosCompras, 'nome', 'nome')}
      />
  )
}