import { IItemSelect } from "@/interfaces/types";
import { EnqueueSnackbar } from "notistack";

export function addSnackError(enqueueSnackbar: EnqueueSnackbar, title: string) {
  enqueueSnackbar(title, { 
    variant: 'error',
    preventDuplicate: true
  })
}

export function addSnackSuccess(enqueueSnackbar: EnqueueSnackbar, title: string) {
  enqueueSnackbar(title, { 
    variant: 'success',
    preventDuplicate: true
  })
}

export function addSnackIfSelectEmpty(enqueueSnackbar: EnqueueSnackbar, title: string, list: IItemSelect[]) {
  if(list == null || list.length < 1) {
    enqueueSnackbar(`Lista de ${title} não foi carregada.`, { 
      variant: 'error',
      preventDuplicate: true
    })
  }
}