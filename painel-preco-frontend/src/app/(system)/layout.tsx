import "../globals.css";
import { Inter } from "next/font/google";

import Providers from "../providers";
import { auth } from "@/lib/auth";
import ChatWidget from "@/components/organisms/ChatWidget";
import { AppSidebar } from "@/components/organisms/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <Providers>
      <SidebarProvider>
        {session && session.userInfo && <AppSidebar />}
        <SidebarInset>
          {children}
          {session && session.userInfo && <ChatWidget />}
        </SidebarInset>
      </SidebarProvider>
    </Providers>
  );
}
