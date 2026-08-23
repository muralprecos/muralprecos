package br.com.tt.painelpreco.domain.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.domain.model.SituacaoCompra;
import br.com.tt.painelpreco.domain.repository.SituacaoCompraRepository;

@Service
public class SituacaoCompraService {

    @Autowired
    private SituacaoCompraRepository repository;

    public void save(SituacaoCompra situacaoCompra) {
        if (!repository.existsById(situacaoCompra.getId())) {
            repository.save(situacaoCompra);
        }
    }

    public SituacaoCompra findById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public List<SituacaoCompra> findAll() {
        return repository.findAll();
    }
}
