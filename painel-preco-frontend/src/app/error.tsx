"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("error.tsx", error);
  }, [error]);

  const tryAgain = () => {
    router.back();
  };

  return (
    <div className="flex flex-1 justify-center items-center pb-10">
      <div className="flex sm:h-8 sm:flex-row flex-col items-center space-x-4 space-y-2 text-small">
        <h2 className="text-lg">
          <b className="text-xl">Ops,</b> Ocorreu um problema!
        </h2>
        <Button color="primary" onClick={tryAgain}>
          Tente Novamente
        </Button>
      </div>
    </div>
  );
}
