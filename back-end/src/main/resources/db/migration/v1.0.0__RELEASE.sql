CREATE SEQUENCE revision_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE revision_id_seq
  OWNER TO assessment;


-- Table: revision

-- DROP TABLE revision;

CREATE TABLE IF NOT EXISTS public.revision
(
  id bigint NOT NULL DEFAULT nextval('revision_id_seq'::regclass),
  "timestamp" bigint NOT NULL,
  username character varying(200),
  schema character varying(200),
  CONSTRAINT revision_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.revision
  OWNER TO assessment;


--
-- TOC entry 179 (class 1259 OID 273644)
-- Name: cidade; Type: TABLE;
--

CREATE TABLE IF NOT EXISTS cidade (
    id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone,
    nome character varying(200) NOT NULL,
    estado_id bigint NOT NULL
);


--
-- TOC entry 180 (class 1259 OID 273650)
-- Name: cidade_aud; Type: TABLE;
--

CREATE TABLE IF NOT EXISTS cidade_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    revtype smallint,
    nome character varying(200),
    estado_id bigint
);


--
-- TOC entry 178 (class 1259 OID 273642)
-- Name: cidade_id_seq; Type: SEQUENCE;
--

CREATE SEQUENCE cidade_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2226 (class 0 OID 0)
-- Dependencies: 178
-- Name: cidade_id_seq; Type: SEQUENCE OWNED BY;
--

ALTER SEQUENCE cidade_id_seq OWNED BY cidade.id;


--
-- TOC entry 182 (class 1259 OID 273657)
-- Name: colaborador; Type: TABLE;
--

CREATE TABLE IF NOT EXISTS colaborador (
    id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone,
    vinculo integer NOT NULL,
    unidade_id bigint NOT NULL,
    usuario_id bigint NOT NULL
);


--
-- TOC entry 183 (class 1259 OID 273663)
-- Name: colaborador_aud; Type: TABLE;
--

CREATE TABLE IF NOT EXISTS colaborador_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    revtype smallint,
    vinculo integer,
    unidade_id bigint,
    usuario_id bigint
);


--
-- TOC entry 181 (class 1259 OID 273655)
-- Name: colaborador_id_seq; Type: SEQUENCE;
--

CREATE SEQUENCE colaborador_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2227 (class 0 OID 0)
-- Dependencies: 181
-- Name: colaborador_id_seq; Type: SEQUENCE OWNED BY;
--

ALTER SEQUENCE colaborador_id_seq OWNED BY colaborador.id;


--
-- TOC entry 185 (class 1259 OID 273670)
-- Name: configuracao; Type: TABLE;
--

CREATE TABLE IF NOT EXISTS configuracao (
    id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone
);


--
-- TOC entry 186 (class 1259 OID 273676)
-- Name: configuracao_aud; Type: TABLE;
--

CREATE TABLE IF NOT EXISTS configuracao_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    revtype smallint
);


--
-- TOC entry 184 (class 1259 OID 273668)
-- Name: configuracao_id_seq; Type: SEQUENCE;
--

CREATE SEQUENCE configuracao_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2228 (class 0 OID 0)
-- Dependencies: 184
-- Name: configuracao_id_seq; Type: SEQUENCE OWNED BY;
--

ALTER SEQUENCE configuracao_id_seq OWNED BY configuracao.id;


--
-- TOC entry 188 (class 1259 OID 273683)
-- Name: conta; Type: TABLE;
--

CREATE TABLE IF NOT EXISTS conta (
    id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone,
    email character varying(255),
    esquema character varying(255) NOT NULL,
    lastlogin timestamp without time zone,
    administrador boolean NOT NULL,
    root boolean NOT NULL,
    password character varying(255),
    usuario_id bigint
);


--
-- TOC entry 189 (class 1259 OID 273692)
-- Name: conta_aud; Type: TABLE;
--

CREATE TABLE IF NOT EXISTS conta_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    revtype smallint,
    email character varying(255),
    esquema character varying(255),
    lastlogin timestamp without time zone,
    administrador boolean,
    root boolean,
    password character varying(255),
    usuario_id bigint
);


--
-- TOC entry 187 (class 1259 OID 273681)
-- Name: conta_id_seq; Type: SEQUENCE;
--

CREATE SEQUENCE conta_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2229 (class 0 OID 0)
-- Dependencies: 187
-- Name: conta_id_seq; Type: SEQUENCE OWNED BY;
--

ALTER SEQUENCE conta_id_seq OWNED BY conta.id;


--
-- TOC entry 191 (class 1259 OID 273702)
-- Name: endereco; Type: TABLE;
--

CREATE TABLE IF NOT EXISTS endereco (
    id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone,
    bairro character varying(200),
    cep character varying(9),
    complemento character varying(200),
    logradouro character varying(200),
    numero character varying(20),
    cidade_id bigint NOT NULL
);


--
-- TOC entry 192 (class 1259 OID 273711)
-- Name: endereco_aud; Type: TABLE;
--

CREATE TABLE IF NOT EXISTS endereco_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    revtype smallint,
    bairro character varying(200),
    cep character varying(255),
    complemento character varying(200),
    logradouro character varying(200),
    numero character varying(20),
    cidade_id bigint
);


--
-- TOC entry 190 (class 1259 OID 273700)
-- Name: endereco_id_seq; Type: SEQUENCE;
--

CREATE SEQUENCE endereco_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2230 (class 0 OID 0)
-- Dependencies: 190
-- Name: endereco_id_seq; Type: SEQUENCE OWNED BY;
--

ALTER SEQUENCE endereco_id_seq OWNED BY endereco.id;


--
-- TOC entry 194 (class 1259 OID 273721)
-- Name: estado; Type: TABLE;
--

CREATE TABLE IF NOT EXISTS estado (
    id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone,
    nome character varying(200) NOT NULL,
    uf character varying(2) NOT NULL,
    pais_id bigint NOT NULL
);


--
-- TOC entry 195 (class 1259 OID 273727)
-- Name: estado_aud; Type: TABLE;
--

CREATE TABLE IF NOT EXISTS estado_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    revtype smallint,
    nome character varying(200),
    uf character varying(2),
    pais_id bigint
);


--
-- TOC entry 193 (class 1259 OID 273719)
-- Name: estado_id_seq; Type: SEQUENCE;
--

CREATE SEQUENCE estado_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2231 (class 0 OID 0)
-- Dependencies: 193
-- Name: estado_id_seq; Type: SEQUENCE OWNED BY;
--

ALTER SEQUENCE estado_id_seq OWNED BY estado.id;




--
-- TOC entry 197 (class 1259 OID 273734)
-- Name: pais; Type: TABLE;
--

CREATE TABLE IF NOT EXISTS pais (
    id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone,
    nome character varying(200) NOT NULL
);


--
-- TOC entry 198 (class 1259 OID 273740)
-- Name: pais_aud; Type: TABLE;
--

CREATE TABLE IF NOT EXISTS pais_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    revtype smallint,
    nome character varying(200)
);


--
-- TOC entry 196 (class 1259 OID 273732)
-- Name: pais_id_seq; Type: SEQUENCE;
--

CREATE SEQUENCE pais_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2232 (class 0 OID 0)
-- Dependencies: 196
-- Name: pais_id_seq; Type: SEQUENCE OWNED BY;
--

ALTER SEQUENCE pais_id_seq OWNED BY pais.id;


--
-- TOC entry 200 (class 1259 OID 273747)
-- Name: pessoa; Type: TABLE;
--

CREATE TABLE IF NOT EXISTS pessoa (
    id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone,
    documento character varying(255),
    nome character varying(255)
);


--
-- TOC entry 201 (class 1259 OID 273756)
-- Name: pessoa_aud; Type: TABLE;
--

CREATE TABLE IF NOT EXISTS pessoa_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    revtype smallint,
    documento character varying(255),
    nome character varying(255)
);


--
-- TOC entry 199 (class 1259 OID 273745)
-- Name: pessoa_id_seq; Type: SEQUENCE;
--

CREATE SEQUENCE pessoa_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2233 (class 0 OID 0)
-- Dependencies: 199
-- Name: pessoa_id_seq; Type: SEQUENCE OWNED BY;
--

ALTER SEQUENCE pessoa_id_seq OWNED BY pessoa.id;


--
-- TOC entry 199 (class 1259 OID 292489)
-- Name: unidade; Type: TABLE; Schema:  Owner: -
--

CREATE TABLE unidade (
    id bigint NOT NULL,
    endereco_id bigint NOT NULL
);


--
-- TOC entry 200 (class 1259 OID 292494)
-- Name: unidade_aud; Type: TABLE; Schema:  Owner: -
--

CREATE TABLE unidade_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    endereco_id bigint
);



--
-- TOC entry 204 (class 1259 OID 273780)
-- Name: usuario; Type: TABLE;
--

CREATE TABLE IF NOT EXISTS usuario (
    avatar bytea,
    avatarpath character varying(255),
    foto bytea,
    fotopath character varying(255),
    thumbnail bytea,
    thumbnailpath character varying(255),
    id bigint NOT NULL,
    conta_id bigint
);


--
-- TOC entry 205 (class 1259 OID 273788)
-- Name: usuario_aud; Type: TABLE;
--

CREATE TABLE IF NOT EXISTS usuario_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    avatar bytea,
    avatarpath character varying(255),
    foto bytea,
    fotopath character varying(255),
    isadministrador boolean,
    thumbnail bytea,
    thumbnailpath character varying(255),
    conta_id bigint
);


--
-- TOC entry 2036 (class 2604 OID 273647)
-- Name: id; Type: DEFAULT;
--

ALTER TABLE ONLY cidade ALTER COLUMN id SET DEFAULT nextval('cidade_id_seq'::regclass);


--
-- TOC entry 2037 (class 2604 OID 273660)
-- Name: id; Type: DEFAULT;
--

ALTER TABLE ONLY colaborador ALTER COLUMN id SET DEFAULT nextval('colaborador_id_seq'::regclass);


--
-- TOC entry 2038 (class 2604 OID 273673)
-- Name: id; Type: DEFAULT;
--

ALTER TABLE ONLY configuracao ALTER COLUMN id SET DEFAULT nextval('configuracao_id_seq'::regclass);


--
-- TOC entry 2039 (class 2604 OID 273686)
-- Name: id; Type: DEFAULT;
--

ALTER TABLE ONLY conta ALTER COLUMN id SET DEFAULT nextval('conta_id_seq'::regclass);


--
-- TOC entry 2040 (class 2604 OID 273705)
-- Name: id; Type: DEFAULT;
--

ALTER TABLE ONLY endereco ALTER COLUMN id SET DEFAULT nextval('endereco_id_seq'::regclass);


--
-- TOC entry 2041 (class 2604 OID 273724)
-- Name: id; Type: DEFAULT;
--

ALTER TABLE ONLY estado ALTER COLUMN id SET DEFAULT nextval('estado_id_seq'::regclass);


--
-- TOC entry 2042 (class 2604 OID 273737)
-- Name: id; Type: DEFAULT;
--

ALTER TABLE ONLY pais ALTER COLUMN id SET DEFAULT nextval('pais_id_seq'::regclass);


--
-- TOC entry 2043 (class 2604 OID 273750)
-- Name: id; Type: DEFAULT;
--

ALTER TABLE ONLY pessoa ALTER COLUMN id SET DEFAULT nextval('pessoa_id_seq'::regclass);


--
-- TOC entry 2052 (class 2606 OID 273654)
-- Name: cidade_aud_pkey; Type: CONSTRAINT;
--

ALTER TABLE ONLY cidade_aud
    ADD CONSTRAINT cidade_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 2048 (class 2606 OID 273649)
-- Name: cidade_pkey; Type: CONSTRAINT;
--

ALTER TABLE ONLY cidade
    ADD CONSTRAINT cidade_pkey PRIMARY KEY (id);


--
-- TOC entry 2056 (class 2606 OID 273667)
-- Name: colaborador_aud_pkey; Type: CONSTRAINT;
--

ALTER TABLE ONLY colaborador_aud
    ADD CONSTRAINT colaborador_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 2054 (class 2606 OID 273662)
-- Name: colaborador_pkey; Type: CONSTRAINT;
--

ALTER TABLE ONLY colaborador
    ADD CONSTRAINT colaborador_pkey PRIMARY KEY (id);


--
-- TOC entry 2060 (class 2606 OID 273680)
-- Name: configuracao_aud_pkey; Type: CONSTRAINT;
--

ALTER TABLE ONLY configuracao_aud
    ADD CONSTRAINT configuracao_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 2058 (class 2606 OID 273675)
-- Name: configuracao_pkey; Type: CONSTRAINT;
--

ALTER TABLE ONLY configuracao
    ADD CONSTRAINT configuracao_pkey PRIMARY KEY (id);


--
-- TOC entry 2066 (class 2606 OID 273699)
-- Name: conta_aud_pkey; Type: CONSTRAINT;
--

ALTER TABLE ONLY conta_aud
    ADD CONSTRAINT conta_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 2062 (class 2606 OID 273691)
-- Name: conta_pkey; Type: CONSTRAINT;
--

ALTER TABLE ONLY conta
    ADD CONSTRAINT conta_pkey PRIMARY KEY (id);


--
-- TOC entry 2070 (class 2606 OID 273718)
-- Name: endereco_aud_pkey; Type: CONSTRAINT;
--

ALTER TABLE ONLY endereco_aud
    ADD CONSTRAINT endereco_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 2068 (class 2606 OID 273710)
-- Name: endereco_pkey; Type: CONSTRAINT;
--

ALTER TABLE ONLY endereco
    ADD CONSTRAINT endereco_pkey PRIMARY KEY (id);


--
-- TOC entry 2076 (class 2606 OID 273731)
-- Name: estado_aud_pkey; Type: CONSTRAINT;
--

ALTER TABLE ONLY estado_aud
    ADD CONSTRAINT estado_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 2072 (class 2606 OID 273726)
-- Name: estado_pkey; Type: CONSTRAINT;
--

ALTER TABLE ONLY estado
    ADD CONSTRAINT estado_pkey PRIMARY KEY (id);




--
-- TOC entry 2080 (class 2606 OID 273744)
-- Name: pais_aud_pkey; Type: CONSTRAINT;
--

ALTER TABLE ONLY pais_aud
    ADD CONSTRAINT pais_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 2078 (class 2606 OID 273739)
-- Name: pais_pkey; Type: CONSTRAINT;
--

ALTER TABLE ONLY pais
    ADD CONSTRAINT pais_pkey PRIMARY KEY (id);


--
-- TOC entry 2084 (class 2606 OID 273763)
-- Name: pessoa_aud_pkey; Type: CONSTRAINT;
--

ALTER TABLE ONLY pessoa_aud
    ADD CONSTRAINT pessoa_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 2082 (class 2606 OID 273755)
-- Name: pessoa_pkey; Type: CONSTRAINT;
--

ALTER TABLE ONLY pessoa
    ADD CONSTRAINT pessoa_pkey PRIMARY KEY (id);

--
-- TOC entry 2075 (class 2606 OID 292516)
-- Name: uk_cdi0kphlfel3k3jo7xbq2sjyj; Type: CONSTRAINT; Schema:  Owner: -
--

ALTER TABLE ONLY unidade
    ADD CONSTRAINT uk_cdi0kphlfel3k3jo7xbq2sjyj UNIQUE (endereco_id);


--
-- TOC entry 2064 (class 2606 OID 273799)
-- Name: uk_t0ri4tv9tcaagrwkm86qywixk; Type: CONSTRAINT;
--

ALTER TABLE ONLY conta
    ADD CONSTRAINT uk_t0ri4tv9tcaagrwkm86qywixk UNIQUE (email);


--
-- TOC entry 2074 (class 2606 OID 273801)
-- Name: ukkp0bfjywiiladkuu6bji65c5v; Type: CONSTRAINT;
--

ALTER TABLE ONLY estado
    ADD CONSTRAINT ukkp0bfjywiiladkuu6bji65c5v UNIQUE (nome, pais_id);


--
-- TOC entry 2050 (class 2606 OID 273797)
-- Name: ukto8scr6nbr29n55o5hpv9ljg1; Type: CONSTRAINT;
--

ALTER TABLE ONLY cidade
    ADD CONSTRAINT ukto8scr6nbr29n55o5hpv9ljg1 UNIQUE (nome, estado_id);


--
-- TOC entry 2088 (class 2606 OID 273779)
-- Name: unidade_aud_pkey; Type: CONSTRAINT;
--

ALTER TABLE ONLY unidade_aud
    ADD CONSTRAINT unidade_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 2086 (class 2606 OID 273771)
-- Name: unidade_pkey; Type: CONSTRAINT;
--

ALTER TABLE ONLY unidade
    ADD CONSTRAINT unidade_pkey PRIMARY KEY (id);


--
-- TOC entry 2092 (class 2606 OID 273795)
-- Name: usuario_aud_pkey; Type: CONSTRAINT;
--

ALTER TABLE ONLY usuario_aud
    ADD CONSTRAINT usuario_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 2090 (class 2606 OID 273787)
-- Name: usuario_pkey; Type: CONSTRAINT;
--

ALTER TABLE ONLY usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);




--
-- TOC entry 2095 (class 2606 OID 273812)
-- Name: fk4xfunk5u653sywlp8vsnvq4k1; Type: FK CONSTRAINT;
--

ALTER TABLE ONLY colaborador
    ADD CONSTRAINT fk4xfunk5u653sywlp8vsnvq4k1 FOREIGN KEY (unidade_id) REFERENCES unidade(id);


--
-- TOC entry 2108 (class 2606 OID 273877)
-- Name: fk68wjxp6s02oxqfg15e4y71jqd; Type: FK CONSTRAINT;
--

ALTER TABLE ONLY unidade_aud
    ADD CONSTRAINT fk68wjxp6s02oxqfg15e4y71jqd FOREIGN KEY (id, rev) REFERENCES pessoa_aud(id, rev);


--
-- TOC entry 2103 (class 2606 OID 273852)
-- Name: fk8fjre8p0oxr7igfa3dhxlq4pd; Type: FK CONSTRAINT;
--

ALTER TABLE ONLY estado
    ADD CONSTRAINT fk8fjre8p0oxr7igfa3dhxlq4pd FOREIGN KEY (pais_id) REFERENCES pais(id);


--
-- TOC entry 2110 (class 2606 OID 273887)
-- Name: fk9b5ep6wuhibyj4jvphdn1kx4w; Type: FK CONSTRAINT;
--

ALTER TABLE ONLY usuario
    ADD CONSTRAINT fk9b5ep6wuhibyj4jvphdn1kx4w FOREIGN KEY (id) REFERENCES pessoa(id);


--
-- TOC entry 2109 (class 2606 OID 273882)
-- Name: fkb4d3hepeh0mtjtrvqs4m93slm; Type: FK CONSTRAINT;
--

ALTER TABLE ONLY usuario
    ADD CONSTRAINT fkb4d3hepeh0mtjtrvqs4m93slm FOREIGN KEY (conta_id) REFERENCES public.conta(id);


--
-- TOC entry 2096 (class 2606 OID 273817)
-- Name: fkdrolrqpjq522w3v94oh61n56o; Type: FK CONSTRAINT;
--

ALTER TABLE ONLY colaborador
    ADD CONSTRAINT fkdrolrqpjq522w3v94oh61n56o FOREIGN KEY (usuario_id) REFERENCES usuario(id);


--
-- TOC entry 2094 (class 2606 OID 273807)
-- Name: fkefwyjn6arj763whxfdrto1s4e; Type: FK CONSTRAINT;
--

ALTER TABLE ONLY cidade_aud
    ADD CONSTRAINT fkefwyjn6arj763whxfdrto1s4e FOREIGN KEY (rev) REFERENCES public.revision(id);


--
-- TOC entry 2098 (class 2606 OID 273827)
-- Name: fkeljinv8k5ln2wigpup838i4ml; Type: FK CONSTRAINT;
--

ALTER TABLE ONLY configuracao_aud
    ADD CONSTRAINT fkeljinv8k5ln2wigpup838i4ml FOREIGN KEY (rev) REFERENCES public.revision(id);


--
-- TOC entry 2104 (class 2606 OID 273857)
-- Name: fkh85yyhbouaqnu4pi1jqx6cghm; Type: FK CONSTRAINT;
--

ALTER TABLE ONLY estado_aud
    ADD CONSTRAINT fkh85yyhbouaqnu4pi1jqx6cghm FOREIGN KEY (rev) REFERENCES public.revision(id);


--
-- TOC entry 2099 (class 2606 OID 273832)
-- Name: fkjpapvgjiqj26axfejpbkaeb67; Type: FK CONSTRAINT;
--

ALTER TABLE ONLY conta
    ADD CONSTRAINT fkjpapvgjiqj26axfejpbkaeb67 FOREIGN KEY (usuario_id) REFERENCES usuario(id);


--
-- TOC entry 2106 (class 2606 OID 273867)
-- Name: fkjutrachlrb2rljju7emg3rasl; Type: FK CONSTRAINT;
--

ALTER TABLE ONLY pessoa_aud
    ADD CONSTRAINT fkjutrachlrb2rljju7emg3rasl FOREIGN KEY (rev) REFERENCES public.revision(id);


--
-- TOC entry 2097 (class 2606 OID 273822)
-- Name: fkkvbk7kvfhho91rrt51ltsm5he; Type: FK CONSTRAINT;
--

ALTER TABLE ONLY colaborador_aud
    ADD CONSTRAINT fkkvbk7kvfhho91rrt51ltsm5he FOREIGN KEY (rev) REFERENCES public.revision(id);


--
-- TOC entry 2111 (class 2606 OID 273892)
-- Name: fklmj1jljihqyvg9iyqj42aq4q4; Type: FK CONSTRAINT;
--

ALTER TABLE ONLY usuario_aud
    ADD CONSTRAINT fklmj1jljihqyvg9iyqj42aq4q4 FOREIGN KEY (id, rev) REFERENCES pessoa_aud(id, rev);

--
-- TOC entry 2097 (class 2606 OID 292582)
-- Name: fkch7malo902uvvg5pea4htv3ot; Type: FK CONSTRAINT; Schema:  Owner: -
--

ALTER TABLE ONLY unidade
    ADD CONSTRAINT fkch7malo902uvvg5pea4htv3ot FOREIGN KEY (endereco_id) REFERENCES endereco(id);

--
-- TOC entry 2102 (class 2606 OID 273847)
-- Name: fkmnfywh0cf5m1x2kspb99laqim; Type: FK CONSTRAINT;
--

ALTER TABLE ONLY endereco_aud
    ADD CONSTRAINT fkmnfywh0cf5m1x2kspb99laqim FOREIGN KEY (rev) REFERENCES public.revision(id);


--
-- TOC entry 2105 (class 2606 OID 273862)
-- Name: fkmskwo6sjcn9897p2pfho4eyfd; Type: FK CONSTRAINT;
--

ALTER TABLE ONLY pais_aud
    ADD CONSTRAINT fkmskwo6sjcn9897p2pfho4eyfd FOREIGN KEY (rev) REFERENCES public.revision(id);


--
-- TOC entry 2107 (class 2606 OID 273872)
-- Name: fknn4w0hqjypgmwmwiflh8r8t59; Type: FK CONSTRAINT;
--

ALTER TABLE ONLY unidade
    ADD CONSTRAINT fknn4w0hqjypgmwmwiflh8r8t59 FOREIGN KEY (id) REFERENCES pessoa(id);


--
-- TOC entry 2100 (class 2606 OID 273837)
-- Name: fkqjvekwd6r9mpfnnqsmtpcx1qh; Type: FK CONSTRAINT;
--

ALTER TABLE ONLY conta_aud
    ADD CONSTRAINT chave_estrangeira_para_revisao_deconta FOREIGN KEY (rev) REFERENCES public.revision(id);


--
-- TOC entry 2093 (class 2606 OID 273802)
-- Name: fksatretdvg03if89kwwmiagnyd; Type: FK CONSTRAINT;
--

ALTER TABLE ONLY cidade
    ADD CONSTRAINT fksatretdvg03if89kwwmiagnyd FOREIGN KEY (estado_id) REFERENCES estado(id);


--
-- TOC entry 2101 (class 2606 OID 273842)
-- Name: fksq6fa88clryv3uqsbgvva4fne; Type: FK CONSTRAINT;
--

ALTER TABLE ONLY endereco
    ADD CONSTRAINT fksq6fa88clryv3uqsbgvva4fne FOREIGN KEY (cidade_id) REFERENCES public.cidade(id);

-- Table: flyway_schema_history

-- DROP TABLE flyway_schema_history;

CREATE TABLE IF NOT EXISTS flyway_schema_history
(
  installed_rank integer NOT NULL,
  version character varying(50),
  description character varying(200) NOT NULL,
  type character varying(20) NOT NULL,
  script character varying(1000) NOT NULL,
  checksum integer,
  installed_by character varying(100) NOT NULL,
  installed_on timestamp without time zone NOT NULL DEFAULT now(),
  execution_time integer NOT NULL,
  success boolean NOT NULL,
  CONSTRAINT flyway_schema_history_pk PRIMARY KEY (installed_rank)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE flyway_schema_history
  OWNER TO assessment;

-- CREATE INDEX IN POSTGRES 9.4+
DO $$
BEGIN

IF to_regclass('flyway_schema_history_s_idx') IS NULL THEN
    CREATE INDEX flyway_schema_history_s_idx ON flyway_schema_history USING btree (success);
END IF;

END$$;



