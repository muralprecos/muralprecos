import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import Providers from './providers'
import Header from '@/components/organisms/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mural de Preço - TTSolutions',
  description: 'Aplicação para auxiliar em licitações e pregões'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false 
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const linksHeader = [
    {description: 'Início', link: '/'},
    {description: 'Cotação', link: '/cotacao'},
    {description: 'Carrinho', link: '/carrinho'}
  ]

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${inter.className} min-h-svh flex flex-col`}>
        <Providers>
          <Header links={linksHeader}/>
          <main className='flex-1 flex flex-col'>{children}</main>
          <footer></footer>
        </Providers>
      </body>
    </html>
  )
}
