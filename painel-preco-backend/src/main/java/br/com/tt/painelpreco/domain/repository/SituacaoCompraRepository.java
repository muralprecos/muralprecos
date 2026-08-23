package br.com.tt.painelpreco.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.tt.painelpreco.domain.model.SituacaoCompra;

public interface SituacaoCompraRepository extends JpaRepository<SituacaoCompra, Integer> {
}
