package br.com.tt.painelpreco.pncp.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.tt.painelpreco.pncp.domain.model.LogErro;

@Repository
public interface LogErroRepository extends JpaRepository<LogErro, Long> {

}
