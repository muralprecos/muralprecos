"use client";

import { useAppSelector } from '@/redux/store';
import { isLoggedIn } from '@/utils/authUtils';
import { redirect } from 'next/navigation'
import { useEffect } from 'react';

export default function Home() {
  const value = useAppSelector((state) => state.authReducer.value);

  useEffect(() => {
    if (!isLoggedIn(value)) {
      redirect('/login')
    } else {
      redirect('/cotacao')
    }
  }, [value]);

  return (
    <section className='py-4'>
      <div className='container flex items-center justify-center'></div>
    </section>
  )
}