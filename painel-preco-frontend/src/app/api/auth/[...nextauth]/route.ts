import NextAuth, { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";
import { jwtDecode } from "jwt-decode";
import { encrypt } from "@/utils/encryption";
import { IUserInfo } from "@/interfaces/types";

// this will refresh an expired access token, when needed
async function refreshAccessToken(token: JWT) {
  const body = new URLSearchParams();
  body.append('client_id', `${process.env.DEMO_FRONTEND_CLIENT_ID}`);
  body.append('client_secret', `${process.env.DEMO_FRONTEND_CLIENT_SECRET}`);
  body.append('grant_type', "refresh_token");
  body.append('refresh_token', token.refresh_token+'');

  const resp = await fetch(`${process.env.REFRESH_TOKEN_URL}`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body),
    method: "POST",
  });
  const refreshToken = await resp.json();
  if (!resp.ok) throw refreshToken;

  return {
    ...token,
    access_token: refreshToken.access_token,
    decoded: jwtDecode(refreshToken.access_token),
    id_token: refreshToken.id_token,
    expires_at: Math.floor(Date.now() / 1000) + refreshToken.expires_in,
    refresh_token: refreshToken.refresh_token,
  };
}

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: `${process.env.KEYCLOAK_ID}`,
      clientSecret: `${process.env.KEYCLOAK_SECRET}`,
      issuer: `${process.env.KEYCLOAK_ISSUER}`
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      const nowTimeStamp = Math.floor(Date.now() / 1000);
      const tokenExpires : number = token.expires_at != null ? +token.expires_at : nowTimeStamp;
      if (account) {
        // apenas na primeira chamada de login
        token.decoded = jwtDecode<IUserInfo>(`${account.access_token}`);
        token.access_token = account.access_token;
        token.id_token = account.id_token;
        token.expires_at = account.expires_at;
        token.refresh_token = account.refresh_token;
        return token;
      } else if (nowTimeStamp < tokenExpires) {
        // token ainda nao expirou
        return token;
      } else {
        // token expirou
        console.log("Token has expired. Will refresh...")
        try {
          const refreshedToken = await refreshAccessToken(token);
          console.log("Token is refreshed.")
          return refreshedToken;
        } catch (error) {
          console.error("Error refreshing access token", error);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }
      
    },
    async session({ session, token }) {
      //properties to the client without encrypt
      session.access_token = encrypt(`${token.access_token}`); // see utils/sessionTokenAccessor.js
      session.id_token = encrypt(`${token.id_token}`);  // see utils/sessionTokenAccessor.js
      session.userInfo = token.decoded;
      session.roles = token.decoded.realm_access.roles;
      session.error = token.error;
      return session;
    },
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };