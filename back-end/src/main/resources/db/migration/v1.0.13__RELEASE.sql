alter table dispositivo rename codigo to nome;
alter table dispositivo_aud rename codigo to nome;

alter table dispositivo add column latitude numeric(19, 2);
alter table dispositivo add column longitude numeric(19, 2);
alter table dispositivo add column modo_insonia boolean not null default false;
alter table dispositivo add column modo_quiosque boolean not null  default false;
alter table dispositivo add column quebrar_linha_na_selecao_de_item_avaliavel boolean not null default false;
alter table dispositivo add column time int2 not null check(time>=5 AND time<=600) default 30;
alter table dispositivo add column unidade_superior_id int8;
alter table dispositivo_aud add column latitude numeric(19, 2);
alter table dispositivo_aud add column longitude numeric(19, 2);
alter table dispositivo_aud add column modo_insonia boolean;
alter table dispositivo_aud add column modo_quiosque boolean;
alter table dispositivo_aud add column quebrar_linha_na_selecao_de_item_avaliavel boolean;
alter table dispositivo_aud add column time int2;
alter table dispositivo_aud add column unidade_superior_id int8;
