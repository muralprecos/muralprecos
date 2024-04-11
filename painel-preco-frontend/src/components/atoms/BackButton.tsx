'use client'

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

type FormTitleProps = {
  label?: string
} & React.AllHTMLAttributes<HTMLElement>

const BackButton: React.FC<FormTitleProps> = ({
  label,
  ...opts
}) => {

  const router = useRouter();

  const goBack = () => {
    router.back();
  }

  return (
    <Button color="default" type="button" onClick={goBack}>
      <span className="block md:hidden">Voltar</span>
      <span className="hidden md:block">{ label != null ? `Voltar para ${label}` : 'Voltar' }</span>
    </Button>
  );
};

export default BackButton;