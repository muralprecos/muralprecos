package br.com.tt.painelpreco.domain.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import br.com.tt.painelpreco.domain.model.LicitacaoObj;

public interface LicitacaoObjRepository extends JpaRepository<LicitacaoObj, Integer>, JpaSpecificationExecutor<LicitacaoObj> {
	
	// TODO: refatorar levando essa logica para o banco com particionamento
//	@Query(value = "select t.id_licitacao_obj, t.objeto"
//			+ " from ("
//				+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2009 where upper(objeto) ilike :objeto union"
//				+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2010 where upper(objeto) ilike :objeto union"
//				+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2011 where upper(objeto) ilike :objeto union"
//				+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2012 where upper(objeto) ilike :objeto union"
//				+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2013 where upper(objeto) ilike :objeto union"
//				+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2014 where upper(objeto) ilike :objeto union"
//				+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2015 where upper(objeto) ilike :objeto union"
//				+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2016 where upper(objeto) ilike :objeto union"
//				+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2017 where upper(objeto) ilike :objeto union"
//				+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2018 where upper(objeto) ilike :objeto union"
//				+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2019 where upper(objeto) ilike :objeto union"
//				+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2020 where upper(objeto) ilike :objeto union"
//				+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2021 where upper(objeto) ilike :objeto union"
//				+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2022 where upper(objeto) ilike :objeto union"
//				+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2023 where upper(objeto) ilike :objeto union"
//				+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2024 where upper(objeto) ilike :objeto"
//			+ " ) as t order by t.objeto",
//			countQuery = "select count(*)"
//					+ " from ("
//						+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2009 where upper(objeto) ilike :objeto union"
//						+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2010 where upper(objeto) ilike :objeto union"
//						+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2011 where upper(objeto) ilike :objeto union"
//						+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2012 where upper(objeto) ilike :objeto union"
//						+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2013 where upper(objeto) ilike :objeto union"
//						+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2014 where upper(objeto) ilike :objeto union"
//						+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2015 where upper(objeto) ilike :objeto union"
//						+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2016 where upper(objeto) ilike :objeto union"
//						+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2017 where upper(objeto) ilike :objeto union"
//						+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2018 where upper(objeto) ilike :objeto union"
//						+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2019 where upper(objeto) ilike :objeto union"
//						+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2020 where upper(objeto) ilike :objeto union"
//						+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2021 where upper(objeto) ilike :objeto union"
//						+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2022 where upper(objeto) ilike :objeto union"
//						+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2023 where upper(objeto) ilike :objeto union"
//						+ "	select id_licitacao_obj, objeto from mural.licitacao_obj_2024 where upper(objeto) ilike :objeto"
//					+ " ) as t",
//			nativeQuery = true)
	@Query(value = "select l.id_licitacao, l.objeto from mural.licitacao l where upper(l.objeto) ilike :objeto order by l.objeto",
			countQuery = "select count(*) from mural.licitacao l where upper(l.objeto) ilike :objeto ", nativeQuery = true)
	Page<LicitacaoObj> findAllByObjeto(String objeto, Pageable pageable);
	
}
