"use client";

import { redirect } from 'next/navigation'
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function Home() {

  const { status } = useSession();

  useEffect(() => {
    if (status != 'loading'){
      if (status == 'unauthenticated') {
        redirect('/login')
      } else {
        redirect('/cotacao')
      }
    }
  }, [status]);

  return (
    <section className='py-4'>
      <div className='container flex items-center justify-center'></div>
    </section>
  )
}