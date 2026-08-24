package br.com.tt.painelpreco.domain.service;

import br.com.tt.painelpreco.api.dto.DashboardAtaAlertaVencimentoDTO;
import br.com.tt.painelpreco.api.dto.DashboardAtaEvolucaoItemDTO;
import br.com.tt.painelpreco.api.dto.DashboardAtaKpiDTO;
import br.com.tt.painelpreco.api.dto.DashboardAtaSituacaoDTO;
import br.com.tt.painelpreco.api.dto.DashboardAtaTopObjetoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class DashboardAtaService {

    // Predicado de situação reutilizado nas queries (mesmo critério usado em getPorSituacao)
    private static final String SITUACAO_CASE =
            "CASE WHEN a.situacao_nome = 'Cancelada' THEN 'Cancelada' " +
            "WHEN a.data_vigencia_fim < NOW() THEN 'Vencida' ELSE 'Vigente' END";

    @Autowired
    private NamedParameterJdbcTemplate jdbc;

    private MapSqlParameterSource baseParams(Date dataInicio, Date dataFim, String situacao, String objeto) {
        return new MapSqlParameterSource()
                .addValue("dataInicio", dataInicio)
                .addValue("dataFim", dataFim)
                .addValue("situacao", situacao)
                .addValue("objeto", objeto);
    }

    @Cacheable(value = "ata-kpis", keyGenerator = "cacheKeyGenerator")
    public DashboardAtaKpiDTO getKpis(Date dataInicio, Date dataFim, String situacao, String objeto) {
        String sql = "WITH base AS ( " +
            "  SELECT a.situacao_nome, a.data_vigencia_fim, a.licitacao_id, l.valor " +
            "  FROM mural.ata_registro_preco a " +
            "  JOIN mural.licitacao l ON l.id_licitacao = a.licitacao_id " +
            "  WHERE (CAST(:dataInicio AS date) IS NULL OR a.data_vigencia_fim >= CAST(:dataInicio AS date)) " +
            "    AND (CAST(:dataFim AS date) IS NULL OR a.data_vigencia_fim <= CAST(:dataFim AS date)) " +
            "    AND (CAST(:situacao AS text) IS NULL OR (" + SITUACAO_CASE + ") = CAST(:situacao AS text)) " +
            "    AND (CAST(:objeto AS text) IS NULL OR l.objeto ILIKE CONCAT('%', CAST(:objeto AS text), '%')) " +
            ") " +
            "SELECT " +
            "  (SELECT COUNT(*) FROM base WHERE situacao_nome = 'Vigente' AND data_vigencia_fim >= NOW()) AS total_atas_ativas, " +
            "  (SELECT COUNT(*) FROM base WHERE situacao_nome = 'Vigente' AND data_vigencia_fim BETWEEN NOW() AND NOW() + INTERVAL '30 days') AS atas_vencendo_30d, " +
            "  (SELECT COALESCE(SUM(valor), 0) FROM base WHERE situacao_nome = 'Vigente' AND data_vigencia_fim >= NOW()) AS valor_total_registrado, " +
            "  (SELECT COUNT(DISTINCT licitacao_id) FROM base WHERE situacao_nome = 'Vigente' AND data_vigencia_fim >= NOW()) AS total_licitacoes_cobertas";

        return jdbc.queryForObject(sql, baseParams(dataInicio, dataFim, situacao, objeto),
                (rs, row) -> DashboardAtaKpiDTO.builder()
                        .totalAtasAtivas(rs.getLong("total_atas_ativas"))
                        .atasVencendo30d(rs.getLong("atas_vencendo_30d"))
                        .valorTotalRegistrado(rs.getDouble("valor_total_registrado"))
                        .totalItensCobertos(rs.getLong("total_licitacoes_cobertas"))
                        .build());
    }

    @Cacheable(value = "ata-por-situacao", keyGenerator = "cacheKeyGenerator")
    public List<DashboardAtaSituacaoDTO> getPorSituacao(Date dataInicio, Date dataFim, String objeto) {
        String sql = "SELECT situacao, COUNT(*) AS total FROM (" +
            "  SELECT (" + SITUACAO_CASE + ") AS situacao " +
            "  FROM mural.ata_registro_preco a " +
            "  JOIN mural.licitacao l ON l.id_licitacao = a.licitacao_id " +
            "  WHERE (CAST(:dataInicio AS date) IS NULL OR a.data_vigencia_fim >= CAST(:dataInicio AS date)) " +
            "    AND (CAST(:dataFim AS date) IS NULL OR a.data_vigencia_fim <= CAST(:dataFim AS date)) " +
            "    AND (CAST(:objeto AS text) IS NULL OR l.objeto ILIKE CONCAT('%', CAST(:objeto AS text), '%')) " +
            ") t GROUP BY situacao ORDER BY total DESC";

        return jdbc.query(sql, baseParams(dataInicio, dataFim, null, objeto),
                (rs, row) -> DashboardAtaSituacaoDTO.builder()
                        .situacao(rs.getString("situacao"))
                        .total(rs.getLong("total"))
                        .build());
    }

    @Cacheable(value = "ata-evolucao", keyGenerator = "cacheKeyGenerator")
    public List<DashboardAtaEvolucaoItemDTO> getEvolucaoMensal(int ano, String situacao, String objeto) {
        String sql = "WITH meses AS ( " +
            "  SELECT DATE_TRUNC('month', gs) AS mes " +
            "  FROM generate_series(:anoInicio::date, (:ano::integer || '-12-01')::date, '1 month'::interval) gs " +
            "), " +
            "criadas AS ( " +
            "  SELECT DATE_TRUNC('month', a.data_assinatura) AS mes, COUNT(*) AS cnt " +
            "  FROM mural.ata_registro_preco a " +
            "  JOIN mural.licitacao l ON l.id_licitacao = a.licitacao_id " +
            "  WHERE EXTRACT(YEAR FROM a.data_assinatura) = :ano " +
            "    AND (CAST(:situacao AS text) IS NULL OR (" + SITUACAO_CASE + ") = CAST(:situacao AS text)) " +
            "    AND (CAST(:objeto AS text) IS NULL OR l.objeto ILIKE CONCAT('%', CAST(:objeto AS text), '%')) " +
            "  GROUP BY 1 " +
            "), " +
            "encerradas AS ( " +
            "  SELECT DATE_TRUNC('month', a.data_vigencia_fim) AS mes, COUNT(*) AS cnt " +
            "  FROM mural.ata_registro_preco a " +
            "  JOIN mural.licitacao l ON l.id_licitacao = a.licitacao_id " +
            "  WHERE EXTRACT(YEAR FROM a.data_vigencia_fim) = :ano " +
            "    AND (CAST(:situacao AS text) IS NULL OR (" + SITUACAO_CASE + ") = CAST(:situacao AS text)) " +
            "    AND (CAST(:objeto AS text) IS NULL OR l.objeto ILIKE CONCAT('%', CAST(:objeto AS text), '%')) " +
            "  GROUP BY 1 " +
            ") " +
            "SELECT " +
            "  TO_CHAR(m.mes, 'Mon/YY') AS mes_ano, " +
            "  COALESCE(c.cnt, 0) AS criadas, " +
            "  COALESCE(e.cnt, 0) AS encerradas, " +
            "  SUM(COALESCE(c.cnt,0) - COALESCE(e.cnt,0)) OVER (ORDER BY m.mes) AS ativas " +
            "FROM meses m " +
            "LEFT JOIN criadas c ON c.mes = m.mes " +
            "LEFT JOIN encerradas e ON e.mes = m.mes " +
            "ORDER BY m.mes";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("anoInicio", ano + "-01-01")
                .addValue("ano", ano)
                .addValue("situacao", situacao)
                .addValue("objeto", objeto);

        return jdbc.query(sql, params, (rs, row) -> DashboardAtaEvolucaoItemDTO.builder()
                        .mesAno(rs.getString("mes_ano"))
                        .criadas(rs.getLong("criadas"))
                        .encerradas(rs.getLong("encerradas"))
                        .ativas(rs.getLong("ativas"))
                        .build());
    }

    @Cacheable(value = "ata-top-objetos", keyGenerator = "cacheKeyGenerator")
    public List<DashboardAtaTopObjetoDTO> getTopObjetos(int limite, Date dataInicio, Date dataFim, String situacao, String objeto) {
        String sql = "SELECT l.objeto AS descricao, COUNT(*) AS total_atas, " +
            "  COALESCE(SUM(l.valor), 0) AS valor_total " +
            "FROM mural.ata_registro_preco a " +
            "JOIN mural.licitacao l ON l.id_licitacao = a.licitacao_id " +
            "WHERE l.objeto IS NOT NULL AND l.objeto != '' " +
            "  AND (CAST(:dataInicio AS date) IS NULL OR a.data_vigencia_fim >= CAST(:dataInicio AS date)) " +
            "  AND (CAST(:dataFim AS date) IS NULL OR a.data_vigencia_fim <= CAST(:dataFim AS date)) " +
            "  AND (CAST(:situacao AS text) IS NULL OR (" + SITUACAO_CASE + ") = CAST(:situacao AS text)) " +
            "  AND (CAST(:objeto AS text) IS NULL OR l.objeto ILIKE CONCAT('%', CAST(:objeto AS text), '%')) " +
            "GROUP BY l.objeto " +
            "ORDER BY total_atas DESC " +
            "LIMIT :limite";

        MapSqlParameterSource params = baseParams(dataInicio, dataFim, situacao, objeto).addValue("limite", limite);

        return jdbc.query(sql, params, (rs, row) -> DashboardAtaTopObjetoDTO.builder()
                .descricao(rs.getString("descricao"))
                .totalAtas(rs.getLong("total_atas"))
                .valorTotal(rs.getDouble("valor_total"))
                .build());
    }

    // Alertas de vencimento é sempre restrito a atas "Vigente" prestes a vencer (próximos 30 dias)
    // por definição da tela — dataInicio/dataFim e objeto apenas restringem ainda mais esse conjunto.
    @Cacheable(value = "ata-alertas-vencimento", keyGenerator = "cacheKeyGenerator")
    public List<DashboardAtaAlertaVencimentoDTO> getAlertasVencimento(Date dataInicio, Date dataFim, String objeto) {
        String sql = "SELECT " +
            "  a.numero_controle_pncp, " +
            "  COALESCE(o.nome, 'Não informado') AS orgao_gerenciador, " +
            "  l.objeto, " +
            "  TO_CHAR(a.data_vigencia_fim, 'YYYY-MM-DD') AS data_vigencia_fim, " +
            "  (a.data_vigencia_fim::date - CURRENT_DATE) AS dias_restantes, " +
            "  COALESCE(l.valor, 0) AS valor_total " +
            "FROM mural.ata_registro_preco a " +
            "JOIN mural.licitacao l ON l.id_licitacao = a.licitacao_id " +
            "LEFT JOIN mural.orgao o ON o.id_orgao = l.orgao_id " +
            "WHERE a.situacao_nome = 'Vigente' " +
            "  AND a.data_vigencia_fim BETWEEN NOW() AND NOW() + INTERVAL '30 days' " +
            "  AND (CAST(:dataInicio AS date) IS NULL OR a.data_vigencia_fim >= CAST(:dataInicio AS date)) " +
            "  AND (CAST(:dataFim AS date) IS NULL OR a.data_vigencia_fim <= CAST(:dataFim AS date)) " +
            "  AND (CAST(:objeto AS text) IS NULL OR l.objeto ILIKE CONCAT('%', CAST(:objeto AS text), '%')) " +
            "ORDER BY a.data_vigencia_fim " +
            "LIMIT 20";

        return jdbc.query(sql, baseParams(dataInicio, dataFim, null, objeto),
                (rs, row) -> DashboardAtaAlertaVencimentoDTO.builder()
                        .numeroPncp(rs.getString("numero_controle_pncp"))
                        .orgaoGerenciador(rs.getString("orgao_gerenciador"))
                        .objeto(rs.getString("objeto"))
                        .dataVigenciaFim(rs.getString("data_vigencia_fim"))
                        .diasRestantes(rs.getInt("dias_restantes"))
                        .valorTotal(rs.getDouble("valor_total"))
                        .build());
    }
}
