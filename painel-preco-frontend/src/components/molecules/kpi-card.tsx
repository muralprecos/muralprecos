import { DivideIcon as LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface KPICardProps {
  name: string;
  value: string;
  icon: typeof LucideIcon;
  change?: number;
  subtitle?: string;
  loading?: boolean;
}

export function KPICard({
  name,
  value,
  icon: Icon,
  change,
  subtitle,
  loading = false,
}: KPICardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {name}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {change !== undefined && change !== 0 && (
                <>
                  {change > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600" />
                  )}
                  <span
                    className={change > 0 ? "text-green-600" : "text-red-600"}
                  >
                    {Math.abs(change).toFixed(2)}%
                  </span>
                  <span>vs mês anterior</span>
                </>
              )}
              {subtitle && (
                <span className="text-muted-foreground">• {subtitle}</span>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
