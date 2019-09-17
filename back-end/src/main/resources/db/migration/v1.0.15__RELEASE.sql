-- alter table dispositivo alter column senha set type varchar(6);
-- alter table dispositivo_aud alter column senha set type varchar(6);

alter table dispositivo add column numero_serie varchar(6);
alter table dispositivo_aud add column numero_serie varchar(6);
