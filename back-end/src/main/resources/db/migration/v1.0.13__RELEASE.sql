alter table cidade add column tenant varchar(255) not null default current_schema();


alter table conta add column tenant varchar(255) not null default current_schema();

alter table estado add column tenant varchar(255) not null default current_schema();

alter table pais add column tenant varchar(255) not null default current_schema();

alter table agrupador add column tenant varchar(255) not null default current_schema();


alter table avaliacao add column tenant varchar(255) not null default current_schema();
alter table avaliacao_avaliavel add column tenant varchar(255) not null default current_schema();
alter table avaliavel add column tenant varchar(255) not null default current_schema();
alter table configuracao add column tenant varchar(255) not null default current_schema();


alter table dispositivo add column tenant varchar(255) not null default current_schema();
alter table endereco add column tenant varchar(255) not null default current_schema();
alter table operador add column tenant varchar(255) not null default current_schema();
alter table pessoa add column tenant varchar(255) not null default current_schema();


alter table tipo_avaliacao add column tenant varchar(255) not null default current_schema();
alter table unidade_tipo_avaliacao add column tenant varchar(255) not null default current_schema();
alter table unidade_tipo_avaliacao_dispositivo add column tenant varchar(255) not null default current_schema();
alter table unidade_tipo_avaliacao_dispositivo drop constraint if exists UKaex8iqnj6gr507nejq8v48pv5;
alter table unidade_tipo_avaliacao_dispositivo add constraint UKaex8iqnj6gr507nejq8v48pv5 unique (unidade_tipo_avaliacao_id, dispositivo_id, ordem);