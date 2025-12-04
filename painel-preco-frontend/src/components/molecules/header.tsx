import { User, Menu, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/atoms/theme-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";

const dashboardNavItems = [
  { label: "Overview", path: "/" },
  { label: "Atividade", path: "/atividade" },
  { label: "Analytics", path: "/analytics" },
  { label: "Performance", path: "/performance" },
];

const cotacaoNavItems = [
  { label: "Realizar Cotação", path: "/realizar-cotacao" },
  { label: "Carrinho", path: "/carrinho" },
  { label: "Histórico", path: "/historico" },
  { label: "Validar Cotação", path: "/validar-cotacao" },
];

const cotacaoRoutes = [
  "/realizar-cotacao",
  "/carrinho",
  "/historico",
  "/validar-cotacao",
];

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const pathname = usePathname();
  const isCotacaoSection = cotacaoRoutes.includes(pathname);
  const navItems = isCotacaoSection ? cotacaoNavItems : dashboardNavItems;

  return (
    <header className="flex items-center justify-between mb-8 animate-fade-in relative bg-transparent">
      <button
        onClick={onMenuClick}
        className="lg:hidden w-10 h-10 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="hidden lg:flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">TT</span>
        </div>
        <span className="text-foreground font-semibold text-lg">
          Mural de Preços
        </span>
      </div>

      <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 bg-muted rounded-full p-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "px-4 py-2 rounded-full text-sm transition-all whitespace-nowrap",
              pathname === item.path
                ? "bg-sidebar text-sidebar-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="hidden md:flex items-center gap-3">
        <ThemeToggle />

        <button className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 bg-card rounded-full pl-1 pr-4 py-1">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-foreground">Admin</p>
            <p className="text-xs text-muted-foreground">admin@cotacoes.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
