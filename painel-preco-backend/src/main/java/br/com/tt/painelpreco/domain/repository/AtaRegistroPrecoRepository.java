package br.com.tt.painelpreco.domain.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.tt.painelpreco.domain.model.AtaRegistroPreco;

public interface AtaRegistroPrecoRepository extends JpaRepository<AtaRegistroPreco, Long> {

    boolean existsByNumeroPncp(String numeroPncp);

    @Query("SELECT a FROM AtaRegistroPreco a WHERE a.dataVigenciaFim >= :hoje ORDER BY a.dataVigenciaFim ASC")
    List<AtaRegistroPreco> findAtasAtivas(@Param("hoje") Date hoje);
}
