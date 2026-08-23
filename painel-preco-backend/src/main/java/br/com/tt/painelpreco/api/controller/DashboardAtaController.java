package br.com.tt.painelpreco.api.controller;

import br.com.tt.painelpreco.api.dto.DashboardAtaAlertaVencimentoDTO;
import br.com.tt.painelpreco.api.dto.DashboardAtaEvolucaoItemDTO;
import br.com.tt.painelpreco.api.dto.DashboardAtaKpiDTO;
import br.com.tt.painelpreco.api.dto.DashboardAtaSituacaoDTO;
import br.com.tt.painelpreco.api.dto.DashboardAtaTopObjetoDTO;
import br.com.tt.painelpreco.domain.service.DashboardAtaService;
import br.com.tt.painelpreco.util.ApiVersion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping(ApiVersion.LATEST + "/dashboard/atas")
public class DashboardAtaController {

    @Autowired
    private DashboardAtaService dashboardAtaService;

    @GetMapping("/kpis")
    public DashboardAtaKpiDTO getKpis(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dataFim,
            @RequestParam(required = false) String situacao,
            @RequestParam(required = false) String objeto) {
        return dashboardAtaService.getKpis(dataInicio, dataFim, situacao, objeto);
    }

    @GetMapping("/por-situacao")
    public List<DashboardAtaSituacaoDTO> getPorSituacao(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dataFim,
            @RequestParam(required = false) String objeto) {
        return dashboardAtaService.getPorSituacao(dataInicio, dataFim, objeto);
    }

    @GetMapping("/evolucao-mensal")
    public List<DashboardAtaEvolucaoItemDTO> getEvolucaoMensal(
            @RequestParam(required = false) Integer ano,
            @RequestParam(required = false) String situacao,
            @RequestParam(required = false) String objeto) {
        int anoConsulta = (ano != null) ? ano : Calendar.getInstance().get(Calendar.YEAR);
        return dashboardAtaService.getEvolucaoMensal(anoConsulta, situacao, objeto);
    }

    @GetMapping("/top-objetos")
    public List<DashboardAtaTopObjetoDTO> getTopObjetos(
            @RequestParam(defaultValue = "10") int limite,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dataFim,
            @RequestParam(required = false) String situacao) {
        return dashboardAtaService.getTopObjetos(Math.min(limite, 50), dataInicio, dataFim, situacao, null);
    }

    @GetMapping("/alertas-vencimento")
    public List<DashboardAtaAlertaVencimentoDTO> getAlertasVencimento(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dataFim,
            @RequestParam(required = false) String objeto) {
        return dashboardAtaService.getAlertasVencimento(dataInicio, dataFim, objeto);
    }
}
