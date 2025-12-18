"use client";
import { User, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ThemeTogglerButton } from "../animate-ui/components/buttons/theme-toggler";

const dashboardNavItems = [
  { label: "Overview", path: "/" },
  { label: "Atividade", path: "/atividade" },
  // { label: "Analytics", path: "#Analytics" },
  // { label: "Performance", path: "#Performance" },
];

const cotacaoNavItems = [
  { label: "Realizar Cotação", path: "/cotacoes/realizar-cotacao" },
  { label: "Carrinho", path: "/cotacoes/carrinho" },
  { label: "Histórico", path: "/cotacoes/historico" },
  { label: "Validar Cotação", path: "/cotacoes/validar-cotacao" },
];

const cotacaoBaseRoutes = [
  "/cotacoes/realizar-cotacao",
  "/cotacoes/carrinho",
  "/cotacoes/historico",
  "/cotacoes/validar-cotacao",
];

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isCotacaoSection = cotacaoBaseRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const navItems = isCotacaoSection ? cotacaoNavItems : dashboardNavItems;

  const STR_LOADING = "Carregando...";

  const [name, setName] = useState(STR_LOADING);
  const [org, setOrg] = useState(STR_LOADING);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.userInfo) {
      const userInfo = session.userInfo;
      setName(userInfo.name || "Usuário");
      setOrg(userInfo.organizacao?.nome || "Sem Organização");
    }
  }, [session, status]);

  return (
    <header className="flex items-center justify-between animate-fade-in relative bg-transparent">
      <button
        onClick={onMenuClick}
        className="lg:hidden w-10 h-10 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

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

      {mounted && (
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 bg-muted rounded-full p-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "px-4 py-2 rounded-full text-sm transition-all whitespace-nowrap",
                (
                  item.path === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.path)
                )
                  ? "bg-sidebar text-sidebar-foreground"
                  : "text-muted-foreground hover:text-foreground"
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

        <Link
          href="/usuario/perfil"
          className="flex items-center gap-3 bg-card rounded-full pl-1 pr-4 py-1"
        >
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">{org}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
