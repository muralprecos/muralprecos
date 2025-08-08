import AutocompleteForm from "@/components/molecules/AutocompleteForm";
import SelectForm from "@/components/molecules/SelectForm";
import {
  isFieldAutocompleteAsync,
  isFieldAutocompleteStatic,
  isFieldSelect,
  type FieldFormTypes,
  type FormDataCotacao,
} from "./utils";
import { AutocompleteAsyncForm } from "@/components/molecules/AutocompleteAsyncForm";

type Props = {
  name: keyof FormDataCotacao;
  attr: FieldFormTypes | undefined;
  control: any;
  errors: any;
};

export default function DynamicFormField({
  name,
  attr,
  control,
  errors,
}: Props) {
  if (isFieldSelect(attr)) {
    return (
      <SelectForm
        name={name}
        label={attr.label}
        control={control}
        items={attr.items}
        errors={errors}
      />
    );
  }

  if (isFieldAutocompleteStatic(attr)) {
    return (
      <AutocompleteForm
        name={name}
        label={attr.label}
        control={control}
        items={attr.items}
        errors={errors}
      />
    );
  }

  if (isFieldAutocompleteAsync(attr)) {
    return (
      <AutocompleteAsyncForm
        name={name}
        label={attr.label}
        attrVal={attr.auto.attrVal}
        control={control}
        disabled={attr.auto.isDisabled}
        errors={errors}
        autocompleteHook={attr.auto.async}
      />
    );
  }

  return null;
}
