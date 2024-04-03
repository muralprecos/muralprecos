import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import Providers from './providers'
import Header, { ILink } from '@/components/organisms/Header'
import { auth } from 'auth'

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await auth();
  
  const linksHeader : ILink[] = [
    {description: 'Realizar Cotação', link: '/cotacao', isPublic: false },
    {description: 'Histórico', link: '/cotacao/historico', isPublic: false },
    {description: 'Carrinho', link: '/carrinho', isPublic: false },
    {description: 'Documentos', link: 'https://www.gov.br/agu/pt-br/composicao/cgu/cgu/modelos/licitacoesecontratos', isPublic: false, isExternal: true },
    {description: 'Certidões', link: 'https://certidoes-apf.apps.tcu.gov.br', isPublic: false, isExternal: true },
  ]

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${inter.className} min-h-svh flex flex-col`}>
        <Providers>
          <Header session={session} links={linksHeader}/>
          <div>
            <main className='flex-1 flex flex-col'>{children}</main>
          </div>
          <footer></footer>
        </Providers>
      </body>
    </html>
  )
}
