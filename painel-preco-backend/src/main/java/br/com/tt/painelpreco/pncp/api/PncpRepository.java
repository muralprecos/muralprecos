package br.com.tt.painelpreco.pncp.api;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PncpRepository extends JpaRepository<IngestaoDadosPncp, Long> {

    @Query(value = "SELECT max(data_inicio) AS data_inicio FROM mural.ingestao_dados_pncp WHERE status = 1", nativeQuery = true)
    Optional<LocalDateTime> findUltimaIngestaoData();

}
