"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/store";
import { add, remove } from "@/store/features/cart-slice";
import { IRetornoPesquisaItensLicitacao } from "@/interfaces/types";
import { ShoppingCart, ShoppingCartIcon, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { getUserCart, getUsernameBySession } from "@/utils/cartUtils";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";

type CartButtonProps = {
  itemRetornoLicitacao?: IRetornoPesquisaItensLicitacao | null;
  isCompact?: boolean;
};

export default function CartButton({
  itemRetornoLicitacao,
  isCompact = false,
}: CartButtonProps) {
  const [mounted, setMounted] = useState(false);
  const session = useSession();
  const dispatch = useDispatch();
  const cartState = useAppSelector((state) => state.cartReducer);

  const username = getUsernameBySession(session.data);
  const cart = getUserCart(cartState, username);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !itemRetornoLicitacao) return null;
  if (!session || session.status !== "authenticated" || !username) {
    return (
      <p className="text-sm text-muted-foreground">Autentique-se novamente</p>
    );
  }

  const isInCart = cart.some((item) => item.uuid === itemRetornoLicitacao.uuid);

  const handleToggle = () => {
    const action = isInCart ? remove : add;
    dispatch(action({ item: itemRetornoLicitacao, user: username }));
  };

  return (
    <Button
      onClick={handleToggle}
      variant={isInCart ? "destructive" : "ghost"}
      size={isCompact ? "icon" : "sm"}
      className={cn(
        "transition-all rounded-full border",
        isCompact ? "rounded-full h-10 w-10" : "w-full"
      )}
      aria-label={isInCart ? "Remover do carrinho" : "Adicionar ao carrinho"}
    >
      {isInCart ? (
        <Trash2 className="h-4 w-4" />
      ) : (
        <ShoppingCartIcon className="h-4 w-4" />
      )}
      {!isCompact && (
        <span className="ml-2">
          {isInCart ? "Remover do Carrinho" : "Adicionar ao Carrinho"}
        </span>
      )}
    </Button>
  );
}
