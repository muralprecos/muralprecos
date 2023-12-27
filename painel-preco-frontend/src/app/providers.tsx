'use client'

import { ReduxProvider } from '@/redux/provider'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider
        attribute='class'
        defaultTheme='modern'
        themes={['light', 'modern']}
      >
        <ReduxProvider>
          <main className="text-foreground min-h-screen gradient-background flex flex-col">
            {children}
          </main>
        </ReduxProvider>
      </NextThemesProvider>
    </NextUIProvider>
  )
}