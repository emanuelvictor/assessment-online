ALTER TABLE avaliacao ADD COLUMN foto bytea;
ALTER TABLE avaliacao ADD COLUMN foto_path character varying(255);

ALTER TABLE avaliacao_aud ADD COLUMN foto bytea;
ALTER TABLE avaliacao_aud ADD COLUMN foto_path character varying(255);
