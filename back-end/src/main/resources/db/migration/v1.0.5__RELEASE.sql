CREATE TABLE sessao
(
  id bigint NOT NULL,
  created timestamp without time zone NOT NULL,
  updated timestamp without time zone,
  token character varying(255) NOT NULL,
  username character varying(255) NOT NULL,
  validade timestamp without time zone,
  CONSTRAINT sessao_pkey PRIMARY KEY (id),
  CONSTRAINT uk_cc0m5a7h3r9tjcgsqgkxnwscb UNIQUE (token)
);

CREATE SEQUENCE sessao_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE sessao_id_seq OWNED BY sessao.id;

ALTER TABLE ONLY sessao ALTER COLUMN id SET DEFAULT nextval('sessao_id_seq'::regclass);

CREATE TABLE sessao_aud
(
  id bigint NOT NULL,
  rev bigint NOT NULL,
  revtype smallint,
  token character varying(255),
  username character varying(255) NOT NULL,
  validade timestamp without time zone,
  CONSTRAINT sessao_aud_pkey PRIMARY KEY (id, rev),
  CONSTRAINT fkfgw762y3kjq9fidwv4ova0c6e FOREIGN KEY (rev)
    REFERENCES revision (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);