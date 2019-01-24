--
-- PostgreSQL database dump
--

-- Dumped from database version 10.6 (Ubuntu 10.6-1.pgdg16.04+1)
-- Dumped by pg_dump version 10.6 (Ubuntu 10.6-1.pgdg16.04+1)

-- Started on 2019-01-24 18:42:43 -02

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 258 (class 1255 OID 53906)
-- Name: filter(text, text[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION filter(needles text, VARIADIC haystacks text[]) RETURNS boolean
    LANGUAGE sql
    AS $$
SELECT needles IS NULL OR trim(needles) = '' OR EXISTS(
    SELECT DISTINCT 1
    FROM unnest(haystacks) haystack,
          unnest(string_to_array(needles, ',')) needle
    WHERE unaccent(haystack) ILIKE '%' || unaccent(needle) || '%');
$$;


ALTER FUNCTION filter(needles text, VARIADIC haystacks text[]) OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 216 (class 1259 OID 53562)
-- Name: avaliacao; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE avaliacao (
    id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone,
    data timestamp without time zone NOT NULL,
    foto bytea,
    foto_path character varying(255),
    nota numeric(19,0) NOT NULL
);


ALTER TABLE avaliacao OWNER TO assessment;

--
-- TOC entry 217 (class 1259 OID 53571)
-- Name: avaliacao_aud; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE avaliacao_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    revtype smallint,
    data timestamp without time zone,
    foto bytea,
    foto_path character varying(255),
    nota numeric(19,0)
);


ALTER TABLE avaliacao_aud OWNER TO assessment;

--
-- TOC entry 220 (class 1259 OID 53586)
-- Name: avaliacao_avaliavel; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE avaliacao_avaliavel (
    id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone,
    avaliacao_id bigint NOT NULL,
    avaliavel_id bigint NOT NULL
);


ALTER TABLE avaliacao_avaliavel OWNER TO assessment;

--
-- TOC entry 218 (class 1259 OID 53579)
-- Name: avaliacao_avaliavel_aud; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE avaliacao_avaliavel_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    revtype smallint,
    avaliacao_id bigint,
    avaliavel_id bigint
);


ALTER TABLE avaliacao_avaliavel_aud OWNER TO assessment;

--
-- TOC entry 219 (class 1259 OID 53584)
-- Name: avaliacao_avaliavel_id_seq; Type: SEQUENCE; Schema: public; Owner: assessment
--

CREATE SEQUENCE avaliacao_avaliavel_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE avaliacao_avaliavel_id_seq OWNER TO assessment;

--
-- TOC entry 3242 (class 0 OID 0)
-- Dependencies: 219
-- Name: avaliacao_avaliavel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assessment
--

ALTER SEQUENCE avaliacao_avaliavel_id_seq OWNED BY avaliacao_avaliavel.id;


--
-- TOC entry 215 (class 1259 OID 53560)
-- Name: avaliacao_id_seq; Type: SEQUENCE; Schema: public; Owner: assessment
--

CREATE SEQUENCE avaliacao_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE avaliacao_id_seq OWNER TO assessment;

--
-- TOC entry 3243 (class 0 OID 0)
-- Dependencies: 215
-- Name: avaliacao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assessment
--

ALTER SEQUENCE avaliacao_id_seq OWNED BY avaliacao.id;


--
-- TOC entry 222 (class 1259 OID 53594)
-- Name: avaliavel; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE avaliavel (
    id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone,
    ativo boolean NOT NULL,
    unidade_tipo_avaliacao_id bigint NOT NULL,
    usuario_id bigint NOT NULL
);


ALTER TABLE avaliavel OWNER TO assessment;

--
-- TOC entry 223 (class 1259 OID 53600)
-- Name: avaliavel_aud; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE avaliavel_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    revtype smallint,
    ativo boolean,
    unidade_tipo_avaliacao_id bigint,
    usuario_id bigint
);


ALTER TABLE avaliavel_aud OWNER TO assessment;

--
-- TOC entry 221 (class 1259 OID 53592)
-- Name: avaliavel_id_seq; Type: SEQUENCE; Schema: public; Owner: assessment
--

CREATE SEQUENCE avaliavel_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE avaliavel_id_seq OWNER TO assessment;

--
-- TOC entry 3244 (class 0 OID 0)
-- Dependencies: 221
-- Name: avaliavel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assessment
--

ALTER SEQUENCE avaliavel_id_seq OWNED BY avaliavel.id;


--
-- TOC entry 199 (class 1259 OID 53466)
-- Name: cidade; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE cidade (
    id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone,
    nome character varying(200) NOT NULL,
    estado_id bigint NOT NULL
);


ALTER TABLE cidade OWNER TO assessment;

--
-- TOC entry 200 (class 1259 OID 53472)
-- Name: cidade_aud; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE cidade_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    revtype smallint,
    nome character varying(200),
    estado_id bigint
);


ALTER TABLE cidade_aud OWNER TO assessment;

--
-- TOC entry 198 (class 1259 OID 53464)
-- Name: cidade_id_seq; Type: SEQUENCE; Schema: public; Owner: assessment
--

CREATE SEQUENCE cidade_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE cidade_id_seq OWNER TO assessment;

--
-- TOC entry 3245 (class 0 OID 0)
-- Dependencies: 198
-- Name: cidade_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assessment
--

ALTER SEQUENCE cidade_id_seq OWNED BY cidade.id;


--
-- TOC entry 225 (class 1259 OID 53607)
-- Name: configuracao; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE configuracao (
    id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone,
    agradecimento character varying(255),
    background_image bytea,
    background_image_path character varying(255),
    cinco character varying(255),
    dois character varying(255),
    logo bytea,
    logo_path character varying(255),
    quatro character varying(255),
    tres character varying(255),
    um character varying(255)
);


ALTER TABLE configuracao OWNER TO assessment;

--
-- TOC entry 226 (class 1259 OID 53616)
-- Name: configuracao_aud; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE configuracao_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    revtype smallint,
    agradecimento character varying(255),
    background_image bytea,
    background_image_path character varying(255),
    cinco character varying(255),
    dois character varying(255),
    logo bytea,
    logo_path character varying(255),
    quatro character varying(255),
    tres character varying(255),
    um character varying(255)
);


ALTER TABLE configuracao_aud OWNER TO assessment;

--
-- TOC entry 224 (class 1259 OID 53605)
-- Name: configuracao_id_seq; Type: SEQUENCE; Schema: public; Owner: assessment
--

CREATE SEQUENCE configuracao_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE configuracao_id_seq OWNER TO assessment;

--
-- TOC entry 3246 (class 0 OID 0)
-- Dependencies: 224
-- Name: configuracao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assessment
--

ALTER SEQUENCE configuracao_id_seq OWNED BY configuracao.id;


--
-- TOC entry 202 (class 1259 OID 53479)
-- Name: conta; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE conta (
    id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone,
    administrador boolean NOT NULL,
    email character varying(255),
    esquema character varying(255) NOT NULL,
    last_login timestamp without time zone,
    password character varying(255),
    root boolean NOT NULL
);


ALTER TABLE conta OWNER TO assessment;

--
-- TOC entry 203 (class 1259 OID 53488)
-- Name: conta_aud; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE conta_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    revtype smallint,
    administrador boolean,
    email character varying(255),
    esquema character varying(255),
    last_login timestamp without time zone,
    password character varying(255),
    root boolean
);


ALTER TABLE conta_aud OWNER TO assessment;

--
-- TOC entry 201 (class 1259 OID 53477)
-- Name: conta_id_seq; Type: SEQUENCE; Schema: public; Owner: assessment
--

CREATE SEQUENCE conta_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE conta_id_seq OWNER TO assessment;

--
-- TOC entry 3247 (class 0 OID 0)
-- Dependencies: 201
-- Name: conta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assessment
--

ALTER SEQUENCE conta_id_seq OWNED BY conta.id;


--
-- TOC entry 228 (class 1259 OID 53626)
-- Name: endereco; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE endereco (
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


ALTER TABLE endereco OWNER TO assessment;

--
-- TOC entry 229 (class 1259 OID 53635)
-- Name: endereco_aud; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE endereco_aud (
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


ALTER TABLE endereco_aud OWNER TO assessment;

--
-- TOC entry 227 (class 1259 OID 53624)
-- Name: endereco_id_seq; Type: SEQUENCE; Schema: public; Owner: assessment
--

CREATE SEQUENCE endereco_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE endereco_id_seq OWNER TO assessment;

--
-- TOC entry 3248 (class 0 OID 0)
-- Dependencies: 227
-- Name: endereco_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assessment
--

ALTER SEQUENCE endereco_id_seq OWNED BY endereco.id;


--
-- TOC entry 205 (class 1259 OID 53498)
-- Name: estado; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE estado (
    id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone,
    nome character varying(200) NOT NULL,
    uf character varying(2) NOT NULL,
    pais_id bigint NOT NULL
);


ALTER TABLE estado OWNER TO assessment;

--
-- TOC entry 206 (class 1259 OID 53504)
-- Name: estado_aud; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE estado_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    revtype smallint,
    nome character varying(200),
    uf character varying(2),
    pais_id bigint
);


ALTER TABLE estado_aud OWNER TO assessment;

--
-- TOC entry 204 (class 1259 OID 53496)
-- Name: estado_id_seq; Type: SEQUENCE; Schema: public; Owner: assessment
--

CREATE SEQUENCE estado_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE estado_id_seq OWNER TO assessment;

--
-- TOC entry 3249 (class 0 OID 0)
-- Dependencies: 204
-- Name: estado_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assessment
--

ALTER SEQUENCE estado_id_seq OWNED BY estado.id;


--
-- TOC entry 197 (class 1259 OID 53454)
-- Name: flyway_schema_history; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE flyway_schema_history (
    installed_rank integer NOT NULL,
    version character varying(50),
    description character varying(200) NOT NULL,
    type character varying(20) NOT NULL,
    script character varying(1000) NOT NULL,
    checksum integer,
    installed_by character varying(100) NOT NULL,
    installed_on timestamp without time zone DEFAULT now() NOT NULL,
    execution_time integer NOT NULL,
    success boolean NOT NULL
);


ALTER TABLE flyway_schema_history OWNER TO assessment;

--
-- TOC entry 231 (class 1259 OID 53645)
-- Name: operador; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE operador (
    id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone,
    unidade_id bigint NOT NULL,
    usuario_id bigint NOT NULL
);


ALTER TABLE operador OWNER TO assessment;

--
-- TOC entry 232 (class 1259 OID 53651)
-- Name: operador_aud; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE operador_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    revtype smallint,
    unidade_id bigint,
    usuario_id bigint
);


ALTER TABLE operador_aud OWNER TO assessment;

--
-- TOC entry 230 (class 1259 OID 53643)
-- Name: operador_id_seq; Type: SEQUENCE; Schema: public; Owner: assessment
--

CREATE SEQUENCE operador_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE operador_id_seq OWNER TO assessment;

--
-- TOC entry 3250 (class 0 OID 0)
-- Dependencies: 230
-- Name: operador_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assessment
--

ALTER SEQUENCE operador_id_seq OWNED BY operador.id;


--
-- TOC entry 208 (class 1259 OID 53511)
-- Name: pais; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE pais (
    id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone,
    nome character varying(200) NOT NULL
);


ALTER TABLE pais OWNER TO assessment;

--
-- TOC entry 209 (class 1259 OID 53517)
-- Name: pais_aud; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE pais_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    revtype smallint,
    nome character varying(200)
);


ALTER TABLE pais_aud OWNER TO assessment;

--
-- TOC entry 207 (class 1259 OID 53509)
-- Name: pais_id_seq; Type: SEQUENCE; Schema: public; Owner: assessment
--

CREATE SEQUENCE pais_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE pais_id_seq OWNER TO assessment;

--
-- TOC entry 3251 (class 0 OID 0)
-- Dependencies: 207
-- Name: pais_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assessment
--

ALTER SEQUENCE pais_id_seq OWNED BY pais.id;


--
-- TOC entry 234 (class 1259 OID 53658)
-- Name: pessoa; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE pessoa (
    id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone,
    documento character varying(255),
    nome character varying(255)
);


ALTER TABLE pessoa OWNER TO assessment;

--
-- TOC entry 235 (class 1259 OID 53667)
-- Name: pessoa_aud; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE pessoa_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    revtype smallint,
    documento character varying(255),
    nome character varying(255)
);


ALTER TABLE pessoa_aud OWNER TO assessment;

--
-- TOC entry 233 (class 1259 OID 53656)
-- Name: pessoa_id_seq; Type: SEQUENCE; Schema: public; Owner: assessment
--

CREATE SEQUENCE pessoa_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE pessoa_id_seq OWNER TO assessment;

--
-- TOC entry 3252 (class 0 OID 0)
-- Dependencies: 233
-- Name: pessoa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assessment
--

ALTER SEQUENCE pessoa_id_seq OWNED BY pessoa.id;


--
-- TOC entry 211 (class 1259 OID 53524)
-- Name: revision; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE revision (
    id bigint NOT NULL,
    schema character varying(255),
    "timestamp" bigint NOT NULL,
    username character varying(255)
);


ALTER TABLE revision OWNER TO assessment;

--
-- TOC entry 210 (class 1259 OID 53522)
-- Name: revision_id_seq; Type: SEQUENCE; Schema: public; Owner: assessment
--

CREATE SEQUENCE revision_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE revision_id_seq OWNER TO assessment;

--
-- TOC entry 3253 (class 0 OID 0)
-- Dependencies: 210
-- Name: revision_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assessment
--

ALTER SEQUENCE revision_id_seq OWNED BY revision.id;


--
-- TOC entry 213 (class 1259 OID 53535)
-- Name: sessao; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE sessao (
    id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone,
    token character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    validade timestamp without time zone
);


ALTER TABLE sessao OWNER TO assessment;

--
-- TOC entry 214 (class 1259 OID 53544)
-- Name: sessao_aud; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE sessao_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    revtype smallint,
    token character varying(255),
    username character varying(255),
    validade timestamp without time zone
);


ALTER TABLE sessao_aud OWNER TO assessment;

--
-- TOC entry 212 (class 1259 OID 53533)
-- Name: sessao_id_seq; Type: SEQUENCE; Schema: public; Owner: assessment
--

CREATE SEQUENCE sessao_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sessao_id_seq OWNER TO assessment;

--
-- TOC entry 3254 (class 0 OID 0)
-- Dependencies: 212
-- Name: sessao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assessment
--

ALTER SEQUENCE sessao_id_seq OWNED BY sessao.id;


--
-- TOC entry 238 (class 1259 OID 53685)
-- Name: tipo_avaliacao; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE tipo_avaliacao (
    id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone,
    cinco character varying(255),
    dois character varying(255),
    enunciado character varying(255) NOT NULL,
    nome character varying(255) NOT NULL,
    quatro character varying(255),
    tres character varying(255),
    um character varying(255),
    selecao character varying(255) NOT NULL
);


ALTER TABLE tipo_avaliacao OWNER TO assessment;

--
-- TOC entry 236 (class 1259 OID 53675)
-- Name: tipo_avaliacao_aud; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE tipo_avaliacao_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    revtype smallint,
    cinco character varying(255),
    dois character varying(255),
    enunciado character varying(255),
    nome character varying(255),
    quatro character varying(255),
    tres character varying(255),
    um character varying(255),
    selecao character varying(255)
);


ALTER TABLE tipo_avaliacao_aud OWNER TO assessment;

--
-- TOC entry 237 (class 1259 OID 53683)
-- Name: tipo_avaliacao_id_seq; Type: SEQUENCE; Schema: public; Owner: assessment
--

CREATE SEQUENCE tipo_avaliacao_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tipo_avaliacao_id_seq OWNER TO assessment;

--
-- TOC entry 3255 (class 0 OID 0)
-- Dependencies: 237
-- Name: tipo_avaliacao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assessment
--

ALTER SEQUENCE tipo_avaliacao_id_seq OWNED BY tipo_avaliacao.id;


--
-- TOC entry 239 (class 1259 OID 53694)
-- Name: unidade; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE unidade (
    agradecimento character varying(255),
    id bigint NOT NULL,
    endereco_id bigint NOT NULL
);


ALTER TABLE unidade OWNER TO assessment;

--
-- TOC entry 240 (class 1259 OID 53699)
-- Name: unidade_aud; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE unidade_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    agradecimento character varying(255),
    endereco_id bigint
);


ALTER TABLE unidade_aud OWNER TO assessment;

--
-- TOC entry 243 (class 1259 OID 53711)
-- Name: unidade_tipo_avaliacao; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE unidade_tipo_avaliacao (
    id bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone,
    ativo boolean NOT NULL,
    ordem smallint,
    tipo_avaliacao_id bigint NOT NULL,
    unidade_id bigint NOT NULL
);


ALTER TABLE unidade_tipo_avaliacao OWNER TO assessment;

--
-- TOC entry 241 (class 1259 OID 53704)
-- Name: unidade_tipo_avaliacao_aud; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE unidade_tipo_avaliacao_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    revtype smallint,
    ativo boolean,
    ordem smallint,
    tipo_avaliacao_id bigint,
    unidade_id bigint
);


ALTER TABLE unidade_tipo_avaliacao_aud OWNER TO assessment;

--
-- TOC entry 242 (class 1259 OID 53709)
-- Name: unidade_tipo_avaliacao_id_seq; Type: SEQUENCE; Schema: public; Owner: assessment
--

CREATE SEQUENCE unidade_tipo_avaliacao_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE unidade_tipo_avaliacao_id_seq OWNER TO assessment;

--
-- TOC entry 3256 (class 0 OID 0)
-- Dependencies: 242
-- Name: unidade_tipo_avaliacao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: assessment
--

ALTER SEQUENCE unidade_tipo_avaliacao_id_seq OWNED BY unidade_tipo_avaliacao.id;


--
-- TOC entry 244 (class 1259 OID 53717)
-- Name: usuario; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE usuario (
    avatar bytea,
    avatar_path character varying(255),
    foto bytea,
    foto_path character varying(255),
    thumbnail bytea,
    thumbnail_path character varying(255),
    id bigint NOT NULL,
    conta_id bigint
);


ALTER TABLE usuario OWNER TO assessment;

--
-- TOC entry 245 (class 1259 OID 53725)
-- Name: usuario_aud; Type: TABLE; Schema: public; Owner: assessment
--

CREATE TABLE usuario_aud (
    id bigint NOT NULL,
    rev bigint NOT NULL,
    avatar bytea,
    avatar_path character varying(255),
    foto bytea,
    foto_path character varying(255),
    thumbnail bytea,
    thumbnail_path character varying(255),
    conta_id bigint
);


ALTER TABLE usuario_aud OWNER TO assessment;

--
-- TOC entry 2934 (class 2604 OID 53565)
-- Name: avaliacao id; Type: DEFAULT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY avaliacao ALTER COLUMN id SET DEFAULT nextval('avaliacao_id_seq'::regclass);


--
-- TOC entry 2935 (class 2604 OID 53589)
-- Name: avaliacao_avaliavel id; Type: DEFAULT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY avaliacao_avaliavel ALTER COLUMN id SET DEFAULT nextval('avaliacao_avaliavel_id_seq'::regclass);


--
-- TOC entry 2936 (class 2604 OID 53597)
-- Name: avaliavel id; Type: DEFAULT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY avaliavel ALTER COLUMN id SET DEFAULT nextval('avaliavel_id_seq'::regclass);


--
-- TOC entry 2928 (class 2604 OID 53469)
-- Name: cidade id; Type: DEFAULT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY cidade ALTER COLUMN id SET DEFAULT nextval('cidade_id_seq'::regclass);


--
-- TOC entry 2937 (class 2604 OID 53610)
-- Name: configuracao id; Type: DEFAULT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY configuracao ALTER COLUMN id SET DEFAULT nextval('configuracao_id_seq'::regclass);


--
-- TOC entry 2929 (class 2604 OID 53482)
-- Name: conta id; Type: DEFAULT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY conta ALTER COLUMN id SET DEFAULT nextval('conta_id_seq'::regclass);


--
-- TOC entry 2938 (class 2604 OID 53629)
-- Name: endereco id; Type: DEFAULT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY endereco ALTER COLUMN id SET DEFAULT nextval('endereco_id_seq'::regclass);


--
-- TOC entry 2930 (class 2604 OID 53501)
-- Name: estado id; Type: DEFAULT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY estado ALTER COLUMN id SET DEFAULT nextval('estado_id_seq'::regclass);


--
-- TOC entry 2939 (class 2604 OID 53648)
-- Name: operador id; Type: DEFAULT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY operador ALTER COLUMN id SET DEFAULT nextval('operador_id_seq'::regclass);


--
-- TOC entry 2931 (class 2604 OID 53514)
-- Name: pais id; Type: DEFAULT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY pais ALTER COLUMN id SET DEFAULT nextval('pais_id_seq'::regclass);


--
-- TOC entry 2940 (class 2604 OID 53661)
-- Name: pessoa id; Type: DEFAULT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY pessoa ALTER COLUMN id SET DEFAULT nextval('pessoa_id_seq'::regclass);


--
-- TOC entry 2932 (class 2604 OID 53527)
-- Name: revision id; Type: DEFAULT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY revision ALTER COLUMN id SET DEFAULT nextval('revision_id_seq'::regclass);


--
-- TOC entry 2933 (class 2604 OID 53538)
-- Name: sessao id; Type: DEFAULT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY sessao ALTER COLUMN id SET DEFAULT nextval('sessao_id_seq'::regclass);


--
-- TOC entry 2941 (class 2604 OID 53688)
-- Name: tipo_avaliacao id; Type: DEFAULT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY tipo_avaliacao ALTER COLUMN id SET DEFAULT nextval('tipo_avaliacao_id_seq'::regclass);


--
-- TOC entry 2942 (class 2604 OID 53714)
-- Name: unidade_tipo_avaliacao id; Type: DEFAULT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY unidade_tipo_avaliacao ALTER COLUMN id SET DEFAULT nextval('unidade_tipo_avaliacao_id_seq'::regclass);



--
-- TOC entry 3257 (class 0 OID 0)
-- Dependencies: 219
-- Name: avaliacao_avaliavel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assessment
--

SELECT pg_catalog.setval('avaliacao_avaliavel_id_seq', 73, true);


--
-- TOC entry 3258 (class 0 OID 0)
-- Dependencies: 215
-- Name: avaliacao_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assessment
--

SELECT pg_catalog.setval('avaliacao_id_seq', 39, true);


--
-- TOC entry 3259 (class 0 OID 0)
-- Dependencies: 221
-- Name: avaliavel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assessment
--

SELECT pg_catalog.setval('avaliavel_id_seq', 15, true);


--
-- TOC entry 3260 (class 0 OID 0)
-- Dependencies: 198
-- Name: cidade_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assessment
--

SELECT pg_catalog.setval('cidade_id_seq', 1, false);


--
-- TOC entry 3261 (class 0 OID 0)
-- Dependencies: 224
-- Name: configuracao_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assessment
--

SELECT pg_catalog.setval('configuracao_id_seq', 1, true);


--
-- TOC entry 3262 (class 0 OID 0)
-- Dependencies: 201
-- Name: conta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assessment
--

SELECT pg_catalog.setval('conta_id_seq', 7, true);


--
-- TOC entry 3263 (class 0 OID 0)
-- Dependencies: 227
-- Name: endereco_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assessment
--

SELECT pg_catalog.setval('endereco_id_seq', 4, true);


--
-- TOC entry 3264 (class 0 OID 0)
-- Dependencies: 204
-- Name: estado_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assessment
--

SELECT pg_catalog.setval('estado_id_seq', 1, false);


--
-- TOC entry 3265 (class 0 OID 0)
-- Dependencies: 230
-- Name: operador_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assessment
--

SELECT pg_catalog.setval('operador_id_seq', 9, true);


--
-- TOC entry 3266 (class 0 OID 0)
-- Dependencies: 207
-- Name: pais_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assessment
--

SELECT pg_catalog.setval('pais_id_seq', 1, false);


--
-- TOC entry 3267 (class 0 OID 0)
-- Dependencies: 233
-- Name: pessoa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assessment
--

SELECT pg_catalog.setval('pessoa_id_seq', 9, true);


--
-- TOC entry 3268 (class 0 OID 0)
-- Dependencies: 210
-- Name: revision_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assessment
--

SELECT pg_catalog.setval('revision_id_seq', 172, true);


--
-- TOC entry 3269 (class 0 OID 0)
-- Dependencies: 212
-- Name: sessao_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assessment
--

SELECT pg_catalog.setval('sessao_id_seq', 2, true);


--
-- TOC entry 3270 (class 0 OID 0)
-- Dependencies: 237
-- Name: tipo_avaliacao_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assessment
--

SELECT pg_catalog.setval('tipo_avaliacao_id_seq', 4, true);


--
-- TOC entry 3271 (class 0 OID 0)
-- Dependencies: 242
-- Name: unidade_tipo_avaliacao_id_seq; Type: SEQUENCE SET; Schema: public; Owner: assessment
--

SELECT pg_catalog.setval('unidade_tipo_avaliacao_id_seq', 8, true);


--
-- TOC entry 2979 (class 2606 OID 53578)
-- Name: avaliacao_aud avaliacao_aud_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY avaliacao_aud
    ADD CONSTRAINT avaliacao_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 2981 (class 2606 OID 53583)
-- Name: avaliacao_avaliavel_aud avaliacao_avaliavel_aud_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY avaliacao_avaliavel_aud
    ADD CONSTRAINT avaliacao_avaliavel_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 2983 (class 2606 OID 53591)
-- Name: avaliacao_avaliavel avaliacao_avaliavel_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY avaliacao_avaliavel
    ADD CONSTRAINT avaliacao_avaliavel_pkey PRIMARY KEY (id);


--
-- TOC entry 2977 (class 2606 OID 53570)
-- Name: avaliacao avaliacao_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY avaliacao
    ADD CONSTRAINT avaliacao_pkey PRIMARY KEY (id);


--
-- TOC entry 2991 (class 2606 OID 53604)
-- Name: avaliavel_aud avaliavel_aud_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY avaliavel_aud
    ADD CONSTRAINT avaliavel_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 2987 (class 2606 OID 53599)
-- Name: avaliavel avaliavel_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY avaliavel
    ADD CONSTRAINT avaliavel_pkey PRIMARY KEY (id);


--
-- TOC entry 2951 (class 2606 OID 53476)
-- Name: cidade_aud cidade_aud_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY cidade_aud
    ADD CONSTRAINT cidade_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 2947 (class 2606 OID 53471)
-- Name: cidade cidade_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY cidade
    ADD CONSTRAINT cidade_pkey PRIMARY KEY (id);


--
-- TOC entry 2995 (class 2606 OID 53623)
-- Name: configuracao_aud configuracao_aud_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY configuracao_aud
    ADD CONSTRAINT configuracao_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 2993 (class 2606 OID 53615)
-- Name: configuracao configuracao_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY configuracao
    ADD CONSTRAINT configuracao_pkey PRIMARY KEY (id);


--
-- TOC entry 2957 (class 2606 OID 53495)
-- Name: conta_aud conta_aud_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY conta_aud
    ADD CONSTRAINT conta_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 2953 (class 2606 OID 53487)
-- Name: conta conta_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY conta
    ADD CONSTRAINT conta_pkey PRIMARY KEY (id);


--
-- TOC entry 2999 (class 2606 OID 53642)
-- Name: endereco_aud endereco_aud_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY endereco_aud
    ADD CONSTRAINT endereco_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 2997 (class 2606 OID 53634)
-- Name: endereco endereco_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY endereco
    ADD CONSTRAINT endereco_pkey PRIMARY KEY (id);


--
-- TOC entry 2963 (class 2606 OID 53508)
-- Name: estado_aud estado_aud_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY estado_aud
    ADD CONSTRAINT estado_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 2959 (class 2606 OID 53503)
-- Name: estado estado_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY estado
    ADD CONSTRAINT estado_pkey PRIMARY KEY (id);


--
-- TOC entry 2944 (class 2606 OID 53462)
-- Name: flyway_schema_history flyway_schema_history_pk; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY flyway_schema_history
    ADD CONSTRAINT flyway_schema_history_pk PRIMARY KEY (installed_rank);


--
-- TOC entry 3005 (class 2606 OID 53655)
-- Name: operador_aud operador_aud_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY operador_aud
    ADD CONSTRAINT operador_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 3001 (class 2606 OID 53650)
-- Name: operador operador_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY operador
    ADD CONSTRAINT operador_pkey PRIMARY KEY (id);


--
-- TOC entry 2967 (class 2606 OID 53521)
-- Name: pais_aud pais_aud_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY pais_aud
    ADD CONSTRAINT pais_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 2965 (class 2606 OID 53516)
-- Name: pais pais_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY pais
    ADD CONSTRAINT pais_pkey PRIMARY KEY (id);


--
-- TOC entry 3009 (class 2606 OID 53674)
-- Name: pessoa_aud pessoa_aud_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY pessoa_aud
    ADD CONSTRAINT pessoa_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 3007 (class 2606 OID 53666)
-- Name: pessoa pessoa_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY pessoa
    ADD CONSTRAINT pessoa_pkey PRIMARY KEY (id);


--
-- TOC entry 2969 (class 2606 OID 53532)
-- Name: revision revision_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY revision
    ADD CONSTRAINT revision_pkey PRIMARY KEY (id);


--
-- TOC entry 2975 (class 2606 OID 53551)
-- Name: sessao_aud sessao_aud_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY sessao_aud
    ADD CONSTRAINT sessao_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 2971 (class 2606 OID 53543)
-- Name: sessao sessao_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY sessao
    ADD CONSTRAINT sessao_pkey PRIMARY KEY (id);


--
-- TOC entry 3011 (class 2606 OID 53682)
-- Name: tipo_avaliacao_aud tipo_avaliacao_aud_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY tipo_avaliacao_aud
    ADD CONSTRAINT tipo_avaliacao_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 3013 (class 2606 OID 53693)
-- Name: tipo_avaliacao tipo_avaliacao_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY tipo_avaliacao
    ADD CONSTRAINT tipo_avaliacao_pkey PRIMARY KEY (id);


--
-- TOC entry 2989 (class 2606 OID 53736)
-- Name: avaliavel uk373hk1qmupsuuu61g1ykejn0e; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY avaliavel
    ADD CONSTRAINT uk373hk1qmupsuuu61g1ykejn0e UNIQUE (usuario_id, unidade_tipo_avaliacao_id);


--
-- TOC entry 3015 (class 2606 OID 53740)
-- Name: tipo_avaliacao uk_9jsyiwd03q22aumua8g70h77f; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY tipo_avaliacao
    ADD CONSTRAINT uk_9jsyiwd03q22aumua8g70h77f UNIQUE (enunciado);


--
-- TOC entry 3019 (class 2606 OID 53744)
-- Name: unidade uk_bxfhl1pn9y0kkech17l0jvngy; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY unidade
    ADD CONSTRAINT uk_bxfhl1pn9y0kkech17l0jvngy UNIQUE (endereco_id);


--
-- TOC entry 2973 (class 2606 OID 53559)
-- Name: sessao uk_cc0m5a7h3r9tjcgsqgkxnwscb; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY sessao
    ADD CONSTRAINT uk_cc0m5a7h3r9tjcgsqgkxnwscb UNIQUE (token);


--
-- TOC entry 3017 (class 2606 OID 53742)
-- Name: tipo_avaliacao uk_rrinthdfjo3hyvqimplhk0a47; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY tipo_avaliacao
    ADD CONSTRAINT uk_rrinthdfjo3hyvqimplhk0a47 UNIQUE (nome);


--
-- TOC entry 2955 (class 2606 OID 53555)
-- Name: conta uk_tgtgthemxloxpudkwxy14qnbw; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY conta
    ADD CONSTRAINT uk_tgtgthemxloxpudkwxy14qnbw UNIQUE (email);


--
-- TOC entry 2949 (class 2606 OID 53553)
-- Name: cidade ukgx7khulpkfsgyqbw5noivqui7; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY cidade
    ADD CONSTRAINT ukgx7khulpkfsgyqbw5noivqui7 UNIQUE (nome, estado_id);


--
-- TOC entry 3003 (class 2606 OID 53738)
-- Name: operador ukjk7g5klnw9709ku6wnplxuwxr; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY operador
    ADD CONSTRAINT ukjk7g5klnw9709ku6wnplxuwxr UNIQUE (usuario_id, unidade_id);


--
-- TOC entry 2961 (class 2606 OID 53557)
-- Name: estado ukjobe8rm12hn6m9hjnsgbdvp94; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY estado
    ADD CONSTRAINT ukjobe8rm12hn6m9hjnsgbdvp94 UNIQUE (nome, pais_id);


--
-- TOC entry 3027 (class 2606 OID 53746)
-- Name: unidade_tipo_avaliacao ukmej174qrl5t6u9qsiwa4w2nq5; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY unidade_tipo_avaliacao
    ADD CONSTRAINT ukmej174qrl5t6u9qsiwa4w2nq5 UNIQUE (tipo_avaliacao_id, unidade_id);


--
-- TOC entry 3029 (class 2606 OID 53748)
-- Name: unidade_tipo_avaliacao ukogpd5x0v8m3otrcqyvdrbgo1d; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY unidade_tipo_avaliacao
    ADD CONSTRAINT ukogpd5x0v8m3otrcqyvdrbgo1d UNIQUE (unidade_id, ordem);


--
-- TOC entry 2985 (class 2606 OID 53734)
-- Name: avaliacao_avaliavel uksq56l0lhsa2p6wrjs2ygitrdd; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY avaliacao_avaliavel
    ADD CONSTRAINT uksq56l0lhsa2p6wrjs2ygitrdd UNIQUE (avaliavel_id, avaliacao_id);


--
-- TOC entry 3023 (class 2606 OID 53703)
-- Name: unidade_aud unidade_aud_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY unidade_aud
    ADD CONSTRAINT unidade_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 3021 (class 2606 OID 53698)
-- Name: unidade unidade_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY unidade
    ADD CONSTRAINT unidade_pkey PRIMARY KEY (id);


--
-- TOC entry 3025 (class 2606 OID 53708)
-- Name: unidade_tipo_avaliacao_aud unidade_tipo_avaliacao_aud_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY unidade_tipo_avaliacao_aud
    ADD CONSTRAINT unidade_tipo_avaliacao_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 3031 (class 2606 OID 53716)
-- Name: unidade_tipo_avaliacao unidade_tipo_avaliacao_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY unidade_tipo_avaliacao
    ADD CONSTRAINT unidade_tipo_avaliacao_pkey PRIMARY KEY (id);


--
-- TOC entry 3035 (class 2606 OID 53732)
-- Name: usuario_aud usuario_aud_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY usuario_aud
    ADD CONSTRAINT usuario_aud_pkey PRIMARY KEY (id, rev);


--
-- TOC entry 3033 (class 2606 OID 53724)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- TOC entry 2945 (class 1259 OID 53463)
-- Name: flyway_schema_history_s_idx; Type: INDEX; Schema: public; Owner: assessment
--

CREATE INDEX flyway_schema_history_s_idx ON flyway_schema_history USING btree (success);


--
-- TOC entry 3047 (class 2606 OID 53804)
-- Name: avaliavel fk1wg1nljm73ixmvny30jwxv1nw; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY avaliavel
    ADD CONSTRAINT fk1wg1nljm73ixmvny30jwxv1nw FOREIGN KEY (unidade_tipo_avaliacao_id) REFERENCES unidade_tipo_avaliacao(id);


--
-- TOC entry 3056 (class 2606 OID 53849)
-- Name: pessoa_aud fk24tiwpkx458kkfykpdw0eplnw; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY pessoa_aud
    ADD CONSTRAINT fk24tiwpkx458kkfykpdw0eplnw FOREIGN KEY (rev) REFERENCES revision(id);


--
-- TOC entry 3044 (class 2606 OID 53789)
-- Name: avaliacao_avaliavel_aud fk4rp9v89c9v7740876pw9c7r8g; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY avaliacao_avaliavel_aud
    ADD CONSTRAINT fk4rp9v89c9v7740876pw9c7r8g FOREIGN KEY (rev) REFERENCES revision(id);


--
-- TOC entry 3037 (class 2606 OID 53754)
-- Name: cidade_aud fk5eniib2h0qdbeg6i20kgjhrtu; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY cidade_aud
    ADD CONSTRAINT fk5eniib2h0qdbeg6i20kgjhrtu FOREIGN KEY (rev) REFERENCES revision(id);


--
-- TOC entry 3066 (class 2606 OID 53899)
-- Name: usuario_aud fk6mi4t2e5o8cp9gsy77xqvsuii; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY usuario_aud
    ADD CONSTRAINT fk6mi4t2e5o8cp9gsy77xqvsuii FOREIGN KEY (id, rev) REFERENCES pessoa_aud(id, rev);


--
-- TOC entry 3040 (class 2606 OID 53769)
-- Name: estado_aud fk70vj54e74od9gxcre4d3y8sb7; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY estado_aud
    ADD CONSTRAINT fk70vj54e74od9gxcre4d3y8sb7 FOREIGN KEY (rev) REFERENCES revision(id);


--
-- TOC entry 3051 (class 2606 OID 53824)
-- Name: endereco fk8b1kcb3wucapb8dejshyn5fsx; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY endereco
    ADD CONSTRAINT fk8b1kcb3wucapb8dejshyn5fsx FOREIGN KEY (cidade_id) REFERENCES cidade(id);


--
-- TOC entry 3054 (class 2606 OID 53839)
-- Name: operador fkajlncx53fcqxjpepj4dsogdel; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY operador
    ADD CONSTRAINT fkajlncx53fcqxjpepj4dsogdel FOREIGN KEY (usuario_id) REFERENCES usuario(id);


--
-- TOC entry 3058 (class 2606 OID 53859)
-- Name: unidade fkao3ouwfpkinhbgl6k0wk0uo2m; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY unidade
    ADD CONSTRAINT fkao3ouwfpkinhbgl6k0wk0uo2m FOREIGN KEY (endereco_id) REFERENCES endereco(id);


--
-- TOC entry 3063 (class 2606 OID 53884)
-- Name: unidade_tipo_avaliacao fkef4rbh8y9bn11qdrium0hw56s; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY unidade_tipo_avaliacao
    ADD CONSTRAINT fkef4rbh8y9bn11qdrium0hw56s FOREIGN KEY (unidade_id) REFERENCES unidade(id);


--
-- TOC entry 3042 (class 2606 OID 53779)
-- Name: sessao_aud fkfgw762y3kjq9fidwv4ova0c6e; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY sessao_aud
    ADD CONSTRAINT fkfgw762y3kjq9fidwv4ova0c6e FOREIGN KEY (rev) REFERENCES revision(id);


--
-- TOC entry 3061 (class 2606 OID 53874)
-- Name: unidade_tipo_avaliacao_aud fkhb918o8hsu32di2bc974dp601; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY unidade_tipo_avaliacao_aud
    ADD CONSTRAINT fkhb918o8hsu32di2bc974dp601 FOREIGN KEY (rev) REFERENCES revision(id);


--
-- TOC entry 3055 (class 2606 OID 53844)
-- Name: operador_aud fkhcecwopl83nqaknck7qpf6xbf; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY operador_aud
    ADD CONSTRAINT fkhcecwopl83nqaknck7qpf6xbf FOREIGN KEY (rev) REFERENCES revision(id);


--
-- TOC entry 3060 (class 2606 OID 53869)
-- Name: unidade_aud fki85nctbnxcvjjp5kg8m3qnb2n; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY unidade_aud
    ADD CONSTRAINT fki85nctbnxcvjjp5kg8m3qnb2n FOREIGN KEY (id, rev) REFERENCES pessoa_aud(id, rev);


--
-- TOC entry 3036 (class 2606 OID 53749)
-- Name: cidade fkkworrwk40xj58kevvh3evi500; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY cidade
    ADD CONSTRAINT fkkworrwk40xj58kevvh3evi500 FOREIGN KEY (estado_id) REFERENCES estado(id);


--
-- TOC entry 3039 (class 2606 OID 53764)
-- Name: estado fklsmaqvrvjo414pa0u6kiusg5; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY estado
    ADD CONSTRAINT fklsmaqvrvjo414pa0u6kiusg5 FOREIGN KEY (pais_id) REFERENCES pais(id);


--
-- TOC entry 3057 (class 2606 OID 53854)
-- Name: tipo_avaliacao_aud fklyp7dky0ii83h1a2bim7eo6qq; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY tipo_avaliacao_aud
    ADD CONSTRAINT fklyp7dky0ii83h1a2bim7eo6qq FOREIGN KEY (rev) REFERENCES revision(id);


--
-- TOC entry 3064 (class 2606 OID 53889)
-- Name: usuario fkm9ew1jp3jewapkiridletuerr; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY usuario
    ADD CONSTRAINT fkm9ew1jp3jewapkiridletuerr FOREIGN KEY (conta_id) REFERENCES conta(id);


--
-- TOC entry 3053 (class 2606 OID 53834)
-- Name: operador fkmbui9o7f7r65qq4e8f1htnuyx; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY operador
    ADD CONSTRAINT fkmbui9o7f7r65qq4e8f1htnuyx FOREIGN KEY (unidade_id) REFERENCES unidade(id);


--
-- TOC entry 3052 (class 2606 OID 53829)
-- Name: endereco_aud fknabsn79mk6puy70jlaavkt5vx; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY endereco_aud
    ADD CONSTRAINT fknabsn79mk6puy70jlaavkt5vx FOREIGN KEY (rev) REFERENCES revision(id);


--
-- TOC entry 3065 (class 2606 OID 53894)
-- Name: usuario fknndxavgf8rogrx6jdmxbgm6s3; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY usuario
    ADD CONSTRAINT fknndxavgf8rogrx6jdmxbgm6s3 FOREIGN KEY (id) REFERENCES pessoa(id);


--
-- TOC entry 3043 (class 2606 OID 53784)
-- Name: avaliacao_aud fko4c47hsy8077g9cjndbkjlqce; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY avaliacao_aud
    ADD CONSTRAINT fko4c47hsy8077g9cjndbkjlqce FOREIGN KEY (rev) REFERENCES revision(id);


--
-- TOC entry 3045 (class 2606 OID 53794)
-- Name: avaliacao_avaliavel fkp6vcye353c4iqqi67kkfgu1g0; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY avaliacao_avaliavel
    ADD CONSTRAINT fkp6vcye353c4iqqi67kkfgu1g0 FOREIGN KEY (avaliacao_id) REFERENCES avaliacao(id);


--
-- TOC entry 3048 (class 2606 OID 53809)
-- Name: avaliavel fkp84hu90r7k1p8d7e4rt3vprsl; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY avaliavel
    ADD CONSTRAINT fkp84hu90r7k1p8d7e4rt3vprsl FOREIGN KEY (usuario_id) REFERENCES usuario(id);


--
-- TOC entry 3046 (class 2606 OID 53799)
-- Name: avaliacao_avaliavel fkqfo0ey5s0h1agvmdgg7kud5xq; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY avaliacao_avaliavel
    ADD CONSTRAINT fkqfo0ey5s0h1agvmdgg7kud5xq FOREIGN KEY (avaliavel_id) REFERENCES avaliavel(id);


--
-- TOC entry 3038 (class 2606 OID 53759)
-- Name: conta_aud fkqm7g69hly0iufwaspo5vl8uls; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY conta_aud
    ADD CONSTRAINT fkqm7g69hly0iufwaspo5vl8uls FOREIGN KEY (rev) REFERENCES revision(id);


--
-- TOC entry 3059 (class 2606 OID 53864)
-- Name: unidade fkqt586b6o6dkbxx5wedh52cqi1; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY unidade
    ADD CONSTRAINT fkqt586b6o6dkbxx5wedh52cqi1 FOREIGN KEY (id) REFERENCES pessoa(id);


--
-- TOC entry 3062 (class 2606 OID 53879)
-- Name: unidade_tipo_avaliacao fkrqpvvafa7bugibgptix3t6q0a; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY unidade_tipo_avaliacao
    ADD CONSTRAINT fkrqpvvafa7bugibgptix3t6q0a FOREIGN KEY (tipo_avaliacao_id) REFERENCES tipo_avaliacao(id);


--
-- TOC entry 3049 (class 2606 OID 53814)
-- Name: avaliavel_aud fksgkqofx8yqakyqhk9crofy60p; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY avaliavel_aud
    ADD CONSTRAINT fksgkqofx8yqakyqhk9crofy60p FOREIGN KEY (rev) REFERENCES revision(id);


--
-- TOC entry 3041 (class 2606 OID 53774)
-- Name: pais_aud fksi42g1ni0ad8g851u5fxk4fw7; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY pais_aud
    ADD CONSTRAINT fksi42g1ni0ad8g851u5fxk4fw7 FOREIGN KEY (rev) REFERENCES revision(id);


--
-- TOC entry 3050 (class 2606 OID 53819)
-- Name: configuracao_aud fksru5nb79ldou74p921idp2ooi; Type: FK CONSTRAINT; Schema: public; Owner: assessment
--

ALTER TABLE ONLY configuracao_aud
    ADD CONSTRAINT fksru5nb79ldou74p921idp2ooi FOREIGN KEY (rev) REFERENCES revision(id);


-- Completed on 2019-01-24 18:42:43 -02

--
-- PostgreSQL database dump complete
--

