create table datalake.unidade_federativa (
	sg character varying(2) not null,
	nm character varying(50) not null
);

insert into datalake.unidade_federativa values
	('AC', 'Acre'), 
	('AL', 'Alagoas'), 
	('AP', 'Amapá'), 
	('AM', 'Amazonas'), 
	('BA', 'Bahia'), 
	('CE', 'Ceará'), 
	('DF', 'Distrito Federal'), 
	('ES', 'Espírito Santo'), 
	('GO', 'Goiás'), 
	('MA', 'Maranhão'), 
	('MT', 'Mato Grosso'), 
	('MS', 'Mato Grosso do Sul'), 
	('MG', 'Minas Gerais'), 
	('PA', 'Pará'), 
	('PB', 'Paraíba'), 
	('PR', 'Paraná'), 
	('PE', 'Pernambuco'), 
	('PI', 'Piauí'), 
	('RJ', 'Rio de Janeiro'), 
	('RN', 'Rio Grande do Norte'), 
	('RS', 'Rio Grande do Sul'), 
	('RO', 'Rondônia'), 
	('RR', 'Roraima'), 
	('SC', 'Santa Catarina'), 
	('SP', 'São Paulo'), 
	('SE', 'Sergipe'), 
	('TO', 'Tocantins');
update painel.unidade_federativa uf set nome = 'Não informado', sigla = 'NI' where id_unidade_federativa = 1;
update painel.unidade_federativa set nome = nm from datalake.unidade_federativa where sg = sigla;
update painel.municipio set nome = 'Não informado' where id_municipio = 1;
