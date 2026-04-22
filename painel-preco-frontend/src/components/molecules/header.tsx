"use client";

import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthSession } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { ThemeTogglerButton } from "../animate-ui/components/buttons/theme-toggler";

import { ProfileDropdown } from "../atoms/mobile-dropwdown";

const dashboardNavItems = [
  { label: "Overview", path: "/" },
  { label: "Atividades", path: "/atividades" },
];

const cotacaoNavItems = [
  { label: "Realizar Cotação", path: "/cotacoes/realizar-cotacao" },
  { label: "Carrinho", path: "/cotacoes/carrinho" },
  { label: "Histórico", path: "/cotacoes/historico" },
  { label: "Validar Cotação", path: "/cotacoes/validar-cotacao" },
];

const cotacaoBaseRoutes = [
  "/cotacoes",
  "/cotacoes/realizar-cotacao",
  "/cotacoes/carrinho",
  "/cotacoes/historico",
  "/cotacoes/validar-cotacao",
  "/cotacoes/listagem",
];

const hiddenNavRoutes = ["/gestao-usuarios", "/usuario/perfil"];

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { data: session, status, update } = useAuthSession();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const isCotacaoSection = cotacaoBaseRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const showNav = !hiddenNavRoutes.includes(pathname);

  const navItems = isCotacaoSection ? cotacaoNavItems : dashboardNavItems;

  const STR_LOADING = "";

  const [name, setName] = useState(STR_LOADING);
  const [org, setOrg] = useState(STR_LOADING);

  useEffect(() => {
    setMounted(true);

    try {
      const cached = localStorage.getItem("userSessionCache");
      if (cached) {
        const { name: cachedName, org: cachedOrg } = JSON.parse(cached);
        setName(cachedName);
        setOrg(cachedOrg);
      }
    } catch (error) {
      console.error("Erro ao carregar cache de sessão:", error);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && !session?.userInfo) {
      update();
    }
  }, [status, session?.userInfo, update]);

  useEffect(() => {
    if (status === "authenticated" && session?.userInfo) {
      const userInfo = session.userInfo;
      const userName = userInfo.name || "Usuário";
      const tokenOrg = userInfo.organizacao?.nome;

      setName(userName);

      if (tokenOrg) {
        setOrg(tokenOrg);
        try {
          localStorage.setItem(
            "userSessionCache",
            JSON.stringify({ name: userName, org: tokenOrg }),
          );
        } catch (error) {
          console.error("Erro ao salvar cache de sessão:", error);
        }
      } else {
        // org não está no token — busca no backend
        fetch("/api/usuarios/me")
          .then((res) => res.ok ? res.json() : null)
          .then((data) => {
            const orgName: string = data?.organizacaoNome || "Sem Organização";
            setOrg(orgName);
            try {
              localStorage.setItem(
                "userSessionCache",
                JSON.stringify({ name: userName, org: orgName }),
              );
            } catch {
              // silently ignore
            }
          })
          .catch(() => setOrg("Sem Organização"));
      }
    } else if (status === "unauthenticated") {
      setName("");
      setOrg("");
      try {
        localStorage.removeItem("userSessionCache");
      } catch (error) {
        console.error("Erro ao limpar cache de sessão:", error);
      }
    }
  }, [session, status, update]);

  return (
    <header className="flex items-center justify-between mb-8 animate-fade-in relative bg-transparent">
      <button
        onClick={onMenuClick}
        className="lg:hidden w-10 h-10 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex md:hidden items-center gap-3">
        <ThemeTogglerButton
          variant="link"
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        />
        {mounted && (
          <ProfileDropdown variant="mobile" userName={name} userOrg={org} sessionStart={session?.session_start ?? undefined} />
        )}
      </div>

      <Link
        href="/"
        className="hidden lg:flex items-center gap-3 bg-card rounded-full pl-1 pr-4 py-1"
      >
        <div className="w-8 h-8 rounded-xl items-center justify-center">
          <img src="/assets/logo-tt.png" alt="Logo TT" />
        </div>
        <span className="text-foreground font-semibold text-lg">
          Mural de Preços
        </span>
      </Link>

      {mounted && showNav && (
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 bg-muted rounded-full p-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "px-4 py-2 rounded-full text-sm transition-all whitespace-nowrap",
                pathname === item.path || pathname.startsWith(item.path + "/")
                  ? "bg-sidebar text-sidebar-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}

      <div className="hidden md:flex items-center gap-3">
        <ThemeTogglerButton
          variant="link"
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        />

        {mounted && (
          <ProfileDropdown variant="desktop" userName={name} userOrg={org} sessionStart={session?.session_start ?? undefined} />
        )}
      </div>
    </header>
  );
}
