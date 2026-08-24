package br.com.tt.painelpreco.api.dto;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import br.com.tt.painelpreco.domain.model.ProcessoContratacao.CriterioJulgamentoEnum;
import br.com.tt.painelpreco.domain.model.ProcessoContratacao.ModalidadeEnum;
import br.com.tt.painelpreco.domain.model.ProcessoContratacao.PrazoVigenciaFundamentoEnum;
import br.com.tt.painelpreco.domain.model.ProcessoContratacao.RegimeExecucaoEnum;
import br.com.tt.painelpreco.domain.model.ProcessoContratacao.StatusEnum;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProcessoContratacaoDTO {

	private UUID uuid;
	private UUID cotacaoUuid;
	private String objeto;
	private String justificativaNecessidade;
	private ModalidadeEnum modalidadePretendida;
	private CriterioJulgamentoEnum criterioJulgamento;
	private RegimeExecucaoEnum regimeExecucao;
	private Integer prazoVigenciaMeses;
	private PrazoVigenciaFundamentoEnum prazoVigenciaFundamentoLegal;
	private Boolean tipoObjetoContinuo;
	private Boolean orcamentoSigiloso;
	private Boolean registroPrecos;
	private Boolean tratamentoFavorecidoMeEpp;
	private String dotacaoGestaoUnidade;
	private String dotacaoFonteRecursos;
	private String dotacaoProgramaTrabalho;
	private String dotacaoElementoDespesa;
	private String dotacaoPlanoInterno;
	private Boolean dotacaoPostergada;
	private String orgaoNome;
	private String orgaoCnpj;
	private String orgaoEndereco;
	private String orgaoEsfera;
	private String orgaoUasg;
	private String orgaoTelefone;
	private StatusEnum status;
	private Date criadoEm;
	private List<ItemProcessoContratacaoDTO> itens;
	private List<ArtefatoGeradoDTO> artefatos;

}
