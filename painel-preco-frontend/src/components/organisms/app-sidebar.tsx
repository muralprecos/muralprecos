"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "../molecules/nav-main";
import { NavExternal } from "../molecules/nav-external-links";
import { NavUser } from "../molecules/nav-users";
import { useSession } from "next-auth/react";
import { TTLogo } from "../atoms/TTLogo";
import Link from "next/link";

const sidebarData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: "material-symbols:dashboard",
    },
    {
      title: "Cotação",
      url: "/cotacoes/realizar-cotacao",
      icon: "mdi:file-document-edit-outline",
    },
    {
      title: "Histórico",
      url: "/cotacoes/historico",
      icon: "mdi:history",
    },
    {
      title: "Carrinho",
      url: "/carrinho",
      icon: "mdi:cart-outline",
    },
    {
      title: "Validar Cotação",
      url: "/cotacoes/validacao",
      icon: "mdi:check-decagram",
    },
  ],
  navExternal: [
    {
      title: "Documentos",
      url: "https://www.gov.br/agu/pt-br/composicao/cgu/cgu/modelos/licitacoesecontratos",
      icon: "mdi:file-document-box-multiple-outline",
      isExternal: true,
    },
    {
      title: "Certidões",
      url: "https://certidoes-apf.apps.tcu.gov.br",
      icon: "mdi:certificate-outline",
      isExternal: true,
    },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          asChild
          className="data-[slot=sidebar-menu-button]:!p-1.5"
        >
          <Link href="/" className="flex items-center gap-2">
            <TTLogo className="w-5 h-5" />
            <span className="text-base font-semibold text-primary">Mural de Preços</span>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
        <NavExternal items={sidebarData.navExternal} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser session={session} />
      </SidebarFooter>
    </Sidebar>
  );
}
