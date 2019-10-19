create table if not exists assinatura
(
    id                             bigserial not null,
    created                        timestamp not null,
    updated                        timestamp,
    primary key (id),
    forma_pagamento                int4      not null DEFAULT 0,
    mes_validade                   varchar(20),
    ano_validade                   varchar(50),
    data_vencimento                timestamp,
    numero_cartao                  varchar(20),
    nome_titular_cartao            varchar(150),
    hash                           varchar,
    documento_titular_cartao       varchar(20),
    sou_empresa                    boolean,
    cancelada                      boolean   not null,
    dia_vencimento_fatura          smallint  not null default 5,
    data_nascimento_titular_cartao date,
    codigo_area                    smallint,
    telefone                       bigint,
    endereco_id                    bigint
);

create table if not exists assinatura_aud
(
    id                             int8 not null,
    rev                            int8 not null,
    revtype                        int2,
    primary key (id, rev),
    forma_pagamento                int4,
    mes_validade                   varchar(20),
    ano_validade                   varchar(50),
    data_vencimento                timestamp,
    numero_cartao                  varchar(20),
    nome_titular_cartao            varchar(150),
    documento_titular_cartao       varchar(20),
    hash                           varchar,
    sou_empresa                    boolean,
    cancelada                      boolean,
    dia_vencimento_fatura          smallint,
    data_nascimento_titular_cartao date,
    codigo_area                    smallint,
    telefone                       bigint,
    endereco_id                    bigint
);

alter table assinatura
    drop constraint if exists UK_numero_cartao;
alter table assinatura
    add constraint UK_numero_cartao unique (numero_cartao);

-- Inserir assinatura
INSERT INTO assinatura (id, created, cancelada)
VALUES (1, NOW(), false);

alter table dispositivo
    add column assinatura_id bigint not null default 1;
alter table dispositivo
    add column latitude numeric(19, 2);
alter table dispositivo
    add column longitude numeric(19, 2);
alter table dispositivo
    add column interna boolean not null default true;
alter table dispositivo
    add column modo_insonia boolean not null default true;
alter table dispositivo
    add column modo_quiosque boolean not null default true;
alter table dispositivo
    add column quebrar_linha_na_selecao_de_item_avaliavel boolean not null default true;
alter table dispositivo
    add column time int2 not null check (time >= 5 AND time <= 600) default 30;
alter table dispositivo
    add column tenant varchar(150) not null default current_schema();
alter table dispositivo
    add column senha varchar(10);
alter table dispositivo_aud
    add column senha varchar(10);
alter table dispositivo_aud
    add column tenant varchar(150) default current_schema();
alter table dispositivo_aud
    add column latitude numeric(19, 2);
alter table dispositivo_aud
    add column longitude numeric(19, 2);
alter table dispositivo_aud
    add column modo_insonia boolean;
alter table dispositivo_aud
    add column modo_quiosque boolean;
alter table dispositivo_aud
    add column interna boolean;
alter table dispositivo_aud
    add column quebrar_linha_na_selecao_de_item_avaliavel boolean;
alter table dispositivo_aud
    add column time int2;
alter table dispositivo_aud
    add column assinatura_id bigint not null default 0;

alter table dispositivo
    drop constraint if exists UK_tcudt9flboi41o17wagkwx8tw;
alter table dispositivo
    add constraint UK_tcudt9flboi41o17wagkwx8tw unique (numero_licenca);

alter table dispositivo
    drop constraint if exists dispositivo_tenant_nome_unique;
alter table dispositivo
    add constraint dispositivo_tenant_nome_unique unique (nome, tenant);


-- Coluna temporária para transferência
alter table dispositivo
    add column unidade_id varchar(150);

-- Insere os dispositivos de acordo com as unidades
INSERT INTO public.dispositivo (unidade_id, created, nome, interna, modo_quiosque, modo_insonia, time,
                                quebrar_linha_na_selecao_de_item_avaliavel, tenant, assinatura_id)
    (
        SELECT (unidade.id) || current_schema(),
               NOW()       AS created,
               pessoa.nome AS nome,
               true        AS interna,
               true        AS modo_quiosque,
               true        AS modo_insonia,
               30          AS time,
               true       AS quebrar_linha_na_selecao_de_item_avaliavel,
               current_schema(),
               1
        FROM unidade
                 INNER JOIN pessoa ON pessoa.id = unidade.id
    );

-- Insere os unidade-tipo-avaliacao-dispositivo de acordo com as unidades
INSERT INTO unidade_tipo_avaliacao_dispositivo (id, created, ordem, unidade_tipo_avaliacao_id, dispositivo_id, ativo)
    (
        SELECT (unidade_tipo_avaliacao.id) as ide,
               NOW()                       AS created,
               1                           AS ordem,
               unidade_tipo_avaliacao.id   AS unidade_tipo_avaliacao_id,
               public.dispositivo.id       AS dispositivo_id,
               true                        AS ativo
        FROM unidade
                 INNER JOIN unidade_tipo_avaliacao ON unidade_tipo_avaliacao.unidade_id = unidade.id
                 LEFT OUTER JOIN public.dispositivo ON public.dispositivo.unidade_id = unidade.id || current_schema()
    );


alter table dispositivo
    add constraint fk_assinatura foreign key (assinatura_id) references assinatura;
