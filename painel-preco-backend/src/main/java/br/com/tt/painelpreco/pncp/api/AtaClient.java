package br.com.tt.painelpreco.pncp.api;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "ata", url = "https://pncp.gov.br/api/pncp/v1")
public interface AtaClient {

    @GetMapping("/orgaos/{cnpj}/compras/{ano}/{sequencial}/atas")
    String getAtas(
            @PathVariable("cnpj") String cnpj,
            @PathVariable("ano") String ano,
            @PathVariable("sequencial") String sequencial,
            @RequestParam("pagina") int pagina,
            @RequestParam("tamanhoPagina") int tamanhoPagina
    );

    @GetMapping("/orgaos/{cnpj}/atas/{ano}/{sequencial}/itens")
    String getItensAta(
            @PathVariable("cnpj") String cnpj,
            @PathVariable("ano") String ano,
            @PathVariable("sequencial") String sequencial,
            @RequestParam("pagina") int pagina,
            @RequestParam("tamanhoPagina") int tamanhoPagina
    );
}
