import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import type { JWT } from "next-auth/jwt";
import { postLogin } from "@/hooks/api";
import { IUserInfo } from "@/interfaces/types";
import { loginRefreshToken } from "@/app/action/loginRefreshTokenActions";
import { INITIAL_PAGE_LOGIN } from "@/utils/routesUtils";
import { authCheckSession } from "@/app/action/authCheckSession";

const credentialsConfig = CredentialsProvider({
  name: "credentials",
  credentials: {
    username: { label: "Usuário" },
    password: { label: "Senha", type: "password" },
  },
  async authorize(credentials) {
    if (!credentials?.username || !credentials?.password) return null;

    try {

    const res = await postLogin({
        username: `${credentials.username}`,
        password: `${credentials.password}`,
      });

      if (!res.ok) {
        const text = await res.text();
        // console.error("❌ [AUTH] Resposta não OK:", res.status, text);
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const usr = await res.json();
      if (res.ok && usr) return usr;

      return null;
    } catch (error) {
      // console.error("❌ [AUTH] Erro:", error);
      return null;
    }
  },
});

export const authConfig = {
  providers: [credentialsConfig],
  pages: {
    signIn: INITIAL_PAGE_LOGIN,
  },
  trustHost: true,
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.decoded = jwtDecode<IUserInfo>(`${user.access_token}`);
        token.access_token = user.access_token;
        token.id_token = user.id_token;
        token.refresh_token = user.refresh_token;
        token.error = user.error;
        return token;
      }

      if (trigger === "update" && session) {
        token.updateFirstName = session.firstName ?? "";
        token.updateLastName = session.lastName ?? "";
        token.updateName = `${session.firstName ?? ""} ${
          session.lastName ?? ""
        }`;
        token.updateEmail = session.email ?? "";
      }

      const isAuth = await authCheckSession(token);
      if (isAuth) return token;

      const refreshed = await loginRefreshToken(token);
      return refreshed.error ? null : (refreshed as JWT);
    },

    async session({ session, token }) {
      if (token) {
        session.access_token = token.access_token;
        session.id_token = token.id_token;
        session.userInfo = token.decoded;
        session.roles = token.decoded?.realm_access?.roles ?? [];
        session.error = token.error;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
} satisfies NextAuthConfig;
