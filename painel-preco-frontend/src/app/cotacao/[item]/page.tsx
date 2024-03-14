
import { redirect,  } from "next/navigation";
import { CheckRolesStrategy } from "@/utils/sessionTokenAccessor";
import { auth } from "auth";
import { checkSession } from "@/utils/sessionCheckerServerUtils";
import ViewItemLicitacao from "../[item]/pageClient";

export default async function PageItemCotacao({ params } : { params : { item: string } }) {

  const session = await auth();
  const { redirectUrl, accessToken, hasAuthorization } = await checkSession(session, [], CheckRolesStrategy.INCLUDES_ALL);
  if (!hasAuthorization || !accessToken) {
    redirect(redirectUrl ?? '/');
  }

  return (
    <ViewItemLicitacao params={params}  session={session} accessToken={accessToken} />
  );
}