import { User, Settings, Users, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import pkg from "../../../package.json";
import { logoutAction } from "@/app/action/logoutActions";
import { useEffect, useState } from "react";
import { getIdleRemainingMs } from "@/lib/session-idle-state";

interface ProfileDropdownProps {
  variant?: "desktop" | "mobile";
  userName: string;
  userOrg: string;
  sessionStart?: number;
}

function useIdleRemaining(active: boolean) {
  const [remainingMs, setRemainingMs] = useState<number>(getIdleRemainingMs);

  useEffect(() => {
    if (!active) return;
    setRemainingMs(getIdleRemainingMs()); // sync immediately on open
    const id = setInterval(() => setRemainingMs(getIdleRemainingMs()), 1_000);
    return () => clearInterval(id);
  }, [active]);

  if (remainingMs <= 0) return "expirando";
  const totalSeconds = Math.floor(remainingMs / 1_000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function ProfileDropdown({
  variant = "desktop",
  userName,
  userOrg,
  sessionStart,
}: ProfileDropdownProps) {
  const isDesktop = variant === "desktop";
  const isLoading = !userName || !userOrg;
  const [open, setOpen] = useState(false);
  const idleRemaining = useIdleRemaining(open);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {isDesktop ? (
          <button className="flex items-center gap-3 bg-card rounded-full pl-1 pr-3 py-1 hover:bg-card/80 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-sm text-left lg:block hidden">
              {isLoading ? (
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ) : (
                <>
                  <p className="font-medium text-foreground">{userName}</p>
                  <p className="text-xs text-muted-foreground">{userOrg}</p>
                </>
              )}
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
              {isLoading ? (
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ) : (
                <>
                  <p className="font-medium text-foreground">{userName}</p>
                  <p className="text-xs text-muted-foreground">{userOrg}</p>
                </>
              )}
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

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-red-600 hover:!bg-red-500/10 hover:!text-red-600 focus:!bg-red-500/10 focus:!text-red-600"
          onClick={async () => {
            try {
              await logoutAction();
            } catch (error) {
              console.error("Erro ao sair", error);
            }
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>

        <div className="px-2 py-1 text-xs text-muted-foreground space-y-0.5">
          <div className="text-right">v{pkg.version}</div>
        </div>
        
        <div className="hidden px-2 py-1 text-xs text-muted-foreground space-y-0.5">
          {sessionStart && (
            <div>Sessão desde {new Date(sessionStart).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</div>
          )}
          <div>Expira por inatividade em <span className="font-medium">{idleRemaining}</span></div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
