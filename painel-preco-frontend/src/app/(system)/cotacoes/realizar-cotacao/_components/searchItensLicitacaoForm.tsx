"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm, SubmitHandler, SubmitErrorHandler, Controller } from "react-hook-form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import InputForm from "@/components/molecules/InputForm";
import {
  schema,
  type FormDataCotacao,
  type IPropsSearchItensLicitacaoForm,
  isFieldAutocompleteAsync,
  TipoBuscaDescricao,
  TipoBuscaDescricaoLabel,
} from "./utils";
import { Label } from "@/components/ui/label";
import { ArrowUpDown, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCotacaoFields } from "@/hooks/useCotacaoFields";
import SortSelect from "@/components/atoms/SortSelect";
import DynamicFormField from "./DynamicFormField";
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
import { useLabelCache } from "@/hooks/useLabelCache";
import {
  normalizeLegacySearchParams,
  stableSerializeState,
} from "./buildBackendParams";
import {
  defaultFormValues,
  formValuesToQuery,
  queryToFormValues,
  useCotacaoQueryStates,
} from "./cotacaoQuery";

const buildCanonicalParams = (state: Record<string, unknown>) => {
  const params = new URLSearchParams();
  const hasSort =
    typeof state.sort === "string" && state.sort.trim().length > 0;
  Object.entries(state).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === "dir" && !hasSort) return;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed === "" || trimmed === "0") return;
      params.set(key, trimmed);
      return;
    }
    params.set(key, String(value));
  });
  return params;
};

export default function SearchItensLicitacaoForm({
  anosCompras,
  empresaPorte,
  esferas,
  compraFormas,
  compraModalidades,
  compraPeriodos,
  situacoesLicitacoes,
  unidadesFederativas,
  variant = "page",
  onAfterSubmit,
}: IPropsSearchItensLicitacaoForm) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [queryState, setQueryState] = useCotacaoQueryStates();
  const { getLabel, setLabel, ensureLabel } = useLabelCache();

  const [doingRequest, setDoingRequest] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const initializedRef = useRef(false);
  const lastAppliedRef = useRef(stableSerializeState(queryState));

  const filteredAnosCompras = useMemo(() => {
    if (!anosCompras) return [];
    const currentYear = new Date().getFullYear();
    return anosCompras.filter((item) => {
      const itemYear = parseInt(item.label);
      return !isNaN(itemYear) && itemYear <= currentYear;
    });
  }, [anosCompras]);

  const initialDefaultsRef = useRef<FormDataCotacao | null>(null);
  if (!initialDefaultsRef.current) {
    initialDefaultsRef.current = queryToFormValues(queryState);
  }

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormDataCotacao>({
    resolver: zodResolver(schema),
    defaultValues: initialDefaultsRef.current ?? defaultFormValues,
  });

  const ufId = watch("ufId");
  const watchedValues = watch();

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

  useEffect(() => {
    const { params, changed } = normalizeLegacySearchParams(searchParams);
    if (changed) {
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    }
  }, [searchParams, router, pathname]);

  useEffect(() => {
    const snapshot = stableSerializeState(queryState);

    if (!initializedRef.current) {
      initializedRef.current = true;
      reset(queryToFormValues(queryState));
      lastAppliedRef.current = snapshot;
      setLoading(false);
      return;
    }

    if (!isDirty && snapshot !== lastAppliedRef.current) {
      reset(queryToFormValues(queryState));
      lastAppliedRef.current = snapshot;
    }
  }, [queryState, reset, isDirty]);

  useEffect(() => {
    Object.entries(fields).forEach(([fieldName, fieldConfig]) => {
      if (isFieldAutocompleteAsync(fieldConfig) && fieldConfig.auto.apiFindDesc) {
        const value = (watchedValues as any)[fieldName] as string | undefined;
        if (value) {
          ensureLabel(fieldName, value, fieldConfig.auto.apiFindDesc);
        }
      }
    });
  }, [fields, watchedValues, ensureLabel]);

  const getSelectedLabel = (name: keyof FormDataCotacao) => {
    const value = (watchedValues as any)[name] as string | undefined;
    if (!value) return undefined;
    return getLabel(name as string, value);
  };

  const onSubmit: SubmitHandler<FormDataCotacao> = async (data) => {
    if (doingRequest) return;
    try {
      setDoingRequest(true);

      const cleaned = formValuesToQuery(data);
      const nextQuery = {
        ...cleaned,
        page: 0,
        size: queryState.size ?? 10,
        sort: queryState.sort,
        dir: queryState.dir,
      };

      await setQueryState(nextQuery, { history: "replace" });
      lastAppliedRef.current = stableSerializeState(nextQuery);
      reset(data);

      if (variant === "inline") {
        notify("success", "Filtros aplicados", "A listagem foi atualizada.");
        onAfterSubmit?.();
      } else {
        const canonicalParams = buildCanonicalParams(nextQuery);
        router.push(
          `${"/cotacoes/listagem"}${canonicalParams.toString() ? `?${canonicalParams.toString()}` : ""
          }`
        );
      }
    } catch (e) {
      // noop
    } finally {
      setDoingRequest(false);
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
      "Por favor, verifique os campos obrigatórios antes de continuar."
    );
  };

  const handleTrashClick = (
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (e) e.preventDefault();
    setIsModalOpen(true);
  };

  const clearForm = async () => {
    const clearedQuery = {
      ano: null,
      porteFornecedorId: null,
      esferaId: null,
      formaCompraId: null,
      modalidadeId: null,
      periodoCompraId: null,
      descricao: null,
      ufId: null,
      municipioId: null,
      orgaoSuperiorId: null,
      orgaoId: null,
      fornecedorId: null,
      materialId: null,
      ugId: null,
      objeto: null,
      descricaoComplementar: null,
      situacaoId: null,
      unidadeFornecimentoId: null,
      page: null,
      size: null,
      sort: null,
      dir: null,
    };

    reset(defaultFormValues);
    await setQueryState(clearedQuery, { history: "replace" });
    lastAppliedRef.current = stableSerializeState(clearedQuery);
    setIsModalOpen(false);
  };

  if (loading) {
    return <LoadingForm />;
  }

  const searchHelpContent = (
    <>
      <p>Considerando a busca <strong>"serviço de xerox"</strong>:</p>
      <ul className="space-y-2">
        <li><strong>Qualquer palavra:</strong> Retorna itens que contenham pelo menos uma das palavras (ex: "serviço OU xerox"). Ignora artigos, preposições, conjunções, etc.</li>
        <li><strong>Todas as palavras:</strong> Retorna itens que contenham todas as palavras, independentemente da ordem (ex: "serviço E xerox"). Ignora artigos, preposições, conjunções, etc.</li>
        <li><strong>Frase exata:</strong> Retorna itens que contenham exatamente a frase digitada na ordem (ex: "serviço de xerox").</li>
      </ul>
    </>
  );

  const formContent = (
    <form
      onSubmit={handleSubmit(onSubmit, onSubmitError)}
      className="w-full mx-auto p-2 space-y-6"
    >
      <div className="grid grid-cols-1 gap-2 mb-2">
        <InputForm
          as="textarea"
          name="descricao"
          control={control}
          placeholder="Descreva o item ou serviço para cotação..."
          inputClassName="min-h-[100px] resize-none bg-surface-plain"
          label="Descrição"
        />
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 text-sm mt-2">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-foreground">Opções de Busca:</span>
            {/* Desktop Tooltip */}
            <div className="hidden md:block">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full">
                      <HelpCircle className="w-4 h-4 cursor-help" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs text-xs space-y-3 p-3 z-50">
                    {searchHelpContent}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Mobile Dialog */}
            <div className="block md:hidden">
              <Dialog>
                <DialogTrigger asChild>
                  <button type="button" className="flex items-center gap-1 text-xs font-medium text-primary dark:text-white hover:text-primary/80 dark:hover:text-white/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded p-1">
                    <HelpCircle className="w-4 h-4" />
                    <span className="underline underline-offset-2">Como funciona?</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] w-full rounded-lg p-4 z-50">
                  <DialogHeader>
                    <DialogTitle className="text-base text-left text-primary">Opções de Busca</DialogTitle>
                  </DialogHeader>
                  <div className="text-sm space-y-3 mt-2">
                    {searchHelpContent}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <Controller
            name="tipoBuscaDescricao"
            control={control}
            render={({ field }) => (
              <div className="flex flex-wrap gap-3 md:gap-4">
                {Object.values(TipoBuscaDescricao).map((tipo) => (
                  <label key={tipo} className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="radio"
                      value={tipo}
                      checked={(field.value || TipoBuscaDescricao.TODAS_PALAVRAS) === tipo}
                      onChange={() => field.onChange(tipo)}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                    <span>{TipoBuscaDescricaoLabel[tipo]}</span>
                  </label>
                ))}
              </div>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DynamicFormField
          name="ufId"
          attr={fields.ufId}
          control={control}
          errors={errors}
          selectedLabel={getSelectedLabel("ufId")}
          onLabelResolved={(id, label) => setLabel("ufId", id, label)}
        />
        <DynamicFormField
          name="municipioId"
          attr={fields.municipioId}
          control={control}
          errors={errors}
          selectedLabel={getSelectedLabel("municipioId")}
          onLabelResolved={(id, label) =>
            setLabel("municipioId", id, label)
          }
        />
        <DynamicFormField
          name="ugId"
          attr={fields.ugId}
          control={control}
          errors={errors}
          selectedLabel={getSelectedLabel("ugId")}
          onLabelResolved={(id, label) => setLabel("ugId", id, label)}
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
          name="unidadeFornecimentoId"
          attr={fields.unidadeFornecimentoId}
          control={control}
          errors={errors}
          selectedLabel={getSelectedLabel("unidadeFornecimentoId")}
          onLabelResolved={(id, label) =>
            setLabel("unidadeFornecimentoId", id, label)
          }
        />
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DynamicFormField
            name="porteFornecedorId"
            attr={fields.porteFornecedorId}
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
          <DynamicFormField
            name="modalidadeId"
            attr={fields.modalidadeId}
            control={control}
            errors={errors}
          />
          <DynamicFormField
            name="situacaoId"
            attr={fields.situacaoId}
            control={control}
            errors={errors}
          />
          <DynamicFormField
            name="orgaoSuperiorId"
            attr={fields.orgaoSuperiorId}
            control={control}
            errors={errors}
            selectedLabel={getSelectedLabel("orgaoSuperiorId")}
            onLabelResolved={(id, label) =>
              setLabel("orgaoSuperiorId", id, label)
            }
          />
          <DynamicFormField
            name="orgaoId"
            attr={fields.orgaoId}
            control={control}
            errors={errors}
            selectedLabel={getSelectedLabel("orgaoId")}
            onLabelResolved={(id, label) => setLabel("orgaoId", id, label)}
          />
          <DynamicFormField
            name="fornecedorId"
            attr={fields.fornecedorId}
            control={control}
            errors={errors}
            selectedLabel={getSelectedLabel("fornecedorId")}
            onLabelResolved={(id, label) =>
              setLabel("fornecedorId", id, label)
            }
          />
          <DynamicFormField
            name="materialId"
            attr={fields.materialId}
            control={control}
            errors={errors}
            selectedLabel={getSelectedLabel("materialId")}
            onLabelResolved={(id, label) =>
              setLabel("materialId", id, label)
            }
          />

          <InputForm
            name="objeto"
            control={control}
            placeholder="Objeto da licitação"
            label="Objeto"
          />
          <InputForm
            name="descricaoComplementar"
            control={control}
            placeholder="Descrição complementar"
            label="Descrição Complementar"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5 col-span-1 lg:col-start-3">
          <Label className="flex items-center gap-1.5 text-sm font-medium">
            <ArrowUpDown className="w-4 h-4" />
            Ordenação
          </Label>
          <Controller
            name="sort"
            control={control}
            render={({ field }) => (
              <SortSelect
                value={field.value ?? ""}
                onValueChange={field.onChange}
              />
            )}
          />
        </div>
      </div>


      <div className="pt-4 flex justify-end">
        <SearchButtons
          clearForm={handleTrashClick}
          doingRequest={doingRequest}
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
          showAdvancedForm={showAdvanced}
          handleAdvancedFormClick={() => setShowAdvanced((prev) => !prev)}
          onConfirmClear={clearForm}
        />
      </div>
    </form>
  );

  if (variant === "inline") {
    return formContent;
  }

  return (
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
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}
