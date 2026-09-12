package br.com.tt.painelpreco.domain.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.api.dto.ArtefatoGeradoDTO;
import br.com.tt.painelpreco.api.dto.ItemProcessoContratacaoDTO;
import br.com.tt.painelpreco.api.dto.ProcessoContratacaoDTO;
import br.com.tt.painelpreco.api.dto.form.ProcessoContratacaoForm;
import br.com.tt.painelpreco.arch.exception.ArchException;
import br.com.tt.painelpreco.arch.infra.auth.Usuario;
import br.com.tt.painelpreco.domain.model.ArtefatoGerado;
import br.com.tt.painelpreco.domain.model.Cotacao;
import br.com.tt.painelpreco.domain.model.ItemLicitacao;
import br.com.tt.painelpreco.domain.model.ItemProcessoContratacao;
import br.com.tt.painelpreco.domain.model.ProcessoContratacao;
import br.com.tt.painelpreco.domain.repository.ArtefatoGeradoRepository;
import br.com.tt.painelpreco.domain.repository.CotacaoRepository;
import br.com.tt.painelpreco.domain.repository.ItemLicitacaoRepository;
import br.com.tt.painelpreco.domain.repository.ProcessoContratacaoRepository;
import br.com.tt.painelpreco.util.StringUtil;

@Service
public class ProcessoContratacaoService {

	@Autowired
	private ProcessoContratacaoRepository processoContratacaoRepository;

	@Autowired
	private ArtefatoGeradoRepository artefatoGeradoRepository;

	@Autowired
	private CotacaoRepository cotacaoRepository;

	@Autowired
	private ItemLicitacaoRepository itemLicitacaoRepository;

	@Transactional
	public ProcessoContratacao criar(ProcessoContratacaoForm form, Usuario usuarioLogado) {
		Cotacao cotacao = cotacaoRepository.findByUuid(form.getCotacaoUuid());
		if (cotacao == null) {
			throw new ArchException("Cotação não encontrada: " + form.getCotacaoUuid());
		}

		List<UUID> itensUuid = cotacao.getItensUuidList();
		if (itensUuid.isEmpty()) {
			throw new ArchException("Esta cotação não possui itens associados (cotações geradas antes desta funcionalidade "
					+ "não podem ser usadas — gere uma nova cotação a partir da pesquisa de preços).");
		}

		ProcessoContratacao processo = new ProcessoContratacao();
		processo.setUuid(UUID.randomUUID());
		processo.setCotacao(cotacao);
		processo.setObjeto(form.getObjeto());
		processo.setJustificativaNecessidade(form.getJustificativaNecessidade());
		processo.setModalidadePretendida(form.getModalidadePretendida());
		processo.setCriterioJulgamento(form.getCriterioJulgamento());
		processo.setRegimeExecucao(form.getRegimeExecucao());
		processo.setPrazoVigenciaMeses(form.getPrazoVigenciaMeses());
		processo.setPrazoVigenciaFundamentoLegal(form.getPrazoVigenciaFundamentoLegal());
		processo.setTipoObjetoContinuo(form.getTipoObjetoContinuo());
		processo.setOrcamentoSigiloso(Boolean.TRUE.equals(form.getOrcamentoSigiloso()));
		processo.setRegistroPrecos(Boolean.TRUE.equals(form.getRegistroPrecos()));
		processo.setTratamentoFavorecidoMeEpp(!Boolean.FALSE.equals(form.getTratamentoFavorecidoMeEpp()));
		processo.setDotacaoGestaoUnidade(form.getDotacaoGestaoUnidade());
		processo.setDotacaoFonteRecursos(form.getDotacaoFonteRecursos());
		processo.setDotacaoProgramaTrabalho(form.getDotacaoProgramaTrabalho());
		processo.setDotacaoElementoDespesa(form.getDotacaoElementoDespesa());
		processo.setDotacaoPlanoInterno(form.getDotacaoPlanoInterno());
		processo.setDotacaoPostergada(Boolean.TRUE.equals(form.getDotacaoPostergada()));

		String orgaoNome = form.getOrgaoNome();
		if (StringUtil.isEmpty(orgaoNome) && usuarioLogado.getOrganizacao() != null) {
			orgaoNome = usuarioLogado.getOrganizacao().getNome();
		}
		processo.setOrgaoNome(orgaoNome);
		processo.setOrgaoCnpj(form.getOrgaoCnpj());
		processo.setOrgaoEndereco(form.getOrgaoEndereco());
		processo.setOrgaoEsfera(form.getOrgaoEsfera());
		processo.setOrgaoUasg(form.getOrgaoUasg());
		processo.setOrgaoTelefone(form.getOrgaoTelefone());
		aplicarParametrosLegais(processo, form);

		processo.setCriadoPor(usuarioLogado);
		processo.setCriadoEm(new Date());
		processo = processoContratacaoRepository.save(processo);

		List<ItemLicitacao> itensOrigem = itemLicitacaoRepository.findAllByUuidIn(itensUuid);
		List<ItemProcessoContratacao> snapshot = new ArrayList<>();
		for (ItemLicitacao origem : itensOrigem) {
			ItemProcessoContratacao item = new ItemProcessoContratacao();
			item.setProcessoContratacao(processo);
			item.setItemLicitacaoOrigemUuid(origem.getUuid());
			item.setNumeroItem(origem.getNumeroItem() == null ? null : origem.getNumeroItem().toString());
			item.setDescricao(origem.getDescricao());
			item.setDescricaoComplementar(origem.getDescricaoComplementar());
			item.setUnidadeFornecimento(origem.getUnidadeFornecimento() == null ? null : origem.getUnidadeFornecimento().getNome());
			item.setQuantidade(origem.getQuantidade() == null ? null : origem.getQuantidade().longValue());
			Double valorUnitario = origem.getValorUnitario();
			item.setValorUnitario(valorUnitario == null ? null : BigDecimal.valueOf(valorUnitario));
			item.setValorTotal(origem.getValor() == null ? null : BigDecimal.valueOf(origem.getValor()));
			if (origem.getFornecedor() != null) {
				item.setFornecedorNome(origem.getFornecedor().getNome());
				item.setFornecedorDocumento(origem.getFornecedor().getDocumento());
			}
			if (origem.getLicitacao() != null) {
				item.setLicitacaoNumeroPncp(origem.getLicitacao().getNumeroPncp());
				if (origem.getLicitacao().getModalidadeCompra() != null) {
					item.setLicitacaoModalidade(origem.getLicitacao().getModalidadeCompra().getNome());
				}
				if (origem.getLicitacao().getMunicipio() != null && origem.getLicitacao().getMunicipio().getUf() != null) {
					item.setLicitacaoUf(origem.getLicitacao().getMunicipio().getUf().getSigla());
				}
			}
			snapshot.add(item);
		}
		processo.setItens(snapshot);
		processoContratacaoRepository.save(processo);

		return processo;
	}

	public ProcessoContratacao buscarPorUuid(UUID uuid) {
		ProcessoContratacao processo = processoContratacaoRepository.findByUuid(uuid);
		if (processo == null) {
			throw new ArchException("Processo de contratação não encontrado: " + uuid);
		}
		return processo;
	}

	/** @return o processo mais recente já criado para esta cotação, ou {@code null} se nenhum existir. */
	public ProcessoContratacao buscarPorCotacaoUuid(UUID cotacaoUuid) {
		return processoContratacaoRepository.findFirstByCotacao_UuidOrderByCriadoEmDesc(cotacaoUuid);
	}

	@Transactional
	public ProcessoContratacao atualizar(UUID uuid, ProcessoContratacaoForm form) {
		ProcessoContratacao processo = buscarPorUuid(uuid);

		processo.setObjeto(form.getObjeto());
		processo.setJustificativaNecessidade(form.getJustificativaNecessidade());
		processo.setModalidadePretendida(form.getModalidadePretendida());
		processo.setCriterioJulgamento(form.getCriterioJulgamento());
		processo.setRegimeExecucao(form.getRegimeExecucao());
		processo.setPrazoVigenciaMeses(form.getPrazoVigenciaMeses());
		processo.setPrazoVigenciaFundamentoLegal(form.getPrazoVigenciaFundamentoLegal());
		processo.setTipoObjetoContinuo(form.getTipoObjetoContinuo());
		processo.setOrcamentoSigiloso(Boolean.TRUE.equals(form.getOrcamentoSigiloso()));
		processo.setRegistroPrecos(Boolean.TRUE.equals(form.getRegistroPrecos()));
		processo.setTratamentoFavorecidoMeEpp(!Boolean.FALSE.equals(form.getTratamentoFavorecidoMeEpp()));
		processo.setDotacaoGestaoUnidade(form.getDotacaoGestaoUnidade());
		processo.setDotacaoFonteRecursos(form.getDotacaoFonteRecursos());
		processo.setDotacaoProgramaTrabalho(form.getDotacaoProgramaTrabalho());
		processo.setDotacaoElementoDespesa(form.getDotacaoElementoDespesa());
		processo.setDotacaoPlanoInterno(form.getDotacaoPlanoInterno());
		processo.setDotacaoPostergada(Boolean.TRUE.equals(form.getDotacaoPostergada()));
		if (!StringUtil.isEmpty(form.getOrgaoNome())) {
			processo.setOrgaoNome(form.getOrgaoNome());
		}
		processo.setOrgaoCnpj(form.getOrgaoCnpj());
		processo.setOrgaoEndereco(form.getOrgaoEndereco());
		processo.setOrgaoEsfera(form.getOrgaoEsfera());
		processo.setOrgaoUasg(form.getOrgaoUasg());
		processo.setOrgaoTelefone(form.getOrgaoTelefone());
		aplicarParametrosLegais(processo, form);
		processo.setAtualizadoEm(new Date());

		return processoContratacaoRepository.save(processo);
	}

	/** Campos opcionais do TR/Edital que reduzem lacunas na redação por seção — ver ProcessoContratacao. */
	private void aplicarParametrosLegais(ProcessoContratacao processo, ProcessoContratacaoForm form) {
		processo.setLocalExecucaoServicos(form.getLocalExecucaoServicos());
		processo.setHorarioExecucaoServicos(form.getHorarioExecucaoServicos());
		processo.setPrazoInicioExecucaoDias(form.getPrazoInicioExecucaoDias());
		processo.setMarcoInicioExecucao(form.getMarcoInicioExecucao());
		processo.setPrazoRecebimentoProvisorioDias(form.getPrazoRecebimentoProvisorioDias());
		processo.setPrazoRecebimentoDefinitivoDias(form.getPrazoRecebimentoDefinitivoDias());
		processo.setPrazoPagamentoDias(form.getPrazoPagamentoDias());
		processo.setExigeGarantiaContratual(Boolean.TRUE.equals(form.getExigeGarantiaContratual()));
		processo.setPercentualGarantiaContratual(form.getPercentualGarantiaContratual());
		processo.setGarantiaServicoDescricao(form.getGarantiaServicoDescricao());
		processo.setPermiteSubcontratacao(Boolean.TRUE.equals(form.getPermiteSubcontratacao()));
		processo.setPercentualMaximoSubcontratacao(form.getPercentualMaximoSubcontratacao());
		processo.setExigeUniforme(Boolean.TRUE.equals(form.getExigeUniforme()));
		processo.setEspecificacaoUniforme(form.getEspecificacaoUniforme());
		processo.setIndiceReajuste(form.getIndiceReajuste());
		processo.setPeriodicidadeReajusteMeses(form.getPeriodicidadeReajusteMeses());
		processo.setPercentualMultaMoratoria(form.getPercentualMultaMoratoria());
		processo.setPercentualMultaCompensatoria(form.getPercentualMultaCompensatoria());
		processo.setPrazoAssinaturaContratoDiasUteis(form.getPrazoAssinaturaContratoDiasUteis());
		processo.setPrazoValidadePropostaDias(form.getPrazoValidadePropostaDias());
		processo.setIntervaloMinimoLances(form.getIntervaloMinimoLances());
		processo.setMeioImpugnacaoEsclarecimento(form.getMeioImpugnacaoEsclarecimento());
	}

	public ProcessoContratacaoDTO toDTO(ProcessoContratacao processo) {
		ProcessoContratacaoDTO dto = new ProcessoContratacaoDTO();
		dto.setUuid(processo.getUuid());
		dto.setCotacaoUuid(processo.getCotacao().getUuid());
		dto.setObjeto(processo.getObjeto());
		dto.setJustificativaNecessidade(processo.getJustificativaNecessidade());
		dto.setModalidadePretendida(processo.getModalidadePretendida());
		dto.setCriterioJulgamento(processo.getCriterioJulgamento());
		dto.setRegimeExecucao(processo.getRegimeExecucao());
		dto.setPrazoVigenciaMeses(processo.getPrazoVigenciaMeses());
		dto.setPrazoVigenciaFundamentoLegal(processo.getPrazoVigenciaFundamentoLegal());
		dto.setTipoObjetoContinuo(processo.getTipoObjetoContinuo());
		dto.setOrcamentoSigiloso(processo.getOrcamentoSigiloso());
		dto.setRegistroPrecos(processo.getRegistroPrecos());
		dto.setTratamentoFavorecidoMeEpp(processo.getTratamentoFavorecidoMeEpp());
		dto.setDotacaoGestaoUnidade(processo.getDotacaoGestaoUnidade());
		dto.setDotacaoFonteRecursos(processo.getDotacaoFonteRecursos());
		dto.setDotacaoProgramaTrabalho(processo.getDotacaoProgramaTrabalho());
		dto.setDotacaoElementoDespesa(processo.getDotacaoElementoDespesa());
		dto.setDotacaoPlanoInterno(processo.getDotacaoPlanoInterno());
		dto.setDotacaoPostergada(processo.getDotacaoPostergada());
		dto.setOrgaoNome(processo.getOrgaoNome());
		dto.setOrgaoCnpj(processo.getOrgaoCnpj());
		dto.setOrgaoEndereco(processo.getOrgaoEndereco());
		dto.setOrgaoEsfera(processo.getOrgaoEsfera());
		dto.setOrgaoUasg(processo.getOrgaoUasg());
		dto.setOrgaoTelefone(processo.getOrgaoTelefone());
		dto.setLocalExecucaoServicos(processo.getLocalExecucaoServicos());
		dto.setHorarioExecucaoServicos(processo.getHorarioExecucaoServicos());
		dto.setPrazoInicioExecucaoDias(processo.getPrazoInicioExecucaoDias());
		dto.setMarcoInicioExecucao(processo.getMarcoInicioExecucao());
		dto.setPrazoRecebimentoProvisorioDias(processo.getPrazoRecebimentoProvisorioDias());
		dto.setPrazoRecebimentoDefinitivoDias(processo.getPrazoRecebimentoDefinitivoDias());
		dto.setPrazoPagamentoDias(processo.getPrazoPagamentoDias());
		dto.setExigeGarantiaContratual(processo.getExigeGarantiaContratual());
		dto.setPercentualGarantiaContratual(processo.getPercentualGarantiaContratual());
		dto.setGarantiaServicoDescricao(processo.getGarantiaServicoDescricao());
		dto.setPermiteSubcontratacao(processo.getPermiteSubcontratacao());
		dto.setPercentualMaximoSubcontratacao(processo.getPercentualMaximoSubcontratacao());
		dto.setExigeUniforme(processo.getExigeUniforme());
		dto.setEspecificacaoUniforme(processo.getEspecificacaoUniforme());
		dto.setIndiceReajuste(processo.getIndiceReajuste());
		dto.setPeriodicidadeReajusteMeses(processo.getPeriodicidadeReajusteMeses());
		dto.setPercentualMultaMoratoria(processo.getPercentualMultaMoratoria());
		dto.setPercentualMultaCompensatoria(processo.getPercentualMultaCompensatoria());
		dto.setPrazoAssinaturaContratoDiasUteis(processo.getPrazoAssinaturaContratoDiasUteis());
		dto.setPrazoValidadePropostaDias(processo.getPrazoValidadePropostaDias());
		dto.setIntervaloMinimoLances(processo.getIntervaloMinimoLances());
		dto.setMeioImpugnacaoEsclarecimento(processo.getMeioImpugnacaoEsclarecimento());
		dto.setStatus(processo.getStatus());
		dto.setCriadoEm(processo.getCriadoEm());

		List<ItemProcessoContratacaoDTO> itensDTO = new ArrayList<>();
		for (ItemProcessoContratacao item : processo.getItens()) {
			ItemProcessoContratacaoDTO itemDTO = new ItemProcessoContratacaoDTO();
			itemDTO.setNumeroItem(item.getNumeroItem());
			itemDTO.setDescricao(item.getDescricao());
			itemDTO.setDescricaoComplementar(item.getDescricaoComplementar());
			itemDTO.setUnidadeFornecimento(item.getUnidadeFornecimento());
			itemDTO.setQuantidade(item.getQuantidade());
			itemDTO.setValorUnitario(item.getValorUnitario());
			itemDTO.setValorTotal(item.getValorTotal());
			itemDTO.setFornecedorNome(item.getFornecedorNome());
			itemDTO.setFornecedorDocumento(item.getFornecedorDocumento());
			itemDTO.setLicitacaoNumeroPncp(item.getLicitacaoNumeroPncp());
			itemDTO.setLicitacaoModalidade(item.getLicitacaoModalidade());
			itemDTO.setLicitacaoUf(item.getLicitacaoUf());
			itensDTO.add(itemDTO);
		}
		dto.setItens(itensDTO);

		List<ArtefatoGeradoDTO> artefatosDTO = new ArrayList<>();
		for (ArtefatoGerado artefato : artefatoGeradoRepository.findByProcessoContratacao(processo)) {
			ArtefatoGeradoDTO artefatoDTO = new ArtefatoGeradoDTO();
			artefatoDTO.setUuid(artefato.getUuid());
			artefatoDTO.setTipo(artefato.getTipo());
			artefatoDTO.setVersao(artefato.getVersao());
			artefatoDTO.setStatus(artefato.getStatus());
			artefatoDTO.setNomeArquivo(artefato.getNomeArquivo());
			artefatoDTO.setGeradoEm(artefato.getGeradoEm());
			artefatoDTO.setRevisadoEm(artefato.getRevisadoEm());
			artefatosDTO.add(artefatoDTO);
		}
		dto.setArtefatos(artefatosDTO);

		return dto;
	}

}
