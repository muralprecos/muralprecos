package br.com.tt.painelpreco.pncp.schedule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import br.com.tt.painelpreco.pncp.domain.service.ColetaDadosPncpService;

@Component
public class ColetaIngestaoDadosTask {
	
	@Autowired
	private ColetaDadosPncpService pncpService;
	
	@Scheduled(cron = "${PNCP_API_CRON_EXPRESSION}")
	public void run() {
		pncpService.getDados(true);
	}

}
