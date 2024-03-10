import { getFormasCompra, getListAnos, getListEsferas, getListEstados, getListModalidadesCompra, getListPeriodosCompra, getListPorteFornecedor, getListSituacoesLicitacao } from "@/hooks/api";
import { reqDataListToSelect } from "@/utils/convertData";
import PageClient from "./pageClient";
import { IAnoCompra, IEsfera, IFormaCompra, IModalidadeCompra, IPeriodoCompra, IPorteFornecedor, IReturnRequestAPI, ISituacaoLicitacao, IUnidadeFederativa } from "@/interfaces/types";
import { redirect } from "next/navigation";
import { CheckRolesStrategy, checkAccessRoles, getAccessToken } from "@/utils/sessionTokenAccessor";
import { SetDynamicRoute } from "@/utils/setDynamicRoute";
import { INITIAL_PAGE_LOGIN } from "@/utils/routesUtils";
import { auth } from "auth";
import logger from "../../../services/logger";

export default async function CotacaoHome() {

  const session = await auth();
  if (!session || !session.userInfo) {
    console.log('AAAA 1')
    //redirect(INITIAL_PAGE_LOGIN);
  }


  const accessToken = await getAccessToken() || '';
  const hasAuthorization = await checkAccessRoles([], CheckRolesStrategy.INCLUDES_ALL);

  if (!accessToken) {
    console.log('AAAA 2')
    //redirect(INITIAL_PAGE_LOGIN);
  } else if (!hasAuthorization) {
    redirect("/unauthorized");
  }

  const dataPorteFornecedores = getListPorteFornecedor({accessToken});
  const dataEsferas = getListEsferas({accessToken});
  const dataFormasCompra = getFormasCompra({accessToken});
  const dataModalidadesCompra = getListModalidadesCompra({accessToken});
  const dataPeriodosCompra = getListPeriodosCompra({accessToken});
  const dataSituacoesLicitacao = getListSituacoesLicitacao({accessToken});
  const dataUnidadesFederativas = getListEstados({accessToken});
  const dataAnosCompras = getListAnos({accessToken});
  
  const resReq = await Promise.allSettled([dataPorteFornecedores, dataEsferas, dataFormasCompra, dataModalidadesCompra, dataPeriodosCompra, dataSituacoesLicitacao, dataUnidadesFederativas, dataAnosCompras]);
  const [settledPorteFornecedores, settledEsferas, settledFormasCompra, settledModalidadesCompra, settledPeriodosCompra, settledSituacoesLicitacao, settledUnidadesFederativas, settledAnosCompras] = resReq;

  function getSettledValue<T>(req: PromiseSettledResult<T[] | null>) {
    if (req.status === "fulfilled" && req.value == undefined) {
      return [];
    } else if (req.status === "rejected") {
      return [];
    }
    return req.status === "fulfilled" ? req.value : []
  }

  function getSettledValuePageable<T>(req: PromiseSettledResult<IReturnRequestAPI<T> | null>) {
    if (req.status === "fulfilled" && req.value == undefined) {
      return [];
    } else if (req.status === "rejected") {
      return [];
    }
    return req.status === "fulfilled" ? req.value ? req.value.content : [] : null
  }

  const porteFornecedores : IPorteFornecedor[] | null = getSettledValue<IPorteFornecedor>(settledPorteFornecedores),
      esferas : IEsfera[] | null = getSettledValue<IEsfera>(settledEsferas),
      formasCompra : IFormaCompra[] | null = getSettledValue<IFormaCompra>(settledFormasCompra),
      modalidadesCompra : IModalidadeCompra[] | null = getSettledValue<IModalidadeCompra>(settledModalidadesCompra),
      periodosCompra : IPeriodoCompra[] | null = getSettledValue<IPeriodoCompra>(settledPeriodosCompra),
      situacoesLicitacao : ISituacaoLicitacao[] | null = getSettledValue<ISituacaoLicitacao>(settledSituacoesLicitacao),
      unidadesFederativas : IUnidadeFederativa[] | null = getSettledValue<IUnidadeFederativa>(settledUnidadesFederativas),
      anosCompras : IAnoCompra[] | null = getSettledValuePageable<IAnoCompra>(settledAnosCompras)
      ;

  return (
    <>
      {/* <SetDynamicRoute/> */}
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
    </>
  )
}