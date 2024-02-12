import { redirect } from 'next/navigation';
import { getAccessToken } from '@/utils/sessionTokenAccessor';
import { INITIAL_PAGE_LOGGED, INITIAL_PAGE_LOGIN } from '@/utils/routesUtils';

export default async function Home() {

  const accessToken = await getAccessToken() || '';
  
  if (!accessToken) {
    redirect(INITIAL_PAGE_LOGIN);
  } else {
    redirect(INITIAL_PAGE_LOGGED);
  }

  return (
    <></>
  )
}