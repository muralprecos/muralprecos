'use client'

import { ReduxProvider } from '@/redux/provider'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { SnackbarProvider } from 'notistack'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider
        attribute='class'
        defaultTheme='light'
        themes={['light', 'modern']}
      >
        <ReduxProvider>
          <SnackbarProvider maxSnack={3} autoHideDuration={4000} anchorOrigin={ {horizontal: 'left', vertical: 'bottom' }}>
            <main className="text-foreground min-h-svh gradient-background flex flex-col">
              {children}
            </main>
          </SnackbarProvider>
        </ReduxProvider>
      </NextThemesProvider>
    </NextUIProvider>
  )
}