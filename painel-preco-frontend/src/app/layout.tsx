import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import Providers from './providers'
import Link from 'next/link'
import Header from '@/components/molecules/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mural de Preço - TTSolutions',
  description: 'Aplicação para auxiliar em licitações e pregões',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const linksHeader = [
    {description: 'Início', link: '/'},
    {description: 'Cotação', link: '/cotacao'}
  ]

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>
          <Header links={linksHeader}/>
          <main className='flex-1 flex flex-col'>{children}</main>
          <footer></footer>
        </Providers>
      </body>
    </html>
  )
}
