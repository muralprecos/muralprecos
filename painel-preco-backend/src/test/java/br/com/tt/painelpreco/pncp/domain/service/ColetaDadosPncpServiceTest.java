package br.com.tt.painelpreco.pncp.domain.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import br.com.tt.painelpreco.api.dto.ColetaPncpStatusDTO;

/**
 * Cobre a trava de concorrência adicionada em cada etapa disparável isoladamente
 * (fornecedores/atas) a partir da área administrativa: uma chamada em andamento
 * deve bloquear uma segunda chamada concorrente à MESMA etapa, mas nunca a etapas
 * diferentes (fornecedores e atas precisam poder rodar em paralelo).
 */
class ColetaDadosPncpServiceTest {

    @Test
    void coletarFornecedoresIgnoraChamadaConcorrenteNaMesmaEtapa() throws Exception {
        ColetaDadosPncpService service = new ColetaDadosPncpService();
        IngestaoResultadoItemService resultadoService = mock(IngestaoResultadoItemService.class);
        ReflectionTestUtils.setField(service, "pncpResultadoItemService", resultadoService);

        CountDownLatch entrouNaEtapa = new CountDownLatch(1);
        CountDownLatch podeSair = new CountDownLatch(1);
        AtomicInteger execucoesReais = new AtomicInteger(0);

        doAnswer(invocation -> {
            execucoesReais.incrementAndGet();
            entrouNaEtapa.countDown();
            assertTrue(podeSair.await(2, TimeUnit.SECONDS), "primeira execução travou além do esperado");
            return null;
        }).when(resultadoService).carregaResultadosBaixadosNoBanco();

        ExecutorService pool = Executors.newSingleThreadExecutor();
        try {
            pool.submit(service::coletarFornecedores);
            assertTrue(entrouNaEtapa.await(2, TimeUnit.SECONDS), "primeira chamada nunca entrou na etapa");
            assertTrue(status(service).isFornecedoresEmAndamento());

            // Chamada concorrente à mesma etapa: deve retornar na hora, sem executar de novo.
            service.coletarFornecedores();
            assertEquals(1, execucoesReais.get());
            verify(resultadoService, times(1)).carregaResultadosBaixadosNoBanco();

            podeSair.countDown();
        } finally {
            pool.shutdown();
            assertTrue(pool.awaitTermination(2, TimeUnit.SECONDS));
        }

        assertFalse(status(service).isFornecedoresEmAndamento(), "flag não voltou a false após a etapa terminar");
    }

    @Test
    void coletarAtasIgnoraChamadaConcorrenteNaMesmaEtapa() throws Exception {
        ColetaDadosPncpService service = new ColetaDadosPncpService();
        IngestaoAtaRegistroPrecoService ataService = mock(IngestaoAtaRegistroPrecoService.class);
        ReflectionTestUtils.setField(service, "pncpAtaService", ataService);

        CountDownLatch entrouNaEtapa = new CountDownLatch(1);
        CountDownLatch podeSair = new CountDownLatch(1);
        AtomicInteger execucoesReais = new AtomicInteger(0);

        doAnswer(invocation -> {
            execucoesReais.incrementAndGet();
            entrouNaEtapa.countDown();
            assertTrue(podeSair.await(2, TimeUnit.SECONDS), "primeira execução travou além do esperado");
            return null;
        }).when(ataService).carregaAtasBaixadasNoBanco();

        ExecutorService pool = Executors.newSingleThreadExecutor();
        try {
            pool.submit(service::coletarAtas);
            assertTrue(entrouNaEtapa.await(2, TimeUnit.SECONDS), "primeira chamada nunca entrou na etapa");
            assertTrue(status(service).isAtasEmAndamento());

            service.coletarAtas();
            assertEquals(1, execucoesReais.get());
            verify(ataService, times(1)).carregaAtasBaixadasNoBanco();

            podeSair.countDown();
        } finally {
            pool.shutdown();
            assertTrue(pool.awaitTermination(2, TimeUnit.SECONDS));
        }

        assertFalse(status(service).isAtasEmAndamento());
    }

    @Test
    void etapasDiferentesNaoSeBloqueiamEntreSi() throws Exception {
        ColetaDadosPncpService service = new ColetaDadosPncpService();
        IngestaoResultadoItemService resultadoService = mock(IngestaoResultadoItemService.class);
        IngestaoAtaRegistroPrecoService ataService = mock(IngestaoAtaRegistroPrecoService.class);
        ReflectionTestUtils.setField(service, "pncpResultadoItemService", resultadoService);
        ReflectionTestUtils.setField(service, "pncpAtaService", ataService);

        CountDownLatch fornecedoresEntrou = new CountDownLatch(1);
        CountDownLatch podeSairFornecedores = new CountDownLatch(1);
        doAnswer(invocation -> {
            fornecedoresEntrou.countDown();
            assertTrue(podeSairFornecedores.await(2, TimeUnit.SECONDS));
            return null;
        }).when(resultadoService).carregaResultadosBaixadosNoBanco();

        ExecutorService pool = Executors.newFixedThreadPool(2);
        try {
            pool.submit(service::coletarFornecedores);
            assertTrue(fornecedoresEntrou.await(2, TimeUnit.SECONDS));
            assertTrue(status(service).isFornecedoresEmAndamento());
            assertFalse(status(service).isAtasEmAndamento());

            // Atas roda normalmente mesmo com fornecedores em andamento.
            service.coletarAtas();
            verify(ataService, times(1)).carregaAtasBaixadasNoBanco();
            assertFalse(status(service).isAtasEmAndamento());

            podeSairFornecedores.countDown();
        } finally {
            pool.shutdown();
            assertTrue(pool.awaitTermination(2, TimeUnit.SECONDS));
        }
    }

    private ColetaPncpStatusDTO status(ColetaDadosPncpService service) {
        return service.getStatus();
    }

}
