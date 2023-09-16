package br.com.tt.painelpreco.util;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.Date;

public abstract class DateUtil {
	
	public static final String DD_MM_YYYY = "dd/MM/yyyy";
	public static final String DEFAULT_MASK = DD_MM_YYYY;
	public static final String YYYY_MM_DD = "yyyy-MM-dd";
	
	public static final int JANEIRO = Calendar.JANUARY;
	public static final int DEZEMBRO = Calendar.DECEMBER;
	
	public static Calendar getCalendar() {
		return Calendar.getInstance();
	}
	
	public static Date getDate(int ano, int mes, int dia) {
		Calendar calendar = getCalendar();
		calendar.set(ano, mes, dia);
		return calendar.getTime();
	}

	public static Date getDateFirtDayYear(int ano) {
		return getDate(ano, JANEIRO, 1);
	}
	
	public static Date getDateLastDayYear(int ano) {
		return getDate(ano, DEZEMBRO, 1);
	}
	
	public static Calendar getCalendar(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		return calendar;
	}
	
	public static int getAno(Date date) {
		return getCalendar(date).get(Calendar.YEAR);
	}
	
	public static String format(Date date, String mask) {
		SimpleDateFormat format = new SimpleDateFormat(mask);
		return format.format(date);
	}
	
	public static long getIntervalo(Date date1, Date date2) {
		LocalDate inicio = LocalDate.parse(format(date1, YYYY_MM_DD));
		LocalDate fim   = LocalDate.parse(format(date2, YYYY_MM_DD));

		return ChronoUnit.DAYS.between(inicio, fim);
	}

	public static Date decrementaDeHoje(Integer dias) {
		Calendar calendar = getCalendar(new Date());
		calendar.add(Calendar.DAY_OF_MONTH, -dias);
		return calendar.getTime();
	}

}
