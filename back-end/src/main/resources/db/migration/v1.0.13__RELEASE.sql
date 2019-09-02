alter table licenca add column latitude numeric(19, 2);
alter table licenca add column longitude numeric(19, 2);
alter table licenca add column interna boolean not null default true;
alter table licenca add column modo_insonia boolean not null default true;
alter table licenca add column modo_quiosque boolean not null  default true;
alter table licenca add column quebrar_linha_na_selecao_de_item_avaliavel boolean not null default true;
alter table licenca add column time int2 not null check(time>=5 AND time<=600) default 30;
alter table licenca add column tenant varchar(150) not null default current_schema();
alter table licenca add column senha varchar(10);
alter table licenca_aud add column senha varchar(10);
alter table licenca_aud add column tenant varchar(150) default current_schema();
alter table licenca_aud add column latitude numeric(19, 2);
alter table licenca_aud add column longitude numeric(19, 2);
alter table licenca_aud add column modo_insonia boolean;
alter table licenca_aud add column modo_quiosque boolean;
alter table licenca_aud add column interna boolean;
alter table licenca_aud add column quebrar_linha_na_selecao_de_item_avaliavel boolean;
alter table licenca_aud add column time int2;

alter table licenca drop constraint if exists UK_tcudt9flboi41o17wagkwx8tw;
alter table licenca add constraint UK_tcudt9flboi41o17wagkwx8tw unique (numero);

alter table licenca drop constraint if exists licenca_tenant_nome_unique;
alter table licenca add constraint licenca_tenant_nome_unique unique (nome, tenant);



-- Coluna temporária para transferência
alter table licenca add column unidade_id varchar(150);

-- Insere os licencas de acordo com as unidades
INSERT INTO public.licenca (unidade_id, created, nome, interna, modo_quiosque, modo_insonia, time, quebrar_linha_na_selecao_de_item_avaliavel, tenant)
    (
        SELECT  (unidade.id) || current_schema(), NOW() AS created, pessoa.nome AS nome, false AS interna, false AS modo_quiosque, false AS modo_insonia, 30 AS time, false AS quebrar_linha_na_selecao_de_item_avaliavel, current_schema()
        FROM unidade
                 INNER JOIN pessoa ON pessoa.id = unidade.id
    );

-- Insere os unidade-tipo-avaliacao-licenca de acordo com as unidades
INSERT INTO unidade_tipo_avaliacao_licenca (id, created, ordem, unidade_tipo_avaliacao_id, licenca_id, ativo)
    (
        SELECT  (unidade_tipo_avaliacao.id) as ide, NOW() AS created, 1 AS ordem, unidade_tipo_avaliacao.id AS unidade_tipo_avaliacao_id, public.licenca.id AS licenca_id, true AS ativo
        FROM unidade
                 INNER JOIN unidade_tipo_avaliacao ON unidade_tipo_avaliacao.unidade_id = unidade.id
                 LEFT OUTER JOIN public.licenca ON public.licenca.unidade_id = unidade.id || current_schema()
    );
