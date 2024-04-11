"use client";

import { Button, ButtonProps } from "@nextui-org/react";
import { downloadPDF } from "@/utils/fileUtils";
import React from "react";

type IDownloadButton = {
  children: React.ReactNode
  filename: string
  file: string
} & ButtonProps;

const DownloadButton: React.FC<IDownloadButton> = ({children, filename, file, ...opts}) => {

  const download = async () => {
    downloadPDF(filename, file);
  }

  return (
    <Button type="button" color='primary' onClick={() => { download() }} {...opts}>
      {children}
    </Button>
  )
}

export default DownloadButton;