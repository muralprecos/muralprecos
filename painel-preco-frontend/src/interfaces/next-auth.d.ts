import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { IUserInfo } from '@/interfaces/types'; // Verifique se o caminho está correto

declare module 'next-auth' {
  /**
   * O tipo Session retornado por `useSession` ou `getSession`.
   */
  interface Session {
    access_token?: string;
    id_token?: string;
    userInfo?: IUserInfo;
    roles?: string[];
    error?: string;
    // Garante que o objeto 'user' padrão não seja perdido
    user: DefaultSession['user']; 
  }

  /**
   * O tipo User é o objeto que você retorna do callback `authorize`.
   * Ele só precisa conter os dados brutos retornados pela sua API de login.
   */
  interface User extends DefaultUser {
    access_token?: string;
    id_token?: string;
    refresh_token?: string;
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  /** O tipo JWT decodificado e enriquecido nos callbacks. */
  interface JWT {
    // Propriedades do token
    access_token?: string;
    id_token?: string;
    refresh_token?: string;
    decoded?: IUserInfo;
    error?: string;

    // Propriedades temporárias para atualização de perfil
    updateFirstName?: string;
    updateLastName?: string;
    updateName?: string;
    updateEmail?: string;
  }
}
