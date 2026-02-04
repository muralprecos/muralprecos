"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
import LoadingForm from "@/components/atoms/LoadingForm";
import { SearchButtons } from "./SearchButtons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormTitle from "@/components/atoms/FormTitle";
import { Icon } from "@iconify/react";
import { notify } from "@/components/molecules/NotifyToast";

export default function SearchItensLicitacaoForm({
  session,
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
    (state) => state.cotacaoSearchReducer.value,
  );

  const [doingRequest, setDoingRequest] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const initializedRef = useRef(false);

  const filteredAnosCompras = useMemo(() => {
    if (!anosCompras) return [];
    const currentYear = new Date().getFullYear();
    return anosCompras.filter((item) => {
      const itemYear = parseInt(item.label);
      return !isNaN(itemYear) && itemYear <= currentYear;
    });
  }, [anosCompras]);

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormDataCotacao>({
    resolver: zodResolver(schema),
    defaultValues: initialFormData,
  });

  const ufId = watch("ufId");

  const fields = useCotacaoFields({
    ufId: ufId ?? undefined,
    anosCompras: filteredAnosCompras,
    empresaPorte,
    esferas,
    compraFormas,
    compraModalidades,
    compraPeriodos,
    situacoesLicitacoes,
    unidadesFederativas,
  });

  function isFieldAutocompleteAsync(
    obj: FieldFormTypes | undefined,
  ): obj is FieldFormAutocompleteAsync {
    return !!obj && obj.type === "autocompleteAsync";
  }

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const changeVal = async (attr: keyof FormDataCotacao, val: string) => {
      const f = (fields as any)[attr];

      if (!isFieldAutocompleteAsync(f)) {
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
          if (initialFormData.hasOwnProperty(key)) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_initialFormDataLocalStorage, setValue, getValues]);
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
            size: 10,
            info,
            filterFields: FIELDS_COTACOES_LIST,
          }),
        );
      } catch (e) {
        setDoingRequest(false);
      }
    }
  };

  const onSubmitError: SubmitErrorHandler<FormDataCotacao> = (errors) => {
    setDoingRequest(false);

    const firstErrorKey = Object.keys(errors)[0];
    const errorMessage =
      errors[firstErrorKey as keyof FormDataCotacao]?.message;

    notify(
      "error",
      "Campos inválidos",
      errorMessage ||
        "Por favor, verifique os campos obrigatórios antes de continuar.",
    );
  };
  const handleTrashClick = (
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (e) e.preventDefault();
    setIsModalOpen(true);
  };

  if (loading) {
    return <LoadingForm />;
  }

  return (
    <>
      <Card className="min-h-[560px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon="mdi:file-document-edit-outline" className="w-6 h-6" />
            <FormTitle title={"Realizar Cotação"} />
          </CardTitle>
          <CardDescription>
            Preencha os dados abaixo para filtrar as cotações desejadas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit, onSubmitError)}
            className="w-full mx-auto p-2 space-y-6"
          >
            <div className="grid grid-cols-1 gap-4">
              <InputForm
                as="textarea"
                name="descricao"
                control={control}
                placeholder="Descreva o item ou serviço para cotação..."
                inputClassName="min-h-[100px] resize-none"
                label="Descrição"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <DynamicFormField
                name="ugId"
                attr={fields.ugId}
                control={control}
                errors={errors}
              />

              <DynamicFormField
                name="periodoCompraId"
                attr={fields.periodoCompraId}
                control={control}
                errors={errors}
              />
              <DynamicFormField
                name="ano"
                attr={fields.ano}
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

            <div className="pt-4 flex justify-end">
              <SearchButtons
                clearForm={handleTrashClick}
                doingRequest={doingRequest}
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
                showAdvancedForm={false}
                handleAdvancedFormClick={() => {}}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
