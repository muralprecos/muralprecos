
import { authOptions } from "../[...nextauth]/options";
import { getServerSession } from "next-auth"
import { getIdToken } from "@/utils/sessionTokenAccessor";
import logger from "../../../../../services/logger";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session) {

    const idToken = await getIdToken();
    const URL = `${process.env.END_SESSION_URL}`;
    const client = `${process.env.KEYCLOAK_ID}`;
    // const redirect = encodeURIComponent(`${process.env.NEXTAUTH_URL}`);

    try {
      if (idToken != null && client != null) {
        const resp = await fetch(URL, { 
          method: "POST",
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            'id_token_hint': idToken,
            'client_id': client
          })
        });
        return resp;
      } else {
        return new Response(null, { status: 500 });
      }
    } catch (err) {
      logger.error('Logout error');
      logger.error(err);
      return new Response(null, { status: 500 });
    }
  }
  return new Response(null, { status: 400 });
}