"use client";

import "../globals.css";
import { Inter } from "next/font/google";
import { useState } from "react";
import Providers from "../providers";
import ChatWidget from "@/components/organisms/ChatWidget";
import { DashboardHeader } from "@/components/molecules/header";
import { DashboardSidebar } from "@/components/organisms/app-sidebar-v2";
import { MobileNavBar } from "@/components/molecules/mobile-nav-bar";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Providers>
      <div className="min-h-screen bg-background flex flex-col">
        <div className="p-2 pt-4 sm:p-6 pb-0">
          <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        </div>

        <div className="flex flex-1">
          <DashboardSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <main className="flex-1 p-4 pt-0 sm:p-6 sm:pt-0 pb-20 md:pb-6 relative">
            {children}
            <ChatWidget />
          </main>
        </div>

        <MobileNavBar />
      </div>
    </Providers>
  );
}
