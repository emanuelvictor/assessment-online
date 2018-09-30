
--
-- TOC entry 202 (class 1259 OID 155992)
-- Name: avaliacao; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE avaliacao (
    id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone,
    data timestamp without time zone,
    nota numeric(19,2) NOT NULL
);


--
-- TOC entry 203 (class 1259 OID 155998)
-- Name: avaliacao_aud; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE avaliacao_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    revtype smallint,
    data timestamp without time zone,
    nota numeric(19,2)
);


--
-- TOC entry 206 (class 1259 OID 156010)
-- Name: avaliacao_colaborador; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE avaliacao_colaborador (
    id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone,
    avaliacao_id bigint NOT NULL,
    colaborador_id bigint NOT NULL
);


--
-- TOC entry 204 (class 1259 OID 156003)
-- Name: avaliacao_colaborador_aud; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE avaliacao_colaborador_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    revtype smallint,
    avaliacao_id bigint,
    colaborador_id bigint
);


--
-- TOC entry 205 (class 1259 OID 156008)
-- Name: avaliacao_colaborador_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE avaliacao_colaborador_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2245 (class 0 OID 0)
-- Dependencies: 205
-- Name: avaliacao_colaborador_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE avaliacao_colaborador_id_seq OWNED BY avaliacao_colaborador.id;


--
-- TOC entry 201 (class 1259 OID 155990)
-- Name: avaliacao_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE avaliacao_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2246 (class 0 OID 0)
-- Dependencies: 201
-- Name: avaliacao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE avaliacao_id_seq OWNED BY avaliacao.id;


--
-- TOC entry 2108 (class 2604 OID 155995)
-- Name: avaliacao id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY avaliacao ALTER COLUMN id SET DEFAULT nextval('avaliacao_id_seq'::regclass);


--
-- TOC entry 2109 (class 2604 OID 156013)
-- Name: avaliacao_colaborador id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY avaliacao_colaborador ALTER COLUMN id SET DEFAULT nextval('avaliacao_colaborador_id_seq'::regclass);


--
-- TOC entry 2113 (class 2606 OID 156002)
-- Name: avaliacao_aud avaliacao_aud_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY avaliacao_aud
    ADD CONSTRAINT avaliacao_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 2115 (class 2606 OID 156007)
-- Name: avaliacao_colaborador_aud avaliacao_colaborador_aud_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY avaliacao_colaborador_aud
    ADD CONSTRAINT avaliacao_colaborador_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 2117 (class 2606 OID 156015)
-- Name: avaliacao_colaborador avaliacao_colaborador_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY avaliacao_colaborador
    ADD CONSTRAINT avaliacao_colaborador_pkey PRIMARY KEY (id);


--
-- TOC entry 2111 (class 2606 OID 155997)
-- Name: avaliacao avaliacao_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY avaliacao
    ADD CONSTRAINT avaliacao_pkey PRIMARY KEY (id);


--
-- TOC entry 2119 (class 2606 OID 156107)
-- Name: avaliacao_colaborador ukhbi4xop2yyk1nt43lp0hjyi9r; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY avaliacao_colaborador
    ADD CONSTRAINT ukhbi4xop2yyk1nt43lp0hjyi9r UNIQUE (colaborador_id, avaliacao_id);


--
-- TOC entry 2121 (class 2606 OID 156147)
-- Name: avaliacao_colaborador_aud fkdtpajrioqoghvhv0g1l5a6stm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY avaliacao_colaborador_aud
    ADD CONSTRAINT fkdtpajrioqoghvhv0g1l5a6stm FOREIGN KEY (rev) REFERENCES revision(id);


--
-- TOC entry 2123 (class 2606 OID 156157)
-- Name: avaliacao_colaborador fkiqv4jbq46owb54omw2uniinou; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY avaliacao_colaborador
    ADD CONSTRAINT fkiqv4jbq46owb54omw2uniinou FOREIGN KEY (colaborador_id) REFERENCES colaborador(id);


--
-- TOC entry 2120 (class 2606 OID 156142)
-- Name: avaliacao_aud fko4c47hsy8077g9cjndbkjlqce; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY avaliacao_aud
    ADD CONSTRAINT fko4c47hsy8077g9cjndbkjlqce FOREIGN KEY (rev) REFERENCES revision(id);


--
-- TOC entry 2122 (class 2606 OID 156152)
-- Name: avaliacao_colaborador fksb4bksf3irgblxrvh1ijwxfaf; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY avaliacao_colaborador
    ADD CONSTRAINT fksb4bksf3irgblxrvh1ijwxfaf FOREIGN KEY (avaliacao_id) REFERENCES avaliacao(id);


-- Completed on 2018-09-01 22:38:21

--
-- PostgreSQL database dump complete
--

