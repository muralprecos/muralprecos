import "../globals.css";
import { Inter } from "next/font/google";

import Providers from "../providers";
import ChatWidget from "@/components/organisms/ChatWidget";
import { AppSidebar } from "@/components/organisms/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {children}
          <ChatWidget />
        </SidebarInset>
      </SidebarProvider>
    </Providers>
  );
}
