import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { postLogin } from "@/hooks/api";
import { encrypt } from "@/utils/encryption";
import logger from "../services/logger";
import { jwtDecode } from "jwt-decode";
import { IUserInfo } from "@/interfaces/types";
import { loginRefreshToken } from "@/app/action/loginRefreshTokenActions";
import { INITIAL_PAGE_LOGIN } from "@/utils/routesUtils";
import { authCheckSession } from "@/app/action/authCheckSession";
import { logoutAction } from "@/app/action/logoutActions";

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
    logger.info("...authorize...");
    if (!credentials?.username || !credentials?.password) return null;
    try {
      logger.info("has credentials");
      const res = await postLogin({
        username: `${credentials?.username}`,
        password: `${credentials?.password}`
      });
      logger.info("credentials has res");
      const usr = await res.json();
      logger.info("credentials has usr");
      // If no error and we have user data, return it
      if (res.ok && usr) {
        logger.info("credentials ok!");
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
      logger.info("...authorized... " + pathname);
      if (pathname === "/middlewareProtected") return !!auth;
      return true;
    },
    async jwt({ token, user }) {
      // apenas na primeira chamada de login
      if (user) {
        token.decoded = jwtDecode<IUserInfo>(`${user.access_token}`);
        token.access_token = user.access_token;
        token.id_token = user.id_token;
        token.refresh_token = user.refresh_token;
        token.error = user.error;
        logger.info("Token registred...");
        logger.info(user);
        return token;
      }

      const isAuth = await authCheckSession(token);
      if (isAuth) {
        logger.info(`jwt ativo`);
        return token;
      }
      // token expirou ou não existe
      logger.info(`Token has expired. Will refresh...`);
      const refreshToken = await loginRefreshToken(token);
      if (!refreshToken.error) {
        return loginRefreshToken(token);
      } else {
        return null;
      }
      
    },
    async session({ session, token }) {
      //properties to the client without encrypt
      if (token) {
        logger.info("session com token");
        session.access_token = encrypt(`${token.access_token}`); // see utils/sessionTokenAccessor.js
        session.id_token = encrypt(`${token.id_token}`);  // see utils/sessionTokenAccessor.js
        session.userInfo = token.decoded;
        session.roles = token.decoded.realm_access.roles;
        session.error = token.error;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl;
    },
  },
  trustHost: true,
  session: {
    strategy: "jwt"
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: INITIAL_PAGE_LOGIN
  }
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);