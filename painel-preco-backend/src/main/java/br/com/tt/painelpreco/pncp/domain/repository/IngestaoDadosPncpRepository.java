package br.com.tt.painelpreco.pncp.domain.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.com.tt.painelpreco.pncp.domain.model.IngestaoDadosPncp;

@Repository
public interface IngestaoDadosPncpRepository extends JpaRepository<IngestaoDadosPncp, Long> {

    @Query(value = "SELECT max(data_fim) AS data_fim FROM mural.ingestao_dados_pncp WHERE status = 1", nativeQuery = true)
    Optional<LocalDateTime> findUltimaIngestaoData();
    
    @Query(value = "SELECT i.* FROM mural.ingestao_dados_pncp i WHERE i.status = 0 AND i.data_fim IS NULL ORDER BY 1 DESC LIMIT 1", nativeQuery = true)
    IngestaoDadosPncp findAtualIngestaoData();

}
