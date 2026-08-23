import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import { auth } from "@/lib/auth";
import ChatWidget from "@/components/organisms/ChatWidget";
import { NotifyToaster } from "@/components/molecules/NotifyToast";
import { SessionKeepalive } from "@/components/atoms/SessionKeepalive";
import { GoogleAnalytics } from "@next/third-parties/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mural de Preço - TTSolutions",
  description: "Aplicação para auxiliar em licitações e pregões",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const gaId = process.env.GA_MEASUREMENT_ID;

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${inter.className} min-h-svh flex flex-col`}>
        <Providers>
          <NotifyToaster />
          <main className="flex-1 flex flex-col">
            {children}
            {session && session?.userInfo && <ChatWidget />}
            {session && <SessionKeepalive />}
          </main>
        </Providers>
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
