import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { encrypt } from "@/utils/encryption";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }) {
      if (token) {
        session.access_token = encrypt(token.access_token ?? "");
        session.id_token = encrypt(token.id_token ?? "");

        session.userInfo = token.decoded;
        session.roles = token.decoded?.realm_access?.roles ?? [];
        session.error = token.error;

        if (session.userInfo) {
          if (token.updateFirstName)
            session.userInfo.given_name = token.updateFirstName;
          if (token.updateLastName)
            session.userInfo.family_name = token.updateLastName;
          if (token.updateEmail) session.userInfo.email = token.updateEmail;
          if (token.updateName) session.userInfo.name = token.updateName;
        }

        delete token.updateFirstName;
        delete token.updateLastName;
        delete token.updateName;
        delete token.updateEmail;
      }
      return session;
    },
  },
});
