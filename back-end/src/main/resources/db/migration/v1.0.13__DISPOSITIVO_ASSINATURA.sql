create table if not exists assinatura
(
    id                      bigserial not null,
    created                 timestamp not null,
    updated                 timestamp,
    primary key (id),
    forma_pagamento         int4      not null DEFAULT 0,
    client_id               varchar(50),
    mes_validade            varchar(20),
    ano_validade            varchar(50),
    data_vencimento         timestamp,
    numero_cartao           varchar(20),
    nome_titular            varchar(150),
    hash                    varchar,
    documento_titular       varchar(20),
    agrupar_faturas         boolean   not null default false,
    sou_empresa             boolean,
    cancelada               boolean   not null,
    dia_vencimento_fatura   smallint  not null default 5,
    data_nascimento_titular date,
    codigo_area             smallint,
    telefone                bigint,
    endereco_id             bigint
);

create table if not exists assinatura_aud
(
    id                      int8 not null,
    rev                     int8 not null,
    revtype                 int2,
    primary key (id, rev),
    forma_pagamento         int4,
    client_id               varchar(50),
    mes_validade            varchar(20),
    ano_validade            varchar(50),
    data_vencimento         timestamp,
    numero_cartao           varchar(20),
    nome_titular            varchar(150),
    documento_titular       varchar(20),
    hash                    varchar,
    agrupar_faturas         boolean,
    sou_empresa             boolean,
    cancelada               boolean,
    dia_vencimento_fatura   smallint,
    data_nascimento_titular date,
    codigo_area             smallint,
    telefone                bigint,
    endereco_id             bigint
);

alter table assinatura
    drop constraint if exists UK_numero_cartao;
alter table assinatura
    add constraint UK_numero_cartao unique (numero_cartao);

-- Inserir assinatura
INSERT INTO assinatura (id, created, cancelada)
VALUES (1, NOW(), false);

alter table dispositivo
    add column latitude numeric(19, 2);
alter table dispositivo
    add column longitude numeric(19, 2);
alter table dispositivo
    add column quebrar_linha_na_selecao_de_item_avaliavel boolean not null default true;
alter table dispositivo
    add column time int2 not null check (time >= 5 AND time <= 600) default 30 not null;
alter table dispositivo
    add column tenant varchar(150) not null default current_schema();
alter table dispositivo
    add column senha bigint not null default ((floor(random() * (999999 - 100000 + 1) + 100000)));
alter table dispositivo
    add column codigo bigint not null default ((floor(random() * (999999 - 100000 + 1) + 100000)));
alter table dispositivo
    add column codigo_expiration timestamp without time zone NOT NULL default now();
alter table dispositivo
    add column data_desativacao date;

alter table dispositivo_aud
    add column senha bigint;
alter table dispositivo_aud
    add column tenant varchar(150) default current_schema();
alter table dispositivo_aud
    add column latitude numeric(19, 2);
alter table dispositivo_aud
    add column longitude numeric(19, 2);
alter table dispositivo_aud
    add column quebrar_linha_na_selecao_de_item_avaliavel boolean;
alter table dispositivo_aud
    add column time int2;
alter table dispositivo_aud
    add column codigo bigint;
alter table dispositivo_aud
    add column codigo_expiration timestamp without time zone;
alter table dispositivo_aud
    add column data_desativacao date;

alter table dispositivo
    drop constraint if exists dispositivo_tenant_nome_unique;
alter table dispositivo
    add constraint dispositivo_tenant_nome_unique unique (nome, tenant);

alter table dispositivo
    drop constraint if exists dispositivo_codigo_unique;
alter table dispositivo
    add constraint dispositivo_codigo_unique unique (codigo);

-- Coluna temporária para transferência
alter table dispositivo
    add column unidade_id varchar(150);

-- Insere os dispositivos de acordo com as unidades
INSERT INTO public.dispositivo (unidade_id, created, nome, time,
                                quebrar_linha_na_selecao_de_item_avaliavel,
                                tenant)
    (
        SELECT (unidade.id) || current_schema(),
               NOW()                                         AS created,
               pessoa.nome                                   AS nome,
               COALESCE((select time from configuracao), 30) AS time,
               true                                          AS quebrar_linha_na_selecao_de_item_avaliavel,
               current_schema()
        FROM unidade
                 INNER JOIN pessoa ON pessoa.id = unidade.id
    );

-- Insere os unidade-tipo-avaliacao-dispositivo de acordo com as unidades
INSERT INTO unidade_tipo_avaliacao_dispositivo (id, created, ordem, unidade_tipo_avaliacao_id, dispositivo_id, ativo)
    (
        SELECT (unidade_tipo_avaliacao.id)                                                               as ide,
               NOW()                                                                                     AS created,
               row_number() OVER (PARTITION BY public.dispositivo.id ORDER BY unidade_tipo_avaliacao.id) AS ordem,
               unidade_tipo_avaliacao.id                                                                 AS unidade_tipo_avaliacao_id,
               public.dispositivo.id                                                                     AS dispositivo_id,
               true                                                                                      AS ativo
        FROM unidade
                 INNER JOIN unidade_tipo_avaliacao ON unidade_tipo_avaliacao.unidade_id = unidade.id
                 LEFT OUTER JOIN public.dispositivo ON public.dispositivo.unidade_id = unidade.id || current_schema()
    );
