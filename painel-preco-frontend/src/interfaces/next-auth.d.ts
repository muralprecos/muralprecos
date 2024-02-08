import NextAuth from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    access_token?: string
    id_token?: string
    error?: string
    userInfo?: IUserInfo
    roles?: string[]
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    decoded?: IUserInfo
    access_token?: string
    id_token?: string
    expires_at?: number
    refresh_token?: string
    error?: string
  }
}
