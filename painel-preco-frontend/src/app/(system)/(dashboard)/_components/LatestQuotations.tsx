import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import type { RecentData } from "./dashboard";

export default function LatestQuotations() {
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
        latestTenders: [],
        latestQuotations: [
          {
            id: "9b95c045ab9b3714bc8d599a7e2d4ebc",
            totalValue: "R$ 568,33",
            date: "27/06/2025",
            status: "Concluída",
          },
          {
            id: "7a84b123cd4e5678ef9g012h3i4j5k6l",
            totalValue: "R$ 1.245,67",
            date: "26/06/2025",
            status: "Pendente",
          },
          {
            id: "8c95d156bc7a4829de0f123g4h5i6j7k",
            totalValue: "R$ 3.456,89",
            date: "25/06/2025",
            status: "Em análise",
          },
        ],
        mostPurchasedItems: [],
      });
    };

    fetchDashboardData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Últimas Cotações
        </CardTitle>
        <CardDescription>Cotações criadas recentemente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentData.latestQuotations.map((quotation) => (
            <div
              key={quotation.id}
              className="p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-medium text-sm font-mono">
                    {quotation.id.slice(0, 8)}...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {quotation.date}
                  </p>
                </div>
                <Badge
                  variant={
                    quotation.status === "Concluída"
                      ? "default"
                      : quotation.status === "Pendente"
                      ? "secondary"
                      : "outline"
                  }
                  className="text-xs"
                >
                  {quotation.status}
                </Badge>
              </div>
              <div className="text-right">
                <span className="font-medium text-sm">
                  {quotation.totalValue}
                </span>
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
