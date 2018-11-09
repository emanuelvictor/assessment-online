ALTER TABLE avaliacao ADD COLUMN logo bytea;
ALTER TABLE avaliacao ADD COLUMN logo_Path character varying(255);

ALTER TABLE avaliacao_aud ADD COLUMN logo bytea;
ALTER TABLE avaliacao_aud ADD COLUMN logo_Path character varying(255);
