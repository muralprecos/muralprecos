import { redirect } from 'next/navigation';
import { INITIAL_PAGE_LOGGED, INITIAL_PAGE_LOGIN } from '@/utils/routesUtils';
import { auth } from 'auth';
import logger from '../../services/logger';

export default async function Home() {

  const session = await auth();
  
  if (!session || !session.userInfo) {
    redirect(INITIAL_PAGE_LOGIN);
  } else {
    redirect(INITIAL_PAGE_LOGGED);
  }

  return (
    <div></div>
  )
}