import { test } from "node:test";
import assert from "node:assert/strict";
import { buildBackendParams } from "../../src/app/(system)/cotacoes/realizar-cotacao/_components/buildBackendParams";

test("buildBackendParams maps canonical to legacy keys", () => {
  const params = buildBackendParams({
    modalidadeId: "abc",
    porteFornecedorId: "123",
    situacaoId: "sit",
    unidadeFornecimentoId: "un",
  });
  const obj = Object.fromEntries(params.entries());
  assert.equal(obj.modalidadeCompraId, "abc");
  assert.equal(obj.porteFornecedor, "123");
  assert.equal(obj.situacao_licitacao, "sit");
  assert.equal(obj.unidade_fornecimento, "un");
});

test("buildBackendParams removes empty values and trims strings", () => {
  const params = buildBackendParams({
    descricao: "  papel A4  ",
    objeto: "",
    fornecedorId: undefined,
    materialId: null,
  });
  const obj = Object.fromEntries(params.entries());
  assert.equal(obj.descricao, "papel A4");
  assert.equal(obj.objeto, undefined);
  assert.equal(obj.fornecedorId, undefined);
  assert.equal(obj.materialId, undefined);
});

test("buildBackendParams handles numeric ids and zero rules", () => {
  const params = buildBackendParams({
    fornecedorId: 123 as unknown as string,
    materialId: 0 as unknown as string,
    page: 0,
    size: 10,
  });
  const obj = Object.fromEntries(params.entries());
  assert.equal(obj.fornecedorId, "123");
  assert.equal(obj.materialId, undefined);
  assert.equal(obj.page, "0");
  assert.equal(obj.size, "10");
});

test("buildBackendParams builds sort + dir", () => {
  const params = buildBackendParams({
    sort: "valor",
    dir: "asc",
  });
  const obj = Object.fromEntries(params.entries());
  assert.equal(obj.sort, "valor,asc");
  assert.equal(obj.dir, undefined);
});

test("buildBackendParams ignores invalid dir", () => {
  const params = buildBackendParams({
    sort: "valor",
    dir: "invalid",
  });
  const obj = Object.fromEntries(params.entries());
  assert.equal(obj.sort, "valor");
});

test("buildBackendParams keeps page mapping 0-based", () => {
  const params = buildBackendParams({ page: 2 });
  const obj = Object.fromEntries(params.entries());
  assert.equal(obj.page, "2");
});

test("buildBackendParams removes string zero for non-allowed fields", () => {
  const params = buildBackendParams({ descricao: "0" });
  const obj = Object.fromEntries(params.entries());
  assert.equal(obj.descricao, undefined);
});
