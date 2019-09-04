create table if not exists assinatura
(
    id                             bigserial    not null,
    created                        timestamp    not null,
    updated                        timestamp,
    primary key (id),
    tenant                         varchar(150) not null,
    mes_validade                   varchar(20),
    ano_validade                   varchar(50),
    data_vencimento                timestamp,
    numero_cartao                  bigint,
    nome_titular_cartao            varchar(150),
    documento_titular_cartao       varchar(20),
    data_nascimento_titular_cartao timestamp,
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
    tenant                         varchar(150),
    mes_validade                   varchar(20),
    ano_validade                   varchar(50),
    data_vencimento                timestamp,
    numero_cartao                  bigint,
    nome_titular_cartao            varchar(150),
    documento_titular_cartao       varchar(20),
    data_nascimento_titular_cartao timestamp,
    codigo_area                    smallint,
    telefone                       bigint,
    endereco_id                    bigint
);

alter table assinatura
    drop constraint if exists UK_numero_cartao;
alter table assinatura
    add constraint UK_numero_cartao unique (numero_cartao);

-- Inserir assinatura
INSERT INTO public.assinatura (created, tenant)
VALUES (NOW(), current_schema());

-- atualizar licencas
alter table licenca
    add column assinatura_id bigint;
alter table licenca_aud
    add column assinatura_id bigint;

update licenca
set assinatura_id = (SELECT MAX(id) FROM public.assinatura WHERE tenant = "current_schema"());

-- alter table licenca
--     alter column assinatura_id set not null;
