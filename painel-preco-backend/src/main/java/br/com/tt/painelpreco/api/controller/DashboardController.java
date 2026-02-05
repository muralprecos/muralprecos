package br.com.tt.painelpreco.api.controller;

import br.com.tt.painelpreco.api.dto.DashboardDTO;
import br.com.tt.painelpreco.domain.service.DashboardService;
import br.com.tt.painelpreco.util.ApiVersion;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiVersion.LATEST + "/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/resumo")
    public DashboardDTO getDashboardData(
            @Qualifier("licitacoes")
            @PageableDefault(size = 5, sort = "dataAbertura", direction = Sort.Direction.DESC) Pageable pageableLicitacoes,

            @Qualifier("cotacoes")
            @PageableDefault(size = 5, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageableCotacoes
    ) {
        return dashboardService.getDashboardData(pageableLicitacoes, pageableCotacoes);
    }
}
