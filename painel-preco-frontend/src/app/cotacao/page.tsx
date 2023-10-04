import { getFormasCompra, getListEsferas, getListFornecedores, getListModalidadesCompra, getListPeriodosCompra, getListPorteFornecedor } from "@/hooks/api";
import { reqDataListToAutocomplete, reqDataPageableToAutocomplete } from "@/utils/convertData";
import PageClient from "./pageClient";
import { IEsfera, IFormaCompra, IFornecedor, IModalidadeCompra, IPeriodoCompra, IPorteFornecedor } from "@/interfaces/types";

export default async function Home() {
  const dataPorteFornecedores = getListPorteFornecedor({});
  const dataEsferas = getListEsferas({});
  const dataFormasCompra = getFormasCompra({});
  const dataFornecedores = getListFornecedores({});
  const dataModalidadesCompra = getListModalidadesCompra({});
  const dataPeriodosCompra = getListPeriodosCompra({});
  
  const [porteFornecedores, esferas, formasCompra, fornecedores, modalidadesCompra, periodosCompra] = await Promise.all([dataPorteFornecedores, dataEsferas, dataFormasCompra, dataFornecedores, dataModalidadesCompra, dataPeriodosCompra])

  return (
    <PageClient
        empresaPorte={reqDataListToAutocomplete<IPorteFornecedor>(porteFornecedores)}
        esferas={reqDataListToAutocomplete<IEsfera>(esferas)}
        compraFormas={reqDataListToAutocomplete<IFormaCompra>(formasCompra)}
        fornecedorNomes={reqDataPageableToAutocomplete<IFornecedor>(fornecedores)}
        fornecedorDocumentos={reqDataPageableToAutocomplete<IFornecedor>(fornecedores, 'documento')}
        compraModalidades={reqDataListToAutocomplete<IModalidadeCompra>(modalidadesCompra)}
        compraPeriodos={reqDataListToAutocomplete<IPeriodoCompra>(periodosCompra, 'descricao')}
      />
  )
}