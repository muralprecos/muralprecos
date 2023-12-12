create temporary table item_licitacao_uuid as
select uuid_generate_v1() as nuuid, id_item_licitacao as id
from painel.item_licitacao;

update painel.item_licitacao set uuid = nuuid
from item_licitacao_uuid
where id = id_item_licitacao;

drop table item_licitacao_uuid;

create temporary table licitacao_uuid as
select uuid_generate_v1() as nuuid, id_licitacao as id
from painel.licitacao;

update painel.licitacao set uuid = nuuid
from licitacao_uuid
where id = id_licitacao;

drop table licitacao_uuid;
