"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function Unauthorized() {
  const router = useRouter();

  const tryAgain = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-1 justify-center items-center pb-10">
      <div className="flex sm:h-8 sm:flex-row flex-col items-center space-x-4 space-y-2 text-small">
        <h2 className="text-lg">
          <b className="text-xl">401!</b> Você não tem permissão para esta
          operação.
        </h2>
        <Separator />
        <Button color="primary" onClick={tryAgain}>
          Início
        </Button>
      </div>
    </div>
  );
}
