import { getServerSession, Session } from "next-auth";
import { options } from "../app/api/auth/[...nextauth]/options";
import { decrypt } from "./encryption";

export async function getAccessToken() {
  const session = await getServerSession(options);  
  if (!!session && !!session.access_token){    
    const accessTokenDecrypted = decrypt(session.access_token)    
    return accessTokenDecrypted;
  }
  return null;
}

export async function getIdToken() {
  const session = await getServerSession(options);  
  if (!!session && !!session.id_token){    
    const idTokenDecrypted = decrypt(session.id_token)    
    return idTokenDecrypted;
  }
  return null;
}

export async function getAccessTokenClient(session: Session|null) {
  if (!!session && !!session.access_token){    
    const accessTokenDecrypted = decrypt(session.access_token)    
    return accessTokenDecrypted;
  }
  return null;
}