import {
  LayoutDashboard,
  FileText,
  Award,
  Gavel,
  Settings,
  HelpCircle,
  LogOut,
  X,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { logoutAction } from "@/app/action/logoutActions";

interface MenuItem {
  icon: typeof LayoutDashboard;
  label: string;
  path: string;
  external?: boolean;
}

const menuItems: MenuItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/",
  },
  {
    icon: FileText,
    label: "Cotação",
    path: "/cotacoes/realizar-cotacao",
  },

  {
    icon: Gavel,
    label: "Licitações",
    path: "/licitacoes",
  },
  {
    icon: FileText,
    label: "Documentos",
    path: "https://www.gov.br/agu/pt-br/composicao/cgu/cgu/modelos/licitacoesecontratos",
    external: true,
  },
  {
    icon: Award,
    label: "Certidões",
    path: "https://certidoes-apf.apps.tcu.gov.br",
    external: true,
  },
];

const bottomItems = [
  {
    icon: Users,
    label: "Gestão de Usuários",
    path: "/gestao-usuarios",
  },
  {
    icon: Settings,
    label: "Configurações",
    path: "#",
  },
  {
    icon: HelpCircle,
    label: "Ajuda",
    path: "#",
  },
  {
    icon: LogOut,
    label: "Sair",
    path: "#",
  },
];

const dashboardRoutes = ["/", "/atividade", "/analytics", "/performance"];
const cotacaoRoutes = [
  "/cotacoes/realizar-cotacao",
  "/cotacoes/carrinho",
  "/cotacoes/historico",
  "/cotacoes/validar-cotacao",
];

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  const isActiveItem = (path: string) => {
    if (path === "/") {
      return dashboardRoutes.includes(pathname);
    }
    if (path === "/cotacoes/realizar-cotacao") {
      return cotacaoRoutes.includes(pathname);
    }
    return pathname === path;
  };

  const onClickLogout = async () => {
    try {
      await logoutAction();
    } catch (error) {
      console.error("Erro ao sair", error);
    }
  };

  const commonItemClasses =
    "h-10 mx-3 rounded-xl flex items-center gap-3 px-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 lg:w-10 lg:mx-auto lg:justify-center lg:px-0 lg:group-hover:w-auto lg:group-hover:mx-3 lg:group-hover:justify-start lg:group-hover:px-3 w-full";

  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          "fixed lg:sticky top-0 h-auto lg:h-auto p-4 z-50 transition-transform duration-300",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <aside
          className={cn(
            "group h-auto lg:max-h-[calc(100vh-140px)] bg-sidebar rounded-2xl flex flex-col py-4 overflow-hidden shadow-lg transition-all duration-300 ease-in-out",
            "w-56 lg:w-16 lg:hover:w-56"
          )}
        >
          <button
            onClick={onClose}
            className="lg:hidden absolute top-6 right-4 w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground"
          >
            <X className="w-4 h-4" />
          </button>

          <nav className="flex-1 flex flex-col gap-2 py-4">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                onClick={onClose}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className={cn(
                  "h-10 mx-3 rounded-xl flex items-center gap-3 px-3 transition-all duration-200",
                  "lg:w-10 lg:mx-auto lg:justify-center lg:px-0 lg:group-hover:w-auto lg:group-hover:mx-3 lg:group-hover:justify-start lg:group-hover:px-3",
                  isActiveItem(item.path)
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="w-5 h-5 min-w-5" />
                <span className="whitespace-nowrap lg:hidden lg:group-hover:block transition-opacity duration-300">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2 py-4 border-t border-sidebar-border/30 my-[40px]">
            {bottomItems.map((item, index) => {
              if (item.label === "Sair") {
                return (
                  <button
                    key={index}
                    onClick={onClickLogout}
                    className={commonItemClasses}
                  >
                    <item.icon className="w-5 h-5 min-w-5" />
                    <span className="whitespace-nowrap lg:hidden lg:group-hover:block transition-opacity duration-300">
                      {item.label}
                    </span>
                  </button>
                );
              }

              return (
                <Link
                  key={index}
                  href={item.path}
                  className={commonItemClasses}
                >
                  <item.icon className="w-5 h-5 min-w-5" />
                  <span className="whitespace-nowrap lg:hidden lg:group-hover:block transition-opacity duration-300">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </aside>
      </div>
    </>
  );
}
