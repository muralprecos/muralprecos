"use client";

import { Button, ButtonProps } from "@nextui-org/react";
import { downloadBlob } from "@/utils/fileUtils";
import { getValidateCotacao } from "@/hooks/api";
import { useSnackbar } from "notistack";
import { addSnackError } from "@/utils/snackbarUtils";
import { useTheme } from "next-themes";

type IDownloadButton = {
  text?: string
  item: string
  accessToken: string
} & ButtonProps;

const DownloadButton: React.FC<IDownloadButton> = ({text = 'Baixar', item, accessToken, ...opts}) => {

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  
  const download = async (item: string) => {
    try {
      const validateCotacao = await getValidateCotacao(item, accessToken);
      if (validateCotacao != null && validateCotacao instanceof Blob) {
        downloadBlob(validateCotacao, `${item}.pdf`);
      } else {
        addSnackError(enqueueSnackbar, `Problema ao baixar a cotação ${item}, tente novamente!`);
      }
    } catch (error) {
      addSnackError(enqueueSnackbar, `Problema ao baixar a cotação ${item}, tente novamente!`);
    }
  }

  return (
    <Button type="button" color='primary' onClick={() => { download(item) }} {...opts}>
      {text}
    </Button>
  )
}

export default DownloadButton;