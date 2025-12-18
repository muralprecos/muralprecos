"use client";

import { Calendar, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CotacaoProps {
  uuid: string;
  nome: string;
  criadoEm: string;
}

export default function ItemCotacao({ uuid, nome, criadoEm }: CotacaoProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/cotacoes/historico`);
  };

  return (
    <Card
      onClick={handleClick}
      className={cn(
        "cursor-pointer border rounded-xl transition-all select-none",
        "hover:shadow-md hover:bg-accent/30 active:scale-[0.99]"
      )}
    >
      <CardContent className="p-4 flex flex-col gap-2">
        <h4 className="font-medium text-lg text-foreground leading-tight line-clamp-2">
          {nome}
        </h4>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {criadoEm}
        </div>
      </CardContent>
    </Card>
  );
}
