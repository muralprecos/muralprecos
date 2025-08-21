"use client";

import {
  IconSun,
  IconDotsVertical,
  IconLogout,
  IconNotification,
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

import { Session } from "next-auth";
import { logoutAction } from "@/app/action/logoutActions";
import Link from "next/link";
import { useTheme } from "next-themes";

export function NavUser({ session }: { session: Session | null }) {
  const { isMobile } = useSidebar();

  const org = session?.userInfo?.organizacao?.nome ?? "Sem organização  ";
  const name = session?.user?.name ?? "Usuário";
  const email = session?.user?.email ?? "user@example.com";
  const image = session?.user?.image ?? "";
  const { version } = require("@/../package.json");

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const onClickLogout = () => {
    logoutAction();
  };

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
              <DropdownMenuItem>
                <Link href="/usuario/perfil" className="flex gap-2">
                  <IconUserCircle className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button onClick={toggleTheme} className="flex gap-2">
                  <IconSun className="mr-2 h-4 w-4" />
                  <span>Alternar Tema</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-red-600 dark:text-red-400">
              <button onClick={onClickLogout} className="flex gap-2">
                <IconLogout className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </button>
            </DropdownMenuItem>
            <div className="flex items-center">
              <span className="ml-auto px-3 py-1 text-muted-foreground" style={{ fontSize: "0.5rem" }}>
                Mural de Preços v.{version}
              </span>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
