"use client";

import { useAppSelector } from '@/redux/store';
import { redirect } from 'next/navigation'
import { useEffect } from 'react';

export default function Home() {
  const isLogged = useAppSelector((state) => state.authReducer.value.isAuth);

  useEffect(() => {
    if (!isLogged) {
      redirect('/login')
    } else {
      redirect('/cotacao')
    }
  }, [isLogged]);

  return (
    <section className='py-4'>
      <div className='container flex items-center justify-center'></div>
    </section>
  )
}