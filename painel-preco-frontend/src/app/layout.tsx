import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import Providers from './providers'
import Header, { ILink } from '@/components/organisms/Header'
import { auth } from 'auth'
import ChatWidget from '@/components/organisms/ChatWidget'

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
    {description: 'Perfil do Usuário', link: '/usuario/perfil', access: 'private', onlyVisible: 'mobile' },
    {description: 'Realizar Cotação', link: '/cotacao', access: 'private' },
    {description: 'Histórico', link: '/cotacao/historico', access: 'private' },
    {description: 'Carrinho', link: '/carrinho', access: 'private' },
    {description: 'Validar Cotacao', link: '/cotacao/validacao', access: 'public' },
    {description: 'Documentos', link: 'https://www.gov.br/agu/pt-br/composicao/cgu/cgu/modelos/licitacoesecontratos', access: 'private', isExternal: true },
    {description: 'Certidões', link: 'https://certidoes-apf.apps.tcu.gov.br', access: 'private', isExternal: true },
  ]

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${inter.className} min-h-svh flex flex-col`}>
        <Providers>
          <Header session={session} links={linksHeader}/>
          <main className='flex-1 flex flex-col'>
            {children}
            { session && session?.userInfo && (
              <ChatWidget />
            )}
          </main>
          <footer></footer>
        </Providers>
      </body>
    </html>
  )
}
