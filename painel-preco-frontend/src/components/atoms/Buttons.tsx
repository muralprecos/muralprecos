"use client";

import { useRouter } from "next/navigation";
import { Button, type ButtonProps } from "../ui/button";

export function ButtonNewQuote({ variant = "default", ...props }: ButtonProps) {
  const router = useRouter();

  const handleNewQuote = () => {
    router.push("/cotacoes/realizar-cotacao");
  };

  return (
    <Button
      variant={variant}
      className="btn btn-primary"
      onClick={handleNewQuote}
      {...props}
    >
      Nova Cotação
    </Button>
  );
}

export function CartButton({ variant = "default", ...props }: ButtonProps) {
  const router = useRouter();

  const handleCart = () => {
    router.push("/carrinho");
  };

  return (
    <Button
      variant={variant}
      className="btn btn-primary"
      onClick={handleCart}
      {...props}
    >
      Ir para o Carrinho
    </Button>
  );
}

export function BackButton({ variant = "secondary", ...props }: ButtonProps) {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <Button
      variant={variant}
      className="btn btn-primary"
      onClick={goBack}
      {...props}
    >
      Voltar
    </Button>
  );
}
