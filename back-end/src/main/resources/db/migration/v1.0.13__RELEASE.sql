alter table licenca add column latitude numeric(19, 2);
alter table licenca add column longitude numeric(19, 2);
alter table licenca add column interna boolean not null default true;
alter table licenca add column modo_insonia boolean not null default true;
alter table licenca add column modo_quiosque boolean not null  default true;
alter table licenca add column quebrar_linha_na_selecao_de_item_avaliavel boolean not null default true;
alter table licenca add column time int2 not null check(time>=5 AND time<=600) default 30;
alter table licenca add column tenant varchar(150) not null default current_schema();
alter table licenca add column senha varchar(10);
alter table licenca_aud add column senha varchar(10);
alter table licenca_aud add column tenant varchar(150) default current_schema();
alter table licenca_aud add column latitude numeric(19, 2);
alter table licenca_aud add column longitude numeric(19, 2);
alter table licenca_aud add column modo_insonia boolean;
alter table licenca_aud add column modo_quiosque boolean;
alter table licenca_aud add column interna boolean;
alter table licenca_aud add column quebrar_linha_na_selecao_de_item_avaliavel boolean;
alter table licenca_aud add column time int2;


alter table licenca drop constraint if exists UK_tcudt9flboi41o17wagkwx8tw;
alter table licenca add constraint UK_tcudt9flboi41o17wagkwx8tw unique (numero);

alter table licenca drop constraint if exists licenca_tenant_nome_unique;
alter table licenca add constraint licenca_tenant_nome_unique unique (nome, tenant);

