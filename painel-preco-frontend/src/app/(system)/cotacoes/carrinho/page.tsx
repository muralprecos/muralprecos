import { auth } from "@/lib/auth";
import CartPage from "./ViewCart";

export default async function PageCarrinho() {
  const session = await auth();

  return <CartPage session={session} />;
}
