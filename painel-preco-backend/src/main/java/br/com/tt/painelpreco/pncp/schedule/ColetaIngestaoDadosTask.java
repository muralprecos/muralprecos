package br.com.tt.painelpreco.pncp.schedule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import br.com.tt.painelpreco.pncp.domain.service.ColetaDadosPncpService;

@Component
public class ColetaIngestaoDadosTask {

	@Autowired
	private ColetaDadosPncpService pncpService;

	@Scheduled(cron = "${pncp.api.schedule.cron}")
	public void run() {
		long inicio = System.currentTimeMillis();
		System.out.println("INFO: Iniciando coleta agendada do PNCP.");
		try {
			pncpService.getDados(true, false);
		} catch (Exception e) {
			// Rede de segurança de último nível: cada etapa interna já é fail-open,
			// mas isso garante que uma falha inesperada não derrube o scheduler.
			System.err.println("ERROR: Falha inesperada na coleta agendada: " + e.getMessage());
		} finally {
			System.out.printf("INFO: Coleta agendada finalizada em %.1fs%n",
					(System.currentTimeMillis() - inicio) / 1000.0);
		}
	}

}
