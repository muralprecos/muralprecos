#!/usr/bin/env python3
"""Gera os templates .docx "limpos" usados por ArtefatoGeradoService para TR e Edital
(src/main/resources/templates/tr-clean-base.docx e edital-clean-base.docx).

Substitui o antigo template de geracao (copia do modelo de redacao da AGU, cheio de
comentarios, realces coloridos e paragrafos "opcionais" nunca resolvidos) por um
documento minimo e limpo, no MESMO espirito de src/main/resources/templates/etp/etp-base.docx
ja existente: sem styles.xml, sem cores/realces, um run por trecho com b/sz explicitos,
paragrafos de corpo justificados (w:jc=both).

A estrutura de secoes (titulos, ordem, e qual token cada uma recebe) precisa ficar em
sincronia com as listas SECOES_TR/SECOES_EDITAL de DocxSecaoDraftService.java e com os
tokens {{CLAUSE:*}} que DocxClauseSelectionService/ClausulaCatalogoTR/Edital resolvem.
Rode este script (python3, sem dependencias externas) sempre que essa estrutura mudar:

    python3 scripts/gerar-templates-artefatos.py

Ele sobrescreve os dois arquivos em src/main/resources/templates/.
"""
import zipfile
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(BASE_DIR, "src", "main", "resources", "templates")

CONTENT_TYPES = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
    '<Default ContentType="application/vnd.openxmlformats-package.relationships+xml" Extension="rels"/>'
    '<Default ContentType="application/xml" Extension="xml"/>'
    '<Override ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml" PartName="/docProps/app.xml"/>'
    '<Override ContentType="application/vnd.openxmlformats-package.core-properties+xml" PartName="/docProps/core.xml"/>'
    '<Override ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml" PartName="/word/document.xml"/>'
    '<Override ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml" PartName="/word/settings.xml"/>'
    '</Types>'
)

RELS_PACKAGE = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    '<Relationship Id="rId1" Target="word/document.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"/>'
    '<Relationship Id="rId2" Target="docProps/app.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties"/>'
    '<Relationship Id="rId3" Target="docProps/core.xml" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties"/>'
    '</Relationships>'
)

RELS_DOCUMENT = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    '<Relationship Id="rId1" Target="settings.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings"/>'
    '</Relationships>'
)

APP_XML = (
    '<?xml version="1.0" encoding="UTF-8"?>'
    '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">'
    '<Application>painel-preco</Application></Properties>'
)

CORE_XML = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" '
    'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" '
    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
    '<dcterms:created xsi:type="dcterms:W3CDTF">2026-09-12T00:00:00Z</dcterms:created>'
    '<dc:creator>painel-preco</dc:creator></cp:coreProperties>'
)

SETTINGS_XML = (
    '<?xml version="1.0" encoding="UTF-8"?>'
    '<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>'
)


def esc(text):
    return (text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def run(text, bold=False, size=22, italic=False):
    rpr = f'<w:b w:val="{"on" if bold else "off"}"/><w:sz w:val="{size}"/>'
    if italic:
        rpr += '<w:i w:val="on"/>'
    return f'<w:r><w:rPr>{rpr}</w:rPr><w:t xml:space="preserve">{esc(text)}</w:t></w:r>'


def p(text="", bold=False, size=22, center=False, italic=False):
    ppr = '<w:pPr><w:jc w:val="center"/></w:pPr>' if center else '<w:pPr><w:jc w:val="both"/></w:pPr>'
    if text == "":
        return "<w:p/>"
    return f'<w:p>{ppr}{run(text, bold=bold, size=size, italic=italic)}</w:p>'


def heading(numero, titulo):
    return p(f"{numero}. {titulo}", bold=True, size=24)


def blank():
    return "<w:p/>"


def item_table():
    borda = '<w:tcBorders><w:top w:val="single" w:sz="4" w:color="000000"/><w:left w:val="single" w:sz="4" w:color="000000"/>' \
            '<w:bottom w:val="single" w:sz="4" w:color="000000"/><w:right w:val="single" w:sz="4" w:color="000000"/></w:tcBorders>'

    def celula(texto, bold=False, shaded=False, width=1000):
        shd = '<w:shd w:val="clear" w:fill="D9D9D9"/>' if shaded else ''
        return (f'<w:tc><w:tcPr><w:tcW w:w="{width}" w:type="dxa"/>{borda}{shd}</w:tcPr>'
                f'<w:p><w:r><w:rPr><w:b w:val="{"on" if bold else "off"}"/><w:sz w:val="20"/></w:rPr>'
                f'<w:t xml:space="preserve">{esc(texto)}</w:t></w:r></w:p></w:tc>')

    header = '<w:tr>' + ''.join([
        celula("Item", bold=True, shaded=True, width=700),
        celula("Descrição", bold=True, shaded=True, width=3500),
        celula("Unidade", bold=True, shaded=True, width=1200),
        celula("Quantidade", bold=True, shaded=True, width=1200),
        celula("Valor Unitário", bold=True, shaded=True, width=1400),
        celula("Valor Total", bold=True, shaded=True, width=1400),
    ]) + '</w:tr>'

    data_row = '<w:tr>' + ''.join([
        celula("{{FACTS:ITEM_NUMERO}}", width=700),
        celula("{{FACTS:ITEM_DESCRICAO}}", width=3500),
        celula("{{FACTS:ITEM_UNIDADE}}", width=1200),
        celula("{{FACTS:ITEM_QUANTIDADE}}", width=1200),
        celula("{{FACTS:ITEM_VALOR_UNITARIO}}", width=1400),
        celula("{{FACTS:ITEM_VALOR_TOTAL}}", width=1400),
    ]) + '</w:tr>'

    grid = ''.join(f'<w:gridCol w:w="{w}"/>' for w in (700, 3500, 1200, 1200, 1400, 1400))
    return (f'<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/>'
            f'<w:tblBorders><w:top w:val="single" w:sz="4" w:color="000000"/><w:left w:val="single" w:sz="4" w:color="000000"/>'
            f'<w:bottom w:val="single" w:sz="4" w:color="000000"/><w:right w:val="single" w:sz="4" w:color="000000"/>'
            f'<w:insideH w:val="single" w:sz="4" w:color="000000"/><w:insideV w:val="single" w:sz="4" w:color="000000"/></w:tblBorders>'
            f'</w:tblPr><w:tblGrid>{grid}</w:tblGrid>{header}{data_row}</w:tbl>')


def capa(titulo_documento):
    return "".join([
        p(titulo_documento, bold=True, size=32, center=True),
        p("Lei nº 14.133, de 1º de abril de 2021", size=22, center=True),
        p("{{FACTS:ORGAO_NOME}}", size=22, center=True),
        p("(Processo Administrativo n° xxxxx.xxxxxx/xxxx-xx)", size=22, center=True),
        blank(),
        p("Objeto: {{FACTS:OBJETO}}", size=22),
        p("Modalidade pretendida: {{FACTS:MODALIDADE_NOME}}", size=22),
        p("Critério de julgamento: {{FACTS:CRITERIO_JULGAMENTO_NOME}}", size=22),
        p("Valor total estimado: {{FACTS:VALOR_TOTAL_ESTIMADO}} ({{FACTS:VALOR_POR_EXTENSO}})", size=22),
        blank(),
    ])


def assinatura():
    return "".join([
        blank(),
        p("[Local], [dia] de [mês] de [ano].", size=22),
        blank(),
        p("_________________________________________", size=22),
        p("(Nome e Cargo do Responsável pela Elaboração)", size=20, center=True),
        blank(),
        p("Este documento é uma minuta gerada automaticamente com base nos dados informados pelo órgão e está "
          "sujeito a revisão técnica e jurídica da equipe responsável antes de sua aprovação final.", size=18, italic=True),
    ])


def montar_documento(corpo_paragrafos):
    body = "".join(corpo_paragrafos)
    return (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
        f'<w:body>{body}</w:body></w:document>'
    )


def escrever_docx(caminho, document_xml):
    with zipfile.ZipFile(caminho, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", CONTENT_TYPES)
        z.writestr("_rels/.rels", RELS_PACKAGE)
        z.writestr("docProps/app.xml", APP_XML)
        z.writestr("docProps/core.xml", CORE_XML)
        z.writestr("word/document.xml", document_xml)
        z.writestr("word/_rels/document.xml.rels", RELS_DOCUMENT)
        z.writestr("word/settings.xml", SETTINGS_XML)


# ── Termo de Referência ──────────────────────────────────────────────────────

def gerar_tr():
    corpo = [capa("TERMO DE REFERÊNCIA")]

    corpo.append(heading(1, "CONDIÇÕES GERAIS DA CONTRATAÇÃO"))
    corpo.append(p("{{DRAFT:CONDICOES_GERAIS}}"))
    corpo.append(p("{{CLAUSE:CONTINUIDADE}}"))

    secoes_simples = [
        (2, "FUNDAMENTAÇÃO E DESCRIÇÃO DA NECESSIDADE DA CONTRATAÇÃO", "FUNDAMENTACAO_NECESSIDADE"),
        (3, "DESCRIÇÃO DA SOLUÇÃO COMO UM TODO CONSIDERADO O CICLO DE VIDA DO OBJETO", "DESCRICAO_SOLUCAO"),
        (4, "REQUISITOS DA CONTRATAÇÃO", "REQUISITOS_CONTRATACAO"),
        (5, "SUBCONTRATAÇÃO", "SUBCONTRATACAO"),
        (6, "MODELO DE EXECUÇÃO DO OBJETO", "MODELO_EXECUCAO"),
        (7, "MODELO DE GESTÃO DO CONTRATO", "MODELO_GESTAO"),
        (8, "CRITÉRIOS DE MEDIÇÃO E PAGAMENTO", "MEDICAO_PAGAMENTO"),
        (9, "INFRAÇÕES E SANÇÕES ADMINISTRATIVAS", "SANCOES"),
        (10, "FORMA E CRITÉRIOS DE SELEÇÃO DO FORNECEDOR E REGIME DE EXECUÇÃO", "SELECAO_FORNECEDOR"),
    ]
    for numero, titulo, chave in secoes_simples:
        corpo.append(heading(numero, titulo))
        corpo.append(p(f"{{{{DRAFT:{chave}}}}}"))

    corpo.append(heading(11, "ESTIMATIVAS DO VALOR DA CONTRATAÇÃO"))
    corpo.append(p("O valor total estimado da contratação é de {{FACTS:VALOR_TOTAL_ESTIMADO}} "
                    "({{FACTS:VALOR_POR_EXTENSO}}), conforme detalhamento por item a seguir."))
    corpo.append(item_table())
    corpo.append(blank())

    corpo.append(heading(12, "ADEQUAÇÃO ORÇAMENTÁRIA"))
    corpo.append(p("{{CLAUSE:ORCAMENTO_SIGILO}}"))
    corpo.append(p("{{CLAUSE:DOTACAO}}"))

    corpo.append(heading(13, "DISPOSIÇÕES FINAIS"))
    corpo.append(p("{{DRAFT:DISPOSICOES_FINAIS}}"))

    corpo.append(heading(14, "FORMALIZAÇÃO DA CONTRATAÇÃO"))
    corpo.append(p("{{DRAFT:FORMALIZACAO_CONTRATACAO}}"))

    corpo.append(heading(15, "VIGÊNCIA E PRORROGAÇÃO"))
    corpo.append(p("{{CLAUSE:VIGENCIA}}"))

    secoes_finais = [
        (16, "OBRIGAÇÕES DO CONTRATANTE", "OBRIGACOES_CONTRATANTE"),
        (17, "OBRIGAÇÕES DO CONTRATADO", "OBRIGACOES_CONTRATADO"),
        (18, "OBRIGAÇÕES PERTINENTES À LGPD", "OBRIGACOES_LGPD"),
        (19, "DA EXTINÇÃO CONTRATUAL", "EXTINCAO_CONTRATUAL"),
        (20, "DOS CASOS OMISSOS", "CASOS_OMISSOS"),
        (21, "ALTERAÇÕES", "ALTERACOES_CONTRATUAIS"),
        (22, "FORO", "FORO"),
    ]
    for numero, titulo, chave in secoes_finais:
        corpo.append(heading(numero, titulo))
        corpo.append(p(f"{{{{DRAFT:{chave}}}}}"))

    corpo.append(assinatura())
    return montar_documento(corpo)


# ── Edital ───────────────────────────────────────────────────────────────────

def gerar_edital():
    corpo = [capa("EDITAL DE LICITAÇÃO")]

    corpo.append(heading(1, "DO OBJETO"))
    corpo.append(p("{{DRAFT:EDITAL_OBJETO}}"))
    corpo.append(p("{{CLAUSE:DIVISAO_ITENS}}"))

    corpo.append(heading(2, "DO REGISTRO DE PREÇOS"))
    corpo.append(p("{{DRAFT:REGISTRO_PRECOS}}"))

    corpo.append(heading(3, "DA PARTICIPAÇÃO NA LICITAÇÃO"))
    corpo.append(p("{{DRAFT:PARTICIPACAO_LICITACAO}}"))
    corpo.append(p("{{CLAUSE:TRATAMENTO_ME_EPP}}"))

    corpo.append(heading(4, "DO ORÇAMENTO ESTIMADO"))
    corpo.append(p("O valor total estimado da contratação é de {{FACTS:VALOR_TOTAL_ESTIMADO}} "
                    "({{FACTS:VALOR_POR_EXTENSO}})."))
    corpo.append(p("{{CLAUSE:ORCAMENTO_SIGILO}}"))

    secoes_simples = [
        (5, "DA APRESENTAÇÃO DA PROPOSTA E DOS DOCUMENTOS DE HABILITAÇÃO", "APRESENTACAO_PROPOSTA_HABILITACAO"),
        (6, "DO PREENCHIMENTO DA PROPOSTA", "PREENCHIMENTO_PROPOSTA"),
        (7, "DA ABERTURA DA SESSÃO, CLASSIFICAÇÃO DAS PROPOSTAS E FORMULAÇÃO DE LANCES", "ABERTURA_SESSAO_LANCES"),
        (8, "DA FASE DE JULGAMENTO", "FASE_JULGAMENTO"),
        (9, "DA FASE DE HABILITAÇÃO", "FASE_HABILITACAO"),
        (10, "DO TERMO DE CONTRATO", "TERMO_CONTRATO"),
        (11, "DA ATA DE REGISTRO DE PREÇOS", "ATA_REGISTRO_PRECOS"),
        (12, "DA FORMAÇÃO DO CADASTRO DE RESERVA", "CADASTRO_RESERVA"),
        (13, "DOS RECURSOS", "RECURSOS_ADMINISTRATIVOS"),
        (14, "DAS INFRAÇÕES ADMINISTRATIVAS E SANÇÕES", "INFRACOES_SANCOES_EDITAL"),
        (15, "DA IMPUGNAÇÃO AO EDITAL E DO PEDIDO DE ESCLARECIMENTO", "IMPUGNACAO_ESCLARECIMENTO"),
        (16, "DAS DISPOSIÇÕES GERAIS", "DISPOSICOES_GERAIS_EDITAL"),
    ]
    for numero, titulo, chave in secoes_simples:
        corpo.append(heading(numero, titulo))
        corpo.append(p(f"{{{{DRAFT:{chave}}}}}"))

    corpo.append(assinatura())
    return montar_documento(corpo)


if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)
    escrever_docx(os.path.join(OUT_DIR, "tr-clean-base.docx"), gerar_tr())
    escrever_docx(os.path.join(OUT_DIR, "edital-clean-base.docx"), gerar_edital())
    print("Gerado:", os.path.join(OUT_DIR, "tr-clean-base.docx"))
    print("Gerado:", os.path.join(OUT_DIR, "edital-clean-base.docx"))
