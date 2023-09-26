'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider
        attribute='class'
        defaultTheme='dark'
        themes={['light', 'dark', 'modern']}
      >
        <main className="text-foreground bg-background min-h-screen">
          {children}
        </main>
      </NextThemesProvider>
    </NextUIProvider>
  )
}