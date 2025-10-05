"use client";
import StatusCard from "@/components/molecules/StatusCard";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorPage() {
  return (
    <StatusCard
      code="500"
      title="Algo Deu Errado"
      message="Ocorreu um erro inesperado no servidor. Nossa equipe foi notificada e está trabalhando para resolver o problema."
      icon={AlertTriangle}
      theme="red"
      extraActions={[
        {
          label: "Recarregar",
          icon: RefreshCw,
          onClick: () => window.location.reload(),
        },
      ]}
    />
  );
}
