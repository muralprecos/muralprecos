package br.com.tt.painelpreco.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.tt.painelpreco.domain.model.ArtefatoGerado;
import br.com.tt.painelpreco.domain.model.ArtefatoSecaoLog;

public interface ArtefatoSecaoLogRepository extends JpaRepository<ArtefatoSecaoLog, Integer> {

	List<ArtefatoSecaoLog> findByArtefatoGeradoOrderByIdAsc(ArtefatoGerado artefatoGerado);

}
