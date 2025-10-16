"use client";

import {
  IconSun,
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { logoutAction } from "@/app/action/logoutActions";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Skeleton } from "../ui/skeleton";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export function NavUser() {

  const { data: session, status } = useSession();
  const { isMobile } = useSidebar();
  const { version } = require("@/../package.json");
  const { theme, setTheme } = useTheme();

  const STR_LOADING = 'Carregando...';

  const [name, setName] = useState(STR_LOADING);
  const [org, setOrg] = useState(STR_LOADING);
  const [email, setEmail] = useState(STR_LOADING);
  const [initials, setInitials] = useState("..");

  const changeUserInfo = (name: string, org: string, email: string, initials? : string) => {
    //console.log("Changing user info to:", { name, org, email, initials });
    setName(name);
    setOrg(org);
    setEmail(email);
    setInitials(
      initials ||
      name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    );
  }

  useEffect(() => {
    console.log("Session status:", status);

    if (status === 'authenticated' && session?.userInfo) {
      sessionStorage.removeItem("forceRefresh");
      const userInfo = session.userInfo;
      changeUserInfo(
        userInfo.name || "Usuário", 
        userInfo.organizacao?.nome || "Sem Organização", 
        userInfo.email || "user@example.com"
      );
    }
    
    // workaround para a situação logo após o login o status ser 'unauthenticated' por um breve momento
    if (status === 'unauthenticated') {
      console.log('Force re-render...');
      const forceRefresh = sessionStorage.getItem("forceRefresh");
      if (!forceRefresh) {
        sessionStorage.setItem("forceRefresh", "true");
        window.location.reload();
      }
    }
  }, [session, status]);


  const image = session?.user?.image ?? "";

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const onClickLogout = () => {
    logoutAction();
  };

  if (status === 'loading') {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="cursor-wait">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="grid flex-1 gap-y-1 text-left text-sm leading-tight">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              aria-haspopup="menu"
              aria-label="Abrir menu do usuário"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={image} alt={name} />
                <AvatarFallback className="rounded-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {org}
                </span>
              </div>
              <IconDotsVertical className="ml-auto h-4 w-4 opacity-70" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-3 py-2">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={image} alt={name} />
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid text-left leading-tight">
                  <span className="truncate text-sm font-medium">{name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/usuario/perfil" className="flex w-full items-center gap-2">
                  <IconUserCircle className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <button onClick={toggleTheme} className="flex w-full items-center gap-2">
                  <IconSun className="mr-2 h-4 w-4" />
                  <span>Alternar Tema</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-red-600 dark:text-red-400" asChild>
              <button onClick={onClickLogout} className="flex w-full items-center gap-2">
                <IconLogout className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </button>
            </DropdownMenuItem>
            <div className="flex items-center">
              <span className="ml-auto px-3 py-1 text-muted-foreground" style={{ fontSize: "0.6rem" }}>
                Mural de Preços v.{version}
              </span>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
