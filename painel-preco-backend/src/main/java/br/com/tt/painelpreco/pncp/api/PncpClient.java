package br.com.tt.painelpreco.pncp.api;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "pncp", url = "https://pncp.gov.br/api/consulta/v1")
public interface PncpClient {
	
	@GetMapping(value = "/contratacoes/publicacao")
    Object getLicitacoes(
            @RequestParam("dataInicial") String dataInicial, // Formato YYYYMMDD
            @RequestParam("dataFinal") String dataFinal,     // Formato YYYYMMDD
            @RequestParam("codigoModalidadeContratacao") int codigoModalidadeContratacao,
            @RequestParam("pagina") int pagina,
            @RequestParam("tamanhoPagina") int tamanhoPagina,
            @RequestHeader("chave-api-dados") String apiKey
    );

}
