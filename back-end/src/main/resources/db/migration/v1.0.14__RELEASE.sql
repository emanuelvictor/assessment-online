-- Insere os dispositivos de acordo com as unidades
INSERT INTO dispositivo (id, created, nome, publico, modo_quiosque, modo_insonia, time, quebrar_linha_na_selecao_de_item_avaliavel, endereco_id, documento)
    (
        SELECT  (unidade.id) as ide, NOW() AS created, pessoa.nome AS nome, false AS publico, false AS modo_quiosque, false AS modo_insonia, 30 AS time, false AS quebrar_linha_na_selecao_de_item_avaliavel, unidade.endereco_id as endereco_id, pessoa.documento as documento
        FROM unidade
                 INNER JOIN pessoa ON pessoa.id = unidade.id
    );

-- Insere os unidade-tipo-avaliacao-dispositivo de acordo com as unidades
INSERT INTO unidade_tipo_avaliacao_dispositivo (id, created, ordem, unidade_tipo_avaliacao_id, dispositivo_id, ativo)
    (
        SELECT  (unidade_tipo_avaliacao.id) as ide, NOW() AS created, 1 AS ordem, unidade_tipo_avaliacao.id AS unidade_tipo_avaliacao_id, unidade.id AS dispositivo_id, true AS ativo
        FROM unidade
                 INNER JOIN unidade_tipo_avaliacao ON unidade_tipo_avaliacao.unidade_id = unidade.id
    );


ALTER TABLE unidade ADD COLUMN nome character varying(255);
ALTER TABLE unidade_aud ADD COLUMN nome character varying(255);
ALTER TABLE unidade_aud ADD COLUMN revtype smallint;
ALTER TABLE unidade ADD COLUMN created timestamp without time zone NOT NULL default NOW();
ALTER TABLE unidade ADD COLUMN updated timestamp without time zone;



UPDATE unidade
SET nome = p.nome
FROM unidade u
    inner join pessoa p on
        p.id = u.id;

-- constrint de pessoa
ALTER TABLE unidade drop constraint fkqt586b6o6dkbxx5wedh52cqi1;
-- constrint de pessoa
ALTER TABLE unidade_aud drop constraint fki85nctbnxcvjjp5kg8m3qnb2n;
-- constraint de endereço
ALTER TABLE unidade drop constraint uk_bxfhl1pn9y0kkech17l0jvngy;
ALTER TABLE unidade drop column endereco_id;

--
-- TOC entry 233 (class 1259 OID 53656)
-- Name: unidade_id_seq; Type: SEQUENCE; Schema: public; Owner: ubest
--

CREATE SEQUENCE unidade_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE unidade_id_seq OWNED BY unidade.id;


--
-- TOC entry 2940 (class 2604 OID 53661)
-- Name: pessoa id; Type: DEFAULT; Schema: public; Owner: ubest
--

ALTER TABLE ONLY unidade ALTER COLUMN id SET DEFAULT nextval('unidade_id_seq'::regclass);

--
-- TOC entry 3267 (class 0 OID 0)
-- Dependencies: 233
-- Name: unidade_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ubest
--

SELECT pg_catalog.setval('unidade_id_seq', 100, true);

