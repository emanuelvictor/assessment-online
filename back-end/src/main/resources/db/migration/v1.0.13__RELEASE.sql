alter table licenca rename codigo to nome;
alter table licenca_aud rename codigo to nome;

alter table licenca add column latitude numeric(19, 2);
alter table licenca add column longitude numeric(19, 2);
alter table licenca add column modo_insonia boolean not null default false;
alter table licenca add column modo_quiosque boolean not null  default false;
alter table licenca add column quebrar_linha_na_selecao_de_item_avaliavel boolean not null default false;
alter table licenca add column time int2 not null check(time>=5 AND time<=600) default 30;
alter table licenca_aud add column latitude numeric(19, 2);
alter table licenca_aud add column longitude numeric(19, 2);
alter table licenca_aud add column modo_insonia boolean;
alter table licenca_aud add column modo_quiosque boolean;
alter table licenca_aud add column quebrar_linha_na_selecao_de_item_avaliavel boolean;
alter table licenca_aud add column time int2;
