'use client'

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
        <main className="text-foreground min-h-screen gradient-background">
          {children}
        </main>
      </NextThemesProvider>
    </NextUIProvider>
  )
}