'use client' // Error components must be Client Components

import { Button, Divider } from '@nextui-org/react'
import { useEffect } from 'react'
import { redirect, useRouter } from 'next/navigation'

export default function Unauthorized({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {

  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('error.tsx', error)
  }, [error]);

  const tryAgain = () => {
    router.push("/");
  }

  return (
    <div className='flex flex-1 justify-center items-center pb-10'>
      <div className="flex sm:h-8 sm:flex-row flex-col items-center space-x-4 space-y-2 text-small">
        <h2 className='text-lg'><b className='text-xl'>401!</b> Você não tem permissão para esta operação.</h2>
        <Divider orientation="vertical" />
        <Button
          variant='light'
          color='primary'
          onClick={tryAgain}
        >
          Início
        </Button>
      </div>
    </div>
  )
}