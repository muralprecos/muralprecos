package br.com.tt.painelpreco.domain.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.domain.model.AtaRegistroPreco;
import br.com.tt.painelpreco.domain.repository.AtaRegistroPrecoRepository;

@Service
public class AtaRegistroPrecoService {

    @Autowired
    private AtaRegistroPrecoRepository ataRepository;

    public boolean existsByNumeroPncp(String numeroPncp) {
        return ataRepository.existsByNumeroPncp(numeroPncp);
    }

    public AtaRegistroPreco save(AtaRegistroPreco ata) {
        return ataRepository.save(ata);
    }

    public List<AtaRegistroPreco> findAtasAtivas() {
        return ataRepository.findAtasAtivas(new Date());
    }
}
