package br.com.tt.painelpreco.domain.model.vo;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

import org.junit.jupiter.api.Test;

public class PeriodoCompraTest {
	
	@Test
	public void periodo30Test() {
		PeriodoCompra periodoCompra = new PeriodoCompra(Date.from(LocalDate.of(2023, 8, 12).atStartOfDay(ZoneId.systemDefault()).toInstant()));
		assertEquals("Comprado nos últimos 30 dias", periodoCompra.getPeriodo());
	}
	
	@Test
	public void periodo60Test() {
		PeriodoCompra periodoCompra = new PeriodoCompra(Date.from(LocalDate.of(2023, 7, 13).atStartOfDay(ZoneId.systemDefault()).toInstant()));
		assertEquals("Comprado nos últimos 60 dias", periodoCompra.getPeriodo());
	}
	
	@Test
	public void periodo90Test() {
		PeriodoCompra periodoCompra = new PeriodoCompra(Date.from(LocalDate.of(2023, 6, 13).atStartOfDay(ZoneId.systemDefault()).toInstant()));
		assertEquals("Comprado nos últimos 90 dias", periodoCompra.getPeriodo());
	}
	
	@Test
	public void periodo120Test() {
		PeriodoCompra periodoCompra = new PeriodoCompra(Date.from(LocalDate.of(2023, 5, 14).atStartOfDay(ZoneId.systemDefault()).toInstant()));
		assertEquals("Comprado nos últimos 120 dias", periodoCompra.getPeriodo());
	}
	
	@Test
	public void periodo150Test() {
		PeriodoCompra periodoCompra = new PeriodoCompra(Date.from(LocalDate.of(2023, 4, 14).atStartOfDay(ZoneId.systemDefault()).toInstant()));
		assertEquals("Comprado nos últimos 150 dias", periodoCompra.getPeriodo());
	}
	
	@Test
	public void periodo180Test() {
		PeriodoCompra periodoCompra = new PeriodoCompra(Date.from(LocalDate.of(2023, 3, 15).atStartOfDay(ZoneId.systemDefault()).toInstant()));
		assertEquals("Comprado nos últimos 180 dias", periodoCompra.getPeriodo());
	}
	
	@Test
	public void periodoMaior180Test() {
		PeriodoCompra periodoCompra = new PeriodoCompra(Date.from(LocalDate.of(2023, 2, 15).atStartOfDay(ZoneId.systemDefault()).toInstant()));
		assertEquals("Comprado há mais de 180 dias", periodoCompra.getPeriodo());
	}

}
