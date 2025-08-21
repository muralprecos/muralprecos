"use client";

import { useCallback, useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { FIELDS_COTACOES_LIST } from "@/hooks/api";

import { objToParamSearch } from "@/utils/searchParamUtils";
import { useAppSelector } from "@/store/store";
import {
  doSearch,
  initialFormData,
} from "@/store/features/cotacao-search-slice";
import { isClientNextjs } from "@/utils/validateUtils";
import { useRouter } from "next/navigation";
import { mountUrl } from "@/utils/requestUtils";

import InputForm from "@/components/molecules/InputForm";
import {
  schema,
  type FieldFormAutocompleteAsync,
  type FieldFormTypes,
  type FormDataCotacao,
  type IPropsSearchItensLicitacaoForm,
} from "./utils";
import { useCotacaoFields } from "@/hooks/useCotacaoFields";
import DynamicFormField from "./DynamicFormField";
import { useDispatch } from "react-redux";
import LoadingForm from "@/components/molecules/LoadingForm";
import { SearchButtons } from "./SearchButtons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Car, ClipboardList } from "lucide-react";
import FormTitle from "@/components/atoms/FormTitle";
import { Icon } from "@iconify/react";

export default function SearchItensLicitacaoForm({
  session,
  searchParams,
  anosCompras,
  empresaPorte,
  esferas,
  compraFormas,
  compraModalidades,
  compraPeriodos,
  situacoesLicitacoes,
  unidadesFederativas,
  ...opts
}: IPropsSearchItensLicitacaoForm) {
  const router = useRouter();
  const dispatch = useDispatch();
  const _initialFormDataLocalStorage: FormDataCotacao = useAppSelector(
    (state) => state.cotacaoSearchReducer.value
  );
  const [doingRequest, setDoingRequest] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAdvancedForm, setShowAdvancedForm] = useState<boolean>(false);
  const [lastUF, setLastUF] = useState<string | null>();
  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    watch,
    resetField,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormDataCotacao>({
    resolver: yupResolver(schema),
    defaultValues: initialFormData,
  });

  const ufId = watch("ufId");
  const hasUF = useCallback(() => {
    return ufId != undefined && ufId != "";
  }, [ufId]);

  const onSubmit: SubmitHandler<FormDataCotacao> = async (data) => {
    if (!doingRequest) {
      try {
        setDoingRequest(true);
        dispatch(doSearch(data));
        const info = objToParamSearch(data);
        router.push(
          mountUrl({
            host: "",
            path: "/cotacoes/listagem",
            page: 0,
            size: 20,
            info,
            filterFields: FIELDS_COTACOES_LIST,
          })
        );
      } catch (e) {
        setDoingRequest(false);
      }
    }
  };

  const onSubmitError: SubmitErrorHandler<FormDataCotacao> = (data) => {
    setDoingRequest(false);
  };

  const clearForm = (
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    defVals?: FormDataCotacao
  ) => {
    if (e != null) {
      e.preventDefault();
    }
    reset(defVals);
    Object.keys(fields).forEach((k) => {
      const key = k as keyof FormDataCotacao;
      const v = fields[key];
      if (v != undefined && isFieldAutocompleteAsync(v)) {
        v.auto.async.setFilterText("");
      }
    });
    dispatch(doSearch(getValues()));
  };

  const fields = useCotacaoFields({
    ufId: ufId ?? undefined,
    anosCompras,
    empresaPorte,
    esferas,
    compraFormas,
    compraModalidades,
    compraPeriodos,
    situacoesLicitacoes,
    unidadesFederativas,
  });

  function isFieldAutocompleteAsync(
    obj: FieldFormTypes | undefined
  ): obj is FieldFormAutocompleteAsync {
    return !!obj && obj.type === "autocompleteAsync";
  }

  const municipioId = fields.municipioId;

  useEffect(() => {
    setLastUF(ufId);
    if (
      ufId !== lastUF &&
      municipioId !== undefined &&
      isFieldAutocompleteAsync(municipioId)
    ) {
      if (ufId != null) {
        municipioId.auto.async.reload();
      }
      municipioId.auto.async.setFilterText("");
      resetField("municipioId");
    }
  }, [ufId, lastUF, municipioId, resetField]);

  useEffect(() => {
    const changeVal = async (attr: keyof FormDataCotacao, val: string) => {
      const f = fields[attr];
      if (isFieldAutocompleteAsync(f)) {
        let desc = null;
        if (f.auto.apiFindDesc) {
          desc = await f.auto.apiFindDesc(val);
        } else if (f.auto.attrVal == "nome") {
          desc = val;
        }
        if (desc != null) {
          f.auto.async.setFilterText(desc);
          f.auto.async.setSelectedKeys(new Set(val));
          setValue(attr, val, {
            shouldValidate: true,
            shouldTouch: true,
            shouldDirty: true,
          });
        }
      } else {
        setValue(attr, val, {
          shouldValidate: true,
          shouldTouch: true,
          shouldDirty: true,
        });
      }
    };

    const runAsync = async () => {
      setLoading(true);
      if (isClientNextjs()) {
        for (const [key, value] of Object.entries(getValues())) {
          const k = key as keyof FormDataCotacao;
          if (
            searchParams != null &&
            Array.from(searchParams.keys()).length > 0
          ) {
            const newVal = searchParams.get(key);
            if (newVal != null && newVal != value) {
              await changeVal(k, newVal + ""); // await garante que concluí antes do próximo
            }
          } else if (initialFormData.hasOwnProperty(key)) {
            const newVal = _initialFormDataLocalStorage[k];
            if (newVal != value && !!newVal) {
              await changeVal(k, newVal + "");
            }
          }
        }
      }
      setLoading(false);
    };

    runAsync();
  }, [_initialFormDataLocalStorage, searchParams, getValues, setValue, fields]);

  const handleAdvancedFormClick = () => {
    const curPeriodo = getValues("periodoCompraId");
    const curUF = getValues("ufId");
    const curMunicipio = getValues("municipioId");
    const curDescricao = getValues("descricao");
    clearForm(undefined, {
      periodoCompraId: curPeriodo,
      ufId: curUF,
      municipioId: curMunicipio,
      descricao: curDescricao,
    });
    setShowAdvancedForm((prev) => !prev);
  };

  if (loading) {
    return <LoadingForm />; // Mostra enquanto carrega
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon icon="mdi:file-document-edit-outline" className="w-6 h-6" />
          <FormTitle title={"Realizar Cotação"}></FormTitle>
        </CardTitle>
        <CardDescription>
          Preencha os dados para realizar uma nova cotação
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit, onSubmitError)}
          className="w-full max-w-8xl mx-auto p-2 sm:p-4 lg:p-2 space-y-6"
        >
          {/* Primeira linha com 3 colunas */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <DynamicFormField
              name="periodoCompraId"
              attr={fields.periodoCompraId}
              control={control}
              errors={errors}
            />
            <DynamicFormField
              name="ufId"
              attr={fields.ufId}
              control={control}
              errors={errors}
            />
            <DynamicFormField
              name="municipioId"
              attr={fields.municipioId}
              control={control}
              errors={errors}
            />
          </div>

          {/* Linha de descrição */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <InputForm
              name="descricao"
              label="Descrição do Item"
              placeholder="Digite a Descrição do Item"
              control={control}
              errors={errors}
            />
          </div>

          {/* Campos avançados */}
          {showAdvancedForm && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <InputForm
                  name="objeto"
                  label="Objeto"
                  placeholder="Digite a Descrição do objeto"
                  control={control}
                  errors={errors}
                />
                <DynamicFormField
                  name="unidade_fornecimento"
                  attr={fields.unidade_fornecimento}
                  control={control}
                  errors={errors}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <DynamicFormField
                  name="ano"
                  attr={fields.ano}
                  control={control}
                  errors={errors}
                />
                <DynamicFormField
                  name="porteFornecedor"
                  attr={fields.porteFornecedor}
                  control={control}
                  errors={errors}
                />
                <DynamicFormField
                  name="esferaId"
                  attr={fields.esferaId}
                  control={control}
                  errors={errors}
                />
                <DynamicFormField
                  name="formaCompraId"
                  attr={fields.formaCompraId}
                  control={control}
                  errors={errors}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DynamicFormField
                  name="modalidadeCompraId"
                  attr={fields.modalidadeCompraId}
                  control={control}
                  errors={errors}
                />
                <DynamicFormField
                  name="situacao_licitacao"
                  attr={fields.situacao_licitacao}
                  control={control}
                  errors={errors}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DynamicFormField
                  name="orgaoId"
                  attr={fields.orgaoId}
                  control={control}
                  errors={errors}
                />
                <DynamicFormField
                  name="ugId"
                  attr={fields.ugId}
                  control={control}
                  errors={errors}
                />
              </div>
            </div>
          )}

          {/* Botões de ação */}
          <div className="pt-4">
            <SearchButtons
              showAdvancedForm={showAdvancedForm}
              handleAdvancedFormClick={handleAdvancedFormClick}
              setIsModalOpen={setIsModalOpen}
              isModalOpen={isModalOpen}
              clearForm={clearForm}
              doingRequest={doingRequest}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
