package br.com.tt.painelpreco.pncp.api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogErroRepository extends JpaRepository<LogErro, Long> {

}
