import { ICart, IRetornoPesquisaItensLicitacao } from "@/interfaces/types";
import { ClientSession } from "@/interfaces/auth";

export const getUsernameBySession = (session: ClientSession | null): string => {
  return session?.userInfo?.preferred_username ?? "Usuário Anônimo";
}
export const getUserCartBySession = (cartList: ICart, session: ClientSession | null): IRetornoPesquisaItensLicitacao[] => {
  return getUserCart(cartList, getUsernameBySession(session));
}

export const getUserCart = (cartList: ICart, usr: string | null): IRetornoPesquisaItensLicitacao[] => {
  if (usr == null || cartList == null) return [];
  return cartList[usr] != null ? cartList[usr] : [];
}