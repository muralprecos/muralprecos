"use client";
import StatusCard from "@/components/molecules/StatusCard";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
  return (
    <StatusCard
      code="401"
      title="Acesso Não Autorizado"
      message="Você não possui permissão para acessar este recurso. Por favor, verifique suas credenciais ou entre em contato com o administrador."
      icon={ShieldAlert}
      theme="orange"
    />
  );
}
