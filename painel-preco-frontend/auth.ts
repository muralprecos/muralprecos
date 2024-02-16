import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { postLogin } from "@/hooks/api";
import { encrypt } from "@/utils/encryption";
import logger from "./services/logger";
import { jwtDecode } from "jwt-decode";
import { IUserInfo } from "@/interfaces/types";
import { loginRefreshToken } from "@/app/action/loginRefreshTokenActions";

const credentialsConfig = CredentialsProvider({
  name: "credentials",
  credentials: {
    username: {
      label: "Usuário",
    },
    password: {
      label: "Senha",
      type: "password",
    },
  },
  async authorize(credentials) {
    if (!credentials?.username || !credentials?.password) return null;
    try {
      const res = await postLogin({
        username: `${credentials?.username}`,
        password: `${credentials?.password}`
      });
      const usr = await res.json();
      // If no error and we have user data, return it
      if (res.ok && usr) {
        return usr;
      }
      // Return null if user data could not be retrieved
      return null;
    } catch (e) {
      return null;
    }
  },
});

const config = {
  providers: [credentialsConfig],
  callbacks: {
    async authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/middlewareProtected") return !!auth;
      return true;
    },
    async jwt({ token, user }) {
      // apenas na primeira chamada de login
      // console.log('jwt:', { token, user })
      if (user) {
        token.decoded = jwtDecode<IUserInfo>(`${user.access_token}`);
        token.access_token = user.access_token;
        token.id_token = user.id_token;
        token.expires_at = user.expires_at;
        token.refresh_token = user.refresh_token;
        token.error = user.error;
        logger.info("Token registred...");
        return token;
      }
      // nas demais chamadas
      const nowTimeStamp = Math.floor(Date.now() / 1000);
      const tokenExpires : number = token.expires_at != null ? +token.expires_at : nowTimeStamp;
      if (nowTimeStamp < tokenExpires) {
        return token;
      }
      // token expirou ou não existe
      logger.info("Token has expired. Will refresh...");
      return loginRefreshToken(token);
    },
    async session({ session, token }) {
      //properties to the client without encrypt
      if (token) {
        session.access_token = encrypt(`${token.access_token}`); // see utils/sessionTokenAccessor.js
        session.id_token = encrypt(`${token.id_token}`);  // see utils/sessionTokenAccessor.js
        session.userInfo = token.decoded;
        session.roles = token.decoded.realm_access.roles;
        session.error = token.error;
      }
      return session;
    }
  },
  trustHost: true,
  session: {
    strategy: "jwt"
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/signIn'
  }
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);