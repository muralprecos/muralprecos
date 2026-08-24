import { notify, type NotifyOptions } from "@/components/molecules/NotifyToast";

export interface FriendlyError {
  status?: number;
  title: string;
  description: string;
}

/**
 * Mapeia códigos de status HTTP para mensagens claras e amigáveis ao usuário.
 */
export function getFriendlyErrorMessage(
  status?: number | null,
  backendMessage?: string
): { title: string; description: string } {
  switch (status) {
    case 400:
      return {
        title: "Requisição inválida",
        description: backendMessage || "Verifique os filtros ou dados informados e tente novamente.",
      };
    case 401:
      return {
        title: "Sessão expirada",
        description: "Por favor, realize o login novamente para continuar.",
      };
    case 403:
      return {
        title: "Acesso não autorizado",
        description: "Você não possui permissão para acessar estas informações.",
      };
    case 404:
      return {
        title: "Dados não encontrados",
        description: backendMessage || "Os registros solicitados não foram localizados no servidor.",
      };
    case 408:
    case 504:
      return {
        title: "Tempo de resposta esgotado",
        description: "O servidor demorou muito para responder. Tente novamente mais tarde.",
      };
    case 500:
      return {
        title: "Erro interno no servidor",
        description: backendMessage || "Ocorreu um erro no processamento do servidor. Tente novamente em instantes.",
      };
    case 502:
    case 503:
      return {
        title: "Serviço temporariamente indisponível",
        description:
          backendMessage ||
          "O servidor de dados está temporariamente indisponível ou em manutenção. Tente novamente em instantes.",
      };
    default:
      return {
        title: "Não foi possível carregar os dados",
        description:
          backendMessage ||
          "Ocorreu uma instabilidade na comunicação com o servidor. Tente novamente mais tarde.",
      };
  }
}

/**
 * Extrai código HTTP e mensagens amigáveis a partir de qualquer erro (Error, Response, objeto ou string).
 */
export function parseApiError(error: unknown, fallbackTitle?: string): FriendlyError {
  if (!error) {
    return {
      title: fallbackTitle || "Erro inesperado",
      description: "Ocorreu uma instabilidade na comunicação.",
    };
  }

  // Se já for uma string
  if (typeof error === "string") {
    const statusMatch = error.match(/\b(400|401|403|404|408|500|502|503|504)\b/);
    const status = statusMatch ? parseInt(statusMatch[1], 10) : undefined;
    const friendly = getFriendlyErrorMessage(status, error.includes("HTTP") ? undefined : error);
    return {
      status,
      title: fallbackTitle || friendly.title,
      description: friendly.description,
    };
  }

  // Se for uma instância de Error
  if (error instanceof Error) {
    const msg = error.message;

    // Erros de rede (Failed to fetch, NetworkError, offline)
    if (msg.includes("Failed to fetch") || msg.includes("NetworkError") || msg.includes("fetch failed")) {
      return {
        title: fallbackTitle || "Sem conexão com o servidor",
        description: "Verifique sua conexão com a internet e tente novamente.",
      };
    }

    // Extrai status code se estiver em formato "HTTP 502" ou "status 502"
    const statusMatch = msg.match(/\b(400|401|403|404|408|500|502|503|504)\b/);
    const status = statusMatch ? parseInt(statusMatch[1], 10) : undefined;
    const friendly = getFriendlyErrorMessage(status);

    return {
      status,
      title: fallbackTitle || friendly.title,
      description: friendly.description,
    };
  }

  // Se for um objeto com status/statusCode/message
  if (typeof error === "object" && error !== null) {
    const obj = error as Record<string, any>;
    const status = typeof obj.status === "number" ? obj.status : typeof obj.statusCode === "number" ? obj.statusCode : undefined;
    const backendMessage = typeof obj.message === "string" ? obj.message : typeof obj.error === "string" ? obj.error : undefined;

    const friendly = getFriendlyErrorMessage(status, backendMessage);
    return {
      status,
      title: fallbackTitle || friendly.title,
      description: friendly.description,
    };
  }

  return {
    title: fallbackTitle || "Erro na requisição",
    description: "Tente novamente mais tarde.",
  };
}

/**
 * Dispara uma notificação amigável via NotifyToast para erros de API, com suporte a deduplicação de toasts via `id`.
 */
export function notifyApiError(
  error: unknown,
  fallbackTitle?: string,
  options?: NotifyOptions
) {
  const parsed = parseApiError(error, fallbackTitle);
  notify("error", parsed.title, parsed.description, options);
}
