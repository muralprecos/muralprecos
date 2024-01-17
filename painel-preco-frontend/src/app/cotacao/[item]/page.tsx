"use client";

import { Button, Card, CardBody, Divider, Listbox, ListboxItem, Selection, Spacer } from "@nextui-org/react";
import FormTitle from "@/components/atoms/FormTitle";
import FormRow from "@/components/atoms/FormRow";
import { IItemLicitacao } from "@/interfaces/types";
import { useEffect, useState } from "react";
import InfoText from "@/components/atoms/InfoText";
import InfoTitle from "@/components/atoms/InfoTitle";
import CartButton from "@/components/molecules/CartButton";
import { useRouter } from "next/navigation";
import { isClientNextjs } from "@/utils/validateUtils";
import { getItemLicitacao } from "@/hooks/api";
import { addSnackError } from "@/utils/snackbarUtils";
import { useSnackbar } from "notistack";
import LoadingItem from "@/components/molecules/LoadingItem";

export interface IPropsViewItensLicitacao {
  params: { item: string }
}

const INFO_TYPE = {
  TODOS: "all",
  ITEM: "item",
  LICITACAO: "licitacao"
}

const ViewItemLicitacao: React.FC<IPropsViewItensLicitacao> = ({
  params,
  ...opts
}) => {

  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [itemLicitacao, setItemLicitacao] = useState<IItemLicitacao|null>();

  useEffect(() => {
    const fetchData = async () => {
      if (isClientNextjs()) {
        setIsLoading ? setIsLoading(true) : null;
        const req: IItemLicitacao | null = await getItemLicitacao({ info: [{ val: params.item, param: 'uuid' }] });
        setIsLoading ? setIsLoading(false) : null;
        if (req) {
          setItemLicitacao(req);
        } else {
          addSnackError(enqueueSnackbar, 'Problema ao carregar item, tente novamente!');
        }
      }
    }
    fetchData().catch(console.error);
  }, [params, setItemLicitacao, enqueueSnackbar, router]);

  const showTitle = () => {
    return itemLicitacao != null ? itemLicitacao.descricao : isLoading ? 'Carregando Item...' : 'Item não encontrado';
  }

  const hastItens = () => {
    return itemLicitacao != null;
  }

  const goListTab = () => {
    router.back();
  }

  const items = [
    {
      key: INFO_TYPE.TODOS,
      label: "Todas as Informações",
    },
    {
      key: INFO_TYPE.LICITACAO,
      label: "Dados da Licitação",
    },
    {
      key: INFO_TYPE.ITEM,
      label: "Informações Gerais do Item",
    },
  ];
  const [selectedKeys, setSelectedKeys] = useState<Iterable<string|number>>(new Set([INFO_TYPE.TODOS]));
  const selectValue = (keys:Selection):any => {
    if (keys instanceof Set) {
      const it = keys.values();
      const first = it.next();
      setSelectedKeys(new Set([first.value]));
    }
  }
  const hasSelectedValue = (vals:string[]) => {
    const arr = Array.from(selectedKeys);
    const res = vals.filter((s) => arr.indexOf(s) != -1)
    return res.length > 0;
  }

  return (
    <section className='py-4 flex items-center justify-center flex-col w-full'>
      <div className='container'>
        <Card>
          <CardBody>
            <section className='container flex flex-col items-start justify-start'>
              <FormTitle className='text-lg font-bold uppercase text-primary flex flex-row items-center justify-between w-full'>
                <div className="flex-auto">
                  {showTitle()}
                </div>
                <Button color="secondary" type="button" onClick={goListTab}>
                  Voltar
                </Button>
              </FormTitle>
              <Divider className="my-4" />
              <FormRow className='flex flex-col items-start justify-start'>
                { isLoading && 
                  <LoadingItem/>
                }
                { !hastItens() && !isLoading && 
                  <div className='flex flex-col w-full items-start justify-start'>
                    <p>Item de Licitação não encontrado. Tente novamente.</p>
                  </div>
                }
                { hastItens() && !isLoading && 
                  <div className='flex lg:flex-row flex-col w-full items-start justify-start gap-4'>
                    <div className='flex flex-col items-start justify-start basis-1/4 gap-2 w-full'> 
                      <div className="flex flex-1 flex-col border-small rounded-small border-default-200 dark:border-default-100 w-full">
                        <h3 className={`text-sm font-bold uppercase text-primary-600 w-full bg-opacity-5 bg-primary-300 p-4 text-center`}>
                          Modos de Visualização
                        </h3>
                        <Listbox
                          aria-label="Seleção do Tipo de Visualização"
                          variant="flat"
                          className="w-full flex-1"
                          disallowEmptySelection
                          selectionMode="single"
                          items={items}
                          selectedKeys={selectedKeys}
                          onSelectionChange={selectValue}
                        >
                          {items.map((item) => (
                            <ListboxItem key={item.key}>
                              {item.label}
                            </ListboxItem>
                          ))}
                        </Listbox>
                      </div>
                      <div className="flex flex-1 w-full">
                        <CartButton itemRetornoLicitacao={itemLicitacao}/>
                      </div>
                      
                    </div>

                    <div className='flex flex-col items-start justify-start basis-3/4'>
                      { hasSelectedValue([INFO_TYPE.TODOS, INFO_TYPE.ITEM]) &&
                        <section className='flex-1 w-full gap-4 pb-6'>
                          <InfoTitle>Informações Gerais do Item</InfoTitle>
                          <Divider orientation="horizontal" />
                          <Spacer y={3} />
                          <FormRow>
                            <InfoText label="Unidade" orientarion="row">
                              {itemLicitacao?.unidadeFornecimento.nome}
                            </InfoText>
                            <InfoText label="Quantidade" orientarion="row">
                              {itemLicitacao?.quantidade}
                            </InfoText>
                            <InfoText label="Valor" orientarion="row">
                              {itemLicitacao?.valor}
                            </InfoText>
                          </FormRow>
                          <Divider orientation="horizontal" />
                          <FormRow>
                            <InfoText label="Descrição">
                              {itemLicitacao?.descricao}
                            </InfoText>
                          </FormRow>
                          <Divider orientation="horizontal" />
                          <FormRow>
                            <InfoText label="Descrição Complementar">
                              {itemLicitacao?.descricaoComplementar}
                            </InfoText>
                          </FormRow>
                          <Divider orientation="horizontal" />
                          <FormRow>
                            <InfoText label="Material">
                              (CatMat: {itemLicitacao?.material.codigo}) - {itemLicitacao?.material.nome}
                            </InfoText>
                          </FormRow>
                          <Divider orientation="horizontal" />
                          <FormRow>
                            <InfoText label="Fornecedor">
                              {itemLicitacao?.fornecedor.nome}
                            </InfoText>
                            <InfoText label="Porte">
                              {itemLicitacao?.fornecedor.porte.nome}
                            </InfoText>
                            <InfoText label="Documento">
                              {itemLicitacao?.fornecedor.documento}
                            </InfoText>
                          </FormRow>
                        </section>
                      }
                      { hasSelectedValue([INFO_TYPE.TODOS, INFO_TYPE.LICITACAO]) &&
                        <section className='flex-1 w-full gap-4 pb-6'>
                          <InfoTitle>Dados da Licitação</InfoTitle>
                          <Divider orientation="horizontal" />
                          <Spacer y={3} />
                          <FormRow>
                            <InfoText label="Ano Compra" orientarion="row">
                              {itemLicitacao?.licitacao.anoCompra}
                            </InfoText>
                            <InfoText label="Data Abertura" orientarion="row">
                              {itemLicitacao?.licitacao.dataAbertura}
                            </InfoText>
                            <InfoText label="Data Resultado" orientarion="row">
                              {itemLicitacao?.licitacao.dataResultadoCompra}
                            </InfoText>
                          </FormRow>
                          <Divider orientation="horizontal" />
                          <FormRow>
                            <InfoText label="Processo" orientarion="row">
                              {itemLicitacao?.licitacao.numeroProcesso}
                            </InfoText>
                            <InfoText label="Situacao" orientarion="row">
                              {itemLicitacao?.licitacao.situacao.nome}
                            </InfoText>
                            <InfoText label="Valor" orientarion="row">
                              {itemLicitacao?.licitacao.valor}
                            </InfoText>
                          </FormRow>
                          <Divider orientation="horizontal" />
                          <FormRow>
                            <InfoText label="Esfera" orientarion="row">
                              {itemLicitacao?.licitacao.esfera.nome}
                            </InfoText>
                            <InfoText label="Estado" orientarion="row">
                              {itemLicitacao?.licitacao.municipio.uf.nome} ({itemLicitacao?.licitacao.municipio.uf.sigla})
                            </InfoText>
                            <InfoText label="Municipio" orientarion="row">
                              {itemLicitacao?.licitacao.municipio.nome}
                            </InfoText>
                          </FormRow>
                          <Divider orientation="horizontal" />
                          <FormRow py={2}>
                            <InfoText label="Objeto da Licitação">
                              {itemLicitacao?.licitacao.objeto}
                            </InfoText>
                          </FormRow>
                          <Divider orientation="horizontal" />
                          <FormRow>
                            <InfoText label="Forma Compra">
                              {itemLicitacao?.licitacao.formaCompra.nome} ({itemLicitacao?.licitacao.formaCompra.sigla})
                            </InfoText>
                            <InfoText label="Modalidade Compra">
                              {itemLicitacao?.licitacao.modalidadeCompra.nome} ({itemLicitacao?.licitacao.modalidadeCompra.codigo})
                            </InfoText>
                          </FormRow>
                          <Divider orientation="horizontal" />
                          <FormRow>
                            <InfoText label="Unidade Gestora">
                              {itemLicitacao?.licitacao.unidadeGestora.nome} ({itemLicitacao?.licitacao.unidadeGestora.codigo})
                            </InfoText>
                          </FormRow>
                          <Divider orientation="horizontal" />
                          <FormRow>
                            <InfoText label="Órgão">
                              {itemLicitacao?.licitacao.orgao.nome} ({itemLicitacao?.licitacao.orgao.codigo})
                            </InfoText>
                          </FormRow>
                          
                          { !itemLicitacao?.licitacao.orgao.ehsuperior &&
                            <div>
                              <Divider orientation="horizontal" />
                              <FormRow>
                                <InfoText label="Órgão Superior">
                                  {itemLicitacao?.licitacao.orgaoSuperior.nome} ({itemLicitacao?.licitacao.orgaoSuperior.codigo})
                                </InfoText>
                              </FormRow>
                            </div>
                          }
                        </section>
                      }
                      
                    </div>
                  </div>
                }
              </FormRow>
            </section>

          </CardBody>
        </Card>
      </div>
    </section>
  );
}

export default ViewItemLicitacao;