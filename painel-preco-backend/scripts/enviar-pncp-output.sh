#!/usr/bin/env bash
#
# Envia pastas do output do PNCP (JSONs já baixados neste ambiente) para popular outro
# ambiente (ex.: staging) através do endpoint administrativo de upload em chunks, evitando
# que o ambiente de destino precise rebaixar tudo direto da API do PNCP.
#
# Empacota localmente (tar.gz), divide em pedaços pequenos e envia um a um. É retomável:
# se a rede cair no meio, rode o script de novo (mesmo WORK_DIR) que ele pula os pedaços
# já confirmados pelo servidor antes de continuar.
#
# Uso:
#   BACKEND_URL=https://qa.api.muraldeprecos.com ADMIN_USER=fulano ADMIN_PASS='...' \
#     ./enviar-pncp-output.sh atas itens
#
# Pastas aceitas: atas, itens, resultados (a maior das três, ~28GB/7M arquivos aqui —
# inclua só se realmente precisar, já que fornecedores também funciona sem cache local,
# só que baixando ao vivo da API do PNCP).
#
# Variáveis opcionais:
#   SOURCE_DIR   diretório local com as pastas atas/ resultados/ itens/ (padrão: /home/euclydes/pncp/output)
#   CHUNK_SIZE   tamanho de cada pedaço enviado (padrão: 50m) — reduza se a rede/proxy for instável
#   WORK_DIR     onde gerar o tar.gz e os pedaços localmente (padrão: /tmp/pncp-output-upload)

set -euo pipefail

SOURCE_DIR="${SOURCE_DIR:-/home/euclydes/pncp/output}"
CHUNK_SIZE="${CHUNK_SIZE:-50m}"
WORK_DIR="${WORK_DIR:-/tmp/pncp-output-upload}"
BACKEND_URL="${BACKEND_URL:?defina BACKEND_URL, ex: https://qa.api.muraldeprecos.com}"
ADMIN_USER="${ADMIN_USER:?defina ADMIN_USER}"
ADMIN_PASS="${ADMIN_PASS:?defina ADMIN_PASS}"

PASTAS=("$@")
if [ ${#PASTAS[@]} -eq 0 ]; then
  PASTAS=(atas itens)
  echo "Nenhuma pasta informada — usando padrão: ${PASTAS[*]}."
fi

for p in "${PASTAS[@]}"; do
  if [ ! -d "$SOURCE_DIR/$p" ]; then
    echo "ERRO: $SOURCE_DIR/$p não existe." >&2
    exit 1
  fi
done

mkdir -p "$WORK_DIR"
TAR_FILE="$WORK_DIR/output.tar.gz"
CHUNKS_DIR="$WORK_DIR/chunks"
SESSION_FILE="$WORK_DIR/upload-id"

if [ ! -f "$TAR_FILE" ]; then
  echo "==> Empacotando ${PASTAS[*]} de $SOURCE_DIR ..."
  tar -czf "$TAR_FILE" -C "$SOURCE_DIR" "${PASTAS[@]}"
else
  echo "==> Reaproveitando pacote já gerado em $TAR_FILE (apague-o se quiser reempacotar do zero)."
fi
echo "==> Pacote: $TAR_FILE ($(du -h "$TAR_FILE" | cut -f1))"

if [ ! -d "$CHUNKS_DIR" ] || [ -z "$(ls -A "$CHUNKS_DIR" 2>/dev/null)" ]; then
  echo "==> Dividindo em pedaços de $CHUNK_SIZE ..."
  mkdir -p "$CHUNKS_DIR"
  split -b "$CHUNK_SIZE" -d -a 6 "$TAR_FILE" "$CHUNKS_DIR/chunk-"
fi
TOTAL_CHUNKS=$(ls "$CHUNKS_DIR" | wc -l)
echo "==> $TOTAL_CHUNKS pedaços."

echo "==> Autenticando em $BACKEND_URL ..."
TOKEN=$(curl -sf -X POST "$BACKEND_URL/serverapi/v1/auth/logon" \
  --data-urlencode "username=$ADMIN_USER" \
  --data-urlencode "password=$ADMIN_PASS" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")
if [ -z "$TOKEN" ]; then
  echo "ERRO: não foi possível autenticar." >&2
  exit 1
fi
echo "==> Autenticado."

if [ -f "$SESSION_FILE" ]; then
  UPLOAD_ID=$(cat "$SESSION_FILE")
  echo "==> Retomando sessão de upload existente: $UPLOAD_ID"
else
  UPLOAD_ID=$(curl -sf -X POST "$BACKEND_URL/serverapi/v1/admin/pncp-output/uploads" \
    -H "Authorization: Bearer $TOKEN" \
    | python3 -c "import sys,json; print(json.load(sys.stdin)['uploadId'])")
  echo "$UPLOAD_ID" > "$SESSION_FILE"
  echo "==> Nova sessão de upload: $UPLOAD_ID"
fi

echo "==> Consultando pedaços já recebidos (retomada)..."
JA_RECEBIDOS=$(curl -sf "$BACKEND_URL/serverapi/v1/admin/pncp-output/uploads/$UPLOAD_ID/status" \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -c "import sys,json; print(' '.join(map(str, json.load(sys.stdin)['chunksRecebidos'])))")

INDEX=0
for CHUNK_FILE in "$CHUNKS_DIR"/chunk-*; do
  if echo " $JA_RECEBIDOS " | grep -q " $INDEX "; then
    echo "  [pedaço $INDEX/$TOTAL_CHUNKS] já enviado, pulando"
  else
    echo "  [pedaço $INDEX/$TOTAL_CHUNKS] enviando ($(du -h "$CHUNK_FILE" | cut -f1))..."
    curl -sf -X PUT "$BACKEND_URL/serverapi/v1/admin/pncp-output/uploads/$UPLOAD_ID/chunks/$INDEX" \
      -H "Authorization: Bearer $TOKEN" \
      -F "chunk=@$CHUNK_FILE" > /dev/null
  fi
  INDEX=$((INDEX + 1))
done

echo "==> Todos os pedaços enviados. Finalizando (extraindo no servidor — pode levar alguns minutos)..."
curl -sf -X POST "$BACKEND_URL/serverapi/v1/admin/pncp-output/uploads/$UPLOAD_ID/finalizar?totalChunks=$TOTAL_CHUNKS" \
  -H "Authorization: Bearer $TOKEN"
echo
echo "==> Concluído."

rm -f "$SESSION_FILE"
rm -rf "$CHUNKS_DIR"
echo "==> Pedaços locais removidos. O pacote $TAR_FILE foi mantido em $WORK_DIR — apague manualmente se quiser liberar espaço."
