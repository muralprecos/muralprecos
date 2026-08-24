import { test } from "node:test";
import assert from "node:assert/strict";
import { getFriendlyErrorMessage, parseApiError } from "../../src/utils/errorUtils";

test("getFriendlyErrorMessage maps HTTP 502/503 to temporary service unavailable", () => {
  const result502 = getFriendlyErrorMessage(502);
  assert.equal(result502.title, "Serviço temporariamente indisponível");
  assert.match(result502.description, /temporariamente indisponível/);

  const result503 = getFriendlyErrorMessage(503);
  assert.equal(result503.title, "Serviço temporariamente indisponível");
});

test("getFriendlyErrorMessage maps HTTP 404 to not found", () => {
  const result = getFriendlyErrorMessage(404);
  assert.equal(result.title, "Dados não encontrados");
});

test("getFriendlyErrorMessage maps HTTP 401 and 403 to auth errors", () => {
  const result401 = getFriendlyErrorMessage(401);
  assert.equal(result401.title, "Sessão expirada");

  const result403 = getFriendlyErrorMessage(403);
  assert.equal(result403.title, "Acesso não autorizado");
});

test("parseApiError extracts status code from HTTP error string or Error instance", () => {
  const parsed1 = parseApiError("HTTP 502");
  assert.equal(parsed1.status, 502);
  assert.equal(parsed1.title, "Serviço temporariamente indisponível");

  const parsed2 = parseApiError(new Error("HTTP 404"));
  assert.equal(parsed2.status, 404);
  assert.equal(parsed2.title, "Dados não encontrados");
});

test("parseApiError handles network/offline errors gracefully", () => {
  const parsed = parseApiError(new Error("Failed to fetch"));
  assert.equal(parsed.title, "Sem conexão com o servidor");
  assert.match(parsed.description, /internet/);
});

test("parseApiError extracts backend message payload from objects", () => {
  const parsed = parseApiError({
    status: 502,
    message: "Não foi possível carregar os dados de fornecedores.",
  });
  assert.equal(parsed.status, 502);
  assert.equal(parsed.title, "Serviço temporariamente indisponível");
  assert.equal(parsed.description, "Não foi possível carregar os dados de fornecedores.");
});
