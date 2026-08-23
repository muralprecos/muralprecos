"use client";

import {
  LayoutDashboard,
  FileText,
  History,
  ShoppingCart,
  CheckCircle,
  BarChart3,
  Building2,
  ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const dashboardNavItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/" },
  { label: "Atividades", icon: FileText, path: "/atividades" },
  { label: "Fornecedores", icon: Building2, path: "/fornecedores" },
  { label: "Atas", icon: ScrollText, path: "/atas" },
];

const cotacaoNavItems = [
  { label: "Cotação", icon: FileText, path: "/cotacoes/realizar-cotacao" },
  { label: "Carrinho", icon: ShoppingCart, path: "/cotacoes/carrinho" },
  { label: "Histórico", icon: History, path: "/cotacoes/historico" },
  { label: "Validar", icon: CheckCircle, path: "/cotacoes/validar-cotacao" },
];

const cotacaoRoutes = "/cotacoes";

const hiddenNavRoutes = ["/gestao-usuarios", "/usuario/perfil"];

export function MobileNavBar() {
  const pathname = usePathname();

  const isCotacaoSection = pathname.startsWith(cotacaoRoutes);
  const showNav = hiddenNavRoutes.includes(pathname);
  const navItems = isCotacaoSection ? cotacaoNavItems : dashboardNavItems;

  return (
    <>
      {!showNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const active = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex flex-col items-center gap-[2px] px-2 py-1 rounded-lg transition-colors",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-[11px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
