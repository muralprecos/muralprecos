import { TriangleAlert } from "lucide-react";

interface Props {
  message: string;
}

export function KeycloakSyncWarning({ message }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
      <TriangleAlert className="h-5 w-5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
