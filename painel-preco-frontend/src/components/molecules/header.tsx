"use client";

import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthSession } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { ThemeTogglerButton } from "../animate-ui/components/buttons/theme-toggler";
import { environmentBadgeLabel } from "@/lib/app-environment";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setSessionData, clearSessionData } from "@/store/features/session-slice";

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

const adminNavItems = [
  { label: "Organizações", path: "/administracao/organizacoes" },
  { label: "Usuários", path: "/administracao/usuarios" },
  { label: "Sincronização", path: "/administracao/sincronizacao" },
];

const cotacaoBaseRoutes = [
  "/cotacoes",
  "/cotacoes/realizar-cotacao",
  "/cotacoes/carrinho",
  "/cotacoes/historico",
  "/cotacoes/validar-cotacao",
  "/cotacoes/listagem",
  // Processo de contratação (ETP/TR/Edital) sempre parte de uma cotação — mantém a
  // mesma toolbar em vez de cair no default (Overview/Atividades).
  "/processos-contratacao",
];

const hiddenNavRoutes = ["/gestao-organizacao", "/usuario/perfil"];

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

  const isAdminSection = pathname.startsWith("/administracao");

  const showNav = !hiddenNavRoutes.includes(pathname);

  const navItems = isCotacaoSection ? cotacaoNavItems : isAdminSection ? adminNavItems : dashboardNavItems;

  const dispatch = useAppDispatch();
  const sessionState = useAppSelector((state) => state.sessionReducer);

  const STR_LOADING = "";
  const name = sessionState.name || STR_LOADING;
  const org = sessionState.org || STR_LOADING;

  useEffect(() => {
    setMounted(true);
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

      if (tokenOrg) {
        dispatch(setSessionData({ name: userName, org: tokenOrg }));
      } else {
        // org não está no token — busca no backend
        fetch("/api/usuarios/me")
          .then((res) => res.ok ? res.json() : null)
          .then((data) => {
            const orgName: string = data?.organizacaoNome || "Sem Organização";
            dispatch(setSessionData({ name: userName, org: orgName }));
          })
          .catch(() => dispatch(setSessionData({ name: userName, org: "Sem Organização" })));
      }
    } else if (status === "unauthenticated") {
      dispatch(clearSessionData());
    }
  }, [session, status, update, dispatch]);

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
        <span className="flex items-center gap-2 text-foreground font-semibold text-lg">
          Mural de Preços
          {environmentBadgeLabel && (
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
              {environmentBadgeLabel}
            </span>
          )}
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
