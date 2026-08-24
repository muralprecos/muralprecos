package br.com.tt.painelpreco.pncp.api;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "resultado", url = "https://pncp.gov.br/api/pncp/v1")
public interface ResultadoClient {

    @GetMapping("/orgaos/{cnpj}/compras/{ano}/{sequencial}/itens/{numeroItem}/resultados")
    String getResultados(
            @PathVariable("cnpj") String cnpj,
            @PathVariable("ano") String ano,
            @PathVariable("sequencial") String sequencial,
            @PathVariable("numeroItem") int numeroItem,
            @RequestParam("pagina") int pagina,
            @RequestParam("tamanhoPagina") int tamanhoPagina
    );

}
