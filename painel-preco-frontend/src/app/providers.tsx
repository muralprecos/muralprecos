"use client";

import { SnackbarProvider } from "notistack";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReduxProvider } from "@/store/reduxProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NuqsAdapter>
          <ReduxProvider>
            <SnackbarProvider
              maxSnack={3}
              autoHideDuration={4000}
              anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
            >
              <TooltipProvider delayDuration={300}>
                <main className="text-foreground min-h-svh gradient-background flex flex-col">
                  {children}
                </main>
              </TooltipProvider>
            </SnackbarProvider>
          </ReduxProvider>
        </NuqsAdapter>
      </ThemeProvider>
    </SessionProvider>
  );
}
