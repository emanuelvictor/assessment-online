alter table unidade_tipo_avaliacao_dispositivo drop constraint if exists UKcdje95t2heav6arkqvwwjxm5c;
alter table unidade_tipo_avaliacao_dispositivo add constraint UKcdje95t2heav6arkqvwwjxm5c unique (unidade_tipo_avaliacao_id, dispositivo_id, ordem);