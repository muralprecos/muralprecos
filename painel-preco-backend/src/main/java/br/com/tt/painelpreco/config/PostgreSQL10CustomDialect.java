package br.com.tt.painelpreco.config;

import org.hibernate.dialect.PostgreSQL10Dialect;

import com.vladmihalcea.hibernate.type.array.StringArrayType;

/**
 * 
 * Necessário para usar a funação array_agg.
 * 
 * Ref: https://stackoverflow.com/questions/21630370/no-dialect-mapping-for-jdbc-type-2003
 * 
 */
public class PostgreSQL10CustomDialect extends PostgreSQL10Dialect {
	
	public PostgreSQL10CustomDialect() {
        super();
        this.registerHibernateType(2003, StringArrayType.class.getName());
    }

}
