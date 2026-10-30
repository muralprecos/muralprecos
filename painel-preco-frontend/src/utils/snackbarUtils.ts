import { notify } from "@/components/molecules/NotifyToast";
import type { IItemSelect } from "@/interfaces/types";

export function addSnackError(title: string) {
  notify("error", title);
}

export function addSnackSuccess(title: string) {
  notify("success", title);
}

export function addSnackIfSelectEmpty(title: string, list: IItemSelect[]) {
  if (!list || list.length < 1) {
    notify("error", `Lista de ${title} não foi carregada.`);
  }
}
