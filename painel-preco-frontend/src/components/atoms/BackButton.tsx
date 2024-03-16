'use client'

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

type FormTitleProps = {
} & React.AllHTMLAttributes<HTMLElement>

const BackButton: React.FC<FormTitleProps> = ({
  ...opts
}) => {

  const router = useRouter();

  const goBack = () => {
    router.back();
  }

  return (
    <Button color="secondary" type="button" onClick={goBack}>
      Voltar
    </Button>
  );
};

export default BackButton;