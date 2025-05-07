import { redirect } from 'next/navigation';
import { INITIAL_PAGE_LOGGED, INITIAL_PAGE_LOGIN } from '@/utils/routesUtils';
import { auth } from 'auth';

export default async function Home() {

  const session = await auth();
  if (!session || !session.userInfo) {
    console.log('HOME PAGE_LOGIN')
    redirect(INITIAL_PAGE_LOGIN);
  } else {
    console.log('HOME LOGGED')
    redirect(INITIAL_PAGE_LOGGED);
  }

  return (
    <div>Pagina Inicial</div>
  )
}