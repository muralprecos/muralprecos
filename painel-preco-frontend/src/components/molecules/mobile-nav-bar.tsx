import {
  LayoutDashboard,
  FileText,
  History,
  ShoppingCart,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

const dashboardNavItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/" },
  { label: "Atividade", icon: FileText, path: "/atividade" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Performance", icon: ShoppingCart, path: "/performance" },
];

const cotacaoNavItems = [
  { label: "Cotação", icon: FileText, path: "/realizar-cotacao" },
  { label: "Carrinho", icon: ShoppingCart, path: "/carrinho" },
  { label: "Histórico", icon: History, path: "/historico" },
  { label: "Validar", icon: CheckCircle, path: "/validar-cotacao" },
];

const cotacaoRoutes = [
  "/realizar-cotacao",
  "/carrinho",
  "/historico",
  "/validar-cotacao",
];

export function MobileNavBar() {
  const pathname = usePathname();

  const isCotacaoSection = cotacaoRoutes.includes(pathname);
  const navItems = isCotacaoSection ? cotacaoNavItems : dashboardNavItems;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[64px]",
              pathname === item.path ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
