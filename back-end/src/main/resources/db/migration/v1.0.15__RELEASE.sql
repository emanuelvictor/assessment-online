-- alter table licenca alter column senha set type varchar(6);
-- alter table licenca_aud alter column senha set type varchar(6);

alter table licenca add column numero_serie varchar(6);
alter table licenca_aud add column numero_serie varchar(6);
