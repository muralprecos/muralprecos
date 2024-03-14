import NextAuth from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    access_token?: string
    id_token?: string
    userInfo?: IUserInfo
    roles?: string[]
    error?: string
  }

  interface User {
    decoded?: IUserInfo
    access_token?: string
    id_token?: string
    exp?: number
    refresh_token?: string
    error?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    decoded?: IUserInfo
    access_token?: string
    id_token?: string
    exp?: number
    refresh_token?: string
    error?: string
  }
}
