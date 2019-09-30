alter table dispositivo add column numero_serie varchar;
alter table dispositivo_aud add column numero_serie varchar;

alter table dispositivo
    drop constraint if exists UK_numero_serie;
alter table dispositivo
    add constraint UK_numero_serie unique (numero_serie);