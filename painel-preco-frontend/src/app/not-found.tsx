"use client";
import StatusCard from "@/components/molecules/StatusCard";
import { SearchX } from "lucide-react";

export default function NotFoundPage() {
  return (
    <StatusCard
      code="404"
      title="Página Não Encontrada"
      message="Ops! A página que você está procurando não existe ou foi movida para outro lugar."
      icon={SearchX}
      theme="violet"
    />
  );
}
