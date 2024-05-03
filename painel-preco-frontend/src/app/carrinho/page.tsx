
import { redirect,  } from "next/navigation";
import { CheckRolesStrategy } from "@/utils/sessionTokenAccessor";
import { auth } from "auth";
import { checkSession } from "@/utils/sessionCheckerServerUtils";
import CartPage from "./pageClient";

export default async function PageCarrinho() {

  const session = await auth();
  const { redirectUrl, accessToken, hasAuthorization } = await checkSession(session, [], CheckRolesStrategy.INCLUDES_ALL);
  if (!hasAuthorization || !accessToken) {
    redirect(redirectUrl ?? '/');
  }

  return (
    <CartPage session={session} accessToken={accessToken} />
  );
}