"use client";

import { useRouter } from "next/navigation";
import { Button, type ButtonProps } from "../ui/button";

export const ROUTE_NOVA_COTACAO : string = "/cotacoes/realizar-cotacao";
export const ROUTE_CARRINHO : string = "/carrinho";

export function ButtonNewQuote({ variant = "default", ...props }: ButtonProps) {
  const router = useRouter();

  const handleNewQuote = () => {
    router.push(ROUTE_NOVA_COTACAO);
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
    router.push(ROUTE_CARRINHO);
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

export function BackButton({ 
  variant = "secondary", 
  onClick, ...props 
}: ButtonProps & { onClick?: () => void }) {
  const router = useRouter();

  const goBack = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
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
