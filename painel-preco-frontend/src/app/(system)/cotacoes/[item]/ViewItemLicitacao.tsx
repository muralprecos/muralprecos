"use client";

import FormTitle from "@/components/atoms/FormTitle";
import { IItemLicitacao } from "@/interfaces/types";
import { useEffect, useState } from "react";
import InfoText from "@/components/atoms/InfoText";
import InfoTitle from "@/components/atoms/InfoTitle";
import CartButton from "@/components/molecules/CartButton";
import { isClientNextjs } from "@/utils/validateUtils";
import {
  formatCurrency,
  parseCurrency,
  calcUnityValueByQuantity,
} from "@/utils/formatCurrency";
import { useSnackbar } from "notistack";
import LoadingItem from "@/components/molecules/LoadingItem";
import { strIfNotNull } from "@/utils/convertData";
import { catchErrorFromFetch } from "@/utils/requestUtils";
import { apiClientGetItemCotacao } from "@/hooks/apiclient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { notify } from "@/components/molecules/NotifyToast";

export interface IPropsViewItensLicitacao {
  uuidItem: string;
}

const INFO_TYPE = {
  TODOS: "all",
  ITEM: "item",
  LICITACAO: "licitacao",
  LINKS: "links",
};

export default function ViewItemLicitacao(props: IPropsViewItensLicitacao) {
  const { uuidItem } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [itemLicitacao, setItemLicitacao] = useState<IItemLicitacao | null>();

  useEffect(() => {
    const fetchData = async () => {
      if (isClientNextjs()) {
        setIsLoading(true);
        try {
          const req: IItemLicitacao | null = await apiClientGetItemCotacao([
            { val: uuidItem, param: "uuid" },
          ]);
          setIsLoading(false);

          if (req) {
            setItemLicitacao(req);
          } else {
            notify("error", "Problema ao carregar item, tente novamente!");
          }
        } catch (e) {
          catchErrorFromFetch(e, "carregar item");
        }
      }
    };
    fetchData();
  }, [uuidItem]);

  const showTitle = () => {
    return itemLicitacao != null
      ? itemLicitacao.descricao
      : isLoading
      ? "Carregando Item..."
      : "Item não encontrado";
  };

  const hastItens = () => {
    return itemLicitacao != null;
  };

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
    },
  ];

  const [selectedKeys, setSelectedKeys] = useState<Iterable<string | number>>(
    new Set([INFO_TYPE.TODOS])
  );
  const selectValue = (value: string): void => {
    setSelectedKeys(new Set([value]));
  };

  const [selectedKey, setSelectedKey] = useState<string>(INFO_TYPE.TODOS);

  const hasSelectedValue = (vals: string[]) => {
    return vals.includes(selectedKey);
  };

  return (
    <div className="p-6">
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col items-start justify-start">
            <FormTitle
              backButton={true}
              cartButton={true}
              title={showTitle()}
            />
            <Separator className="my-4" />

            <div className="flex flex-col items-start justify-start w-full">
              {isLoading && <LoadingItem />}

              {!hastItens() && !isLoading && (
                <div className="flex flex-col w-full items-start justify-start py-8">
                  <p className="text-muted-foreground">
                    Item de Licitação não encontrado. Tente novamente.
                  </p>
                </div>
              )}

              {hastItens() && !isLoading && (
                <div className="flex lg:flex-row flex-col w-full items-start justify-start gap-6">
                  <div className="flex flex-col items-start justify-start lg:basis-1/4 w-full gap-4">
                    <div className="flex flex-col border rounded-lg w-full overflow-hidden">
                      <div className="bg-primary/5 p-4 border-b">
                        <h3 className="text-sm font-bold uppercase text-primary text-center">
                          Modos de Visualização
                        </h3>
                      </div>
                      <div className="p-2">
                        <Select
                          value={selectedKey}
                          onValueChange={(value) => setSelectedKey(value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione uma opção" />
                          </SelectTrigger>
                          <SelectContent>
                            {items.map((item) => (
                              <SelectItem key={item.key} value={item.key}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="w-full">
                      <CartButton itemRetornoLicitacao={itemLicitacao} />
                    </div>
                  </div>

                  <div className="flex flex-col items-start justify-start lg:basis-3/4 w-full space-y-8">
                    {hasSelectedValue([INFO_TYPE.TODOS, INFO_TYPE.ITEM]) && (
                      <section className="w-full">
                        <InfoTitle>Informações Gerais do Item</InfoTitle>
                        <Separator className="mb-6" />

                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoText label="Quantidade" orientation="row">
                              {strIfNotNull(itemLicitacao?.quantidade)}
                            </InfoText>
                            <InfoText label="Unidade" orientation="row">
                              {strIfNotNull(
                                itemLicitacao?.unidadeFornecimento?.nome
                              )}
                            </InfoText>
                          </div>

                          <Separator />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoText label="Valor Total" orientation="row">
                              {strIfNotNull(itemLicitacao?.valor)}
                            </InfoText>
                            <InfoText
                              label="Valor por Unidade"
                              orientation="row"
                            >
                              {strIfNotNull(
                                formatCurrency(
                                  calcUnityValueByQuantity(
                                    parseCurrency(itemLicitacao?.valor || "0"),
                                    itemLicitacao?.quantidade ?? 0
                                  )
                                )
                              )}
                            </InfoText>
                          </div>

                          <Separator />

                          <InfoText label="Descrição">
                            {strIfNotNull(itemLicitacao?.descricao)}
                          </InfoText>

                          <Separator />

                          <InfoText label="Unidade de Fornecimento">
                            {strIfNotNull(
                              itemLicitacao?.unidadeFornecimento?.nome
                            )}
                          </InfoText>

                          <Separator />

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InfoText label="Fornecedor">
                              {strIfNotNull(itemLicitacao?.fornecedor.nome)}
                            </InfoText>
                            <InfoText label="Porte">
                              {strIfNotNull(
                                itemLicitacao?.fornecedor.porte?.nome
                              )}
                            </InfoText>
                            <InfoText label="Documento">
                              {strIfNotNull(
                                itemLicitacao?.fornecedor.documento
                              )}
                            </InfoText>
                          </div>
                        </div>
                      </section>
                    )}

                    {hasSelectedValue([
                      INFO_TYPE.TODOS,
                      INFO_TYPE.LICITACAO,
                    ]) && (
                      <section className="w-full">
                        <InfoTitle>Dados da Licitação</InfoTitle>
                        <Separator className="mb-6" />

                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InfoText label="Ano Compra" orientation="row">
                              {strIfNotNull(itemLicitacao?.licitacao.anoCompra)}
                            </InfoText>
                            <InfoText label="Data Abertura" orientation="row">
                              {strIfNotNull(
                                itemLicitacao?.licitacao.dataAbertura
                              )}
                            </InfoText>
                            <InfoText label="Data Resultado" orientation="row">
                              {strIfNotNull(
                                itemLicitacao?.licitacao.dataResultadoCompra
                              )}
                            </InfoText>
                          </div>

                          <Separator />

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InfoText label="Processo" orientation="row">
                              {strIfNotNull(
                                itemLicitacao?.licitacao.numeroProcesso
                              )}
                            </InfoText>
                            <InfoText label="Situação" orientation="row">
                              {strIfNotNull(
                                itemLicitacao?.licitacao.situacao.nome
                              )}
                            </InfoText>
                            <InfoText label="Valor" orientation="row">
                              {strIfNotNull(itemLicitacao?.licitacao.valor)}
                            </InfoText>
                          </div>

                          <Separator />

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InfoText label="Esfera" orientation="row">
                              {strIfNotNull(
                                itemLicitacao?.licitacao.esfera.nome
                              )}
                            </InfoText>
                            <InfoText label="Estado" orientation="row">
                              {strIfNotNull(
                                itemLicitacao?.licitacao.municipio.uf.nome
                              )}{" "}
                              (
                              {strIfNotNull(
                                itemLicitacao?.licitacao.municipio.uf.sigla
                              )}
                              )
                            </InfoText>
                            <InfoText label="Município" orientation="row">
                              {strIfNotNull(
                                itemLicitacao?.licitacao.municipio.nome
                              )}
                            </InfoText>
                          </div>

                          <Separator />

                          <InfoText label="Objeto da Licitação">
                            {strIfNotNull(itemLicitacao?.licitacao.objeto)}
                          </InfoText>

                          <Separator />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoText label="Modo de Disputa" orientation="row">
                              {strIfNotNull(
                                itemLicitacao?.licitacao.formaCompra.nome
                              )}
                            </InfoText>
                            <InfoText
                              label="Modalidade Compra"
                              orientation="row"
                            >
                              {strIfNotNull(
                                itemLicitacao?.licitacao.modalidadeCompra.nome
                              )}{" "}
                              (
                              {strIfNotNull(
                                itemLicitacao?.licitacao.modalidadeCompra.codigo
                              )}
                              )
                            </InfoText>
                          </div>

                          <Separator />

                          <InfoText label="Unidade" orientation="row">
                            {strIfNotNull(
                              itemLicitacao?.licitacao.unidadeGestora.nome
                            )}{" "}
                            (
                            {strIfNotNull(
                              itemLicitacao?.licitacao.unidadeGestora.codigo
                            )}
                            )
                          </InfoText>

                          <Separator />

                          <InfoText label="Órgão" orientation="row">
                            {itemLicitacao?.licitacao.orgao != null
                              ? strIfNotNull(
                                  itemLicitacao?.licitacao.orgao.nome
                                )
                              : "-"}
                          </InfoText>

                          {itemLicitacao?.licitacao.orgao != null &&
                            !itemLicitacao?.licitacao.orgao.ehsuperior && (
                              <>
                                <Separator />
                                <InfoText
                                  label="Órgão Superior"
                                  orientation="row"
                                >
                                  {strIfNotNull(
                                    itemLicitacao?.licitacao.orgaoSuperior.nome
                                  )}
                                </InfoText>
                              </>
                            )}
                        </div>
                      </section>
                    )}

                    {hasSelectedValue([INFO_TYPE.TODOS, INFO_TYPE.LINKS]) &&
                      itemLicitacao?.links != undefined &&
                      itemLicitacao?.links.length > 0 && (
                        <section className="w-full">
                          <InfoTitle>Links Úteis</InfoTitle>
                          <Separator className="mb-6" />

                          <div className="flex flex-wrap gap-3">
                            {itemLicitacao.links.map((link) => (
                              <Button
                                key={link.nome}
                                variant="outline"
                                asChild
                                className="text-orange-600 border-orange-200"
                              >
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {link.nome}
                                </a>
                              </Button>
                            ))}
                          </div>
                        </section>
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
