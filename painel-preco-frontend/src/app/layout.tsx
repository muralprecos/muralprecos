import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import Providers from './providers'
import Link from 'next/link'
import ThemeSwitcher from '../components/molecules/ThemeSwitcher'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Painel de Preço - TTSolutions',
  description: 'Aplicação para auxiliar em licitações e pregões',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>
          <header className='py-6 flex items-center justify-center'>
            <nav className='container flex flex-row items-center justify-between'>
              <div className='flex flex-row'>
                <Link className="px-2" href='/'>Início</Link>
                <Link className="px-2" href='/cotacao'>Cotação</Link>
              </div>
              <div className='flex'>
                <ThemeSwitcher />
              </div>
            </nav>
          </header>
          <main>{children}</main>
          <footer></footer>
        </Providers>
      </body>
    </html>
  )
}
