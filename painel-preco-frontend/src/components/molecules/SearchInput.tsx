"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  // Mantém o input sincronizado com o valor da URL
  useEffect(() => {
    const nomeParam = searchParams.get("nome");
    if (nomeParam) setSearch(nomeParam);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("nome", search);
    } else {
      params.delete("nome");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full mt-4">
      <Input
        placeholder="Buscar item..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </form>
  );
}
