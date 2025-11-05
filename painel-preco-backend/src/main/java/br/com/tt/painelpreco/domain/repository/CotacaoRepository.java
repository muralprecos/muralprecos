package br.com.tt.painelpreco.domain.repository;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import br.com.tt.painelpreco.domain.repository.projection.DadosMensaisProjection;
import br.com.tt.painelpreco.domain.repository.projection.DashboardKpiProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.tt.painelpreco.arch.infra.auth.Usuario;
import br.com.tt.painelpreco.domain.model.Cotacao;

public interface CotacaoRepository extends JpaRepository<Cotacao, Integer>, JpaSpecificationExecutor<Cotacao> {

	@Transactional
	Cotacao findByHashValidacao(String hash);
	
	@Query("SELECT new Cotacao(uuid, nome, nomeArquivo, stringBusca, hashValidacao, criadoEm) FROM Cotacao c WHERE c.criadoPor = :usuario ORDER BY c.criadoEm DESC")
	Page<Cotacao> findByUsuarioSemArquivo(@Param("usuario") Usuario usuario, Pageable pageable);

	@Transactional
	Cotacao findByUuid(UUID uuid);

	@Query(value = "SELECT ARRAY_AGG(il.descricao) AS stringBusca FROM mural.item_licitacao il WHERE il.uuid IN (:itens)", nativeQuery = true)
	String findStringBuscaByItens(UUID[] itens);

    @Query(value = "SELECT " +
            "COUNT(CASE WHEN c.criado_em >= :inicioMesAtual AND c.criado_em <= :fimMesAtual THEN 1 END) AS cotacoesCriadas, " +
            "COUNT(CASE WHEN c.criado_em >= :inicioMesAnterior AND c.criado_em <= :fimMesAnterior THEN 1 END) AS cotacoesCriadasAnterior, " +
            "0.0 AS valorMedioCotacao, " +
            "0.0 AS valorMedioCotacaoGeral " +
            "FROM mural.cotacao c", nativeQuery = true)
    DashboardKpiProjection getCotacoesKpiData(@Param("inicioMesAtual") Date inicioMesAtual, @Param("fimMesAtual") Date fimMesAtual,
                                              @Param("inicioMesAnterior") Date inicioMesAnterior, @Param("fimMesAnterior") Date fimMesAnterior);

    @Query(value = "SELECT " +
            "TO_CHAR(c.criado_em, 'MM/YYYY') AS mesAno, " +
            "0 AS volumeLicitacoes, " +
            "0.0 AS valorCotacoes " +
            "FROM mural.cotacao c WHERE c.criado_em >= :inicioPeriodo " +
            "GROUP BY mesAno ORDER BY mesAno", nativeQuery = true)
    List<DadosMensaisProjection> getMonthlyCotacaoValue(@Param("inicioPeriodo") Date inicioPeriodo);

    @Query("SELECT new Cotacao(uuid, nome, nomeArquivo, stringBusca, hashValidacao, criadoEm) FROM Cotacao c ORDER BY c.criadoEm DESC")
    Page<Cotacao> findResumoDashboard(Pageable pageable);
}
