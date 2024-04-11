"use client";

import { Button, Card, CardBody, Divider, Link, Listbox, ListboxItem, Selection, Spacer } from "@nextui-org/react";
import FormTitle from "@/components/atoms/FormTitle";
import FormRow from "@/components/atoms/FormRow";
import { IItemLicitacao } from "@/interfaces/types";
import { useEffect, useState } from "react";
import InfoText from "@/components/atoms/InfoText";
import InfoTitle from "@/components/atoms/InfoTitle";
import CartButton from "@/components/molecules/CartButton";
import { isClientNextjs } from "@/utils/validateUtils";
import { getItemLicitacao } from "@/hooks/api";
import { addSnackError } from "@/utils/snackbarUtils";
import { useSnackbar } from "notistack";
import LoadingItem from "@/components/molecules/LoadingItem";
import { strIfNotNull } from "@/utils/convertData";
import { Session } from "next-auth";
import { catchErrorFromFetch } from "@/utils/requestUtils";
import BackButton from "@/components/atoms/BackButton";

export interface IPropsViewItensLicitacao {
  params: { item: string }
  session: Session | null
  accessToken: string | null
}

const INFO_TYPE = {
  TODOS: "all",
  ITEM: "item",
  LICITACAO: "licitacao",
  LINKS: "links"
}

const ViewItemLicitacao: React.FC<IPropsViewItensLicitacao> = ({
  params,
  session,
  accessToken,
  ...opts
}) => {

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [itemLicitacao, setItemLicitacao] = useState<IItemLicitacao|null>();

  useEffect(() => {
    if (session != null && !!accessToken) {
      const fetchData = async () => {
        if (isClientNextjs()) {
          setIsLoading ? setIsLoading(true) : null;
          const req: IItemLicitacao | null = await getItemLicitacao({ info: [{ val: params.item, param: 'uuid' }], accessToken });
          setIsLoading ? setIsLoading(false) : null;
          if (req) {
            setItemLicitacao(req);
          } else {
            addSnackError(enqueueSnackbar, 'Problema ao carregar item, tente novamente!');
          }
        }
      }
      fetchData().catch(e => {
        catchErrorFromFetch(e, enqueueSnackbar, 'carregar item');
      });
    }
  }, [params, accessToken, session, setItemLicitacao, enqueueSnackbar]);

  const showTitle = () => {
    return itemLicitacao != null ? itemLicitacao.descricao : isLoading ? 'Carregando Item...' : 'Item não encontrado';
  }

  const hastItens = () => {
    return itemLicitacao != null;
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
    {
      key: INFO_TYPE.LINKS,
      label: "Links Úteis",
    }
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
        <Card className="mx-1">
          <CardBody>
            <section className='container flex flex-col items-start justify-start'>
              <FormTitle title={showTitle()}>
                <Button className="force-text-transform-none" color="secondary" type="button" as={Link} href="/cotacao" >
                  Nova Cotação
                </Button>
                <BackButton />
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

                    <div className='flex flex-col items-start justify-start basis-3/4 w-full'>
                      { hasSelectedValue([INFO_TYPE.TODOS, INFO_TYPE.ITEM]) &&
                        <section className='flex-1 w-full gap-4 pb-6'>
                          <InfoTitle>Informações Gerais do Item</InfoTitle>
                          <Divider orientation="horizontal" />
                          <Spacer y={3} />
                          <FormRow>
                            <InfoText label="Unidade" orientarion="row">
                              {strIfNotNull(itemLicitacao?.unidadeFornecimento?.nome)}
                            </InfoText>
                            <InfoText label="Quantidade" orientarion="row">
                              {strIfNotNull(itemLicitacao?.quantidade)}
                            </InfoText>
                            <InfoText label="Valor" orientarion="row">
                              {strIfNotNull(itemLicitacao?.valor)}
                            </InfoText>
                          </FormRow>
                          <Divider orientation="horizontal" />
                          <FormRow>
                            <InfoText label="Descrição">
                              {strIfNotNull(itemLicitacao?.descricao)}
                            </InfoText>
                          </FormRow>
                          <Divider orientation="horizontal" />
                          <FormRow>
                            <InfoText label="Descrição Complementar">
                              {strIfNotNull(itemLicitacao?.descricaoComplementar)}
                            </InfoText>
                          </FormRow>
                          <Divider orientation="horizontal" />
                          <FormRow>
                            <InfoText label="Material">
                              (CatMat: {strIfNotNull(itemLicitacao?.material?.codigo)}) - {itemLicitacao?.material?.nome}
                            </InfoText>
                          </FormRow>
                          <Divider orientation="horizontal" />
                          <FormRow>
                            <InfoText label="Fornecedor">
                              {strIfNotNull(itemLicitacao?.fornecedor.nome)}
                            </InfoText>
                            <InfoText label="Porte">
                              {strIfNotNull(itemLicitacao?.fornecedor.porte?.nome)}
                            </InfoText>
                            <InfoText label="Documento">
                              {strIfNotNull(itemLicitacao?.fornecedor.documento)}
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
                              {strIfNotNull(itemLicitacao?.licitacao.anoCompra)}
                            </InfoText>
                            <InfoText label="Data Abertura" orientarion="row">
                              {strIfNotNull(itemLicitacao?.licitacao.dataAbertura)}
                            </InfoText>
                            <InfoText label="Data Resultado" orientarion="row">
                              {strIfNotNull(itemLicitacao?.licitacao.dataResultadoCompra)}
                            </InfoText>
                          </FormRow>
                          <Divider orientation="horizontal" />
                          <FormRow>
                            <InfoText label="Processo" orientarion="row">
                              {strIfNotNull(itemLicitacao?.licitacao.numeroProcesso)}
                            </InfoText>
                            <InfoText label="Situacao" orientarion="row">
                              {strIfNotNull(itemLicitacao?.licitacao.situacao.nome)}
                            </InfoText>
                            <InfoText label="Valor" orientarion="row">
                              {strIfNotNull(itemLicitacao?.licitacao.valor)}
                            </InfoText>
                          </FormRow>
                          <Divider orientation="horizontal" />
                          <FormRow>
                            <InfoText label="Esfera" orientarion="row">
                              {strIfNotNull(itemLicitacao?.licitacao.esfera.nome)}
                            </InfoText>
                            <InfoText label="Estado" orientarion="row">
                              {strIfNotNull(itemLicitacao?.licitacao.municipio.uf.nome)} ({strIfNotNull(itemLicitacao?.licitacao.municipio.uf.sigla)})
                            </InfoText>
                            <InfoText label="Municipio" orientarion="row">
                              {strIfNotNull(itemLicitacao?.licitacao.municipio.nome)}
                            </InfoText>
                          </FormRow>
                          <Divider orientation="horizontal" />
                          <FormRow py={2}>
                            <InfoText label="Objeto da Licitação">
                              {strIfNotNull(itemLicitacao?.licitacao.objeto)}
                            </InfoText>
                          </FormRow>
                          <Divider orientation="horizontal" />
                          <FormRow>
                            <InfoText label="Forma Compra">
                              {strIfNotNull(itemLicitacao?.licitacao.formaCompra.nome)} ({strIfNotNull(itemLicitacao?.licitacao.formaCompra.sigla)})
                            </InfoText>
                            <InfoText label="Modalidade Compra">
                              {strIfNotNull(itemLicitacao?.licitacao.modalidadeCompra.nome)} ({strIfNotNull(itemLicitacao?.licitacao.modalidadeCompra.codigo)})
                            </InfoText>
                          </FormRow>
                          <Divider orientation="horizontal" />
                          <FormRow>
                            <InfoText label="Unidade Gestora">
                              {strIfNotNull(itemLicitacao?.licitacao.unidadeGestora.nome)} ({strIfNotNull(itemLicitacao?.licitacao.unidadeGestora.codigo)})
                            </InfoText>
                          </FormRow>
                          <Divider orientation="horizontal" />
                          <FormRow>
                            <InfoText label="Órgão">
                              { itemLicitacao?.licitacao.orgao != null ? <>
                                {strIfNotNull(itemLicitacao?.licitacao.orgao.nome)} ({strIfNotNull(itemLicitacao?.licitacao.orgao.codigo)})
                              </> : '-' }
                            </InfoText>
                          </FormRow>
                          
                          { (itemLicitacao?.licitacao.orgao != null && !itemLicitacao?.licitacao.orgao.ehsuperior) &&
                            <div>
                              <Divider orientation="horizontal" />
                              <FormRow>
                                <InfoText label="Órgão Superior">
                                  {strIfNotNull(itemLicitacao?.licitacao.orgaoSuperior.nome)} ({strIfNotNull(itemLicitacao?.licitacao.orgaoSuperior.codigo)})
                                </InfoText>
                              </FormRow>
                            </div>
                          }
                        </section>
                      }

                      { hasSelectedValue([INFO_TYPE.TODOS, INFO_TYPE.LINKS]) && itemLicitacao?.links != undefined && itemLicitacao?.links.length > 0 &&
                        <section className='flex-1 w-full gap-4 pb-6'>
                          <InfoTitle>Links Úteis</InfoTitle>
                          <Divider orientation="horizontal" />
                          <Spacer y={3} />
                          <FormRow defwrap={false} className="flex-wrap">
                          { itemLicitacao.links.map(i => 
                            <Button className="" key={i.nome} color="primary" variant="ghost" href={i.url} target="_blank" as={Link}>
                              {i.nome}
                            </Button>
                          )}
                          </FormRow>
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