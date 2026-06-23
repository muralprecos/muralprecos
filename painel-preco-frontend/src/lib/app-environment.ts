export type AppEnvironment = "production" | "homolog" | "development";

const VALID_ENVIRONMENTS = new Set<AppEnvironment>([
  "production",
  "homolog",
  "development",
]);

export function normalizeAppEnvironment(value?: string | null): AppEnvironment {
  const normalizedValue = value?.trim().toLowerCase();

  if (normalizedValue && VALID_ENVIRONMENTS.has(normalizedValue as AppEnvironment)) {
    return normalizedValue as AppEnvironment;
  }

  return process.env.NODE_ENV === "development" ? "development" : "production";
}

export const appEnvironment = normalizeAppEnvironment(
  process.env.NEXT_PUBLIC_APP_ENV,
);

export const isNonProductionEnvironment = appEnvironment !== "production";

export const environmentBadgeLabel =
  appEnvironment === "homolog"
    ? "hmg"
    : appEnvironment === "development"
      ? "dev"
      : null;

export function getLoginEnvironmentNotice(): {
  label: string;
  description: string;
} | null {
  if (appEnvironment === "homolog") {
    return {
      label: "Ambiente de homologação",
      description:
        "Use este ambiente para validar o comportamento antes da publicação em produção.",
    };
  }

  if (appEnvironment === "development") {
    return {
      label: "Ambiente de desenvolvimento",
      description:
        "Este acesso é destinado a testes locais.",
    };
  }

  return null;
}