package br.com.tt.painelpreco.api.controller;

import br.com.tt.painelpreco.api.dto.DashboardFornecedorEvolucaoItemDTO;
import br.com.tt.painelpreco.api.dto.DashboardFornecedorKpiDTO;
import br.com.tt.painelpreco.api.dto.DashboardFornecedorPorteDTO;
import br.com.tt.painelpreco.api.dto.DashboardFornecedorRankingItemDTO;
import br.com.tt.painelpreco.domain.service.DashboardFornecedorService;
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
@RequestMapping(ApiVersion.LATEST + "/dashboard/fornecedores")
public class DashboardFornecedorController {

    @Autowired
    private DashboardFornecedorService dashboardFornecedorService;

    @GetMapping("/kpis")
    public DashboardFornecedorKpiDTO getKpis(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dataFim,
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String documento,
            @RequestParam(required = false) String porte
    ) {
        return dashboardFornecedorService.getKpis(dataInicio, dataFim, nome, documento, porte);
    }

    @GetMapping("/ranking")
    public List<DashboardFornecedorRankingItemDTO> getRanking(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dataFim,
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String documento,
            @RequestParam(required = false) String porte,
            @RequestParam(defaultValue = "10") int limite
    ) {
        return dashboardFornecedorService.getRanking(dataInicio, dataFim, nome, documento, porte, Math.min(limite, 50));
    }

    @GetMapping("/por-porte")
    public List<DashboardFornecedorPorteDTO> getDistribuicaoPorPorte(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dataFim,
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String documento
    ) {
        return dashboardFornecedorService.getDistribuicaoPorPorte(dataInicio, dataFim, nome, documento);
    }

    @GetMapping("/evolucao-mensal")
    public List<DashboardFornecedorEvolucaoItemDTO> getEvolucaoMensal(
            @RequestParam(required = false) Integer ano,
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String documento,
            @RequestParam(required = false) String porte
    ) {
        int anoConsulta = (ano != null) ? ano : Calendar.getInstance().get(Calendar.YEAR);
        return dashboardFornecedorService.getEvolucaoMensal(anoConsulta, nome, documento, porte);
    }
}
