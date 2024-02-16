import { redirect } from 'next/navigation';
import { INITIAL_PAGE_LOGGED, INITIAL_PAGE_LOGIN } from '@/utils/routesUtils';
import { auth } from 'auth';

export default async function Home() {

  const session = await auth();
  
  if (!session || !session.user) {
    redirect(INITIAL_PAGE_LOGIN);
  } else {
    redirect(INITIAL_PAGE_LOGGED);
  }

  return (
    <div></div>
  )
}