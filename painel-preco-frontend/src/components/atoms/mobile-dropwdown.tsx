import { User, Settings, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import pkg from "../../../package.json";

interface ProfileDropdownProps {
  variant?: "desktop" | "mobile";
  userName: string;
  userOrg: string;
}

export function ProfileDropdown({
  variant = "desktop",
  userName,
  userOrg,
}: ProfileDropdownProps) {
  const isDesktop = variant === "desktop";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isDesktop ? (
          <button className="flex items-center gap-3 bg-card rounded-full pl-1 pr-3 py-1 hover:bg-card/80 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-sm text-left lg:block hidden">
              <p className="font-medium text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground">{userOrg}</p>
            </div>
          </button>
        ) : (
          <button className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <User className="w-5 h-5" />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-popover border border-border shadow-lg z-50"
      >
        {!isDesktop && (
          <>
            <div className="px-2 py-1.5 text-sm">
              <p className="font-medium text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground">{userOrg}</p>
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/usuario/perfil">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/gestao-usuarios">
            <Users className="mr-2 h-4 w-4" />
            <span>Gestão de Usuários</span>
          </Link>
        </DropdownMenuItem>

        <div className="text-xs text-muted-foreground text-right">
          v{pkg.version}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
