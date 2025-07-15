package br.com.tt.painelpreco.domain.service;

import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.arch.infra.auth.Usuario;
import br.com.tt.painelpreco.domain.model.Cotacao;
import br.com.tt.painelpreco.domain.repository.CotacaoRepository;
import br.com.tt.painelpreco.util.StringUtil;

@Service
public class CotacaoService {
	
	private static final int MAX_CHAR_STRING_BUSCA = 60;
	@Autowired
	private CotacaoRepository cotacaoRepository;
	
	public Cotacao save(Cotacao cotacao) {
		cotacao.setUuid(UUID.randomUUID());
		return cotacaoRepository.save(cotacao);
	}

	@Transactional
	public Cotacao findByHashValidacao(String hash) {
		return cotacaoRepository.findByHashValidacao(hash);
	}

	public Page<Cotacao> findByUsuarioSemArquivo(Usuario usuario, Pageable pageable) {
		return cotacaoRepository.findByUsuarioSemArquivo(usuario, pageable);
	}

	public Cotacao findByUuid(UUID uuid) {
		return cotacaoRepository.findByUuid(uuid);
	}
	
	public String findStringBuscaByItens(UUID[] itens) {
		String stringBusca = cotacaoRepository.findStringBuscaByItens(itens);
		if (!StringUtil.isEmpty(stringBusca) && stringBusca.length() > 10) {
			int length = stringBusca.length();
			int max = length < MAX_CHAR_STRING_BUSCA ? length : MAX_CHAR_STRING_BUSCA;
			
			String epilogo = max >= MAX_CHAR_STRING_BUSCA ? "..." : "";
			
			stringBusca = stringBusca.substring(0, max) + epilogo;
		}
		
		return stringBusca;
	}

}
