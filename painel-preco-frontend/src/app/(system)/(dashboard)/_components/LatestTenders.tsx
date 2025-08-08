import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import type { RecentData } from "./dashboard";

export default function LatestTenders() {
  const [recentData, setRecentData] = useState<RecentData>({
    latestTenders: [],
    latestQuotations: [],
    mostPurchasedItems: [],
  });
  // Simulate API calls - replace with actual API endpoints
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock recent data
      setRecentData({
        latestTenders: [
          {
            id: "LIC001",
            number: "2025/001",
            object: "Aquisição de material de limpeza",
            unit: "Secretaria de Administração",
            value: "R$ 45.680,00",
            openingDate: "28/06/2025",
            status: "Aberta",
          },
          {
            id: "LIC002",
            number: "2025/002",
            object: "Contratação de serviços de manutenção",
            unit: "Secretaria de Obras",
            value: "R$ 125.340,00",
            openingDate: "27/06/2025",
            status: "Em andamento",
          },
          {
            id: "LIC003",
            number: "2025/003",
            object: "Fornecimento de equipamentos de informática",
            unit: "Secretaria de Tecnologia",
            value: "R$ 89.750,00",
            openingDate: "26/06/2025",
            status: "Finalizada",
          },
        ],
        latestQuotations: [],
        mostPurchasedItems: [],
      });
    };

    fetchDashboardData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Últimas Licitações
        </CardTitle>
        <CardDescription>Licitações abertas recentemente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentData.latestTenders.map((tender) => (
            <div
              key={tender.id}
              className="p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-medium text-sm">{tender.number}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {tender.object}
                  </p>
                </div>
                <Badge
                  variant={
                    tender.status === "Aberta"
                      ? "default"
                      : tender.status === "Em andamento"
                      ? "secondary"
                      : "outline"
                  }
                  className="text-xs"
                >
                  {tender.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{tender.openingDate}</span>
                <span className="font-medium">{tender.value}</span>
              </div>
            </div>
          ))}
        </div>
        <Button variant="ghost" className="w-full mt-4 gap-2" size="sm">
          <Eye className="h-4 w-4" />
          Ver todas
        </Button>
      </CardContent>
    </Card>
  );
}
